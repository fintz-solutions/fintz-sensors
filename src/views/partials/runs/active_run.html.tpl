{% set stations = project.numStations %}
{% set duration = run.totalTime %}
{% set run_timer = "00:" + duration + ":00" %}
{% set takt_time = run.totalTime / project.productionTarget %}
<div class="container active-run-container">
    <div class="container run-timer-container header-run">
        <div class="takt-time" id="takt-time"> takt time: {{ takt_time }} min </div>
        <div class="takt-time-desc hidden" id="takt-time-desc" data-duration="{{ takt_time }}">00:{{ takt_time }}:00 </div>
        <div class="run-timer" id="run-timer" data-duration="{{ duration }}">{{ run_timer }}</div>
        <div class="logo">
            <a href="https://jmaceurope.com/">
                <img class="image image-logo" src="/images/logo_white.svg" alt="JMAC Europe" id="logo" data-height-percentage="66" data-actual-width="300" data-actual-height="101">
            </a>
        </div>
    </div>
    <div class="container stations-container stations" data-stations_num="{{ stations }}">
        {% for station in range(0, stations) %}
            {% set station_num = loop.index %}
            {% if (station_num <= stations) %}
            <div class="station station-{{ station_num }}">
                <div class="info">
                    <p class="name">Station {{ station_num }}</p>
                    <p class="station-timer station-timer-{{ station_num }}" id="station-timer-{{ station_num }}">00:00:00</p>
                </div>
            </div>
            {% else %}
            <div class="station off disabled station-{{ station_num }}">
                <div class="info">
                    <p class="name">Station {{ station_num }}</p>
                    <p class="station-timer station-timer-{{ station_num }}" id="station-timer-{{ station_num }}">00:00:00</p>
                </div>
            </div>
            {% endif %}
        {% endfor %}
    </div>
    <div class="buttons button-actions button-actions-run">
        <a class="button button-start" href="/projects/{{ project.number }}/runs/{{ run.number }}">start run</a>
        <a class="button button-move disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">move kart</a>
        <a class="button button-continue disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">continue working</a>
        <a class="button button-kill disabled" href="/projects/{{ project.number }}/runs/{{ run.number }}">kill project</a>
    </div>
</div>
