{% set completed_run = run.status in ('FINISHED') %}
<div id="active-run-tab" class="tab active-run-tab">
    <div class="header">
        <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
        <h2 class="side-subtitle"><span class="label">Run</span><span class="value">{{ run.number }}</span></h2>
    </div>
    {% if not completed_run %}
        <div class="buttons button-actions button-actions-active-run">
            {% if run.number + 1 <= session.numRuns %}
                <a class="button button-blue button-next group-top disabled" href="/sessions/{{ session.number }}/runs/{{ run.number + 1 }}">Next Run</a>
            {% endif %}
            <a class="button button-blue button-stats group-top disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}/stats">Stats</a>
            <span class="separator"></span>
            <a class="button button-blue button-start group-middle {% if completed_run %}disabled{% endif%}" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Start</a>
            <a class="button button-blue button-move group-middle disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Move</a>
            <a class="button button-blue button-continue group-middle disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Continue</a>
            <span class="separator"></span>
            <a class="button button-blue button-kill group-bottom disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Kill</a>
        </div>
    {% else %}
        <div class="buttons button-actions">
            <a class="button button-blue button-run button-charts" href="/sessions/{{ session.number }}/runs/{{ run.number }}/stats">Stats</a>
        </div>
    {% endif %}
</div>
