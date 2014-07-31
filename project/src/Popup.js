Popup = Scene.extend({
	prevMovPos:null,
	ignoreTerminate:false,

	init:function(){
		this.sceneIdentifier = this.getIdentifier();
		this._super();	
		SceneManager.setActiveScene(this);
		this.setupPopup();
		this.setTouchPriority(-50);
	},

	exitButtonPressed:function(){
		this.removeFromParent();
	},

	onTouchBegan:function(touch){
		var pos = touch._point;
		SceneManager.setActiveScene(this);
		var truePos = this.panels["control_panel"].convertToNodeSpace(pos);
		if(cc.rectContainsPoint(cc.rect(this.panels["control_panel"]["exitBtn"].getPositionX(),this.panels["control_panel"]["exitBtn"].getPositionY(),this.panels["control_panel"]["exitBtn"].getContentSize().width,this.panels["control_panel"]["exitBtn"].getContentSize().height),truePos)){
			var self=this;
			this._parent.scheduleOnce(function(){if(self.ignoreTerminate==false){self.willTerminate();} self.removeFromParent(); self=null;});
			return true;
		}
	
		if(cc.rectContainsPoint(cc.rect(this.panels.getPosition().x,this.panels.getPosition().y+this.panels["control_panel"].getPosition().y,this.panels["control_panel"].getContentSize().width,this.panels["control_panel"].getContentSize().height),touch._point)){
			this.prevMovPos=this.panels.convertTouchToNodeSpace(touch);
			return true;
		}
		return false;
	},

	onTouchMoved:function(touch){
		if(this.prevMovPos){
			var pt=touch._point;
			this.panels.setPosition(cc.p(pt.x-this.prevMovPos.x,pt.y-this.prevMovPos.y));
			return true;
		}
		return false;
	},

	removeFromParent:function(){
		LocalStorage.setPanelPosition(this.getIdentifier(),this.panels.getPosition());
		this._super();
	},

	setupPopup:function(){
		cc.log("Ovveride setupPopup");
	},

	getIdentifier:function(){
		cc.log("No id given... using default 'Popup'");
		return "Popup";
	},

	onTouchEnded:function(touch){
	},

	didBecomeActive:function(){
		this._super();
		var panelPos = LocalStorage.getPanelPosition();
		console.log(panelPos);
		if(panelPos!="null" && panelPos!=null){
			var obj = JSON.parse(panelPos)[this.getIdentifier()];
			if(obj){
				var pos = cc.p(obj["x"],obj["y"]);
				if(pos.x>screenSize.width-10 || pos.y>screenSize.height){
					pos = cc.p(8,100);
				}
				this.panels.setPosition(pos);
			}
		}
	},

});