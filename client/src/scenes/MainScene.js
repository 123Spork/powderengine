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
});
