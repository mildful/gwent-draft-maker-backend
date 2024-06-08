export enum ErrorCode {
  CANNOT_ADD_DECK_TO_DRAFT = 'CannotAddDeckToDraft',
  CURRENT_KEG_ALREADY_EXISTS = 'CurrentKegAlreadyExists',
  DECK_INVALID_CARD = 'DeckInvalidCard',
  DECK_NOT_FOUND = 'DeckNotFound',
  DRAFT_NOT_FOUND = 'DraftNotFound',
  USER_NOT_FOUND = 'UserNotFound',
  GENERIC_CONFLICT = 'GenericConflictError',
  GENERIC_DOMAIN = 'GenericDomainError',
  GENERIC_FORBIDDEN = 'GenericForbiddenError',
  GENERIC_NOTFOUND = 'GenericNotFoundError',
  GENERIC_SERVER = 'GenericServerError',
  GENERIC_UNAUTHORIZED = 'GenericUnauthorizedError',
  GENERIC_VALIDATION = 'GenericValidationError',
  NO_REMAINING_KEG = 'NoRemainingKeg',
  PAGE_NOT_FOUND = 'PageNotFound',
}

export class DomainError extends Error {
  data?: unknown;
  code?: ErrorCode;

  constructor(message?: string, code?: ErrorCode, data?: unknown) {
    super(message);
    this.code = code ?? ErrorCode.GENERIC_DOMAIN;
    this.data = data;
  }

  public static isDomainError(value: Error): value is DomainError {
    return value instanceof DomainError;
  }
}

export class ValidationError extends DomainError {
  constructor(message?: string, code?: ErrorCode) {
    super(message, code ?? ErrorCode.GENERIC_VALIDATION);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message?: string, code?: ErrorCode) {
    super(message, code ?? ErrorCode.GENERIC_FORBIDDEN);
  }
}

export class ConflictError extends DomainError {
  constructor(message?: string, code?: ErrorCode) {
    super(message, code ?? ErrorCode.GENERIC_CONFLICT);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message?: string, code?: ErrorCode) {
    super(message, code ?? ErrorCode.GENERIC_UNAUTHORIZED);
  }
}

export class NotFoundError extends DomainError {
  constructor(message?: string, code?: ErrorCode, data?: unknown) {
    super(message, code ?? ErrorCode.GENERIC_NOTFOUND, data);
  }
}

export class ServerError extends DomainError {
  constructor(message?: string, code?: ErrorCode) {
    super(message, code ?? ErrorCode.GENERIC_SERVER);
  }
}

export class ErrorUtils {
  public static getErrorMessage(error: DomainError | Error): string {
    return error instanceof DomainError ? error.message : error.toString();
  }
}
