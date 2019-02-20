{% set stations = session.numStations %}
{% set duration = run.totalTime | string %}
<div class="active-run-container">
    <div class="container run-timer-container header-run">
        <div id="run-timer" class="run-timer" data-duration="{{ duration }}" data-start_timestamp="{{ run.startTimestamp }}">
            <p class="timer-values">
                <span class="value hours">00</span>
                <span class="separator">:</span>
                <span class="value mins">{{ duration if duration.length > 1 else ("0" + duration) }}</span>
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
                    <div class="station station-{{ station_num }} idle" data-station_num="{{ station_num }}" data-start_time="{{ measurements[loop.index0].startTime }}" data-stop_time="{{ measurements[loop.index0].stopTime }}">
                        <div class="info-container">
                            <div class="info station-num">{{ station_num }}</div>
                            <div class="info station-timer station-timer-{{ station_num }}" id="station-timer-{{ station_num }}">
                                <span class="value hours">00</span>
                                <span class="separator">:</span>
                                <span class="value mins">00</span>
                                <span class="separator">:</span>
                                <span class="value secs">00</span>
                            </div>
                        </div>
                    </div>
            {% endfor %}
        </div>
    </div>
</div>
