require("../../../css/pages/active_run.css");

const Timer = require('easytimer.js').Timer;
const io = require('socket.io-client')

const ACTION_TYPES = {
    START_RUN: "START",
    MOVE_ITER: "MOVE",
    CONTINUE_RUN: "CONTINUE",
    KILL: "KILL",
    END_RUN: "END" //TODO: call this action when the run total time reached zero
  };
Object.freeze(ACTION_TYPES);

const TIMER_EVENT = {
    START: "START",
    STOP: "STOP"
  };
Object.freeze(TIMER_EVENT);

var activeRun = function(element) {
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

        /** Action buttons **/
        var startButton = jQuery(".button-start", matchedObject);
        var moveButton = jQuery(".button-move", matchedObject);
        var continueButton = jQuery(".button-continue", matchedObject);
        var killButton = jQuery(".button-kill", matchedObject);

        /** Timers **/
        var sations = jQuery(".stations", element);
        var stationsNum = sations.attr("data-stations_num");
        var runTimerElement = jQuery(".run-timer", element);
        var stationTimersElement = jQuery(".stations-container", element);
        var taktTimerElement = jQuery(".takt-time-desc", element);
        var runTimer = new Timer();
        var taktTimer = new Timer();
        var stationTimers = [];

        while (stationsNum > stationTimers.length) {
            stationTimers.push(new Timer());
        }

        runTimer.addEventListener('secondsUpdated', function () {
            runTimerElement.html(runTimer.getTimeValues().toString());
        });

        taktTimer.addEventListener('secondsUpdated', function () {
            taktTimerElement.html(taktTimer.getTimeValues().toString());
        });

        for (var t = 0, length = stationTimers.length; t < length; t++) {
            var timerNum = t + 1;
            stationTimers[t].addEventListener('secondsUpdated', function () {
                var element = jQuery('.station-timer-' + timerNum, stationTimersElement);
                element.html(stationTimers[t].getTimeValues().toString());
            });

            stationTimers[t].addEventListener('started', function (e) {
                var element = jQuery('.station-timer-' + timerNum, stationTimersElement);
                element.html(stationTimers[t].getTimeValues().toString());
            });
        };

        var socket = io.connect();
        socket.on('toggleTimer', function(data){
            if (!data || data.length === 0 || data.station <= stationTimers.length ) {
                return;
            }

            var stationToToggle = data.station;
            var seconds = data.currentTime || 0;
            var timerToUpdate = stationTimers[stationToToggle - 1];
            var station = jQuery(".station-" + stationToToggle);
            data.operation === TIMER_EVENT.START && _startStationTimer(station, timerToUpdate, seconds);
            data.operation === TIMER_EVENT.STOP && _stopStationTimer(station, timerToUpdate);
        });

        startButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_start");
        });

        moveButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_move");
        });

        continueButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_continue");
        });

        killButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var activeRunContainer = element.parents(".active-run-container");
            activeRunContainer.triggerHandler("pre_kill");
        });

        matchedObject.bind("pre_start", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.START_RUN);
        });

        matchedObject.bind("start_action", function(event){
            var element = jQuery(this);
            var runTimerElement = jQuery(".run-timer", element);
            var taktTimerElement = jQuery(".takt-time-desc", element);
            _startRunTimer(runTimerElement, runTimer);
            _startTaktTimer(taktTimerElement, taktTimer);
            startButton.addClass("disabled");
            killButton.removeClass("disabled");
        });

        matchedObject.bind("pre_move", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.MOVE_ITER);
        });

        matchedObject.bind("move_action", function(event){
            moveButton.addClass("disabled");
            continueButton.removeClass("disabled");
            _clearStationTimers(stationTimers);
        });

        matchedObject.bind("pre_continue", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.CONTINUE_RUN);
        });

        matchedObject.bind("continue_action", function(event){
            continueButton.addClass("disabled");
        });

        matchedObject.bind("pre_kill", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.KILL);
        });

        matchedObject.bind("kill_action", function(event){
            var buttons = jQuery(".button" ,matchedObject);
            buttons.addClass("disabled");
            // TODO: redirects to where?
            //TODO: improve this
            window.location.href = '/';
        });
    };

    var _sendActionType = function(element, actionType) {
        var startButton = jQuery(".button-start", element);
        var url = startButton.attr("href");

        jQuery.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                "actionType": actionType,
            }),
            success: function(data, status) {
                var event = actionType.toLowerCase() + "_action";
                element.triggerHandler(event, data);
            },
            error: function(data) {
                var message = data && data.responseJSON && data.responseJSON.message || "Error sending action";
                matchedObject.triggerHandler("error", message);
            }
        });
    };

    var _startRunTimer = function(element, timer) {
        var minutes = element.attr("data-duration");
        minutes = parseFloat(minutes);
        timer.start({
            countdown: true,
            startValues: {
                minutes: minutes
            }
        });
    };

    var _startTaktTimer = function(element, timer) {
        element.removeClass("hidden");
        var minutes = element.attr("data-duration");
        minutes = parseFloat(minutes);
        timer.start({
            countdown: true,
            startValues: {
                minutes: minutes
            }
        });
    };

    var _startStationTimer = function(element, timer, seconds) {
        timer.stop();
        timer.start({ startValues: { seconds: seconds }});
        element.addClass("active");
        element.removeClass("stop");
    };

    var _stopStationTimer = function(element, timer) {
        timer.pause();
        element.removeClass("active");
        element.addClass("stop");
    };

    var _clearStationTimers = function(timers) {
        for(var i = 0, length = timers.length; i < length; i++) {
            timers[i].reset();
        }
        element.removeClass("stop")
        // TODO:review this: add reset class?
    };

    init();
    bind();

    return matchedObject;
};

module.exports = activeRun;
