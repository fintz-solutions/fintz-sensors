(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var mymodule = require('./mymodule');
var testmodule = require('./test');

testmodule.hello();
mymodule.logDate();
mymodule.logMonth();

jQuery(document).ready(function() {
    alert("hello")
    console.log("document ready");
});
},{"./mymodule":2,"./test":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var hello = function() {
    console.log("test> hello");
};

exports.hello = hello;
},{}]},{},[1]);
