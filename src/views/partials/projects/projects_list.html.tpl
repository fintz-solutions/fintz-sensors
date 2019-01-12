<div class="list-container">
    <h3>Projects</h3>
    <ul class="list list-projects">
        {% for project in projects %}
            <li class="element element-project" data-number="{{ project.number }}">
                <p class="name">{{ project.name }}</p>
                <p class="date">{{ project.createdAt }}</p>
                <div class="button-actions">
                    <a class="button show-project" href="/projects/{{ project.number }}">open</a>
                    <a class="button delete-project" href="/projects/{{ project.number }}" data-number="{{ project.number }}">delete</a>
                </div>
            </li>
        {% endfor %}
    </ul>
</div>