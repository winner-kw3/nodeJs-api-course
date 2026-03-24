
function errorHandler(err, req, res, next) {
  
  console.error({
    message: err.message,
    status: err.status || 500,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  const statusCode = err.status || 500;
  const response = {
    status: statusCode >= 500 ? "error" : "fail",
    message: statusCode >= 500 
      ? "Erreur interne" 
      : err.message
  };

  
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;