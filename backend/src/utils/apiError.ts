export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  CONFLICT = "CONFLICT_ERROR",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE_ERROR",
  INTERNAL = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST_ERROR",
}

export default class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errorType: ErrorType = ErrorType.INTERNAL
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
