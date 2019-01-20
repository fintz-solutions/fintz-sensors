const Timer = require('easytimer.js').Timer;

const ACTION_TYPES = {
    START_RUN: "START",
    MOVE_ITER: "MOVE",
    CONTINUE_RUN: "CONTINUE",
    KILL: "KILL"
  };
Object.freeze(ACTION_TYPES);

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

        var startButton = jQuery(".button-start", matchedObject);
        var moveButton = jQuery(".button-move", matchedObject);
        var continueButton = jQuery(".button-continue", matchedObject);
        var killButton = jQuery(".button-kill", matchedObject);

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
            sendActionType(element, ACTION_TYPES.START_RUN);
        });

        matchedObject.bind("start_action", function(event){
            startGlobalTimer(globalTimer);
            startButton.addClass("disabled");
            killButton.removeClass("disabled");
        });

        matchedObject.bind("pre_move", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.MOVE_ITER);
        });

        matchedObject.bind("move_action", function(event){
            moveButton.addClass("disabled");
            continueButton.removeClass("disabled");
            clearStationTimers();
        });

        matchedObject.bind("pre_continue", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.CONTINUE_RUN);
        });

        matchedObject.bind("continue_action", function(event){
            continueButton.addClass("disabled");
        });

        matchedObject.bind("pre_kill", function(event) {
            var element = jQuery(this);
            sendActionType(element, ACTION_TYPES.KILL);
        });

        matchedObject.bind("kill_action", function(event){
            killButton.addClass("disabled");
            window.location.href = '/'; // TODO improve this redirect!
        });

        /*
         *      
         *      
         * TODO: this need a proper refactoring
         *
         *
        */
        let timers = [
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer(),
            new Timer()
        ];
        let globalTimer = new Timer();
        globalTimer.addEventListener('secondsUpdated', function (e) {
            jQuery('.global-timer').html(globalTimer.getTimeValues().toString());
        });

        jQuery( document ).ready(function() {

        });

        for (let i = 0; i < timers.length; i++){
            let timerNr = i+1;
            timers[i].addEventListener('secondsUpdated', function (e) {
                jQuery('.timer-station-'+timerNr).html(timers[i].getTimeValues().toString());
            });
            timers[i].addEventListener('started', function (e) {
                jQuery('.timer-station-'+timerNr).html(timers[i].getTimeValues().toString());
            });
        }
        var socket = io.connect();
        socket.on('toggleTimer', function(data){

            let stationToToggle = data.station;
            // TODO validate if station is valid
            let timerToUpdate = timers[stationToToggle-1];

            if(data.operation === "start") {
                timerToUpdate.stop();
                if(data.currentTime)
                {
                    timerToUpdate.start({startValues: {seconds: data.currentTime}});
                }
                else
                {
                    timerToUpdate.start({startValues: {seconds: 0}});
                }
                let station = $('#timer-station-'+stationToToggle).parents(".station");
                station.addClass("active");
                station.removeClass("stop");
            }
            else if(data.operation === "stop")
            {
                timerToUpdate.pause();
                let station = $('#timer-station-'+stationToToggle).parents(".station");
                station.removeClass("active");
                station.addClass("stop");
            }
        });
    };

    var sendActionType = function(element, actionType) {
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

    var clearStationTimers = function(element) {
        //TODO: implement this
    };
    
    var startGlobalTimer = function(globalTimer) {
        var globalTimerElement = jQuery('.global-timer')
        var minutes = globalTimerElement.attr("data-duration");
        minutes = parseInt(minutes);
        globalTimer.start({
            countdown: true,
            startValues: {
                minutes: minutes
            }
        });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = activeRun;
