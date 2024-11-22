// requestLogger.js
const logger = require('../logger.js');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Extraer detalles adicionales
  const { method, originalUrl, headers, body } = req;
  const { statusCode } = res;
  const ip = req.ip || req.connection.remoteAddress; // Dirección IP del cliente
  const userAgent = headers['user-agent']; // User-Agent de la solicitud
  

  // Verificar si hay un usuario autenticado (si tienes autenticación implementada)
  const user = req.user ? req.user.username : 'Unauthenticated';

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      message: `${method} ${originalUrl} ${statusCode} - ${duration}ms (${ip})`,
      method,
      url: originalUrl,
      statusCode,
      duration,
      ip,
      userAgent,
      user,
      body: (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : undefined, // Solo guarda el cuerpo para POST/PUT
      timestamp: new Date().toISOString()
    });
  });

  next();
};

module.exports = requestLogger;
