function notFoundHandler(req, res) {
  return res.status(404).json({
    status: 'error',
    message: `Route introuvable : ${req.method} ${req.originalUrl}`
  });
}

module.exports = notFoundHandler;
