{% extends "partials/layout.html.tpl" %}
{% block content %}

{{ super() }}

DEBUG: {{stats}}

	<style>
	canvas{
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	</style>
	<div style="width:80%;">
		<canvas id="myChart"></canvas>
	</div>
	<script>
    //let chartjson = JSON.parse({{ chart }});
    //var ctx = document.getElementById("myChart");

    //var myChart = new Chart(ctx, jsonchart);
    </script>
{% endblock %}
<!-- TODO on hover, show time in minutes?-->
<!-- TODO see https://stackoverflow.com/questions/46022383/how-to-feed-hour-and-minute-data-into-chartjs -->