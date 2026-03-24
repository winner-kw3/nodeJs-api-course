
function notFound(req, res, next) {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} non trouvée`
  });
}

module.exports = notFound;