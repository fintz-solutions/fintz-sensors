{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    <h3>Add new project</h3>
    <div class="create-container">
        <form class="form add-project" action="/projects/" method="post">
            <label for="project[name]">Name:</label>
            <input type="text" id="project-name-field" name="project[name]" placeholder="Project name..">
            <div class="stations-num">
                <label for="stations_num">Stations:</label>
                <select name="stations_num">
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
            <div class="runs-num">
                <label for="runs_num">Runs:</label>
                <select name="runs_num">
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
