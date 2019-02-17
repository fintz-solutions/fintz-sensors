
{# <p class="name">#{{ session.number }} | {{ session.name }}</p>
<p class="status">status: {{ session.status }}</p>
<p class="date">created at: {{ session.createdAt }}</p>
<p class="stations">stations: {{ session.numStations }}</p>
<p class="production-target">production target: {{ session.productionTarget }}</p> #}
<div class="container session-details-container">
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Details</h2>
    </div>
</div>
<div class="container list-runs-container">
    {# <p class="total-runs">total runs: {{ session.numRuns }}</p>
    <p class="time-run">time per run: {{ session.timePerRun }}</p> #}
    <div class="header">
        <h2 class="title">Session</h2>
        <h2 class="subtitle">Runs</h2>
    </div>
    <div class="runs-content">
        <ul class="list list-runs">
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
