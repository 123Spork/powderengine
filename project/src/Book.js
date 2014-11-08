
Book=null;
BookPanel = Popup.extend({

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
						/*children:{
							"pageBackbtn" : {
								position:cc.p(2,1),
								size:cc.size(36,36),
								texture:"GUI/btnLeft.png",
								anchorPoint:cc.p(0,0),
							},
							"pageForwardbtn" : {
								position:cc.p(475,1),
								size:cc.size(36,36),
								texture:"GUI/btnRight.png",
								anchorPoint:cc.p(0,0),
							},
							"leftPage":{
								label:this.pages[0],
								anchorPoint:cc.p(0,1),
								position:cc.p(4,308),
								color:cc.c3b(0,0,0),
							},
							"rightPage":{
								label:this.pages.length>1 ? this.pages[1] : "",
								anchorPoint:cc.p(0,1),
								position:cc.p(260,308),
								color:cc.c3b(0,0,0),
							}
						}*/
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,138),
						size: cc.size(512,32),
						children:{
							"header":{
								label:"NPC TALKIN",
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
		
	},

	didBecomeActive:function(){
		this._super();
	
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