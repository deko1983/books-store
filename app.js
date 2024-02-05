const express = require('express');
const mysql = require('mysql');
const port = 3000;

const app = express();
app.use(express.json());

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

app.listen(port, 
    () => console.log('Server in ascolto sulla porta 3000'));