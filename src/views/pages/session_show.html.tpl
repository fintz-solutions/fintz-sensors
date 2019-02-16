{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="session-show">
        {% include "../partials/sessions/session_summary.html.tpl" %}
    </div>
{% endblock %}
