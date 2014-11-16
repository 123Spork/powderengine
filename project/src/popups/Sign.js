Sign=null;
SignPanel = Popup.extend({
	data:null,

	getIdentifier:function(){
		return "Sign";
	},
	getLayoutObject:function(){
		return {
			"panels":{
				position:cc.p(100,300),
				children:{	
					"control_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(128,96),
						texture:"GUI/signpost.png",
						children:{
							"content":{
								label:this.data["label"],
								fontSize:12,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0,1),
								position:cc.p(4,94),
							},
						"exitBtn":{
								position: cc.p(100,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
								
							}
						},					
					}	
				}
			}
		};
	},

	init:function(data){
		this._super();
		this.data=data;
	},
	

	didBecomeActive:function(){
		this._super();
		this.panels["control_panel"]["content"].setDimensions(cc.size(120,0));
	},

});