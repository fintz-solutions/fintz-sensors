module.exports = {
    createAndThrowGenericError : function(errorMessage, statusCode) {
        errorMessage = errorMessage ? errorMessage : "Generic error";
        statusCode = statusCode ? statusCode : 500;
        let errorObject = new Error(errorMessage);
        errorObject.statusCode = statusCode;
        throw errorObject;
    }
};