module.exports = {

    isJsObjectNull: function(obj) {
        return !obj || Object.keys(obj).length === 0
    }
};
