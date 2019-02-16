<div class="container list-sessions-container">
    <div class="header">
        <h2 class="title">Sessions</h2>
    </div>
    <div class="sessions-content">
        <ul class="list list-sessions">
            {% for session in sessions | sort(true, false, "createdAt") %}
                <li class="element element-session" data-number="{{ session.number }}">
                    <span class="row">
                        <span class="info date" data-timestamp="{{ session.createdAt }}"></span>
                        <span class="info name">{{ session.name }}</span>
                        <span class="buttons button-actions">
                            <a class="button button-blue button-open show-session" href="/projects/{{ session.number }}">Open</a>
                            <a class="button button-delete delete-session" href="/projects/{{ session.number }}" data-number="{{ session.number }}"><span><img class="icon" src="/images/trash_bin.svg"/></span>Delete</a>
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
