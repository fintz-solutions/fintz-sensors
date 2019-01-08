var deleteProject = function(element) {
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
        
        matchedObject.click(event, function () {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            var projectNumber = projectElement.attr("data-number");

            element.each(function() {
                var _element = jQuery(this);
                var number = _element.attr("data-number");
                number === projectNumber && clickHandler(event, _element);
            });
        });

        matchedObject.bind("success", function() {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            projectElement.addClass("deleted");
        });

        matchedObject.bind("error", function(event, message) {
            var element = jQuery(this);
            var projectElement = element.parents(".element-project");
            projectElement.addClass("error");
        });
    };

    var clickHandler = function (event, element) {
        if(!event || event.length === 0) {
            return;
        }
        
        //prevents default click behaviour
        event.preventDefault();

        var url = element.attr("href");
        
        jQuery.ajax({
            url: url,
            type: 'DELETE',
            success: function(data, status) {
                element.triggerHandler("success", data);
            },
            error: function(data) {
                var message = data && data.responseJSON && data.responseJSON.message || "Delete operation error";
                matchedObject.triggerHandler("error", message);
            }
          });
    };

    init();
    bind();

    return matchedObject;
};

module.exports = deleteProject;
