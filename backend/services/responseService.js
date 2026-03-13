/**
 * Service to standardize API responses
 */

/**
 * Success response
 * @param {object} res - Express response object
 * @param {any} data - Data to send
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, data = {}, message = "Operation successful", statusCode = 200) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data,
  });
};

/**
 * Error response
 * @param {object} res - Express response object
 * @param {string|object} error - Error message or object
 * @param {number} statusCode - HTTP status code (default 400)
 */
const sendError = (res, error = "Something went wrong", statusCode = 400) => {
  return res.status(statusCode).json({
    status: false,
    error,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
