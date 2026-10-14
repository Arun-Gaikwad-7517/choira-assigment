import AppError from "../utils/AppError.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle invalid MongoDB IDs
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // Handle duplicate values in MongoDB
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value already exists";
  }

  // Hide unexpected server error details
  if (statusCode >= 500) {
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err instanceof AppError && err.errors.length > 0
      ? { errors: err.errors }
      : {}),
  });
};

export default errorMiddleware;
