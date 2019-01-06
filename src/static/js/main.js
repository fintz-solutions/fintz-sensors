(function(jQuery) {
    jQuery.fn.fintzsensors = function() {
        var projectFormPlugin = require("./projectForm");

        // retrieves the current context as the matched object, this
        // is considered to be the default/expected behaviour
        var matchedObject = this;
        var addProjectForm = jQuery("form.add-project", matchedObject);

        projectFormPlugin(addProjectForm);

        // returns the current context to the caller function/method
        // so that proper chaining may be applied to the context
        return this;
    };
})(jQuery);

jQuery(document).ready(function() {
    var _body = jQuery("body");
    _body.fintzsensors();
});