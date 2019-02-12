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
        <div id="homepage-side" class="homepage-side">
            homepage
        </div>
    {% elif title in ("Session Details") %}
        <div class="session-detail-side">
            session details
        </div>
    {% endif %}
</div>
