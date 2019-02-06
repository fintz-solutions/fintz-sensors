{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="session-show">
        {% include "../partials/sessions/session_summary.html.tpl" %}
        <div class="session-charts">
            <h3>Session Charts</h3>
            <div class="buttons button-actions">
                <a class="button button-session button-charts" href="/projects/{{ project.number }}/charts">charts</a>
            </div>
        </div>
    </div>
{% endblock %}
