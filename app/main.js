require.config({
    waitSeconds: 0,
    baseUrl: "bower_components",
    packages: [{
        name: "jquery",
        location: "jquery/dist",
        main: "jquery"
    }, {
        name: "appRoot",
        location: ".."
    }],
    map: {
        '*': {
            text: 'requirejs-plugins/lib/text',
            image: 'requirejs-plugins/src/image',
            json: 'requirejs-plugins/src/json',
            async: 'requirejs-plugins/src/async',
            font: 'requirejs-plugins/src/font',
            goog: 'requirejs-plugins/src/goog',
            noext: 'requirejs-plugins/src/noext',
            mdown: 'requirejs-plugins/src/mdown',
            propertyParser: 'requirejs-plugins/src/propertyParser',
            markdownConverter : 'requirejs-plugins/lib/Markdown.Converter',
            less: 'require-less/less',
            when: 'when'
        }
    }
});

require([
    "jquery",
    "when/when",
    "json!appRoot/config.json",
    "require"
], function(jQuery, when, config, localRequire){
    // build splash screen:
    var ctrlBase = "appRoot/" + config.ctrlPath,
        dataBase = "appRoot/" + config.dataPath,
        contentBase = "appRoot/" + config.contentPath,
        splashCtrlPath = ctrlBase + "splash/" + "main",
        metadataPath = dataBase + "meta.json",
        layoutPath = dataBase + "layout.json";
    localRequire([splashCtrlPath, "json!" + metadataPath, "json!" + layoutPath], function(Splash, meta, layout){
        Splash(meta.logo).then(function($splash){
            jQuery(function ($) {
                var $root = $('.root'),
                    $sectionsContainer = $(".root .sections-container"),
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
                            var ctrlPath = ctrlBase + section.controller + '/main',
                                contentPath = contentBase + section.content + '.md';
                            localRequire([ctrlPath], function(Controller){
                                Controller(contentPath, meta, scrollNext).then(resolve, reject);
                            }, reject);
                        }).tap(function($el){
                            $el.attr('data-section-id', i);
                        });
                    }),
                    pNav = when.promise(function(resolve, reject){
                        var ctrlPath = ctrlBase + 'nav/main';
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
