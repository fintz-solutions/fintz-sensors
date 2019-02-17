require("../../css/layout.css");
require("../../css/partials/form.css");
require("../../css/partials/side_menu.css");
require("../../css/pages/landing.css");

const moment = require('moment')

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
        var sideMenu = jQuery(".side-menu", matchedObject);
        var homePageTab = jQuery(".homepage-tab", sideMenu);

        sessions.each(function(){
            var session = jQuery(this);
            session.click(function(){
                var element = jQuery(this);
                sessions.removeClass("selected");
                element.addClass("selected");
                homePageTab.triggerHandler("session_selected");
            });
        });

        homePageTab.bind("session_selected", function() {
            var element = jQuery(this);
            var sessionPreview = jQuery(".preview-session", element)
            var listSessions = jQuery(".list-sessions", _body);
            var sessions = jQuery(".element-session", listSessions);
            var selected = sessions.filter(".selected");
            var number = jQuery(".number", sessionPreview);
            var status = jQuery(".status", sessionPreview);
            var numStations = jQuery(".num-stations", sessionPreview);
            var numRuns = jQuery(".num-runs", sessionPreview);
            var target = jQuery(".target", sessionPreview);

            sessionPreview.removeClass("hidden");
            number.html(selected.attr("data-number"));
            status.html(selected.attr("data-status"));
            numStations.html(selected.attr("data-stations"));
            numRuns.html(selected.attr("data-runs"));
            target.html(selected.attr("data-target"));
        });
    };

    var _updateDateFormats = function (element) {
        var dates = jQuery(".date", element);
        dates.each(function(){
            var _element = jQuery(this);
            var timestamp = _element.attr("data-timestamp");
            _element.text(moment.unix(timestamp).format("DD/MM/YYYY"));
        });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = fintzSensorsUI;
