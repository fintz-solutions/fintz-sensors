
<div class="container session-details-container">
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Details</h2>
    </div>
    <div class="details">
        <div class="group left">
            <p><span class="label">Number:</span><span class="value">{{ session.number }}</span></p>
            <p><span class="label">name:</span><span class="value">{{ session.number }}</span></p>
            <p><span class="label">Status:</span><span class="value">{{ session.status }}</span></p>
            <p><span class="label">Date:</span><span class="value date" data-timestamp="{{ session.createdAt }}"></span></p>
        </div>
        <div class="group right">
            <p><span class="label">Stations:</span><span class="value">{{ session.numStations }}</span></p>
            <p><span class="label">Production target:</span><span class="value">{{ session.productionTarget }}</span></p>
            <p><span class="label">Total runs:</span><span class="value">{{ session.numRuns }}</span></p>
            <p><span class="label">Time per run:</span></span><span class="value">{{ session.timePerRun }}</span></p>
        </div>
    </div>
</div>
<div class="container list-runs-container">
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Runs</h2>
    </div>
    <div class="runs-content">
        <div class="columns">
            <span class="row">
                <div class="column">run number</div>
                <div class="column">duration (mins)</div>
                <div class="column">status</div>
            </span>
        </div>
        <ul class="list list-runs">
            {% for run in session.runs | sort(false, false, "number") %}
                {% set active_run = run.status in ('RUNNING') %}
                {% set completed_run = run.status in ('FINISHED') %}
                {% set created_run = run.status in ('CREATED') %}
                <li class="element element-run {% if active_run %}active-run{% endif %}">
                    <span class="row">
                        <div class="info number">{{ run.number }}</div>
                        <div class="info duration">{{ run.totalTime }}</div>
                        <div class="info status">{{ run.status }}</div>
                        <span class="buttons button-actions">
                            <a class="button button-blue button-run button-start {% if completed_run or created_run %}disabled{% endif %}" href="/sessions/{{ session.number }}/runs/{{ run.number }}">start</a>
                            <a class="button button-blue button-run button-open {% if not completed_run or created_run %}disabled{% endif %}" href="/sessions/{{ session.number }}/runs/{{ run.number }}/stats">open</a>
                        </span>
                    </span>
                </li>
            {% endfor %}
        </ul>
    </div>
</div>
