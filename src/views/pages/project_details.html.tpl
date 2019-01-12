{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <div class="project-details">
        <h2>{{ title }}</h2>
        <p class="name">#{{ project.number }} | {{ project.name }}</p>
        <p class="status">status: {{ project.status }}</p>
        <p class="date">created at: {{ project.createdAt }}</p>
        <p class="runs">runs: {{ project.numRuns }}</p>
        <p class="time-run">time per run: {{ project.timePerRun }}</p>
        <p class="stations">stations: {{ project.numStations }}</p>
        <p class="production-target">production target: {{ project.productionTarget }}</p>
        runs:{{ project.runs }}
    </div>
    <div class="charts">
        <h3 style="color:red">[[ +Charts ]]</h3>
    </div>
{% endblock %}
