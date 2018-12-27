{% extends "partials/layout.html.tpl" %}
{% block content %}
{{ super() }}
    Mock landing page:
    <p>Test links:</p>
    <a href="/projects/1/runs/1">Create Run [demo]</a>
    <h2>Add new project:</h2> <span>[ ____ < insert name > ][ __ < num of stations > ][ __ < num of runs > ]</span>
    <button>create</button>
    </br>
    <h2>List of projects:</h2><button>view</button>
    <p>.project 1</p><button>view</button>
    <p>.project 2</p><button>view</button>
    <p>.project 3</p><button>view</button>
{% endblock %}
