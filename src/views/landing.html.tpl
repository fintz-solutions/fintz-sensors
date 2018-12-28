{% set projects =
    [ {
        status: "CREATED",
        id: "5c25fa703aeea70a2b8b59d4",
        name: "Project 1",
        number: 1,
        createdAt: "2018-01-11T00:00:00.000Z",
        numStations: 7,
        numRuns: 5,
        timePerRun: 20,
        productionTarget: 20
    },
    {
        status: "CREATED",
        id: "5c25fd2f3aeea70a2b8b59dc",
        name: 'Project 2',
        number: 2,
        createdAt: "2018-01-11T00:00:00.000Z",
        numStations: 7,
        numRuns: 5,
        timePerRun: 20,
        productionTarget: 20
    },
    {
        status: "CREATED",
        id: "5c260d2f3aeea70a2b8b59e3",
        name: 'Project 3',
        number: 3,
        createdAt: "2018-11-21T00:00:00.000Z",
        numStations: 7,
        numRuns: 5,
        timePerRun: 20,
        productionTarget: 20
    }]
%}
{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <p>Test links:</p>
    <a href="/projects/1/runs/1">Create Run [demo]</a>
    <h3>Add new project</h3> <span>[ ____ < insert name > ][ __ < num of stations > ][ __ < num of runs > ]</span>
    <button>create</button>
    <h3>Projects</h3>
    <div class="projects">
        {% for project in projects %}
            <div class="project" data-id="{{ project.id }}" data-number="{{ project.number }}">
                <p class="name">{{ project.name }}</p>
                <p class="date">{{ project.createdAt }}</p>
                <div class="button-actions">
                    <a href="/projects/{{ project.number }}">open</a>
                </div>
            </div>
            <hr/>
        {% endfor %}
    </div>
{% endblock %}
