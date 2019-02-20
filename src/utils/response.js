module.exports = {

    sendSuccessResponse: function(successMessage, statusCode, data, res) {
        data = data === null ? {} : data;
        statusCode = statusCode === null ? 200 : statusCode;
        successMessage = successMessage === null ? "Success" : successMessage;
        return res.status(statusCode).send({
            message: successMessage,
            data: data
        });
    },

    sendErrorResponse: function(error, defaultErrorMessage, data, res) {
        let errorMessage;
        let statusCode;
        if(error.statusCode) {
            //is a safe error
            errorMessage = error.message;
            statusCode = error.statusCode;
        } else {
            //Dangerous errors(might have db information we don't want to show to the client
            errorMessage = defaultErrorMessage;
            statusCode = 500;
        }
        data = data === null ? {} : data;
        console.error(errorMessage, error);//but we always log the original detailed error for bug fixing
        return res.status(statusCode).send({
            message: errorMessage,
            data: data
        });
    }

};
