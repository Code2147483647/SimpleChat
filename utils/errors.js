const ErrorCode = {
    UserNotFoundError: 3000,
    InvalidTypeError: 3001,
    EmailAlreadyExistError: 3002,
    LoginError: 3003,
    SQLError: 4000,
    DuplicateEntryError: 4001
};

class GenericError extends Error {
    constructor(message, code) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidTypeError extends GenericError {
    constructor (propertyName) {
        super(`invalid ${propertyName} type`, ErrorCode.InvalidTypeError);
    }
}

class LoginError extends GenericError {
    constructor () {
        super('user not found or password not match', ErrorCode.LoginError);
    }
}

class EmailAlreadyExistError extends GenericError {
    constructor () {
        super('email already exist', ErrorCode.EmailAlreadyExistError);
    }
}

class UserNotFoundError extends GenericError {
    constructor() {
        super('user not found', ErrorCode.UserNotFoundError);
    }
}

class SQLError extends GenericError {
    constructor(msg) {
        super(msg, ErrorCode.SQLError);
    }
}

class DuplicateEntryError extends GenericError{
    constructor() {
        super('duplicate entry', ErrorCode.DuplicateEntryError);
    }
}

module.exports = {
    GenericError,
    SQLError,
    DuplicateEntryError,
    UserNotFoundError,
    InvalidTypeError,
    EmailAlreadyExistError,
    LoginError,
    ErrorCode
};
