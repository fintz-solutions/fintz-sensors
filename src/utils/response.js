module.exports = {

    sendSuccessResponse : function (successMessage, statusCode, data, res) {
        data = data === null ? {} : data;
        statusCode = statusCode === null ? 200 : statusCode;
        successMessage = successMessage === null ? "Success" : successMessage;
        return res.status(statusCode).send({message: successMessage, data : data});
    },

    sendErrorResponse : function (error, defaultErrorMessage, data, res) {
        let errorMessage = error && error.message ? error.message : defaultErrorMessage;
        let statusCode = error && error.statusCode ? error.statusCode : 500;
        data = data === null ? {} : data;
        console.error(errorMessage, error);
        return res.status(statusCode).send({message: errorMessage, data : data});
    }

};