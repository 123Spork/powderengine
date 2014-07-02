var MainScene = Scene.extend({
	
	ctor:function(){
		this._super();
	},
	
	willBecomeActive:function(){
		this._super();
	},
	
	didBecomeActive:function(){
		this._super();
	},
	
	willTerminate:function(){
		this._super();
	},
	
	onTouchBegan:function(touch){
		if(cc.rectContainsPoint(this.panels["health_panel"].getBoundingBox(),touch._point)){
			SceneManager.getInstance().goToScene("Game");
		}
	},
	

	init:function(){
		var label = cc.LabelTTF.create("ITS WOKKIN!", "Arial", 16);
		label.setColor(cc.c3b(0,0,0));
		label.setPosition(cc.p(200,200));
		this.addChild(label);
	
	
		this._super();
	},
});
