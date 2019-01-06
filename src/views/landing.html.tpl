{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <h3>Add new project</h3>
    <div class="create-container">
        <form class="form form-ajax add-project" action="/project" method="post">
            <label for="project_name">Name:</label>
            <input type="text" class="name-field" name="project_name" placeholder="project name">
            <div class="field">
                <label for="stations_num">Stations:</label>
                <select class="stations-num-field" name="stations_num">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8" selected="selected">8</option>
                </select>
            </div>
            <div class="field">
                <label for="runs_num">Runs:</label>
                <select class="runs-num-field" name="runs_num">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8" selected="selected">8</option>
                </select>
            </div>
            <div class="field">
                <label for="time_run">Time per run:</label>
                <input type="text" class="time-run-field" name="time_run" pattern="[0-9]{2}" placeholder="time per run">
            <div>
            <div class="field">
                <label for="production_target">Production target:</label>
                <input type="text" class="production-target-field" name="production_target" pattern="[0-9]{2}" placeholder="production target">
            </div>
            <input type="submit" value="Create">
        </form>
    </div>
    <div class="list-container">
        <h3>Projects</h3>
        <ul class="list list-projects">
            {% for project in projects %}
                <li class="element element-project" data-id="{{ project._id }}" data-number="{{ project.number }}">
                    <p class="name">{{ project.name }}</p>
                    <p class="date">{{ project.createdAt }}</p>
                    <div class="button-actions">
                        <a href="/projects/{{ project.id }}">open</a>
                    </div>
                </li>
            {% endfor %}
        </ul>
    </div>
{% endblock %}
