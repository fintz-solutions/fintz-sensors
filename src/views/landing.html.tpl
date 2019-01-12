{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    {% include "partials/projects/project_form.html.tpl" %}
    {% include "partials/projects/projects_list.html.tpl" %}
{% endblock %}
