define([
    "jquery",
    "when/when",
    "require",
    "text!./main.html",
    "less!./main.less"
], function($, when, localRequire, html){
    function factory(contentPath, meta){
        var $el = $(html);
        return when.promise(function(resolve, reject){
            localRequire(["mdown!" + contentPath], function(html){
                $el.find(".content-wrapper").html(html);
                resolve($el);
            }, reject);
        });
    }

    return factory;
});
