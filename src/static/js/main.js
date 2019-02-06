require("../css/layout.css");
require("../css/partials/form.css");
// require("../css/pages/landing.css");
// require("../css/pages/project_details.css");
// require("../css/pages/run_details.css");

var jQuery = $ = require('jquery');
window.$ = window.jQuery = jQuery;

(function(jQuery) {
    jQuery.fn.fintzsensors = function() {
        var createProjectPlugin = require("./pages/landing/createProject");
        var deleteProjectPlugin = require("./pages/landing/deleteProject");
        var activeRunPlugin = require("./pages/run/activeRun");


        // retrieves the current context as the matched object, this
        // is considered to be the default/expected behaviour
        var matchedObject = this;
        var addProjectForm = jQuery(".form.add-project", matchedObject);
        var deleteProjectButton = jQuery(".button.delete-project", matchedObject);
        var activeRunContainer = jQuery(".active-run-container", matchedObject);

        createProjectPlugin(addProjectForm);
        deleteProjectPlugin(deleteProjectButton);
        activeRunPlugin(activeRunContainer);

        // returns the current context to the caller function/method
        // so that proper chaining may be applied to the context
        return this;
    };
})(jQuery);

jQuery(document).ready(function() {
    var _body = jQuery("body");
    _body.fintzsensors();
});
