Itemeditor=null,
ItemEditor = Popup.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,



	setTypeData:function(value,data){
		if(Scripteditor){
			Scripteditor.willTerminate();
			Scripteditor.removeFromParent();
			this.typeData=value;
			this.setTouchEnabled(true);
			this.panels["main_panel"]["scriptbtn"]["text"].setString(data["name"]);
			this.panels["main_panel"]["scriptbtn"].setColor(cc.c4b(0,255,0,255));
		}
	},

	setNoType:function(){
		this.panels["main_panel"]["scriptbtn"]["text"].setString("None");
		this.panels["main_panel"]["scriptbtn"].setColor(cc.c4b(255,0,0,255));
	},

	
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
						
							"tiles" : {
								anchorPoint:cc.p(0,1),
								position:cc.p(16,272),
								texture:tileTextureList[0]["name"],
							},
							
							"textureleftbtn" : {
								position:cc.p(362,292),
								size:cc.size(16,32),
								texture:"GUI/texture_change_left.png",
								anchorPoint:cc.p(0,0),
							},
							"texturerightbtn" : {
								position:cc.p(471,292),
								size:cc.size(16,32),
								texture:"GUI/texture_change_right.png",
								anchorPoint:cc.p(0,0),
							},
							"textureName" : {
								position:cc.p(375,292),
								size:cc.size(96,32),
								texture:"GUI/texture_change_middle.png",
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:tileTextureList[0]["name"],
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(48,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"leftbtn" : {
								position:cc.p(0,16),
								size:cc.size(16,256),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"<",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(8,160),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"rightbtn" : {
								position:cc.p(336,16),
								size:cc.size(16,256),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:">",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(8,160),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"upbtn" : {
								position:cc.p(16,272),
								size:cc.size(320,16),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"^",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(160,8),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"downbtn" : {
								position:cc.p(16,0),
								size:cc.size(320,16),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"v",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(160,8),
										color:cc.c3b(255,255,255),
									}
								}
							},

							"stacklbl" : {
								label:"Stackable:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(360,206),
								color:cc.c3b(0,0,0),
							},
							"stackbtn" : {
								position:cc.p(360,176),
								size:cc.size(128,26),
								color: RED,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"No",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(64,13),
										color:cc.c3b(0,0,0),
									}
								}
							},

							"scriptlbl" : {
								label:"Script:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(360,262),
								color:cc.c3b(0,0,0),
							},
							"scriptbtn" : {
								position:cc.p(360,232),
								size:cc.size(128,26),
								color: RED,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"None",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(64,13),
										color:cc.c3b(0,0,0),
									}
								}
							},
							
							"highlightnode" : {
								anchorPoint:cc.p(0,0),
								position:cc.p(0,0),
								size:cc.size(32,32),
								color:cc.c4b(255,100,100,255),
							},
							"selectednode" : {
								anchorPoint:cc.p(0,0),
								position:cc.p(0,0),
								size:cc.size(32,32),
								color:cc.c4b(100,255,100,255),
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
		return "itemEditor";
	},
	nameBox:null,
	delegate:null,
	data:null,
	typeData:null,
	
	init:function(withData){
		this._super();	
		this.data={"sprite":{"texture":tileTextureList[0]["name"],"position":{x:0,y:0}},"script":null,"stackable":false, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.delegate=null,
		this.typeData=null,
		this.mapOffset=cc.p(0,0);
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
			if(this.data["script"]){
				this.typeData=this.data["script"];
			}
		}
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"saveitems":num+"","itemdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"saveitemswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["selectednode"].setOpacity(127);

		for(var i in tileTextureList){
			if(tileTextureList[i]["name"]==this.data["sprite"]["texture"]){
				this.currentTextureNumber=i;
				this.currentTexture=tileTextureList[i]["name"];
			}
		}
		this.panels["main_panel"]["textureName"]["text"].setString(this.currentTexture);
		this.panels["main_panel"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		
		if(this.data["script"]!=null){
			this.panels["main_panel"]["scriptbtn"].setColor(cc.c4b(0,255,0,255));
			this.panels["main_panel"]["scriptbtn"]["text"].setString(ObjectLists.getScriptList()[this.data["script"]]["name"]);
			this.typeData=this.data["script"];
		}

		var posX = this.data["sprite"]["position"].x;
		while(posX>=10){
			posX--;
			this.mapOffset.x++;
		}
		var posY = this.data["sprite"]["position"].y;
		while(posY>=8){
			posY--;
			this.mapOffset.y++;
		}
		var tilePos = cc.p((this.data["sprite"]["position"].x-this.mapOffset.x)*32,(this.data["sprite"]["position"].y-this.mapOffset.y)*32);
		this.panels["main_panel"]["selectednode"].setPosition(this.panels["main_panel"]["tiles"].getPosition().x+tilePos.x,this.panels["main_panel"]["tiles"].getPosition().y-(tilePos.y+32)) 
		this.nameBox = new EntryBox(this.panels["main_panel"]["name_entry"],cc.size(this.panels["main_panel"]["name_entry"].getContentSize().width,this.panels["main_panel"]["name_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["name_entry"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);

		this.panels["main_panel"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["stackbtn"]["text"].setString("Yes");
		}
		this.updateMapOffset();
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
	
	onMouseMoved:function(event){
		var pos = event.getLocation();
		this.panels["main_panel"]["highlightnode"].setOpacity(0);
		var truePos = this.panels["main_panel"]["tiles"].convertToNodeSpace(pos);
		if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tiles"].getContentSize().height){
			truePos.x = truePos.x-(truePos.x%32)+16;
			truePos.y = truePos.y-(truePos.y%32)+16;
			this.panels["main_panel"]["highlightnode"].setOpacity(127);
			this.panels["main_panel"]["highlightnode"].setPosition(truePos);
			return true;
		}		
	},

	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["main_panel"]["tiles"].getTexture() && this.panels["main_panel"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tiles"].setTextureRect(cc.rect(Math.floor(32*this.mapOffset.x),Math.floor(32*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<256?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:256));
		}
	},
	
	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(cc.p(pos.x,pos.y));

		
		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["name"]=this.nameBox.getText();
			this.data["script"]=this.typeData;
			this.delegate.endedEdit(this.data);
			return true;
		}
		
		if(isTouching(this.panels["main_panel"]["scriptbtn"],truePos)){
			if(Scripteditor){
				Scripteditor.willTerminate();
				Scripteditor.removeFromParent();
				Scripteditor=null;
			} else{
				Scripteditor = new PopupList();
				Scripteditor.init({delegate:this,editor:new ScriptEditor(),list:ObjectLists.getScriptList(),name:"Script List"});
				Scripteditor.didBecomeActive();
				this.addChild(Scripteditor);
			}
		}

		if(isTouching(this.panels["main_panel"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true; var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

			if(isTouching(this.panels["main_panel"]["leftbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>264 && this.mapOffset.x>0){
					this.mapOffset.x--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["rightbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-320)/32)){
					this.mapOffset.x++;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["upbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["downbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/32)){
					this.mapOffset.y++; this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["texturerightbtn"],truePos)){
				this.useNextTexture();
				return true;
			}
			if(isTouching(this.panels["main_panel"]["textureleftbtn"],truePos)){
				this.usePrevTexture();
				return true;
			}
		
			if(isTouching(this.panels["main_panel"]["stackbtn"],truePos)){
				this.swapStackable(); return true;
			}

			truePos = this.panels["main_panel"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tiles"].getContentSize().height){
				
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+16;
				
				this.panels["main_panel"]["selectednode"].setOpacity(0);
				if(this.panels["main_panel"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["selectednode"].setPosition(truePos);
				}

				var pos = cc.p(((this.panels["main_panel"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,((8-((this.panels["main_panel"]["selectednode"].getPositionY()-16)/32))+this.mapOffset.y)-1);
				this.data["sprite"]["position"]=pos;

				return true;
			} 
	
		return false;
	},	

	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["main_panel"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["stackbtn"]["text"].setString("Yes");
		}
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["textureName"]["text"].setString(this.currentTexture);
		this.data["sprite"]["texture"]=this.currentTexture;
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=tileTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["main_panel"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
});