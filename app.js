const express = require('express');
const mysql = require('mysql');
const port = 3000;

const app = express();

// endpoint vanno qui
app.get('/', (req, res) => {
    res.send('Benvenuto sui nostri server');
});

app.listen(port, 
    () => console.log('Server in ascolto sulla porta 3000'));