
require('dotenv').config(); +
const express = require('express');
const morgan = require('morgan');
const livreRoutes = require('./routes/livre.routes');
const userRoutes = require('./routes/user.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur de la bibliothèque !');
});


app.use('/api/auth', userRoutes);
app.use('/api/livres', livreRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});


app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});