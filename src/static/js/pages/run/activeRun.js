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
        // TODO: 
        const Timer = require('easytimer.js').Timer;
        let timers = [
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
            $('#globalTimer').html(globalTimer.getTimeValues().toString());
        });
        $( document ).ready(function() {
            globalTimer.start({countdown: true, startValues: {minutes: 30}});
        });
        for (let i = 0; i < timers.length; i++){
            let timerNr = i+1;
            timers[i].addEventListener('secondsUpdated', function (e) {
                $('#timerStation'+timerNr).html(timers[i].getTimeValues().toString());
            });
        }
        var socket = io.connect();
        socket.on('toggleTimer', function(data){
            let stationToToggle = data.sensor;
            let timerToUpdate = timers[stationToToggle-1];
            if(timerToUpdate.isRunning())
            {
                timerToUpdate.pause();
                var station = $('#timerStation'+stationToToggle).parents(".station");
                station.removeClass("active");
                station.addClass("stop");
            }
            else
            {
                timerToUpdate.start();
                var station = $('#timerStation'+stationToToggle).parents(".station");
                station.addClass("active");
                station.removeClass("stop");
            }
        });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = activeRun;
