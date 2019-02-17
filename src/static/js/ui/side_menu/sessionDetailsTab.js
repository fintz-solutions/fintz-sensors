const moment = require('moment')
const ChartJs = require('chart.js');

var fintzSensorsUI = function(element) {
    var _body = jQuery("body", document);
    var matchedObject = jQuery(element);
    var listSessions = jQuery(".list-sessions", element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        _updateDateFormats(listSessions);
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        var sessions = jQuery(".element-session", listSessions);

        sessions.each(function(){
            var session = jQuery(this);
            session.click(function(){
                var element = jQuery(this);
                sessions.removeClass("selected");
                element.addClass("selected");

            });
        });
    };

    var _updateDateFormats = function (element) {
        var dates = jQuery(".date", element);
        dates.each(function(){
            var _element = jQuery(this);
            var timestamp = _element.attr("data-timestamp");
            _element.text(moment.unix(timestamp).format("DD/MM/YYYY"));
        });
    }

    init();
    bind();

    return matchedObject;
};

module.exports = fintzSensorsUI;
