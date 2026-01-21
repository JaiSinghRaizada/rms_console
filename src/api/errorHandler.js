// src/api/errorHandler.js

/**
 * Standard error response structure
 */
class ApiError extends Error {
  constructor(message, statusCode = null, originalError = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Error handler for API responses
 * Maps HTTP status codes to user-friendly error messages
 * @param {Error} error - The error object from axios
 * @returns {ApiError} Standardized error object
 */
export const errorHandler = (error) => {
  // Network error - no response from server
  if (!error.response) {
    return new ApiError(
      error.message === "Network Error"
        ? "Network error. Please check your internet connection."
        : error.message || "An unexpected error occurred",
      null,
      error
    );
  }

  const { status, data } = error.response;

  // Extract error message from different response formats
  const errorMessage =
    data?.message ||
    data?.error ||
    getErrorMessageByStatus(status) ||
    "An error occurred";

  return new ApiError(errorMessage, status, error);
};

/**
 * Map HTTP status codes to user-friendly error messages
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly error message
 */
export const getErrorMessageByStatus = (status) => {
  const errorMessages = {
    400: "Invalid request. Please check your input.",
    401: "Invalid credentials or session expired.",
    403: "You don't have permission to access this resource.",
    404: "Resource not found.",
    408: "Request timeout. Please try again.",
    409: "Conflict. The resource may already exist.",
    410: "The requested resource is no longer available.",
    413: "Request payload too large.",
    415: "Unsupported media type.",
    420: "Enhanced calm required. Too many requests.",
    423: "Your account is locked. Please contact support.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    501: "Not implemented.",
    502: "Bad gateway. Please try again.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. Please try again.",
  };

  return errorMessages[status] || `An error occurred (Error ${status})`;
};

/**
 * Domain-specific error handlers for different API modules
 */
export const authErrorHandler = (error) => {
  if (error instanceof ApiError) {
    const statusSpecificMessages = {
      401: "Invalid email or password.",
      403: "Your account is not verified or is disabled.",
      404: "Invalid email or password.",
      423: "Your account is locked. Please contact support.",
      429: "Too many login attempts. Please try again later.",
      500: "Something went wrong. Please try again later.",
    };

    return statusSpecificMessages[error.statusCode] || error.message;
  }

  return error.message || "Authentication failed";
};

export const validationErrorHandler = (error) => {
  if (error instanceof ApiError && error.statusCode === 400) {
    return error.message;
  }
  return error.message || "Validation failed";
};

export const serverErrorHandler = (error) => {
  if (error instanceof ApiError && error.statusCode >= 500) {
    return "A server error occurred. Please try again later.";
  }
  return error.message || "An error occurred";
};

export default errorHandler;
