{% set active_run = {
    "project": {
        "status": "RUNNING",
        "_id": "5c3b2b1041cb4e472e5648f9",
        "name": "A test project 17",
        "numStations": 4,
        "numRuns": 8,
        "timePerRun": 20,
        "productionTarget": 20,
        "createdAt": 1547381520,
        "number": 1,
        "__v": 0
    },
    "run": {
        "status": "RUNNING",
        "_id": "5c3b2b1041cb4e472e5648fa",
        "number": 1,
        "totalTime": "01",
        "project": "5c3b2b1041cb4e472e5648f9",
        "__v": 0,
        "startTimestamp": 1547381528
    },
    "iteration": {
        "_id": "5c3b2b1941cb4e472e564902",
        "number": 1,
        "startTime": 1547381529,
        "run": "5c3b2b1041cb4e472e5648fa",
        "__v": 0
    },
    "measurements": [],
    "actionType": "START"
}%}
{% set stations = active_run.project.numStations %}
{% set duration = active_run.run.totalTime %}
{% set global_timer = "00:" + duration + ":00" %}

<div class="active-run-container">
    <div class="header-run">
        <div class="global-timer" id="global-timer" data-duration="{{ duration }}">{{ global_timer }}</div>
        <div class="logo">
            <a href="https://jmaceurope.com/">
                <img class="image image-logo" src="https://beestatic.azureedge.net/jmaceurope-com/2018/06/logo-bianco.svg" alt="JMAC Europe" id="logo" data-height-percentage="66" data-actual-width="300" data-actual-height="101">
            </a>
        </div>
    </div>
    <div class="stations">
        {% for station in range(0, stations) %}
            {% set station_num = loop.index %}
            <div class="station station-{{ station_num }}">
                <div class="info">
                    <p class="name">Station {{ station_num }}</p>
                    <p class="timer timer-station-{{ station_num }}" id="timer-station-{{ station_num }}">00:00:00</p>
                </div>
            </div>
        {% endfor %}
    </div>
    <div class="buttons button-actions">
        <a class="button button-start" href="/projects/{{ project.number }}/runs/{{ run.number }}">start</a>
        <a class="button button-move disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">move</a>
        <a class="button button-continue disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">continue</a>
        <a class="button button-kill disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">kill</a>
    </div>
</div>