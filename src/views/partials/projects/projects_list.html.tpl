<div class="list-container">
    <h3>Projects</h3>
    <ul class="list list-projects" style="list-style-type:none">
        {% for project in projects %}
            <li class="element element-project" data-number="{{ project.number }}">
                <span class="name">name: {{ project.name }} |</span>
                <span class="date">created_at: {{ project.createdAt }} |</span>
                <span class="button-actions">
                    <a class="button show-project" href="/projects/{{ project.number }}">open</a>
                    <a class="button delete-project" href="/projects/{{ project.number }}" data-number="{{ project.number }}">delete</a>
                </span>
            </li>
        {% endfor %}
    </ul>
</div>
