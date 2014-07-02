var cocos2dApp = cc.Application.extend({
    config : document["ccConfig"],
    ctor : function(){
        this._super();
        cc.COCOS2D_DEBUG = this.config["COCOS2D_DEBUG"];
        cc.initDebugSetting();
        cc.setup(this.config["tag"]);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching : function(){
        var config = this.config;
        // initialize director
        var director = cc.Director.getInstance();
		
        var eglView = cc.EGLView.getInstance();
      //  eglView._adjustSizeToBrowser();		
        var screenSize = eglView.getFrameSize();
        var resourceSize = cc.size(960, 640);
        var designSize = cc.size(960, 640);

        var fileUtils = cc.FileUtils.getInstance();
        var platform = cc.Application.getInstance().getTargetPlatform();
        fileUtils.setSearchPaths(["res/Graphics"]);
        if(cc.AudioEngine) cc.AudioEngine.getInstance().setResPath("res/Audio");
        director.setContentScaleFactor(1);

        // turn on display FPS
       // director.setDisplayStats(config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / config['frameRate']);

//        config.test = js.project.MyTest_js;//config which js you want to test


        if(config["test"]) cc.test(config["test"]);//
        else{
            //TODO enter point for game
            cc.log("++++++++++++++++entry for game++++++++++++");
            cc.loadGameModule(js.project.SceneManager_js, function(resArr){
			 
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
