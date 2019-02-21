<div id="session-details-tab" class="tab session-details-tab">
    <div class="header">
        <h1 class="side-title">Session <span class="hash">#</span>{{ session.number }}</h1>
    </div>
    <div class="buttons button-actions">
        {% set disabled = "disabled" if session.status in ("CREATED") %}
        <a class="button button-blue button-session button-charts {{ disabled }}" href="/sessions/{{ session.number }}/stats">Stats</a>
    </div>
</div>