{% set completed_run = run.status in ('FINISHED') %}
<div id="active-run-tab" class="tab active-run-tab">
    <div class="header">
        <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
        <h2 class="side-subtitle"><span class="label">Run</span><span class="value">{{ run.number }}</span></h2>
    </div>
    {% if not completed_run %}
        <div class="buttons button-actions button-actions-run">
            <a class="button button-blue button-start {% if completed_run %}disabled{% endif%}" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Start</a>
            <a class="button button-blue button-move disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Move</a>
            <a class="button button-blue button-continue disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Continue</a>
            <a class="button button-blue button-kill disabled" href="/sessions/{{ session.number }}/runs/{{ run.number }}">Kill</a>
        </div>
    {% else %}
        <div class="buttons button-actions">
            <a class="button button-blue button-run button-charts" href="/sessions/{{ session.number }}/runs/{{ run.number }}/stats">Stats</a>
        </div>
    {% endif %}
</div>
