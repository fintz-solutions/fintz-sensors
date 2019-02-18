const path = require("path");
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

const colors = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#000000"]; // TODO more colors, find another way

module.exports.getSessionStats = function(session){

    let stats = [];

    let sessionChart = buildSessionChart(session);
    stats.push(sessionChart);

    return stats;
};

module.exports.getRunStats = function(session, run, iterations) {

    let stats = [];

    if(run.status != "FINISHED"){
        errorUtil.createAndThrowGenericError("Current Run is not finished.", 400);
    }

    let runChart = buildRunChart(session, iterations);
    stats.push(runChart);

    return stats;
};

function buildRunChart(session, iterations){
    let completedIterations = iterations.filter(function (iteration) {
        return iteration.stopTime !== null;
    });

    let labels = [];
    for (let i=1; i<=completedIterations.length; i++) {
        labels.push(i);
    }

    let datasets = [];

    for(let stationIndex=0; stationIndex<session.numStations; stationIndex++) {
        let stationNumber = stationIndex+1;

        let stationTimes = [];
        let label = `Station ${stationNumber}`;
        let color = colors[stationIndex];
        for (let iterationNumber = 1; iterationNumber <= completedIterations.length; iterationNumber++) {
            let currentIteration = completedIterations.find(function (iteration){
               return iteration.number === iterationNumber;
            });
            let measurement = currentIteration._doc.measurements.find(function (measurement) {
                return measurement.stationNumber === stationNumber;
            });
            let time = measurement.stopTime - measurement.startTime;
            stationTimes.push(time);
        }
        let dataset = buildDataset(stationTimes, label, color);
        datasets.push(dataset);
    }

    let runChart = buildLineChart(labels, datasets, 'Station Time per Iteration', 'Iteration', 'Time (in seconds)');

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
        let color = colors[runIndex];

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
        let dataset = buildDataset(iterationTimes, label, color);
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
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    }
                }]
            }
        }
    };

    return chart;
}

function buildDataset(data, label, color) {
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