var mymodule = require('./mymodule');
var testmodule = require('./test');

testmodule.hello();
mymodule.logDate();
mymodule.logMonth();

jQuery(document).ready(function() {
    alert("hello")
    console.log("document ready");
});