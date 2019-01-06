var projectForm = function(element) {
    var matchedObject = jQuery(element);

    var init = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }
    };

    var bind = function() {
        if (!matchedObject || matchedObject.length === 0) {
            return;
        }

        matchedObject.submit(event, function () {
            if(!event || event.length === 0) {
                return;
            }
            
            event.preventDefault(); 

            var element = jQuery(this);
            var url = event.currentTarget && event.currentTarget.action;
            var name = jQuery(".name-field", element);
            var numStations = jQuery(".stations-num-field", element);
            var numRuns = jQuery(".runs-num-field", element);
            var timePerRun = jQuery(".time-run-field", element);
            var productionTarget = jQuery(".production-target-field", element);
            
            name = name ? name.val() : "New project";
            numStations = numStations ? parseInt(numStations.val()) : 8;
            numRuns = numRuns ? parseInt(numRuns.val()) : 3;
            timePerRun = timePerRun ? parseInt(timePerRun.val()) : 30;
            productionTarget = productionTarget ? parseInt(productionTarget.val()) : 0;

            jQuery.ajax({
                url: url,
                type: "post",
                data: {
                    name: name,
                    numStations: numStations,
                    numRuns: numRuns,
                    timePerRun: timePerRun,
                    productionTarget: productionTarget,
                    status: "CREATED"
                },
                success: function() {
                    //TODO:
                    console.log("project created")
                },
                error: function(msg) {
                    //TODO:
                    console.log("message", msg)
                }
            });
        });

    };

    init();
    bind();

    return matchedObject;
};

module.exports = projectForm;
