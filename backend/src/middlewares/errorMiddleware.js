import mongoose from "mongoose";
import { AppError, NotFoundError } from "../utils/errors.js";

const buildValidationDetails = (validationError) =>
  Object.values(validationError.errors || {}).map((issue) => ({
    field: issue.path,
    message: issue.message,
  }));

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError("Validation failed", 400, {
      details: buildValidationDetails(error),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
  }

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyValue || {})[0] || "field";
    return new AppError(`${duplicateField} already exists`, 409);
  }

  if (error?.name === "JsonWebTokenError") {
    return new AppError("Invalid token", 401);
  }

  if (error?.name === "TokenExpiredError") {
    return new AppError("Token expired", 401);
  }

  return new AppError(error?.message || "Internal server error", error?.statusCode || 500, {
    isOperational: false,
  });
};

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);
  }

  const payload = {
    success: false,
    message: normalizedError.message,
  };

  if (normalizedError.details) {
    payload.details = normalizedError.details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};
