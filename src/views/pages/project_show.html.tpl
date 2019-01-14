{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="project-show">
        {% include "../partials/projects/project_summary.html.tpl" %}
        <div class="project-charts">
            <h3>Project Charts</h3>
            <div class="buttons button-actions">
                <a class="button button-project button-charts" href="/projects/{{ project.number }}/charts">charts</a>
            </div>
        </div>
    </div>
{% endblock %}
