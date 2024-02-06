const fetch = require('node-fetch');

function fetchBooks()  {

    fetch('http://localhost:3000/books')
     .then((response) => {
        if (response.ok)
            return response.json();
     })
     .then((data) => {
        console.log('data: ' + JSON.stringify(data));
     })
}

// async trasforma una funzione standard in una promise (se ritorna un valore)
async function fetchBooksAsync()  {
    // await si può usare solo dentro una funzione async
    const response = await fetch('http://localhost:3000/books');

    if (response.ok)  {
        const data = await response.json();

        console.log('data: ' + JSON.stringify(data));
    }
}

fetchBooks();
fetchBooksAsync();



async function asyncFunction()  {
    return 1;
}

async function asyncFunction()  {
    return new Promise(function(resolve, reject) {
        resolve(1);
    });
} 