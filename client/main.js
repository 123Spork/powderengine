var screenSize;

var cocos2dApp = cc.Application.extend({
    config : document["ccConfig"],
    ctor : function(){
        this._super();
        cc.COCOS2D_DEBUG = this.config["COCOS2D_DEBUG"];
        cc.setup(this.config["tag"]);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching : function(){
        var cfg = this.config;
        // initialize director
        var director = cc.Director.getInstance();
        var eglView = cc.EGLView.getInstance();
        eglView._adjustSizeToBrowser();
        eglView.resizeWithBrowserSize(true);	
        screenSize = eglView.getFrameSize();
        
        var resourceSize = cc.size(screenSize.width, screenSize.height);
        var designSize = cc.size(screenSize.width,screenSize.height);
        var fileUtils = cc.FileUtils.getInstance();
        var platform = cc.Application.getInstance().getTargetPlatform();
        fileUtils.setSearchPaths(["res/Graphics"]);
        if(cc.AudioEngine) cc.AudioEngine.getInstance().setResPath("res/Audio");
        director.setContentScaleFactor(1);
        eglView.setDesignResolutionSize(designSize.width, designSize.height, cc.RESOLUTION_POLICY.SHOW_ALL);
        // turn on display FPS
       // director.setDisplayStats(config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / cfg['frameRate']);

//        config.test = js.project.MyTest_js;//config which js you want to test


        if(cfg["test"]) cc.test(cfg["test"]);//
        else{
            //TODO enter point for game
            cc.loadGameModule(js.client.SceneManager_js, function(resArr){
                cc.LoaderScene.preload(resArr, function(){
					document.getElementById("gameCanvas").setAttribute('tabindex','0');
					document.getElementById("gameCanvas").focus();
					var sM = SceneManager.getInstance();
                    cc.Director.getInstance().replaceScene(sM);
					sM.init();
                });
            });
        }
        return true;
    }

});

new cocos2dApp();
