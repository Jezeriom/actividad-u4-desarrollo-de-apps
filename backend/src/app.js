const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const noteRoutes = require('./routes/note.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Middlewares globales
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rutas de la API
app.use('/api', noteRoutes);

// Endpoint de bienvenida / raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API REST de Notas activa. Use /api/notes o /api/health'
  });
});

// Manejadores de 404 y errores globales
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
