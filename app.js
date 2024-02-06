const express = require('express');
const mysql = require('mysql');
const port = 3000;

const app = express();
// middleware di trasformazione del body
app.use(express.json());

// middleware custom per loggare le request
function requestLogger(req, res, next)  {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;

  console.log(timestamp + ", " + method + ", " + path);

  next();
}

app.use(requestLogger);

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