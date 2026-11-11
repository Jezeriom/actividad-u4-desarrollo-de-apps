const app = require('./app');
const config = require('./config/server.config');

const server = app.listen(config.port, () => {
  console.log(`[Server] Servidor escuchando en http://localhost:${config.port}`);
  console.log(`[Server] Entorno: ${config.nodeEnv}`);
  console.log(`[Server] Endpoint base: http://localhost:${config.port}/api/notes`);
});

module.exports = server;
