var SceneManager = cc.Layer.extend({
	instance:null,
	background_node:null,
    currentScene:null,
	activeScene:null,

	init:function(){
	    updateScreenSize();
		cc.EGLView.getInstance().setResizeCallback(this.orientationChange);
		var screenSize = cc.EGLView.getInstance().getFrameSize();
		this.background_node = cc.Sprite.create();
		this.background_node.setColor(cc.c3b(0,0,0));
		this.background_node.setTextureRect(cc.rect(0,0,screenSize.width,(screenSize.height-sizeReducer)));
		this.background_node.setAnchorPoint(cc.p(0,0));
		this.addChild(this.background_node);

		if(LocalStorage.getInstance() && isGameInSync){
			settingsData = mergeSettings(settingsData,LocalStorage.getSettingsData());
			this.goToScene("Login",{});	
			this.schedule(this.buttonDown);
			autoLoginNextTime=LocalStorage.isAutoLogin();
			rememberLoginNextTime=LocalStorage.isRememberLogin();
		}else{
			this.schedule(this.initGameWhenLocalStorage);
		}
	},

	orientationChange:function(){
		if(SceneManager.getInstance().currentScene){
			var egl = cc.EGLView.getInstance();
	        screenSize=cc.size(egl.getFrameSize().width,egl.getFrameSize().height);
	        SceneManager.getInstance().background_node.setTextureRect(cc.rect(0,0,screenSize.width,(screenSize.height-sizeReducer)));
			SceneManager.getInstance().currentScene.onOrientationChanged();
		}
	},

	initGameWhenLocalStorage:function(){
		if(LocalStorage.getInstance() && isGameInSync && io){
			this.unschedule(this.initGameWhenLocalStorage);
			settingsData = mergeSettings(settingsData,LocalStorage.getSettingsData());
			this.goToScene("Login",{});	
			this.schedule(this.buttonDown);
			autoLoginNextTime=LocalStorage.isAutoLogin();
			rememberLoginNextTime=LocalStorage.isRememberLogin();
		}
	},

	buttonDown:function(){
		for(var i in keyMap){
			if(keyMap[i]==true && this.currentScene!=null){
				var button = null;	
				i=parseInt(i);
				switch(i){
					case 8: button="BACKSPACE"; break;
					case 9: button="TAB"; break;
					case 13: button="ENTER"; break;
					case 16: button="SHIFT"; break;
					case 17: button="CTRL"; break;
					case 18: button="ALT"; break;
					case 19: button="PAUSE"; break;
					case 20: button="CAPSLOCK"; break;
					case 27: button="ESC"; break;
					case 32: button="SPACE";break;
					case 33: button="PAGEUP";break;
					case 34: button="PAGEDOWN"; break;
					case 35: button="END";break;
					case 37: button="LEFTARROW"; break;
					case 38: button="UPARROW"; break;
					case 39: button="RIGHTARROW"; break;
					case 40: button="DOWNARROW"; break;
					case 45: button="INSERT"; break;
					case 46: button="DELETE"; break;
				}
				if(button==null){
					if((i>47 && i<58) || (i>64 && i<91)){
						button = String.fromCharCode(i);
					}
				}
				if(button!=null){
					this.currentScene.onKeyDown(button);
				}
			}
		}
	},
	
	goToScene:function (toScene,data) {
		if(this.currentScene!=null){
			this.currentScene.willTerminate();
			this.currentScene.removeFromParent();
			this.currentScene=null;
		}
		switch(toScene){
		case "Login":
			this.currentScene = new Login(); break;
		case "Game":
			this.currentScene = new GameScene(); break;
		}
		this.currentScene.willBecomeActive();
		this.addChild(this.currentScene,1);
		this.currentScene.setIdentifier(toScene);
		this.currentScene.didBecomeActive();
		this.currentScene.init(data);
    },
	
	getCurrentScene:function(){
		return this.currentScene.getIdentifier();
	},

});

SceneManager.getInstance = function(){
	if(this.instance==null){
		this.instance = new SceneManager();
	}
	return this.instance;
};

SceneManager.setActiveScene = function(scene){
	if(this.instance==null){
		this.instance = new SceneManager();
	}
	this.instance.activeScene=scene;
};

SceneManager.getActiveScene = function(){
	if(this.instance==null){
		this.instance = new SceneManager();
	}
	return this.instance.activeScene;
};