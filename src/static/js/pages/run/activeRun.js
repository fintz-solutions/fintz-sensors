require("../../../css/pages/active_run.css");

const Timer = require('easytimer.js').Timer;
const io = require('socket.io-client')

const ACTION_TYPES = {
    START_RUN: "START",
    MOVE_ITER: "MOVE_ITER",
    CONTINUE_RUN: "CONTINUE",
    KILL: "KILL",
    END: "END"
};
Object.freeze(ACTION_TYPES);

const TIMER_EVENT = {
    START: "START",
    STOP: "STOP"
};
Object.freeze(TIMER_EVENT);

var activeRun = function(element) {
    var matchedObject = jQuery(element);
    var _body = jQuery("body", document);

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
        var sideMenu = jQuery(".side-menu", _body);
        var startButton = jQuery(".button-start", sideMenu);
        var moveButton = jQuery(".button-move", sideMenu);
        var continueButton = jQuery(".button-continue", sideMenu);
        var killButton = jQuery(".button-kill", sideMenu);

        /** Timers **/
        var stationsElement = jQuery(".stations", element);
        var stationsNum = stationsElement.attr("data-stations_num");
        var runTimerElement = jQuery(".run-timer", element);
        var runTimer = new Timer();
        var stationTimers = [];

        while (stationsNum > stationTimers.length) {
            stationTimers.push(new Timer());
        }

        runTimer.addEventListener('secondsUpdated', function () {
            var values = jQuery(".timer-values", runTimerElement);
            var hours = jQuery(".hours", values);
            var mins = jQuery(".mins", values);
            var secs = jQuery(".secs", values);
            hours.html(runTimer.getTimeValues().toString(["hours"]));
            mins.html(runTimer.getTimeValues().toString(["minutes"]));
            secs.html(runTimer.getTimeValues().toString(["seconds"]));
        });

        runTimer.addEventListener('targetAchieved', function (e) {
            _endRun(stationTimers);
            matchedObject.triggerHandler("pre_end");
        });

        for (var t = 0, length = stationTimers.length; t < length; t++) {
            let timerIndex = t;
            let timerNum = t + 1;
            let currentTimer = stationTimers[timerIndex];
            currentTimer.addEventListener('secondsUpdated', function () {
                let element = jQuery('.station-timer-' + timerNum, stationsElement);
                let hours = jQuery(".hours", element);
                let mins = jQuery(".mins", element);
                let secs = jQuery(".secs", element);
                hours.html(currentTimer.getTimeValues().toString(["hours"]));
                mins.html(currentTimer.getTimeValues().toString(["minutes"]));
                secs.html(currentTimer.getTimeValues().toString(["seconds"]));
            });

            currentTimer.addEventListener('started', function (e) {
                let element = jQuery('.station-timer-' + timerNum, stationsElement);
                let hours = jQuery(".hours", element);
                let mins = jQuery(".mins", element);
                let secs = jQuery(".secs", element);
                hours.html(currentTimer.getTimeValues().toString(["hours"]));
                mins.html(currentTimer.getTimeValues().toString(["minutes"]));
                secs.html(currentTimer.getTimeValues().toString(["seconds"]));
            });
        };

        var socket = io.connect();
        socket.on('toggleTimer', function(data){
            if (!data || data.station > stationTimers.length ) {
                return;
            }

            var stationToToggle = data.station;
            var seconds = data.currentTime || 0;
            var timerToUpdate = stationTimers[stationToToggle - 1];
            var station = jQuery(".station-" + stationToToggle);
            data.operation === TIMER_EVENT.START && _startStationTimer(station, timerToUpdate, seconds);
            data.operation === TIMER_EVENT.STOP && _stopStationTimer(station, timerToUpdate);
        });

        stationsElement.bind("station_stopped", function (event) {
            var element = jQuery(this);
            var stationsList = jQuery(".station", element);
            var stoppedStations = stationsList.filter(".stopped");
            var allStopped = stationsList.length === stoppedStations.length;
            moveButton.toggleClass("disabled", !allStopped);
        });

        startButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var body = element.parents(".body");
            var activeRunContainer = jQuery(".active-run-container", body);
            activeRunContainer.triggerHandler("pre_start");
        });

        moveButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var body = element.parents(".body");
            var activeRunContainer = jQuery(".active-run-container", body);
            activeRunContainer.triggerHandler("pre_move");
        });

        continueButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var body = element.parents(".body");
            var activeRunContainer = jQuery(".active-run-container", body);
            activeRunContainer.triggerHandler("pre_continue");
        });

        killButton.click(function(event){
            event.preventDefault();
            var element = jQuery(this);
            var body = element.parents(".body");
            var activeRunContainer = jQuery(".active-run-container", body);
            activeRunContainer.triggerHandler("pre_kill");
        });

        matchedObject.bind("pre_start", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.START_RUN);
        });

        matchedObject.bind("start_action", function(event){
            var element = jQuery(this);
            var runTimerElement = jQuery(".run-timer", element);
            _startRunTimer(runTimerElement, runTimer);
            startButton.addClass("disabled");
            killButton.removeClass("disabled");
        });

        matchedObject.bind("pre_move", function(event) {
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.MOVE_ITER);
        });

        matchedObject.bind("move_iter_action", function(event){
            var element = jQuery(this);
            moveButton.addClass("disabled");
            continueButton.removeClass("disabled");
            var stationsList = jQuery(".station", element);
            _clearStationTimers(stationsList);
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
            var element = jQuery(this);
            var _body = element.parents(".body");
            var sideMenu = jQuery(".side-menu", _body);
            var buttons = jQuery(".button", sideMenu);
            buttons.addClass("disabled");
            // TODO: redirects to where?
            //TODO: improve this
            window.location.href = '/';
        });

        matchedObject.bind("pre_end", function(event){
            var element = jQuery(this);
            _sendActionType(element, ACTION_TYPES.END);
        });

        matchedObject.bind("end_action", function(event){
            //TODO: add popup! and redirect to project page
            alert("RUN ENDED!");
            debugger;
            var element = jQuery(this);
            var _body = element.parents(".body");
            var sideMenu = jQuery(".side-menu", _body);
            var buttons = jQuery(".button", sideMenu);
            buttons.addClass("disabled");
        });
    };

    var _sendActionType = function(element, actionType) {
        var _body = element.parents(".body");
        var sideMenu = jQuery(".side-menu", _body);
        var startButton = jQuery(".button-start", sideMenu);
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

    var _startStationTimer = function(element, timer, seconds) {
        timer.stop();
        timer.start({ startValues: { seconds: seconds }});
        element.addClass("active");
        element.removeClass("idle stopped");
    };

    var _stopStationTimer = function(element, timer) {
        timer.pause();
        element.removeClass("active idle");
        element.addClass("stopped");
        let stationsElement = element.parents(".stations");
        stationsElement.triggerHandler("station_stopped");
    };

    var _clearStationTimers = function(stationsList) {
        stationsList.each(function(){
            let element = jQuery(this);
            let hours = jQuery(".hours", element);
            let mins = jQuery(".mins", element);
            let secs = jQuery(".secs", element);
            hours.html("00");
            mins.html("00");
            secs.html("00");
            element.removeClass("stopped");
            element.addClass("idle");
        });
    };

    var _endRun = function(timers) {
        for(let i = 0, length = timers.length; i < length; i++) {
            let timerToUpdate = timers[i];
            let stationToToggle = i + 1;
            let station = jQuery(".station-" + stationToToggle);
            _stopStationTimer(station, timerToUpdate);
        }
    };

    init();
    bind();

    return matchedObject;
};

module.exports = activeRun;
