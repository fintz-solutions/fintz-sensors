{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    debug: [ project_id: {{ project_id }} run number: {{ run }} ]
    <div class="header-run">
        <div class="session-timer" id="globalTimer">00:30:00</div>
        <div class="logo">
            <a href="https://jmaceurope.com/">
                <img class="image image-logo" src="https://beestatic.azureedge.net/jmaceurope-com/2018/06/logo-bianco.svg" alt="JMAC Europe" id="logo" data-height-percentage="66" data-actual-width="300" data-actual-height="101">
            </a>
        </div>
    </div>
    <div class="stations">
        <div class="station station-1">
            <div class="info">
                <p class="name">Station 1</p>
                <p class="timer" id="timerStation1">00:00:00</p>
            </div>
        </div>
        <div class="station station-2">
            <div class="info">
                <p class="name">Station 2</p>
                <p class="timer" id="timerStation2">00:00:00</p>
            </div>
        </div>
        <div class="station station-3">
            <div class="info">
                <p class="name">Station 3</p>
                <p class="timer" id="timerStation3">00:00:00</p>
            </div>
        </div>
        <div class="station station-4">
            <div class="info">
                <p class="name">Station 4</p>
                <p class="timer" id="timerStation4">00:00:00</p>
            </div>
        </div>
        <div class="station station-5">
            <div class="info">
                <p class="name">Station 5</p>
                <p class="timer" id="timerStation5">00:00:00</p>
            </div>
        </div>
        <div class="station station-6">
            <div class="info">
                <p class="name">Station 6</p>
                <p class="timer" id="timerStation6">00:00:00</p>
            </div>
        </div>
        <div class="station station-7">
            <div class="info">
                <p class="name">Station 7</p>
                <p class="timer" id="timerStation7">00:00:00</p>
            </div>
        </div>
    </div>
    <script>
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

            console.log("toggleTimer event:");
            console.log(data);

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

                var station = $('#timerStation'+stationToToggle).parents(".station");
                station.addClass("active");
                station.removeClass("stop");
            }
            else if(data.operation === "stop")
            {
                timerToUpdate.pause();
                var station = $('#timerStation'+stationToToggle).parents(".station");
                station.removeClass("active");
                station.addClass("stop");
            }
        });
    </script>
{% endblock %}
