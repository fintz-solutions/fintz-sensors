let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

let Event = new Schema({
    type: {
        type: String,
        enum: ['SECURITY', 'QUALITY'],
        default: 'QUALITY',
    },
    clickedAt: {//TIMESTAMP
        type: Number,
        required: true
    },
    run: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run',
        required: true
    }
});

Event.statics.createNew = function(eventData) {
    eventData.clickedAt = dateUtil.getCurrentTimestamp();
    let event = this;
    const runModel = require(path.resolve(modelsFolder, "run")).Run; //NELSON: Needed to add this require here because if not circular dependency problems would occur
    return runModel.findByRunId(eventData.run).then(function(run) {
        if (!run) {
            errorUtil.createAndThrowGenericError("Invalid Run", 400);
        } else {
            return event.create(eventData).then(function(newEvent) {
                return newEvent._doc;
            });
        }
    });
};


module.exports.Event = mongoose.model("Event", Event);
