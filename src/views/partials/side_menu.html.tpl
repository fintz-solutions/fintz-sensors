{% if not isHomepage %}
    <div class="side-bar">
        <a href="/" class="link link-homepage">
            <img class="icon icon-home" src="/images/home.svg">
            <span class="label">Home</span>
        </a>
    </div>
{% endif %}
<div class="side-content">
    {% if isHomepage %}
        {% include "./side_menu/homepage_tab.html.tpl" %}
    {% elif title in ("Session Details") %}
        {% include "./side_menu/session_details_tab.html.tpl" %}
    {% elif title in ("Run Details") %}
        {% include "./side_menu/run_details_tab.html.tpl" %}
    {% endif %}
</div>
