
const express = require('express');
const morgan = require('morgan');
const { getBooks, getBookById, addBook, deleteBook} = require('./modules/router');
const app = express();
const PORT = 3000;


app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur');
});

app.get('/books', getBooks);
app.get('/books/:id', getBookById);
app.post('/books', express.json(), addBook);
app.delete('/books/:id', deleteBook);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée"
  });
});



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

