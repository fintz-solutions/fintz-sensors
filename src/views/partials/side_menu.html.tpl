{% if not isHomepage %}
    <div class="side-bar">
        <a href="/" class="link link-homepage">
            <img class="icon icon-home" src="/images/home.svg">
            <span class="label">Home</span>
        </a>
    </div>
{% endif %}
<div class="side-content">
    {% if isHomepage %}
        <div id="homepage-tab" class="tab homepage-tab">
            <div class="header">
                <h1 class="side-title">Kart Factory</h1>
                <h2 class="side-subtitle"><span class="label">Program</span></h2>
            </div>
            <div class="preview-session info hidden">
                <p class="preview-header">Session Preview</p>
                <div class="group-number">
                    <p class="info">Session #<span class="value number"></span></p>
                </div>
                <div class="group-status">
                    <p class="info">Status: <span class="value status"></span></p>
                </div>
                <div class="group-stations">
                    <p class="info">Stations: <span class="value num-stations"></span></p>
                </div>
                <div class="group-runs">
                    <p class="info">Runs: <span class="value num-runs"></span></p>
                </div>
                <div class="group-target">
                    <p class="info">Target: <span class="value target"></span></p>
                </div>
            </div>
        </div>
    {% elif title in ("Session Details") %}
        <div id="session-details-tab" class="tab session-details-tab">
            <div class="header">
                <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
            </div>
            <div class="buttons button-actions">
                <a class="button button-blue button-session button-charts" href="/sessions/{{ session.number }}/stats">Stats</a>
            </div>
        </div>
    {% elif title in ("Run Details") %}
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
    {% endif %}
</div>
