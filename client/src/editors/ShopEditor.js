Shopeditor=null,
ShopEditor = Scene.extend({
	currentTexture:characterTextureList[0]["name"],
	currentTextureNumber:0,

	getTabOptions:function(clicknum){
		return ["Basic"];
	},

	getCloseOptions:function(clicknum){
		return ["Cancel","Don't Save","Save"];
	},

	willExitEditor:function(clicknum){
		switch(clicknum){
			case 1:
				this.ignoreTerminate=true; 
				var self= this.delegate;
				this.delegate.scheduleOnce(function(){self.endedEdit(null)}); 
			break;
			case 2:
				this.ignoreTerminate=true;
				this.data["name"]=this.nameBox.getText();
				this.delegate.endedEdit(this.data);
			break;
		}
	},
	
	getLayoutObject:function(){
		return { "panels":{
				children:{	
					"name_lbl":{
						label:"Name:",
						fontSize:12,
						anchorPoint:cc.p(0,1),
						position: cc.p(4,screenSize.height-99),
					},
					"name_entry":{
						position:cc.p(60,screenSize.height-114),
						size:cc.size(282,16),
						anchorPoint:cc.p(0,0),
						color:cc.c3b(180,180,180)
					},	
					"okbtn" : {
						position:cc.p(434,16),
						size:cc.size(32,32),
						texture:"GUI/tick_icon.png",
						anchorPoint:cc.p(0,0),
					},
					"cancelbtn" : {
						position:cc.p(384,16),
						size:cc.size(32,32),
						texture:"GUI/cross_icon.png",
						anchorPoint:cc.p(0,0),
					},
				}
			}
		};
	},
	
	getIdentifier:function(){
		return "shopEditor";
	},
	nameBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.data={"name":""};;
		this.currentTexture=characterTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.delegate=null,
		this.delegate=withData.delegate;
		if(withData && withData.data){
			this.data=withData.data;
		}
	},
	
	runSaveNewData:function(num){
		sendToServer("saveNewShopMessage",{"saveshops":num+"","shopsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendToServer("deleteShopMessage",{"saveshopswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();

		this.nameBox = new EntryBox(this.panels["name_entry"],cc.size(this.panels["name_entry"].getContentSize().width,this.panels["name_entry"].getContentSize().height+4), cc.p(0,this.panels["name_entry"].getContentSize().height+4), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.nameBox.setBackgroundInvisible();
	},

	willTerminate:function(ignoreTerminate){
		this._super();
		if(this.delegate){
			var self= this.delegate;
			if(ignoreTerminate==true){
				return;
			}
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
		}
	},
	
	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels.convertToNodeSpace(pos);
		
			
		
		return false;
	},	

	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["stackbtn"].setColor(RED);
		this.panels["stackbtn"]["text"].setString("NOT STACKABLE");
		if(this.data["stackable"]==true){
			this.panels["stackbtn"].setColor(GREEN);
			this.panels["stackbtn"]["text"].setString("IS STACKABLE");
		}
	},
	
	
});