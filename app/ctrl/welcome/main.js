define([
    "jquery",
    "when/when",
    "require",
    "text!./main.html",
    "less!./main.less"
], function($, when, localRequire, html){
    function factory(contentPath, meta, scrollNext){
        var $el = $(html);
        return when.promise(function(resolve, reject){
            localRequire(["mdown!" + contentPath, "image!" + meta.logo], function(content, logo){
                var $logo = $(logo).clone(),
                    $content = $(content),
                    $title = $("<h1>").text(meta.title);
                $el.find(".content-wrapper").append($title, $content);
                $el.find(".logo-wrapper").append($logo);
                $el.find(".next a").click(function(){
                    scrollNext();
                });
                resolve($el);
            }, reject);
        });
    }

    return factory;
});
