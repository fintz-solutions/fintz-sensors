let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Project = new Schema({
    projectName: String,
    number:  Number,
    createdAt: Date,//TODO NELSON test this, mongo already add this on creation
    numStations:   Number,
    numRuns: Number,
    timePerRun: Number,
    productionTarget: Number,//target number of karts per run
    status: Number //status of the project // TODO NELSON see enums for accepted types (1,2,3)
 });


Project.statics.createNew = function(projectData) {
    return this.create(projectData).then(function (data) {
        return data._doc;
    });
};

module.exports.Project = mongoose.model("Project", Project);

//TODO NELSON create instance & static methods
/*number:  Number,
    createdAt: Date,
    numStations:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    }*/



//static createNewProject

//instance method updateProject