<div class="session-summary">
    <h2>{{ title }}</h2>
    <p class="name">#{{ project.number }} | {{ project.name }}</p>
    <p class="status">status: {{ project.status }}</p>
    <p class="date">created at: {{ project.createdAt }}</p>
    <p class="stations">stations: {{ project.numStations }}</p>
    <p class="production-target">production target: {{ project.productionTarget }}</p>
    <div class="runs">
        <p class="total-runs">total runs: {{ project.numRuns }}</p>
        <p class="time-run">time per run: {{ project.timePerRun }}</p>
        <p class="header" style="font-weight:bold;">
            <span>number |</span>
            <span>status |</span>
            <span>duration |</span>
            <span>iterations |</span>
        </p>
        <ul class="list list-runs" style="list-style-type:none">
            {% for run in project.runs | sort(False, False, "number") %}
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
                        <a class="button button-run button-start {% if completed_run %}hidden{% endif %}" href="/projects/{{ project.number }}/runs/{{ run.number }}">start</a>
                        <a class="button button-run button-charts {% if not completed_run %}hidden{% endif %}" href="/projects/{{ project.number }}/runs/{{ run.number }}/charts">charts</a>
                    </span>
                </li>
            {% endfor %}
        </ul>
    </div>
</div>
