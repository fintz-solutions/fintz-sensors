{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="landing">
        {% include "partials/sessions/session_form.html.tpl" %}
        {% include "partials/sessions/sessions_list.html.tpl" %}
    </div>
{% endblock %}
