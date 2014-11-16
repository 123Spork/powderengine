
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
						size: cc.size(514,313),
						texture: "GUI/book.png",
						children:{
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
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,313),
						size: cc.size(514,32),
						children:{
							"header":{
								label:this.name,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(490,6),
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
		this.pages = [];
		var chunkSize = 470;
		var str =content;
		while (str) {
		    if (str.length < chunkSize) {
		       this.pages.push(str);
		        break;
		    }
		    else {
		        this.pages.push(str.substr(0, chunkSize)+"...");
		        str = str.substr(chunkSize);
		    }
		}
		this.pageCount = Math.floor(this.pages.length/2)-1;
		this.currentPage=0;
	},

	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["leftPage"].setDimensions(cc.size(248,0));
		this.panels["main_panel"]["rightPage"].setDimensions(cc.size(248,0));
		this.panels["main_panel"]["pageBackbtn"].setVisible(false);
		if(this.pages.length<2){
			this.panels["main_panel"]["pageForwardbtn"].setVisible(false);
		}
	},

	gotoNextPage:function(){
		this.currentPage++;
		this.panels["main_panel"]["pageBackbtn"].setVisible(true);
		if(this.currentPage==this.pageCount){
			this.panels["main_panel"]["pageForwardbtn"].setVisible(false);
		}
		this.panels["main_panel"]["leftPage"].setString(this.pages[this.currentPage*2]);
		if(this.pages[(this.currentPage*2)+1]){
			this.panels["main_panel"]["rightPage"].setString(this.pages[(this.currentPage*2)+1]);
		} else{
			this.panels["main_panel"]["rightPage"].setString("");
		}
	},

	gotoPreviousPage:function(){
		this.currentPage--;
		this.panels["main_panel"]["pageForwardbtn"].setVisible(true);
		if(this.currentPage==0){
			this.panels["main_panel"]["pageBackbtn"].setVisible(false);
		}
		this.panels["main_panel"]["leftPage"].setString(this.pages[this.currentPage*2]);
		if(this.pages[(this.currentPage*2)+1]){
			this.panels["main_panel"]["rightPage"].setString(this.pages[(this.currentPage*2)+1]);
		}
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(isTouching(this.panels["main_panel"]["pageForwardbtn"],truePos)){
			this.gotoNextPage();
			return true;
		}		
		if(isTouching(this.panels["main_panel"]["pageBackbtn"],truePos)){
			this.gotoPreviousPage();
			return true;
		}		
	},


});