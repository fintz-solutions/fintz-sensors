{% set stations = session.numStations %}
{% set duration = run.totalTime %}
{% set takt_time = run.totalTime / session.productionTarget %}
<div class="active-run-container">
    <div class="container run-timer-container header-run">
        <div id="takt-time" class="takt-time hidden"> takt time: {{ takt_time }} min </div>
        <div id="takt-time-desc" class="takt-time-desc hidden" data-duration="{{ takt_time }}">00:{{ takt_time }}:00 </div>
        <div id="run-timer" class="run-timer" data-duration="{{ duration }}">
            <p class="timer-values">
                <span class="value hours">00</span>
                <span class="separator">:</span>
                <span class="value mins">{{ duration }}</span>
                <span class="separator">:</span>
                <span class="value secs">00</span>
            </p>
            <p class="timer-labels">
                <span class="label hours">Hours</span>
                <span class="separator"></span>
                <span class="label mins">Mins</span>
                <span class="separator"></span>
                <span class="label secs">Secs</span>
            </p>
        </div>
    </div>
    <div class="container stations-container stations" data-stations_num="{{ stations }}">
        <div class="header">
            <h2 class="title">Stations</h2>
        </div>
        <div class="stations-content">
            {% for station in range(0, stations) %}
                {% set station_num = loop.index %}
                    <div class="station station-{{ station_num }} stopped">
                        <div class="info-container">
                            <span class="info station-num">{{ station_num }}</span>
                            <span class="info station-timer station-timer-{{ station_num }}" id="station-timer-{{ station_num }}">
                                <span class="hours">00</span>
                                <span class="separator">:</span>
                                <span class="mins">00</span>
                                <span class="separator">:</span>
                                <span class="secs">00</span>
                            </span>
                        </div>
                    </div>
            {% endfor %}
        </div>
    </div>
</div>
