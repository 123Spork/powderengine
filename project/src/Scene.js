var Scene = cc.Layer.extend({
	sceneIdentifier:null,
	panels:null,
	
	
	ctor:function(){
		this._super();
	},
	
	willBecomeActive:function(){
	},
	
	setServerConnected:function(){
	},
	
	didBecomeActive:function(){
		this.panels = requestLayout(this);
		this.addChild(this.panels);
	},
	
	willTerminate:function(){
	},
	
	init:function(){
		this.setTouchMode(1);
		this.setTouchEnabled(true);
		SceneManager.setActiveScene(this);
		this._super();
	},

	onKeyDown:function(key){
		cc.log("Override onKeyDown in scene extended class to use keyboard");
	},
	
	onKeyUp:function(key){
		cc.log("Override onKeyUp in scene extended class to use keyboard");
	},
	
	setIdentifier:function(_identifier){
		this.sceneIdentifier=_identifier;
	},
	
	getIdentifier:function(){
		return this.sceneIdentifier;
	},

	//onTouchBegan:function(touch){
		//SceneManager.setActiveScene(this);
	//},
});
