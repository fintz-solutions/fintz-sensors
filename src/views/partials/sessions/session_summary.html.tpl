<div class="session-summary">
    <h2>{{ title }}</h2>
    <p class="name">#{{ session.number }} | {{ session.name }}</p>
    <p class="status">status: {{ session.status }}</p>
    <p class="date">created at: {{ session.createdAt }}</p>
    <p class="stations">stations: {{ session.numStations }}</p>
    <p class="production-target">production target: {{ session.productionTarget }}</p>
    <div class="runs">
        <p class="total-runs">total runs: {{ session.numRuns }}</p>
        <p class="time-run">time per run: {{ session.timePerRun }}</p>
        <p class="header" style="font-weight:bold;">
            <span>number |</span>
            <span>status |</span>
            <span>duration |</span>
            <span>iterations |</span>
        </p>
        <ul class="list list-runs" style="list-style-type:none">
            {% for run in session.runs | sort(false, false, "number") %}
                {% set active_run = run.status in ('RUNNING') %}
                {% set completed_run = run.status in ('FINISHED') %}
                <li class="run-element {% if active_run %}active-run{% endif %}">
                    <span>number: {{ run.number }} |</span>
                    <span>duration: {{ run.totalTime }} |</span>
                    <span>status: {{ run.status }} |</span>
                    {% if completed_run %}
                        <span>iterations: {{ run.iterations | length }} |</span>
                    {% endif %}
                    <span class="buttons button-actions">
                        <a class="button button-run button-start {% if completed_run %}hidden{% endif %}" href="/projects/{{ session.number }}/runs/{{ run.number }}">start</a>
                        {# TODO: change charts by /run_summary page #}
                        <a class="button button-run button-run-details {% if not completed_run %}hidden{% endif %}" href="/projects/{{ session.number }}/runs/{{ run.number }}">open</a>
                    </span>
                </li>
            {% endfor %}
        </ul>
    </div>
</div>
