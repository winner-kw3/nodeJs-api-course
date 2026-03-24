const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');


const livreRoutes = require('./src/routes/livre.routes');
const userRoutes = require('./src/routes/user.routes');
const errorHandler = require('./src/middlewares/errorHandler.middleware');
const notFound = require('./src/middlewares/notFound.midlleware');
const app = express();

const isDev = process.env.NODE_ENV !== 'production';

const corsOptions = isDev
  ? { origin: true, credentials: true }
  : {
      origin: (origin, callback) => {
        const whitelist = (process.env.ALLOWED_ORIGINS || '')
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean);
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS bloqué : origine non autorisée — ${origin}`));
        }
      },
      credentials: true,
    };

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives, veuillez réessayer dans 15 minutes.' },
});


app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());
app.use(globalLimiter);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur de la bibliothèque !');
});

app.use('/api/auth', userRoutes);
app.use('/api/livres', livreRoutes);

app.use(errorHandler);
app.use(notFound);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvée' });
});



app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS bloqué')) {
    return res.status(403).json({ message: err.message });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload trop volumineux (max 10kb).' });
  }
  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);
  res.status(err.status || 500).json({ message: 'Erreur interne du serveur.' });
});

module.exports = app;