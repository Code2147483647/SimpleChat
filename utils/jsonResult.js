const ERROR_TYPE = {
    system: {
        systemError: 'systemError#1000',
    },
    validation: {
        validationError: 'validationError#2001'
    },
    user: {
        permissionDenied: 'permissionDenied#3001',
        duplicatedEmailError: 'duplicatedEmailError#3002',
        userNotFoundError: 'userNotFoundError#3003'
    }
};

function getFailedResult(message, errorType, data=null) {
  const json = {success: false, message: message, errorType: 'unrecorded', errorCode: 1000};
  if (errorType) {
    json.errorType = errorType.split('#')[0];
    json.errorCode = errorType.split('#')[1];
  }

  if (!Object.has(json, 'errorCode')) {
    json.errorCode = 1000;
  }
  if (!Object.isEmpty(data)) {
      json.data = data;
  }

  return json;
};
function getSuccessfulResult(payload) {
    return {
        success: true,
        data: payload
    }
}

function getValidatorErrorResult(errors) {
    return getFailedResult('validation error', ERROR_TYPE.validation.validationError, errors)
}

module.exports = {
    getSuccessfulResult,
    getFailedResult,
    ERROR_TYPE,
    getValidatorErrorResult
};
