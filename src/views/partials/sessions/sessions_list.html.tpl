<div class="container list-sessions-container">
    <div class="header">
        <h2 class="title">Sessions</h2>
    </div>
    <div class="sessions-content">
        <ul class="list list-sessions">
            {% for project in projects | sort(true, false, "createdAt") %}
                <li class="element element-session" data-number="{{ project.number }}">
                    <span class="row">
                        <span class="info date" data-timestamp="{{ project.createdAt }}"></span>
                        <span class="info name">{{ project.name }}</span>
                        <span class="buttons button-actions">
                            <a class="button button-blue button-open show-session" href="/projects/{{ project.number }}">Open</a>
                            <a class="button button-delete delete-session" href="/projects/{{ project.number }}" data-number="{{ project.number }}"><span><img class="icon" src="/images/trash_bin.svg"/></span>Delete</a>
                        </span>
                    </span>
                </li>
            {% endfor %}
        </ul>
        <div class="pagination hidden">
            <span class="page active">1</span><span class="page">2</span><span>3</span><span>4</span><span>5</span>
        </div>
    </div>
</div>
