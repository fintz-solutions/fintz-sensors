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
        <div id="homepage-tab" class="homepage-tab">
            {# TODO: #}
            {# show last finnished project #}
            {# total iterations implemented #}
            {# or info about selected project #}
        </div>
    {% elif title in ("Session Details") %}
        <div id="session-details-tab" class="tab session-details-tab">
            <div class="header">
                <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
            </div>
            <div class="buttons button-actions">
                <a class="button button-blue button-session button-charts" href="/projects/{{ session.number }}/charts">Stats</a>
            </div>
        </div>
        {# TODO: if Active Run / Run Details #}
    {% elif title in ("Run Details") %}
        {% set completed_run = run.status in ('FINISHED') %}
        <div id="active-run-tab" class="tab active-run-tab">
            <div class="header">
                <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
                <h2 class="side-subtitle"><span class="label">Run</span><span class="value">{{ run.number }}</span></h2>
            </div>
            <div class="buttons button-actions button-actions-run">
                <a class="button button-blue button-start {% if completed_run %}disabled{% endif%}" href="/projects/{{ session.number }}/runs/{{ run.number }}">Start</a>
                <a class="button button-blue button-move disabled" href="/projects/{{ session.number }}/runs/{{ run.number }}">Move</a>
                <a class="button button-blue button-continue disabled" href="/projects/{{ session.number }}/runs/{{ run.number }}">Continue</a>
                <a class="button button-blue button-kill disabled" href="/projects/{{ session.number }}/runs/{{ run.number }}">Kill</a>
            </div>
        </div>
    {% endif %}
</div>
