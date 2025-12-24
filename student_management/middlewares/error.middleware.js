const errorMiddleware = (err, req, res, next) => {
  try {
    console.error(err);

    let error = {
      statusCode: err.statusCode || 500,
      message: err.message || "Server Error",
    };

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      error.statusCode = 404;
      error.message = "Resource not found";
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      error.statusCode = 409; 
      error.message = "Duplicate field value entered";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error.statusCode = 400;
      error.message = message.join(", ");
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } catch (e) {
    next(e);
  }
};

export default errorMiddleware;
