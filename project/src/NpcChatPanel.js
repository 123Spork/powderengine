
NpcChat=null;
NpcChatPanel = Popup.extend({

	name:null,
	content:null,
	pages:null,

	getIdentifier:function(){
		return "Book";
	},
	
	getLayoutObject:function(){
		
		return {
			"panels":{
				position:cc.p(100,20),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(512,138),
						texture: "GUI/npctalk.png",
						children:{
							"chatText":{
								label:this.content,
								anchorPoint:cc.p(0,1),
								position:cc.p(138,134),
								color:cc.c3b(0,0,0),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,138),
						size: cc.size(512,32),
						children:{
							"header":{
								label:this.name,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(488,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
							}
						}
					},
				}	
			}
		};
	},

	init:function(name,content){
		this._super();
		this.name=name;
		this.content=content;
	},

	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["chatText"].setDimensions(cc.size(350,0));
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		/*this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(isTouching(this.panels["main_panel"]["pageForwardbtn"],truePos)){
			this.gotoNextPage();
			return true;
		}		
		if(isTouching(this.panels["main_panel"]["pageBackbtn"],truePos)){
			this.gotoPreviousPage();
			return true;
		}	*/	
	},


});