{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="landing">
        {% include "partials/projects/project_form.html.tpl" %}
        {% include "partials/projects/projects_list.html.tpl" %}
    </div>
{% endblock %}
