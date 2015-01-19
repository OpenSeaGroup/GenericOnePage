define([
    "jquery",
    "when/when",
    "require",
    "text!./main.html",
    "less!./main.less"
], function($, when, localRequire, html){
    var links = [{
        site: 'github',
        base: 'http://www.github.com/',
        faIcon: 'fa-github'
    }, {
        site: 'twitter',
        base: 'http://www.twitter.com/',
        faIcon: 'fa-twitter'
    }, {
        site: 'linkedin',
        base: 'http://www.linkedin.com/',
        faIcon: 'fa-linkedin-square'
    }, {
        site: 'facebook',
        base: 'http://www.facebook.com/',
        faIcon: 'fa-facebook'
    }, {
        site: 'stackoverflow',
        base: 'http://www.stackoverflow.com/',
        faIcon: 'fa-stack-overflow'
    }];
    function factory(contentPath, meta){
        var $el = $(html);
        return when.promise(function(resolve, reject){
            localRequire(["image!" + meta.logo], function(logo){
                var $logo = $(logo).clone(),
                    $links = $el.find(".links-wrapper");
                $el.find(".logo-wrapper").append($logo);
                $el.find(".email-wrapper .title").text(meta.title);
                $el.find(".email-wrapper .email").text(meta.email).attr("href", "mailto:" + meta.email);
                $el.find(".slogan-wrapper").text(meta.slogan);
                links.forEach(function(link){
                    var user = meta.links[link.site];
                    if (user){
                        var $link = $("<a class='link'>").attr("href", link.base ? link.base + user : "#"),
                            $icon = $("<i class='fa " + link.faIcon + "'>");
                        $link.append($icon);
                        $links.append($link);
                    }
                });
                resolve($el);
            }, reject);
        });
    }

    return factory;
});
