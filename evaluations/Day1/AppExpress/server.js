
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./modules/swagger');


const { getBooks, getBookById, addBook, deleteBook} = require('./modules/router');
const app = express();
const PORT = 3000;


app.use(morgan('dev'));

const corsOptions = {
  origin: ["http://localhost:5173", "https://mon-frontend.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur');
});



app.get('/books', getBooks);
app.get('/books/:id', getBookById);
app.post('/books', express.json(), addBook);
app.delete('/books/:id', deleteBook);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée"
  });
});



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

