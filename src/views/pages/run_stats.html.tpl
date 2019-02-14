{% extends "partials/layout.html.tpl" %}
{% block content %}

{{ super() }}

DEBUG: {{ stats }}

	<style>
	canvas{
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	</style>

	{% for stat in stats %}
	<div id="statsContainerX" style="width:80%;" chartJson="{{stat}}">
		<canvas id="myChart"></canvas>
	</div>
	{% endfor %}

	<script>
    var ctx = document.getElementById("myChart");
    var data = $('#statsContainerX').attr("chartJson");

    var myChart = new Chart(ctx, JSON.parse(data));
    </script>
{% endblock %}
<!-- TODO on hover, show time in minutes?-->
<!-- TODO see https://stackoverflow.com/questions/46022383/how-to-feed-hour-and-minute-data-into-chartjs -->