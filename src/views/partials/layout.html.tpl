{% block html %}
    {% set htitle = "Kart Factory" %}
    {% set hauthor = "Fintz Solutions" %}
    <!DOCTYPE html>
    <html lang="en">
        <head>
            {% block head %}
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
                <meta name="mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#2d2d2d" />
                {% block title %}
                    <meta name="title" content="{{ htitle }}" />
                {% endblock %}
                {% block description %}
                    <meta name="description" content="{{ bdescription }}" />
                {% endblock %}
                {% block author %}
                    <meta name="author" content="{{ hauthor }}" />
                {% endblock %}
                {% block og %}
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="{{ htitle }}" />
                {% endblock %}
                {% block includes %}
                    {% include "partials/includes.html.tpl" %}
                {% endblock %}
                <title>{% block htitle %}{{ htitle }}{% endblock %}</title>
            {% endblock %}
        </head>
        <body class="body">
            <div id="app" class="app fintz-sensors">
                <div id="side-menu" class="container side-menu-container side-menu">
                    {% block sidemenu %}
                        {% include "partials/side_menu.html.tpl" %}
                    {% endblock %}
                </div>
                <div id="content" class="content main-content">
                    {% block content %}{% endblock %}
                </div>
                <div id="footer" class="footer">
                    {% block footer %}
                        {% include "partials/footer.html.tpl" %}
                    {% endblock %}
                </div>
            </div>
        </body>
    </html>
{% endblock %}
