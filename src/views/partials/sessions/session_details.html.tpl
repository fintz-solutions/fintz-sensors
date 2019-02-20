
<div class="container session-details-container">
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Details</h2>
    </div>
    <div class="details">
        <p class="name">#{{ session.number }} | {{ session.name }}</p>
        <p class="status">status: {{ session.status }}</p>
        <p class="date">created at: {{ session.createdAt }}</p>
        <p class="stations">stations: {{ session.numStations }}</p>
        <p class="production-target">production target: {{ session.productionTarget }}</p>
        <p class="total-runs">total runs: {{ session.numRuns }}</p>
        <p class="time-run">time per run: {{ session.timePerRun }}</p>
    </div>
</div>
<div class="container list-runs-container">
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Runs</h2>
    </div>
    <div class="runs-content">
        <div class="columns">
            <div class="column">number</div>
            <div class="column">duration (mins)</div>
            <div class="column">status</div>
        </div>
        <ul class="list list-runs">
            {% for run in session.runs | sort(false, false, "number") %}
                {% set active_run = run.status in ('RUNNING') %}
                {% set completed_run = run.status in ('FINISHED') %}
                {% set created_run = run.status in ('CREATED') %}
                <li class="run-element {% if active_run %}active-run{% endif %}">
                    <div class="column">{{ run.number }}</div>
                    <div class="column">{{ run.totalTime }}</div>
                    <div class="column">{{ run.status }}</div>
                    <span class="buttons button-actions">
                        <a class="button button-blue button-run button-start {% if completed_run or created_run %}disabled{% endif %}" href="/sessions/{{ session.number }}/runs/{{ run.number }}">start</a>
                        <a class="button button-blue button-run button-run-details {% if not completed_run or created_run %}disabled{% endif %}" href="/sessions/{{ session.number }}/runs/{{ run.number }}">open</a>
                    </span>
                </li>
            {% endfor %}
        </ul>
    </div>
</div>
