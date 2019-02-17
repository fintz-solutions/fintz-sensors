var jQuery = $ = require('jquery');
window.$ = window.jQuery = jQuery;

(function(jQuery) {
    jQuery.fn.fintzsensors = function() {
        var uiPlugin = require("./ui/fintzSensorsUI.js");
        var createSessionPlugin = require("./pages/landing/createSession");
        var deleteSessionPlugin = require("./pages/landing/deleteSession");
        var activeRunPlugin = require("./pages/run/activeRun");


        // retrieves the current context as the matched object, this
        // is considered to be the default/expected behaviour
        var matchedObject = this;
        var fintzSensorsApp = jQuery(".fintz-sensors", matchedObject);
        var addSessionForm = jQuery(".form.add-session", matchedObject);
        var deleteSessionButton = jQuery(".button.delete-session", matchedObject);
        var activeRunContainer = jQuery(".active-run-container", matchedObject);

        uiPlugin(fintzSensorsApp);
        createSessionPlugin(addSessionForm);
        deleteSessionPlugin(deleteSessionButton);
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
