Shopeditor=null,
ShopEditor = Popup.extend({
	currentTexture:characterTextureList[0]["name"],
	currentTextureNumber:0,
	
	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"background":{
						texture:"GUI/itemeditor_bg.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(500,330),
						children: {
							"namelbl" : {
								label:"Name:",
								fontSize:20,
								anchorPoint:cc.p(0,0),
								position:cc.p(4,292),
								color:cc.c3b(0,0,0),
							},
							"name_entry":{
								position:cc.p(74,292),
								size:cc.size(266,32),
								color:cc.c4b(255,255,255,255),
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
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,330),
						size: cc.size(500,32),
						children:{	
							"header":{
								label:"Item Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(476,6),
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
		sendMessageToServer({"saveshops":num+"","shopsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"saveshopswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();

		this.nameBox = new EntryBox(this.panels["main_panel"]["name_entry"],cc.size(this.panels["main_panel"]["name_entry"].getContentSize().width,this.panels["main_panel"]["name_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["name_entry"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.nameBox.setDefaultFineFlag(true);;
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
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["name"]=this.nameBox.getText();
			this.delegate.endedEdit(this.data);
			return true;
		}
			
		if(isTouching(this.panels["main_panel"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true; var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}			
		return false;
	},	

	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["main_panel"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["stackbtn"]["text"].setString("NOT STACKABLE");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["stackbtn"]["text"].setString("IS STACKABLE");
		}
	},
	
	
});