const express = require('express');
const mysql = require('mysql');

const BooksDao = require('./dao/BooksDao');
const port = 3000;

const app = express();
// middleware di trasformazione del body
app.use(express.json());

// middleware custom per loggare le request
function requestLogger(req, res, next)  {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ipAddress = req.socket.remoteAddress;

  console.log(timestamp + ", " + ", " + ipAddress + ", " + method + ", " + path);
  next();
}

// middleware custom per limitare l'accesso
function rateLimiter(req, res, next)  {
  const ipAddress = req.socket.remoteAddress;

  connection.query('SELECT * FROM authenticated_rate_limit where ip_address = ?', [ipAddress], function(err, results) {
    if (results.length == 0)
      createRateRecord(ipAddress);
    else {
      var rateRecord = results[0];
      var firstRequestDate = new Date(rateRecord.first_request_ts);
      var currentDate = new Date();
      const diffTime = Math.abs(currentDate - firstRequestDate);   
      const diffMins = Math.ceil(diffTime / (1000 * 60)); 
      
      if (diffMins <= 30 && rateRecord.rate_requests >= 15)
        next(res.status(401));  // rispondo con un errore UNAUTHORIZED
      else {
        updateRateRecords(ipAddress, rateRecord.rate_requests+1);
      }
    }
    // al prossimo middleware
    next();
  });
}

function updateRateRecords(ipAddress, rate) {
  connection.query('UPDATE authenticated_rate_limit SET rate_requests = ? WHERE ip_address = ?', [rate, ipAddress]);
}

function createRateRecord(ipAddress) {
  connection.query('INSERT INTO authenticated_rate_limit (ip_address) VALUES (?)', [ipAddress])
}

app.use(requestLogger);
app.use(rateLimiter);

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'deko1983',
    database : 'bookstore'
  });
   
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
  

// endpoint vanno qui
app.get('/', (req, res) => {
    res.send('Benvenuto sui nostri server');
});

app.get('/all', async (req, res) => {
  try {
    const books = await BooksDao.getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/books', (req, res) => {
    connection.query('SELECT * FROM books', function(err, result) {
        res.json(result);
    });
})

app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    connection.query('SELECT * FROM books WHERE id = ?', [bookId], function(err, result)  {
       if (result.length === 0)  {
            res.status(404).json({error: 'Libro non trovato'});
       } else {s
            res.json(result[0]);


       }
    })
});

// aggiungo un nuovo libro allo store
app.post('/books', (req, res) => {
    // destrutturazione di un oggetto
    const { title, author, year} = req.body; // una variabile per chiave (a parità di nome)
    connection.query("INSERT INTO books (title, author, year) VALUES (?, ?, ?)",
      [title, author, year],
      function(err, result) {
        res.json({id: result.insertId});
      });
});

// aggiorno un libro esistente nello store
app.put('/books/:id', (req, res) => {
  const { title, author, year} = req.body;
  const bookId = req.params.id;

  connection.query('UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?',
    [title, author, year, bookId],
    function(err, result)  {
      res.json({success: true});
    })
})



app.listen(port, 
    () => console.log('Server in ascolto sulla porta 3000'));