const path = require("path");
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const colorsUtil = require(path.resolve(global.utilsFolder, "colors"));

//const colors = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#000000"]; // TODO more colors, find another way

module.exports.getSessionStats = function(session){

    let charts = [];

    let sessionChart = buildSessionChart(session);
    charts.push(sessionChart);

    return {
        charts: charts
    };
};

module.exports.getRunStats = function(session, run, iterations, events) {

    let charts = [];

    if(run.status !== "FINISHED"){
        errorUtil.createAndThrowGenericError("Current Run is not finished.", 400);
    }

    let runChart = buildRunChart(session, iterations);
    charts.push(runChart);

    let qualityEvents = events.filter(function(event){
        return event.type === 'QUALITY';
    });
    let safetyEvents = events.filter(function(event){
        return event.type === 'SAFETY';
    });

    let qualityChart = buildQualityChart(qualityEvents);
    charts.push(qualityChart);

    let safetyChart = buildSafetyChart(safetyEvents);
    charts.push(safetyChart);

    return {
        charts: charts
    };
};

function buildQualityChart(events){

    let assemblyErrorEvents = events.filter(function(event){
        return event.subtype === 'ASSEMBLY_ERROR';
    });

    let materialErrorEvents = events.filter(function(event){
        return event.subtype === 'MATERIAL_ERROR';
    });

    let datasets = [
        buildBarDataset([assemblyErrorEvents.length], 'Assembly Errors', colorsUtil.getRandomColor()),
        buildBarDataset([materialErrorEvents.length], 'Material Errors', colorsUtil.getRandomColor())
    ];

    labels = [1,2];

    return buildBarChart(labels, datasets, 'Quality events', ''/*'Iteration'*/, 'Occurrences');
}

function buildSafetyChart(events){

    let generalSafetyEvents = events.filter(function(event){
        return event.subtype === 'GENERAL_SAFETY';
    });

    let materialDropEvents = events.filter(function(event){
        return event.subtype === 'MATERIAL_DROP';
    });

    let datasets = [
        buildBarDataset([generalSafetyEvents.length], 'General Safety', colorsUtil.getRandomColor()),
        buildBarDataset([materialDropEvents.length], 'Material Drop', colorsUtil.getRandomColor())
    ];

    labels = [1,2];

    return buildBarChart(labels, datasets, 'Safety events', ''/*'Iteration'*/, 'Occurrences');
}

function buildRunChart(session, iterations){
    let completedIterations = iterations.filter(function (iteration) {
        return iteration.stopTime !== null;
    });

    let labels = [];
    for (let i=1; i<=completedIterations.length; i++) {
        labels.push(i);
    }

    let datasets = [];

    for(let stationNumber=1; stationNumber <= session.numStations; stationNumber++) {

        let stationTimes = [];
        let label = `Station ${stationNumber}`;
        let color = colorsUtil.getRandomColor();
        for (let iterationNumber = 1; iterationNumber <= completedIterations.length; iterationNumber++) {
            let currentIteration = completedIterations.find(function (iteration){
               return iteration.number === iterationNumber;
            });
            let measurement = currentIteration._doc.measurements.find(function (measurement) {
                return measurement.stationNumber === stationNumber;
            });

            if(measurement.startTime && measurement.stopTime) {
                let time = measurement.stopTime - measurement.startTime;
                stationTimes.push(time);
            }
        }

        let dataset = buildLineDataset(stationTimes, label, color);
        datasets.push(dataset);
    }

    let runChart = buildLineChart(labels, datasets, 'Station Time per Iteration', 'Karts Produced', 'Time (in seconds)');

    return runChart;
}

function buildSessionChart(session){

    // labels = max nr of iterations
    let maxIterations = Math.max.apply(null, session.runs.map(run => run._doc.iterations.length));
    let labels = [];
    for (let i=1; i<=maxIterations; i++) {
        labels.push(i);
    }

    let completedRuns = session.runs.filter(function (run) {
        return run.status === 'FINISHED';
    });

    if (completedRuns.length === 0){
        errorUtil.createAndThrowGenericError("No completed runs available to build chart.", 400);
    }

    let datasets = [];

    for (let runIndex=0; runIndex<completedRuns.length; runIndex++){

        let runNumber = runIndex+1;
        let currentRun = session.runs.find(function(run){
            return run.number === runNumber;
        });

        let label = `Run ${runNumber}`;
        let color = colorsUtil.getRandomColor();

        let completedIterations = currentRun._doc.iterations.filter(function (iteration) {
            return iteration.stopTime !== null;
        });

        let iterationTimes = [];

        for (let iterationNumber=1; iterationNumber <= completedIterations.length; iterationNumber++) {
            let currentIteration = completedIterations.find(function (iteration){
                return iteration.number === iterationNumber;
            });

            let time = currentIteration.stopTime - currentIteration.startTime;
            iterationTimes.push(time);
        }
        let dataset = buildLineDataset(iterationTimes, label, color);
        datasets.push(dataset);
    }

    let sessionChart = buildLineChart(labels, datasets, 'Iteration Time per Run', 'Iteration', 'Time (in seconds)');

    return sessionChart;
}

function buildLineChart(labels, datasets, title, xLabel, yLabel){

    let chart = {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: title
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: xLabel
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    };

    return chart;
}

function buildBarChart(labels, datasets, title, xLabel, yLabel){

    let chart = {
        type: 'bar',
        data: {
            //labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: title
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: xLabel
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1
                    }
                }]
            }
        }
    };

    return chart;
}

function buildLineDataset(data, label, color) {
    return {
        data: data,
        label: label,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        lineTension: 0,
        pointRadius: 5,
        pointHoverRadius: 10,
        showLine: true
    };
}

function buildBarDataset(data, label, color) {
    return {
        data: data,
        label: label,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 1,
    };
}
