require.config({
    waitSeconds: 0,
    baseUrl: "./",
    packages: [{
        name: "jquery",
        location: "bower_components/jquery/dist",
        main: "jquery"
    }],
    map: {
        '*': {
            text: 'bower_components/requirejs-plugins/lib/text',
            image: 'bower_components/requirejs-plugins/src/image',
            json: 'bower_components/requirejs-plugins/src/json',
            async: 'bower_components/requirejs-plugins/src/async',
            font: 'bower_components/requirejs-plugins/src/font',
            goog: 'bower_components/requirejs-plugins/src/goog',
            noext: 'bower_components/requirejs-plugins/src/noext',
            mdown: 'bower_components/requirejs-plugins/src/mdown',
            propertyParser: 'bower_components/requirejs-plugins/src/propertyParser',
            markdownConverter : 'bower_components/requirejs-plugins/lib/Markdown.Converter',
            less: 'bower_components/require-less/less',
            when: 'bower_components/when'
        }
    }
});

require([
    "jquery",
    "when/when",
    "json!config.json",
    "require"
], function(jQuery, when, config, localRequire){
    // build splash screen:
    var splashCtrlPath = config.ctrlPath + "splash/" + "main.js",
        metadataPath = config.dataPath + "meta.json",
        layoutPath = config.dataPath + "layout.json";
    localRequire([splashCtrlPath, "json!" + metadataPath, "json!" + layoutPath], function(Splash, meta, layout){
        Splash(meta.logo).then(function($splash){
            jQuery(function ($) {
                var $root = $('.root'),
                    $sectionsContainer = $(".root .sections-container"),
                    sGuid = 0,
                    minStart = Date.now() + config.minSplashTime,
                    scrollToSection = function(id){
                        var $el = $sectionsContainer.find("[data-section-id='" + id + "']"),
                            scrollTo = $sectionsContainer.scrollTop() +
                                $el.offset().top -
                                $sectionsContainer.offset().top;
                        $sectionsContainer.animate({scrollTop: scrollTo}, config.effectsSpeed);
                    },
                    pSections = layout.sections.map(function(section, i){
                        var nextId = i < layout.sections.length - 1 ? i + 1 : false,
                            scrollNext = nextId ? scrollToSection.bind(null, nextId) : function(){};
                        return when.promise(function(resolve, reject){
                            var ctrlPath = config.ctrlPath + section.controller + '/main.js',
                                contentPath = config.contentPath + section.content + '.md';
                            localRequire([ctrlPath], function(Controller){
                                Controller(contentPath, meta, scrollNext).then(resolve, reject);
                            }, reject);
                        }).tap(function($el){
                            $el.attr('data-section-id', i);
                        });
                    }),
                    pNav = when.promise(function(resolve, reject){
                        var ctrlPath = config.ctrlPath + 'nav/main.js';
                        localRequire([ctrlPath], function(NavController){
                            NavController(layout.sections, meta.logo, meta.title, scrollToSection).then(resolve, reject);
                        }, reject);
                    });
                $splash.hide();
                $root.append($splash);
                $splash.fadeIn(config.effectsSpeed, function(){
                    when.all([pNav, when.all(pSections)]).spread(function($nav, $sections){
                        $root.prepend($nav);
                        $root.css({
                            top: -$sectionsContainer.offset().top + "px"
                        });
                        setTimeout(function(){
                            $sectionsContainer.append($sections);
                            $splash.fadeOut(config.effectsSpeed);
                            $sections[0].fadeIn(config.effectsSpeed, function(){
                                $root.animate({
                                    top: 0
                                }, config.effectsSpeed);
                            });
                        }, minStart - Date.now());
                    });
                });
            });
        });
    });
});
