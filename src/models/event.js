let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Event = new Schema({
    type:  Number, //TODO NELSON enum
    clickedAt: Date, //TODO do not use backend time
    run: model
});

module.exports.Event = Event;