(function(jQuery) {
    jQuery.fn.fintzsensors = function() {
        var createProjectPlugin = require("./pages/landing/createProject");
        var deleteProjectPlugin = require("./pages/landing/deleteProject");

        // retrieves the current context as the matched object, this
        // is considered to be the default/expected behaviour
        var matchedObject = this;
        var addProjectForm = jQuery(".form.add-project", matchedObject);
        var deleteProjectButton = jQuery(".button.delete-project", matchedObject);

        createProjectPlugin(addProjectForm);
        deleteProjectPlugin(deleteProjectButton);

        // returns the current context to the caller function/method
        // so that proper chaining may be applied to the context
        return this;
    };
})(jQuery);

jQuery(document).ready(function() {
    var _body = jQuery("body");
    _body.fintzsensors();
});
