require("../../css/layout.css");
require("../../css/partials/form.css");
require("../../css/partials/side_menu.css");
require("../../css/pages/landing.css");
require("../../css/pages/session_details.css");

const moment = require('moment')

var fintzSensorsUI = function(element) {
    var _body = jQuery("body", document);
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        var sessionDetailsContainer = jQuery(".session-details-container", matchedObject);
        var listSessions = jQuery(".list-sessions", element);

        listSessions.length && _updateDateFormats(listSessions);
        sessionDetailsContainer &&_updateDateFormats(sessionDetailsContainer, { format: "MMMM Do YYYY, hh:mm a"});
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
        
        var listSessions = jQuery(".list-sessions", matchedObject);
        var sessions = jQuery(".element-session", listSessions);
        var sideMenu = jQuery(".side-menu", matchedObject);
        var homePageTab = jQuery(".homepage-tab", sideMenu);
        _sessionsClickHandlers(sessions, homePageTab);

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

        sessions.length > 1 && sessions[0].click(); 
    };

    var _updateDateFormats = function (element, options) {
        var _options = options || {};
        var format = _options.format || "DD/MM/YYYY";
        var dates = jQuery(".date", element);
        dates.each(function(){
            var _element = jQuery(this);
            var timestamp = _element.attr("data-timestamp");
            _element.text(moment.unix(timestamp).format(format));
        });
    };

    var _sessionsClickHandlers = function(sessions, homePageTab) {
        sessions.each(function(){
            var session = jQuery(this);
            session.click(function(){
                sessions.removeClass("selected");
                var element = jQuery(this);
                element.addClass("selected");
                homePageTab.triggerHandler("session_selected");
            });
        });
    
        sessions.length > 1 && sessions[0].click();    
    };

    init();
    bind();

    return matchedObject;
};

module.exports = fintzSensorsUI;
