// 'use strict';

var logDate = function() {
    console.log("myomdule logDate >")
    console.log(new Date().getDate());
};
 
var logMonth = function() {
    console.log("myomdule logMonth >")
    console.log(new Date().getMonth());
}

exports.logDate = logDate;
exports.logMonth = logMonth;