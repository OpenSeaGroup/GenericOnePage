define([
    "jquery",
    "when/when",
    "require",
    "text!./main.html",
    "less!./main.less"
], function($, when, localRequire, html){
    function factory(logoPath){
        var $el = $(html);
        return when.promise(function(resolve, reject){
            localRequire(["image!" + logoPath], function(logo){
                var $logo = $(logo).clone();
                $logo.addClass("logo");
                $el.find("td").append($logo);
                resolve($el);
            }, reject);
        });
    }

    return factory;
});
