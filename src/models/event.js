let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

let Event = new Schema({
    type: {
        type: String,
        enum: ['QUALITY', 'SAFETY']
    },
    subtype: {
        type: String,
        enum: ['ASSEMBLY_ERROR', 'MATERIAL_ERROR', 'MATERIAL_DROP', 'GENERAL_SAFETY']
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
    let event = this;
    return event.create(eventData).then(function(newEvent) {
        return newEvent._doc;
    });
};


module.exports.Event = mongoose.model("Event", Event);
