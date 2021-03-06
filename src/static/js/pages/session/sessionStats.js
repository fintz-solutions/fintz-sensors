require("../../../css/pages/session_stats.css");
const Charts = require("chart.js");
const statsUrl = window.location.href;

var sessionStats = function(element) {
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

        _syncStats(matchedObject);
    };

    var _syncStats = function(element) {
        jQuery.ajax({
            url: statsUrl,
            headers: {
                'Content-Type':'application/json'
            },
            type: 'GET',
            success: function(data, status) {
                _chartsHandler(element, data.data.charts);

            },
            error: function(data) {
                var message = data && data.responseJSON && data.responseJSON.message || "Get session stats operation error";
                element.triggerHandler("error", message);
            }
        });
    };

    var _chartsHandler = function(element, stats) {
        let chartsContainer = jQuery(".charts-container", element);
        for(let i = 0, length = stats.length; i < length; i++) {
            let canvasContainer = jQuery("<div class=\"container canvas-container\"></div>");
            let canvas = jQuery("<canvas class=\"chart\"></canvas>");
            canvas.addClass("chart-" + (i + 1).toString())
            canvas.addClass(stats[i].type);
            canvasContainer.append(canvas);
            chartsContainer.append(canvasContainer);
            let chart = new Charts(canvas, stats[i]);
        };
    };

    init();
    bind();

    return matchedObject;
};

module.exports = sessionStats;
