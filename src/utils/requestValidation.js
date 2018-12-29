const path = require("path");
const generalValidations = require(path.resolve(global.utilsFolder, "general"));
module.exports = {

    isValidBody: function(requiredFields, reqBody) {
        const checkIfBodyContainsRequiredFields = function(requiredKeys, body) {
            let containsAll = true;
            requiredKeys.forEach(function(requiredKey, index) {
                if (body.hasOwnProperty(requiredKey) === false || !body[requiredKey]) {
                    containsAll = false;
                    return containsAll;
                }
            });
            return containsAll;
        };

        const defaultErrorMsg = `Request body requires: ${requiredFields}`;
        let result = {
            status: true,
            message: "valid"
        };
        if (!Array.isArray(requiredFields)) {
            result = {
                status: false,
                message: "Invalid request body"
            };
        } else if (generalValidations.isJsObjectNull(reqBody)) {
            let errorMessage = defaultErrorMsg;
            result = {
                status: false,
                message: errorMessage
            };
        } else {
            let status = checkIfBodyContainsRequiredFields(requiredFields, reqBody);
            let statusMessage = status === true ? "valid" : defaultErrorMsg;
            result = {
                status: status,
                message: statusMessage
            };
        }
        return result;
    }
};
