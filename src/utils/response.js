/** Class representing the response util */
class Response {
  /**
   * Returns a structured response
   * @param {object} res Express Response
   * @param {string} status Action status
   * @param {string} message Action Message
   * @param {object} data Return data from action
   * @returns {object} Response from endpoint
   */
  static customResponse(res, status, message = null, data = null) {
    return res.status(status).json({
      status,
      message,
      data
    });
  }

  /**
   * Returns a validation error
   * @param {*} res Express Response
   * @param {*} message Endpint response message
   * @returns {object} Response from endpoint
   */
  static validationError(res, message) {
    return res.status(422).json({
      status: 422,
      message,
      error: 'Validation error'
    });
  }

  /**
   * Returns a conflict error
   * @param {*} res express response body
   * @param {*} message message from endpoint
   * @returns {object} Conflict response
   */
  static conflictError(res, message) {
    return res.status(409).json({
      status: 409,
      message,
      error: 'Conflict error'
    });
  }

  /**
   * Retuns a authentication error response
   * @param {object} res  details.
   * @param {string} message  details.
   * @param {object} data  details.
   * @returns {object}.
   */
  static authenticationError(res, message) {
    return res.status(401).json({
      status: 401,
      message,
      error: 'Authentication Error'
    });
  }

  /**
   * Retuns a not found error response
   * @param {object} res  details.
   * @param {string} message  details.
   * @param {object} data  details.
   * @returns {object}.
   */
  static notFoundError(res, message) {
    return res.status(404).json({
      status: 404,
      message,
      error: 'Not Found'
    });
  }

  /**
   * Retuns a bad error response
   * @param {object} res  details.
   * @param {string} message  details.
   * @param {object} data  details.
   * @returns {object}.
   */
  static badRequestError(res, message) {
    return res.status(400).json({
      status: 400,
      message,
      error: 'Bad Request'
    });
  }

  /**
   * Retuns a authorization error response
   * @param {object} res  details.
   * @param {string} message  details.
   * @param {object} data  details.
   * @returns {object}.
   */
  static authorizationError(res, message) {
    return res.status(403).json({
      status: 403,
      message,
      error: 'Authorization Error'
    });
  }
}

export default Response;
