const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error',
    status,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;
