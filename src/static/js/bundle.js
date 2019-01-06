(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./projectForm":2}],2:[function(require,module,exports){
var projectForm = function(element) {
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        matchedObject.submit(event, function () {
            if(!event || event.length === 0) {
                return;
            }
            
            event.preventDefault(); 

            var element = jQuery(this);
            element.triggerHandler("pre_submit");
            var url = event.currentTarget && event.currentTarget.action;
            var name = jQuery(".name-field", element);
            var numStations = jQuery(".stations-num-field", element);
            var numRuns = jQuery(".runs-num-field", element);
            var timePerRun = jQuery(".time-run-field", element);
            var productionTarget = jQuery(".production-target-field", element);
            
            name = name && name.val() || "New project";
            numStations = numStations && parseInt(numStations.val()) || 8;
            numRuns = numRuns && parseInt(numRuns.val()) || 3;
            timePerRun = timePerRun && parseInt(timePerRun.val()) || 30;
            productionTarget = productionTarget && parseInt(productionTarget.val()) || 1;
            jQuery.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "name": name,
                    "numStations": numStations,
                    "numRuns": numRuns,
                    "timePerRun": timePerRun,
                    "productionTarget": productionTarget,
                    "status": "CREATED"
                }),
                success: function(data, status) {
                    element.triggerHandler("success", data);
                },
                error: function(data) {
                    var message = data && data.responseJSON && data.responseJSON.message || "Form error";
                    matchedObject.triggerHandler("error", message);
                }
              });
        });

        matchedObject.bind("pre_submit", function() {
            var element = jQuery(this);
            element.addClass("loading");
            element.removeClass("success");
            element.removeClass("error");
        });

        matchedObject.bind("success", function() {
            var element = jQuery(this);
            element.removeClass("loading");
            element.addClass("success");
        });
        
        matchedObject.bind("error", function(event, message) {
            var element = jQuery(this);
            var errorMessage = jQuery(".error-message", element);
            errorMessage.text(message);
            element.removeClass("loading");
            element.addClass("error");
        });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = projectForm;

},{}]},{},[1]);
