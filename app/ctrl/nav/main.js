define([
    "jquery",
    "when/when",
    "require",
    "text!./main.html",
    "less!./main.less"
], function($, when, localRequire, html){
    function factory(sections, logoPath, title, scrollTo){
        var $el = $(html);
        return when.promise(function(resolve, reject){
            localRequire(["image!" + logoPath], function(logo){
                var $logo = $(logo).clone();
                $logo.addClass('logo');
                $el.find(".logo-wrapper").append($logo);
                $el.find(".title").text(title);
                sections.forEach(function(section, i){
                    if (!section.navigation) return;
                    var $link = $('<li><a href="#">'+section.navigation+'</a></li>');
                    $link.click(function(){
                        scrollTo(i);
                    });
                    $el.find(".section-links").append($link);
                });
                $el.find(".navbar-brand").click(function(){
                    scrollTo(0);
                });
                resolve($el);
            }, reject);
        });
    }

    return factory;
});
