{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    {% set active_run = true %}
    <div class="run-show">
        {# TODO: {% set active_run = run.status in ('RUNNING') %} #}
        {% if active_run %}
            {% include "../partials/runs/active_run.html.tpl" %}
        {% else %}
            {% include "../partials/runs/run_summary.html.tpl" %}
        {% endif %}
    </div>
{% endblock %}
