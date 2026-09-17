function notFound(req, res, next) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
}

module.exports = { notFound, errorHandler };
