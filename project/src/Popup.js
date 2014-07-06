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
	},

	onTouchEnded:function(touch){
		this.prevMovPos=null;
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

});

ObjectList = Popup.extend({
	childEditor:null,
	editList:[],
	listName:null,
	showingEditor:false,
	saveNewDataID:-1,
	
	willTerminate:function(){
		if(this.delegate){
			this.delegate.setTouchEnabled(true);
		}
	},

	init:function(withData){
		this._super();
		this.childEditor=null;
		this.editList=[],
		this.listName=null;
		this.showingEditor=false;
		this.saveNewDataID=-1;
		this.childEditor=withData.editor;
		if(withData.list){
			this.editList=withData.list;
		}
		this.listName=withData.name;
		this.delegate=withData.delegate;
	},
	
	getLayoutObject:function(){
		var listPanel = {};
		for(var i in this.editList){
			if(this.editList[i]==null){
				this.editList.splice(i,1);
				continue;
			}
			if(this.delegate!=null){
				listPanel["useElement"+i]={
					size: cc.size(32,26),
					bg: cc.c4b(0,255,0,200),
					position: cc.p(0,302-(i*30)),
					children:{	
						"content":{
							label:"Use",
							fontSize:20,
							anchorPoint:cc.p(0.5,0.5),
							position:cc.p(16,13),
						}
					}
				};
			
			
				listPanel["element"+i]={
					size: cc.size(116,26),
					bg: cc.c4b(140,140,140,200),
					position: cc.p(32,302-(i*30)),
					children:{	
						"content":{
							label:this.editList[i].name,
							fontSize:20,
							anchorPoint:cc.p(0.5,0.5),
							position:cc.p(58,13),
						}
					}
				};
				
			}
			else{
				listPanel["element"+i]={
					size: cc.size(148,26),
					bg: cc.c4b(140,140,140,200),
					position: cc.p(0,302-(i*30)),
					children:{	
						"content":{
							label:this.editList[i].name,
							fontSize:20,
							anchorPoint:cc.p(0.5,0.5),
							position:cc.p(79,13),
						}
					}
				};
			}
			
			listPanel["delElement"+i]={
				size: cc.size(32,26),
				bg: cc.c4b(255,0,0,200),
				position: cc.p(148,302-(i*30)),
				children:{	
					"content":{
						label:"Del",
						fontSize:20,
						anchorPoint:cc.p(0.5,0.5),
						position:cc.p(16,13),
					}
				}
			}
			
			
		}
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(180,328),
						bg: cc.c4b(255,255,255,200),
						children: {
							"list": {
								children: listPanel
							},
							"addButton":{
								size: cc.size(90,26),
								bg: cc.c4b(140,140,140,200),
								position: cc.p(45,302-(this.editList.length*30)),
								children:{	
									"content":{
										label:"+",
										fontSize:20,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(45,13),
									}
								}
							}
						},
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,328),
						size: cc.size(180,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:this.listName,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(151,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}	
			}
		};
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(this.showingEditor==false){
			for(var i in this.editList){
				if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["list"]["element"+i].getPositionX(),this.panels["main_panel"]["list"]["element"+i].getPositionY(),this.panels["main_panel"]["list"]["element"+i].getContentSize().width,this.panels["main_panel"]["list"]["element"+i].getContentSize().height),truePos)){
					this.showingEditor=true;
					this.childEditor.init({delegate:this, data:this.editList[i]});
					this._parent.addChild(this.childEditor);
					this.setTouchEnabled(false);
					this.childEditor.didBecomeActive();
					this.saveNewDataID=i+"";
					return true;
				}
				
				if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["list"]["delElement"+i].getPositionX(),this.panels["main_panel"]["list"]["delElement"+i].getPositionY(),this.panels["main_panel"]["list"]["delElement"+i].getContentSize().width,this.panels["main_panel"]["list"]["delElement"+i].getContentSize().height),truePos)){
					this.deleteElement(i);
					return true;
				}
				
				if(this.delegate){
					if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["list"]["useElement"+i].getPositionX(),this.panels["main_panel"]["list"]["useElement"+i].getPositionY(),this.panels["main_panel"]["list"]["useElement"+i].getContentSize().width,this.panels["main_panel"]["list"]["useElement"+i].getContentSize().height),truePos)){
						this.delegate.setTypeData(i,this.editList[i]);
						return true;
					}
				}
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["addButton"].getPositionX(),this.panels["main_panel"]["addButton"].getPositionY(),this.panels["main_panel"]["addButton"].getContentSize().width,this.panels["main_panel"]["addButton"].getContentSize().height),truePos)){
				this.addingNew=true;
				this.showingEditor=true;
				this.saveNewDataID=this.editList.length;
				this.childEditor.init({delegate:this, data:null});
				this.setTouchEnabled(false);
				this._parent.addChild(this.childEditor);
				this.childEditor.didBecomeActive();
				return true;
			}
		}
	},

	endedEdit:function(addData){
		if(addData){
			this.childEditor.runSaveNewData(this.saveNewDataID);
			if(this.addingNew){
				this.editList.push(addData);
				this.panels.removeFromParent();
				this.panels=requestLayout(this);
				this.addChild(this.panels);
			}
		}
		this.setTouchEnabled(true);
		this.addingNew=false;
		this.showingEditor=false;
		var self=this;
		this.scheduleOnce(function(){
		self.childEditor.willTerminate(true);
		self.childEditor.removeFromParent();
		})
	},
	
	deleteElement:function(number){
		this.editList.splice(number,1);
		this.childEditor.deleteSave(number,this.editList);
		this.panels.removeFromParent();
		this.panels=requestLayout(this);
		this.addChild(this.panels);
	},
	
});

WarpEditorPopup = Popup.extend({
	getIdentifier:function(){
		return "WarpEditor";
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"savewarps":num+"","warpdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savewarpswhole":list});
	},
	
	getLayoutObject:function(){
		var listPanel = {};
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(180,160),
						bg: cc.c4b(100,255,100,200),
						children:{
							"okbtn" : {
								position:cc.p(100,16),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"OK",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"cancelbtn" : {
								position:cc.p(20,16),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Cancel",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"namelbl" : {
								label:"Name of warp.",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(20,140),
								color:cc.c3b(0,0,0),
							},
							"nameEntry":{
								position:cc.p(16,110),
								size:cc.size(120,30),
							},
							"mapnumlbl" : {
								label:"Map #",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(20,90),
								color:cc.c3b(0,0,0),
							},
							"mapNumEntry":{
								position:cc.p(16,60),
								size:cc.size(40,30),
							},
							"mapxlbl" : {
								label:"x",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(80,90),
								color:cc.c3b(0,0,0),
							},
							"mapXEntry":{
								position:cc.p(76,60),
								size:cc.size(36,30),
							},
							"mapylbl" : {
								label:"y",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(130,90),
								color:cc.c3b(0,0,0),
							},
							"mapYEntry":{
								position:cc.p(126,60),
								size:cc.size(36,30),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,160),
						size: cc.size(180,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Warp Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(151,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}	
			}
		};
	},
	
	nameBox:null,
	mapNumBox:null,
	mapXBox:null,
	mapYBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.nameBox=null;
		this.mapNumBox=null;
		this.mapXBox=null;
		this.mapYBox=null;
		this.delegate=null;
		this.data={"mapTo":0,"position":0,"name":""};
		if(withData.data){
			this.data=withData.data;
		}
		this.delegate=withData.delegate;
	},
	
	didBecomeActive:function(){
	this._super();
		var x=this.data["position"] % gridWidth;
		var y=(Math.floor(this.data["position"]/gridWidth)); 
		this.nameBox = new EntryBox(this.panels["main_panel"]["nameEntry"],cc.size(this.panels["main_panel"]["nameEntry"].getContentSize().width,this.panels["main_panel"]["nameEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["nameEntry"].getContentSize().height), this.data["name"], cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.nameBox.setDefaultFineFlag(true);
		this.mapNumBox = new EntryBox(this.panels["main_panel"]["mapNumEntry"],cc.size(this.panels["main_panel"]["mapNumEntry"].getContentSize().width,this.panels["main_panel"]["mapNumEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapNumEntry"].getContentSize().height), ""+this.data["mapTo"], cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapNumBox.setDefaultFineFlag(true);
		this.mapXBox = new EntryBox(this.panels["main_panel"]["mapXEntry"],cc.size(this.panels["main_panel"]["mapXEntry"].getContentSize().width,this.panels["main_panel"]["mapXEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapXEntry"].getContentSize().height), ""+x, cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapXBox.setDefaultFineFlag(true);
		this.mapYBox = new EntryBox(this.panels["main_panel"]["mapYEntry"],cc.size(this.panels["main_panel"]["mapYEntry"].getContentSize().width,this.panels["main_panel"]["mapYEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapYEntry"].getContentSize().height), ""+y, cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapYBox.setDefaultFineFlag(true);
		
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["okbtn"].getPositionX(),this.panels["main_panel"]["okbtn"].getPositionY(),this.panels["main_panel"]["okbtn"].getContentSize().width,this.panels["main_panel"]["okbtn"].getContentSize().height),truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()=="" || this.mapNumBox.getText()==null  || this.mapNumBox.getText()=="" || this.mapXBox.getText()==null || this.mapXBox.getText()=="" || this.mapYBox.getText()==null || this.mapYBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["position"]=indexFromPos(parseInt(this.mapXBox.getText()),(gridHeight)-parseInt(this.mapYBox.getText()));
			this.data["mapTo"]=parseInt(this.mapNumBox.getText());
			this.data["name"]=this.nameBox.getText();
			this.delegate.endedEdit(this.data);
			return true;
		}
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["cancelbtn"].getPositionX(),this.panels["main_panel"]["cancelbtn"].getPositionY(),this.panels["main_panel"]["cancelbtn"].getContentSize().width,this.panels["main_panel"]["cancelbtn"].getContentSize().height),truePos)){
			this.ignoreTerminate=true;
			var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}
	},
	
	willTerminate:function(ignoreTerminate){
		var self= this.delegate;
		if(ignoreTerminate){
			return;
		}
		this.delegate.scheduleOnce(function(){self.endedEdit(null)});
	},
	
});

InventoryPopup = Popup.extend({
	itemContext:null,

	getIdentifier:function(){
		return "Inventory";
	},
	
	getLayoutObject:function(){
		var inventory_panel = {};
		for(var x=0;x<5;x++){
			for(var y=0;y<8;y++){
				inventory_panel[(5 * y + x)+""]={
					size: cc.size(32,32),
					position: cc.p((x*40)+8,(((8-1)-y)*40)+40),
					isSprite:true,
					anchorPoint:cc.p(0,0),
					children:{	
						"stacklabelbg":{
							position: cc.p(1,1),
							size: cc.size(10,6),
							anchorPoint:cc.p(0,0),
							bg: cc.c4b(255,255,255,200),
							children:{
								"stacklabel":{
									label:"",
									fontSize:10,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0,0),
									position:cc.p(0,0),
								}
							}
						}
					}
				};
			}
		}
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						bg: cc.c4b(255,255,255,200),
						size: cc.size(208,328),
						children: inventory_panel
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,328),
						size: cc.size(208,32),
						bg: cc.c4b(255,0,0,200),
						children:{
							"header":{
								label:"Inventory",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(179,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
					"item_name":{
						position:cc.p(0,0),
						bg:cc.c4b(200,200,200,200),
						size:cc.size(64,16),
						visible:false,
						children:{
							"content":{
								label:"",
								fontSize:14,
								color:cc.c3b(0,0,0),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(32,8),
							}
						}
					},
					"control_menu":{
						position:cc.p(0,0),
						bg:cc.c4b(200,200,200,200),
						size:cc.size(96,48),
						visible:false,
						children:{
							"dropbtn":{
								position: cc.p(0,0),
								size: cc.size(96,24),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(200,200,200,200),
								children:{	
								"content":{
									label:"Drop",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0,0.5),
									position:cc.p(4,12),
									}
								}
							},
							"usebtn":{
								position: cc.p(0,24),
								size: cc.size(96,24),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(200,200,200,200),
								children:{	
								"content":{
									label:"Use",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0,0.5),
									position:cc.p(4,12),
									}
								}
							}
						}
					}
				}	
			}
		};
	},

	setStackableLabel:function(itemNum,amount){
		if(amount>1){
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setVisible(true);
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"]["stacklabel"].setString(amount);
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setContentSize(this.panels["main_panel"][(itemNum+"")]["stacklabelbg"]["stacklabel"].getContentSize());
		} else{
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setVisible(false);
		}
	},

	updateTileGrid:function(){
		var inventoryList = PlayersController.getYou().getInventory();

		for(var i=0;i<40;i++){
			if(inventoryList[i]){
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==inventoryList[i]["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				this.panels["main_panel"][(i+"")].setAnchorPoint(0,1);
				this.panels["main_panel"][(i+"")].setTexture(texture);
				this.panels["main_panel"][(i+"")].setTextureRect(cc.rect(inventoryList[i]["sprite"]["position"].x*32, (inventoryList[i]["sprite"]["position"].y*32),32,32));
				this.setStackableLabel(i,inventoryList[i]["amount"]);
			} else{
				this.panels["main_panel"][(i+"")].setTexture(null);
				this.setStackableLabel(i,0);
			}
		}
	},

	didBecomeActive:function(){
		this._super();
		this.updateTileGrid();
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		var menuPos = this.panels["control_menu"].convertToNodeSpace(pos);

		if(this.itemContext!=null){
			if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"]["dropbtn"].getPositionX(),this.panels["control_menu"]["dropbtn"].getPositionY(),this.panels["control_menu"]["dropbtn"].getContentSize().width,this.panels["control_menu"]["dropbtn"].getContentSize().height),menuPos)){
				PlayersController.getYou().dropItem(this.itemContext);
			}else if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"]["usebtn"].getPositionX(),this.panels["control_menu"]["usebtn"].getPositionY(),this.panels["control_menu"]["usebtn"].getContentSize().width,this.panels["control_menu"]["usebtn"].getContentSize().height),menuPos)){
				PlayersController.getYou().useItem(this.itemContext);
			}
			this.itemContext=null;
			this.panels["control_menu"].setVisible(false);
			return true;
		} 

		for(var i=0;i<40;i++){
			var reducer=0;
			if(this.panels["main_panel"][(i+"")].getAnchorPoint().y==1){
				reducer=32;
			}
			if(PlayersController.getYou().getInventory()[i] && cc.rectContainsPoint(cc.rect(this.panels["main_panel"][(i+"")].getPositionX(),this.panels["main_panel"][(i+"")].getPositionY()-reducer,this.panels["main_panel"][(i+"")].getContentSize().width,this.panels["main_panel"][(i+"")].getContentSize().height),truePos)){
				this.panels["control_menu"].setVisible(true);
				this.panels["control_menu"].setPosition(cc.p(this.panels["main_panel"][(i+"")].getPositionX()+28,this.panels["main_panel"][(i+"")].getPositionY()-(reducer!=0?40:0)-8));
				this.itemContext=i;
				return true;
			} else if(!PlayersController.getYou().getInventory()[i] && cc.rectContainsPoint(cc.rect(this.panels["main_panel"][(i+"")].getPositionX(),this.panels["main_panel"][(i+"")].getPositionY()-reducer,this.panels["main_panel"][(i+"")].getContentSize().width,this.panels["main_panel"][(i+"")].getContentSize().height),truePos)) {
				this.itemContext=null;
				return true;
			}	
		}
	},

	onMouseMoved:function(pos){
		var menuPos = this.panels["control_menu"].convertToNodeSpace(pos);
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		this.panels["control_menu"]["dropbtn"].setColor(cc.c4b(200,200,200,200));
		this.panels["control_menu"]["usebtn"].setColor(cc.c4b(200,200,200,200));
		this.panels["item_name"].setVisible(false);
		if(this.itemContext!=null){
			if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"]["dropbtn"].getPositionX(),this.panels["control_menu"]["dropbtn"].getPositionY(),this.panels["control_menu"]["dropbtn"].getContentSize().width,this.panels["control_menu"]["dropbtn"].getContentSize().height),menuPos)){
				this.panels["control_menu"]["dropbtn"].setColor(cc.c4b(255,0,0,255));
				this.panels["control_menu"]["usebtn"].setColor(cc.c4b(200,200,200,200));
			}else if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"]["usebtn"].getPositionX(),this.panels["control_menu"]["usebtn"].getPositionY(),this.panels["control_menu"]["usebtn"].getContentSize().width,this.panels["control_menu"]["usebtn"].getContentSize().height),menuPos)){
				this.panels["control_menu"]["usebtn"].setColor(cc.c4b(255,0,0,255));
				this.panels["control_menu"]["dropbtn"].setColor(cc.c4b(200,200,200,200));
			}
		} else{
			for(var i=0;i<40;i++){
				var reducer=0;
				if(this.panels["main_panel"][(i+"")].getAnchorPoint().y==1){
					reducer=32;
				}
				if(PlayersController.getYou().getInventory()[i] && cc.rectContainsPoint(cc.rect(this.panels["main_panel"][(i+"")].getPositionX(),this.panels["main_panel"][(i+"")].getPositionY()-reducer,this.panels["main_panel"][(i+"")].getContentSize().width,this.panels["main_panel"][(i+"")].getContentSize().height),truePos)){
					this.panels["item_name"]["content"].setString(PlayersController.getYou().getInventory()[i]["name"]);
					this.panels["item_name"].setVisible(true);
					this.panels["item_name"].setContentSize(this.panels["item_name"]["content"].getContentSize());
					this.panels["item_name"]["content"].setPositionX(this.panels["item_name"]["content"].getContentSize().width/2);
					this.panels["item_name"].setPosition(cc.p(this.panels["main_panel"][(i+"")].getPositionX()-(this.panels["item_name"]["content"].getContentSize().width/2)+16,this.panels["main_panel"][(i+"")].getPositionY()));
					return true;
				}
			}
		}


	},


});


BookPopup = Popup.extend({

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
						size: cc.size(512,320),
						bg: cc.c4b(0,0,100,200),
						children:{
							"pageBackbtn" : {
								position:cc.p(4,4),
								size:cc.size(96,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Previous Page",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(48,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"pageForwardbtn" : {
								position:cc.p(412,4),
								size:cc.size(96,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Next Page",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(48,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"pageSplitter" : {
								position:cc.p(254,0),
								size:cc.size(4,320),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
							},
							"leftPage":{
								label:"Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla Bla ",
								fontSize:18,
								anchorPoint:cc.p(0,1),
								position:cc.p(4,316),
								color:cc.c3b(255,255,255),
							}
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,320),
						size: cc.size(512,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Book Title",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(482,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}	
			}
		};
	},

	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["leftPage"].setDimensions(cc.size(248,0));
	},

});



EquipmentPopup = Popup.extend({

	getIdentifier:function(){
		return "Equipment";
	},
	
	getLayoutObject:function(){
		var itemBox = {
			size: cc.size(32,32),
			bg: cc.c4b(140,140,140,200),
		};
		var equipment_panel = {
			"head": merge_objects(itemBox,{ position:cc.p(88,128)}),
			"body": merge_objects(itemBox,{ position: cc.p(88,88)}),
			"legs": merge_objects(itemBox,{ position: cc.p(88,48)}),
			"feet": merge_objects(itemBox,{ position: cc.p(88,8)}),
			"weapon": merge_objects(itemBox,{ position: cc.p(48,88)}),
			"shield": merge_objects(itemBox,{ position: cc.p(128,88)}),
			"ammo": merge_objects(itemBox,{ position: cc.p(8,128)}),
		}
		
		return {
			"panels":{
				position:cc.p(100,300),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(168,168),
						bg: cc.c4b(255,255,255,200),
						children: equipment_panel,
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,168),
						size: cc.size(168,32),
						bg: cc.c4b(255,0,0,200),
						children:{	

							"header":{
								label:"Equipment",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(139,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}	
			}
		};
	},

});

MapEditor = Popup.extend({
	map:null,
	editMode:"tiles",
	lastTile:null,
	currentLayer:"ground1",
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	
	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(420,380),
						bg: cc.c4b(0,0,100,120),
						children: {
							"tab1":{
								children:{
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,336),
										texture:tileTextureList[0]["name"],
									},
									
									"textureleftbtn" : {
										position:cc.p(360,344),
										size:cc.size(16,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"<<",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"texturerightbtn" : {
										position:cc.p(472,344),
										size:cc.size(16,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:">>",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"textureName" : {
										position:cc.p(376,344),
										size:cc.size(96,32),
										bg: cc.c4b(255,255,255,170),
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
									
									"deletebtn" : {
										position:cc.p(360,308),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Erase",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"leftbtn" : {
										position:cc.p(0,16),
										size:cc.size(16,320),
										bg: cc.c4b(0,0,255,255),
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
										size:cc.size(16,320),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(16,336),
										size:cc.size(320,16),
										bg: cc.c4b(0,0,255,255),
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
										bg: cc.c4b(0,0,255,255),
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
									"fillbtn" : {
										position:cc.p(428,308),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fill",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"ground1btn" : {
										position:cc.p(360,278),
										size:cc.size(128,26),
										bg: cc.c4b(0,255,0,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"ground2btn" : {
										position:cc.p(360,248),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"groundShadowbtn" : {
										position:cc.p(360,218),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground Shadow",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask1btn" : {
										position:cc.p(360,188),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask2btn" : {
										position:cc.p(360,158),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask3btn" : {
										position:cc.p(360,128),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 3",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe1btn" : {
										position:cc.p(360,98),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe2btn" : {
										position:cc.p(360,68),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringeShadowbtn" : {
										position:cc.p(360,38),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe Shadow",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe3btn" : {
										position:cc.p(360,8),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 3",
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
										bg:cc.c4b(255,100,100,255),
									},
									"selectednode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										bg:cc.c4b(100,255,100,255),
									},
								}
							},
							"tab2":{
								children:{
									"blockbtn" : {
										position:cc.p(8,320),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Block",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"warpbtn" : {
										position:cc.p(8,280),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Warp",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"itembtn" : {
										position:cc.p(8,240),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Item",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"amountLabelHead":{
										visible:false,
										label:"Item Amount",
										fontSize:12,
										anchorPoint:cc.p(0,0),
										position: cc.p(100,342),
									},
									"amountLabel":{
										size: cc.size(60,32),
										position: cc.p(98,-1000000),
									},
								}
							},
							"tab3":{
								children:{
									"saveBack":{
										position:cc.p(0,78),
										size:cc.size(200,60),
										bg: cc.c4b(0,255,0,100),
										anchorPoint:cc.p(0,0),
									},
									"deleteback":{
										position:cc.p(0,138),
										size:cc.size(200,60),
										bg: cc.c4b(255,0,0,100),
										anchorPoint:cc.p(0,0),
									},
									"mapnumsback":{
										position:cc.p(0,198),
										size:cc.size(200,162),
										bg: cc.c4b(0,0,0,170),
										anchorPoint:cc.p(0,0),
									},
									"mapUp_text":{
										label:"Map Up",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,344),
									},
									"mapUp_entry":{
										size: cc.size(60,32),
										position: cc.p(70,312),
									},
									"mapDown_text":{
										label:"Map Down",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,232),
									},
									"mapDown_entry":{
										size: cc.size(60,32),
										position: cc.p(70,200),
									},
									"mapLeft_text":{
										label:"Map Left",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(38,290),
									},
									"mapLeft_entry":{
										size: cc.size(60,32),
										position: cc.p(8,258),
									},
									"mapRight_text":{
										label:"Map Right",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(162,290),
									},
									"mapRight_entry":{
										size: cc.size(60,32),
										position: cc.p(132,258),
									},
									"this_map":{
										position:cc.p(70,248),
										size:cc.size(60,60),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"THIS MAP\n#"+ GameMap.getMapNumber(),
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(30,30),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clearbtn" : {
										position:cc.p(70,150),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Clear",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clear_text":{
										label:"Clear Map: You sure?",
										fontSize:14,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,182),
									},
									"clearbtnNo" : {
										position:cc.p(10,150),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"NO",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clearbtnYes" : {
										position:cc.p(130,150),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"YES",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"savebtn" : {
										position:cc.p(70,90),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Save",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"save_text":{
										label:"Save Map: You sure?",
										fontSize:14,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,122),
									},
									"savebtnNo" : {
										position:cc.p(10,90),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"NO",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"savebtnYes" : {
										position:cc.p(130,90),
										size:cc.size(60,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"YES",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"saveOnExit" : {
										position:cc.p(40,30),
										size:cc.size(120,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0.5,0),
										children:{
											"content":{
												label:"",
												fontSize:14,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(60,15),
												color:cc.c3b(0,0,0),
											}
										}
									},
								}
							},
							"tab1Clickable":{
								position:cc.p(0,360),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Editor",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab2Clickable":{
								position:cc.p(64,360),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Scripts",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab3Clickable":{
								position:cc.p(128,360),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Settings",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							}
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,380),
						size: cc.size(420,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Map Editor - Map #" + GameMap.getMapNumber(),
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(391,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}
			}
		};
	},
	
	getIdentifier:function(){
		return "MapEditor";
	},
	mapOffset:null,
	mapUpBox:null,
	mapDownBox:null,
	mapLeftBox:null,
	mapRightBox:null,
	itemAmountBox:null,
	tabWidths:null,
	currentTab:0,
	typeData:null,
	
	init:function(_map){
		this._super();
		this.map =_map;
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,496,200,200];
	},
	
	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
		this.mapUpBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapUp_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().height), GameMap.hasMapUp() ? GameMap.getMapUp():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapUpBox.setDefaultFineFlag(true);
		this.mapUpBox.setNullAllowed(true);
		this.mapDownBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapDown_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().height), GameMap.hasMapDown() ? GameMap.getMapDown():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapDownBox.setDefaultFineFlag(true);
	    this.mapDownBox.setNullAllowed(true);
		this.mapLeftBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapLeft_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().height), GameMap.hasMapLeft() ? GameMap.getMapLeft():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapLeftBox.setDefaultFineFlag(true);
		this.mapLeftBox.setNullAllowed(true);
		this.mapRightBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapRight_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().height), GameMap.hasMapRight() ? GameMap.getMapRight():"" , cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapRightBox.setDefaultFineFlag(true);
		this.mapRightBox.setNullAllowed(true);
		this.itemAmountBox = new EntryBox(this.panels["main_panel"]["tab2"]["amountLabel"],cc.size(this.panels["main_panel"]["tab2"]["amountLabel"].getContentSize().width,this.panels["main_panel"]["tab2"]["amountLabel"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["amountLabel"].getContentSize().height), GameMap.hasMapRight() ? GameMap.getMapRight():"1" , cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.itemAmountBox.setDefaultFineFlag(true);
		this.itemAmountBox.setNullAllowed(true);
		this.showAreYouSureClear(false);
		this.showAreYouSureSave(false);
		this.saveOnExit=LocalStorage.getMapSaveOnExit();
		this.setSaveMapOnExit(this.saveOnExit);
		this.setTab(1);
		this.updateMapOffset();
		GameMap.setStringsVisible(true);
	},
	
	setTypeData:function(value,data){
		if(Warpeditor){
			Warpeditor.willTerminate();
			this.scheduleOnce(function(){Warpeditor.removeFromParent(); Warpeditor=null;});
			this.typeData=value;
			this.setTouchEnabled(true);
		}
		if(Itemeditor){
			Itemeditor.willTerminate();
			this.scheduleOnce(function(){Itemeditor.removeFromParent(); Itemeditor=null;});
			this.typeData=value;
			this.setTouchEnabled(true);
			this.itemAmountBox.inputBox.setText("1");
			if(data["stackable"]==true){
				this.panels["main_panel"]["tab2"]["amountLabelHead"].setVisible(true);
				this.panels["main_panel"]["tab2"]["amountLabel"].setPosition(98,308);
			}
		}
	},
	
	willTerminate:function(){
		if(this.saveOnExit==true){
			GameMap.setMapInfo({"up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText()});
			GameMap.updateServer();
		}
		GameMap.setStringsVisible(false);
	},
	
	onMouseMoved:function(pos){
		if(this.currentTab==1){
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+16;
				
				this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(127);
				this.panels["main_panel"]["tab1"]["highlightnode"].setPosition(truePos);
				return true;
			}
		}		
	},
	
	setTab:function(value){
		if(value!=this.currentTab){
			this.panels["main_panel"].setContentSize(this.tabWidths[value],this.panels["main_panel"].getContentSize().height);
			this.panels["control_panel"].setContentSize(this.tabWidths[value],this.panels["control_panel"].getContentSize().height);
			if(this.currentTab==3 || this.currentTab==0){
				this.panels["main_panel"]["tab3"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapUp_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapDown_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapRight_entry"].getPositionX()-1000);
			}
			if(this.currentTab==1){
				if(this.editMode=="erasing" || this.editMode=="tiles"){
					this.editMode="blocking";
				}
			}
			if(this.currentTab==2){
				if(this.editMode=="blocking"){
					this.editMode="tiles";
				}
			}
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false)
			this.panels["main_panel"]["tab3"].setVisible(false);
			this.panels["main_panel"]["tab1Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab2Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab3Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab"+value].setVisible(true);
			this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
			if(value==3){
				this.panels["main_panel"]["tab3"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapUp_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapDown_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapRight_entry"].getPositionX()+1000);
			}
			this.panels["control_panel"]["exitBtn"].setPositionX(this.tabWidths[value]-29);
		}
	},
	
	setSaveMapOnExit:function(value){
		LocalStorage.setMapSaveOnExit(value);
		this.saveOnExit=value;
		if(value=="true" || value==true){
			this.panels["main_panel"]["tab3"]["saveOnExit"].setColor(cc.c3b(0,255,0));
			this.panels["main_panel"]["tab3"]["saveOnExit"]["content"].setString("Save on exit: YES");
		} else{
			this.panels["main_panel"]["tab3"]["saveOnExit"].setColor(cc.c3b(255,0,0));
			this.panels["main_panel"]["tab3"]["saveOnExit"]["content"].setString("Save on exit: NO");
		}
	},
	
	updateMapOffset:function(){
		if(this.panels["main_panel"]["tab1"]["tiles"].getTexture() && this.panels["main_panel"]["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(32*this.mapOffset.x),Math.floor(32*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:320));
		} else{
			this.schedule(this.updateMapOffset);
		}
	},
	
	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1Clickable"].getPositionX(),this.panels["main_panel"]["tab1Clickable"].getPositionY(),this.panels["main_panel"]["tab1Clickable"].getContentSize().width,this.panels["main_panel"]["tab1Clickable"].getContentSize().height),truePos)){
			this.setTab(1);
			return true;
		}		
		
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2Clickable"].getPositionX(),this.panels["main_panel"]["tab2Clickable"].getPositionY(),this.panels["main_panel"]["tab2Clickable"].getContentSize().width,this.panels["main_panel"]["tab2Clickable"].getContentSize().height),truePos)){
			this.setTab(2);
			return true;
		}
	
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab3Clickable"].getPositionX(),this.panels["main_panel"]["tab3Clickable"].getPositionY(),this.panels["main_panel"]["tab3Clickable"].getContentSize().width,this.panels["main_panel"]["tab3Clickable"].getContentSize().height),truePos)){
			this.setTab(3);
			return true;
		}
		
		if(this.currentTab==1){
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["leftbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["leftbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["leftbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["leftbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x>0){
					this.mapOffset.x--;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["rightbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["rightbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["rightbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["rightbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-320)/32)){
					this.mapOffset.x++;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["upbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["upbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["upbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["upbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y>0){
					this.mapOffset.y--;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["downbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["downbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["downbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["downbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/32)){
					this.mapOffset.y++;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["ground1btn"].getPositionX(),this.panels["main_panel"]["tab1"]["ground1btn"].getPositionY(),this.panels["main_panel"]["tab1"]["ground1btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["ground1btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("ground1");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["ground2btn"].getPositionX(),this.panels["main_panel"]["tab1"]["ground2btn"].getPositionY(),this.panels["main_panel"]["tab1"]["ground2btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["ground2btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("ground2");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["groundShadowbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["groundShadowbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["groundShadowbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["groundShadowbtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("groundShadow");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["mask1btn"].getPositionX(),this.panels["main_panel"]["tab1"]["mask1btn"].getPositionY(),this.panels["main_panel"]["tab1"]["mask1btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["mask1btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("mask1");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["mask2btn"].getPositionX(),this.panels["main_panel"]["tab1"]["mask2btn"].getPositionY(),this.panels["main_panel"]["tab1"]["mask2btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["mask2btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("mask2");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["mask3btn"].getPositionX(),this.panels["main_panel"]["tab1"]["mask3btn"].getPositionY(),this.panels["main_panel"]["tab1"]["mask3btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["mask3btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("mask3");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["fringe1btn"].getPositionX(),this.panels["main_panel"]["tab1"]["fringe1btn"].getPositionY(),this.panels["main_panel"]["tab1"]["fringe1btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["fringe1btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("fringe1");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["fringe2btn"].getPositionX(),this.panels["main_panel"]["tab1"]["fringe2btn"].getPositionY(),this.panels["main_panel"]["tab1"]["fringe2btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["fringe2btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("fringe2");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["fringeShadowbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["fringeShadowbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["fringeShadowbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["fringeShadowbtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("fringeShadow");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["fringe3btn"].getPositionX(),this.panels["main_panel"]["tab1"]["fringe3btn"].getPositionY(),this.panels["main_panel"]["tab1"]["fringe3btn"].getContentSize().width,this.panels["main_panel"]["tab1"]["fringe3btn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("fringe3");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["texturerightbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["texturerightbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["texturerightbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["texturerightbtn"].getContentSize().height),truePos)){
				this.useNextTexture();
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["textureleftbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["textureleftbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["textureleftbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["textureleftbtn"].getContentSize().height),truePos)){
				this.usePrevTexture();
				return true;
			}
			SceneManager.setActiveScene(this);
			truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+16;
				
				if(this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["tab1"]["selectednode"].setPosition(truePos);
				} else{
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
				}
				return true;
			} 
			
			var globalErasePos = this.panels["main_panel"]["tab1"]["deletebtn"].convertToWorldSpace(cc.p(0,0));
			if(cc.rectContainsPoint(cc.rect(globalErasePos.x,globalErasePos.y,this.panels["main_panel"]["tab1"]["deletebtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["deletebtn"].getContentSize().height),touch._point)){
				this.editMode=this.editMode=="erasing" ? "tiles" : "erasing";
				if(this.editMode=="erasing"){
					this.panels["main_panel"]["tab1"]["fillbtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab1"]["deletebtn"].setColor(cc.c4b(255,0,0,255));
				} else{
					this.panels["main_panel"]["tab1"]["deletebtn"].setColor(cc.c4b(255,255,255,255));
				}
				return true;
			}
			
			var globalFillPos = this.panels["main_panel"]["tab1"]["fillbtn"].convertToWorldSpace(cc.p(0,0));
			if(cc.rectContainsPoint(cc.rect(globalFillPos.x,globalFillPos.y,this.panels["main_panel"]["tab1"]["fillbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["fillbtn"].getContentSize().height),touch._point)){
				if(this.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
					GameMap.fillMap(tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,(9-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/32))+this.mapOffset.y),this.data["currentLayer"]);
					GameMap.updateMap();
				}
				return true;
			}
		}
		if(this.currentTab==2){			
			var globalBlockPos = this.panels["main_panel"]["tab2"]["blockbtn"].convertToWorldSpace(cc.p(0,0));
			if(cc.rectContainsPoint(cc.rect(globalBlockPos.x,globalBlockPos.y,this.panels["main_panel"]["tab2"]["blockbtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["blockbtn"].getContentSize().height),touch._point)){
				this.editMode = this.editMode=="blocking" ? "tiles" : "blocking";
				if(this.editMode=="blocking"){
					this.panels["main_panel"]["tab2"]["blockbtn"].setColor(cc.c4b(255,0,0,255));
					this.panels["main_panel"]["tab2"]["warpbtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["itembtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["amountLabelHead"].setVisible(false);
					this.panels["main_panel"]["tab2"]["amountLabel"].setPosition(68,-100000);
				} else{
					this.panels["main_panel"]["tab2"]["blockbtn"].setColor(cc.c4b(255,255,255,255));
				}
				return true;
			}
			var globalWarpPos = this.panels["main_panel"]["tab2"]["warpbtn"].convertToWorldSpace(cc.p(0,0));
			if(cc.rectContainsPoint(cc.rect(globalWarpPos.x,globalWarpPos.y,this.panels["main_panel"]["tab2"]["warpbtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["warpbtn"].getContentSize().height),touch._point)){
				this.editMode = this.editMode=="warping" ? "tiles" : "warping";
				if(this.editMode=="warping"){
					if(Warpeditor!=null && !Warpeditor._parent) Warpeditor=null;
					if(Warpeditor){
						Warpeditor.willTerminate();
						Warpeditor.removeFromParent();
						Warpeditor=null;
					}
					Warpeditor = new ObjectList();
					Warpeditor.init({delegate:this,editor:new WarpEditorPopup(),list:ObjectLists.getWarpList(),name:"Warp List"});
					Warpeditor.didBecomeActive();
					this._parent.addChild(Warpeditor);
					this.setTouchEnabled(false);
					this.panels["main_panel"]["tab2"]["warpbtn"].setColor(cc.c4b(255,0,0,255));
					this.panels["main_panel"]["tab2"]["blockbtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["itembtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["amountLabelHead"].setVisible(false);
					this.panels["main_panel"]["tab2"]["amountLabel"].setPosition(68,-100000);
				} else{
					this.panels["main_panel"]["tab2"]["warpbtn"].setColor(cc.c4b(255,255,255,255));
				}
				return true;
			}
			var globalWarpPos = this.panels["main_panel"]["tab2"]["itembtn"].convertToWorldSpace(cc.p(0,0));
			if(cc.rectContainsPoint(cc.rect(globalWarpPos.x,globalWarpPos.y,this.panels["main_panel"]["tab2"]["itembtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["warpbtn"].getContentSize().height),touch._point)){
				this.editMode = this.editMode=="items" ? "tiles" : "items";
				if(this.editMode=="items"){
					if(Itemeditor!=null && !Itemeditor._parent) Itemeditor=null;
					if(Itemeditor){
						Itemeditor.willTerminate();
						Itemeditor.removeFromParent();
						Itemeditor=null;
					}
					Itemeditor = new ObjectList();
					Itemeditor.init({delegate:this,editor:new ItemEditor(),list:ObjectLists.getItemList(),name:"Item List"});
					Itemeditor.didBecomeActive();
					this._parent.addChild(Itemeditor);
					this.setTouchEnabled(false);
					this.panels["main_panel"]["tab2"]["itembtn"].setColor(cc.c4b(255,0,0,255));
					this.panels["main_panel"]["tab2"]["warpbtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["blockbtn"].setColor(cc.c4b(255,255,255,255));
				} else{
					this.panels["main_panel"]["tab2"]["itembtn"].setColor(cc.c4b(255,255,255,255));
					this.panels["main_panel"]["tab2"]["amountLabelHead"].setVisible(false);
					this.panels["main_panel"]["tab2"]["amountLabel"].setPosition(68,-1000000);
				}
				return true;
			}
		}
		
		if(this.currentTab==3){
			var globalClearPos = this.panels["main_panel"]["tab3"]["clearbtn"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["clearbtn"].isVisible() && cc.rectContainsPoint(cc.rect(globalClearPos.x,globalClearPos.y,this.panels["main_panel"]["tab3"]["clearbtn"].getContentSize().width,this.panels["main_panel"]["tab3"]["clearbtn"].getContentSize().height),touch._point)){
				this.showAreYouSureClear(true);
				return true;
			}
			var globalClearPos = this.panels["main_panel"]["tab3"]["clearbtnNo"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["clearbtnNo"].isVisible() && cc.rectContainsPoint(cc.rect(globalClearPos.x,globalClearPos.y,this.panels["main_panel"]["tab3"]["clearbtnNo"].getContentSize().width,this.panels["main_panel"]["tab3"]["clearbtnNo"].getContentSize().height),touch._point)){
				console.log("Closin");
				this.showAreYouSureClear(false);
				return true;
			}
			var globalClearPos = this.panels["main_panel"]["tab3"]["clearbtnYes"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["clearbtnYes"].isVisible() && cc.rectContainsPoint(cc.rect(globalClearPos.x,globalClearPos.y,this.panels["main_panel"]["tab3"]["clearbtnYes"].getContentSize().width,this.panels["main_panel"]["tab3"]["clearbtnYes"].getContentSize().height),touch._point)){
				GameMap.destroy();
				this.showAreYouSureClear(false);
				return true;
			}
			var globalSavePos = this.panels["main_panel"]["tab3"]["savebtn"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["savebtn"].isVisible() && cc.rectContainsPoint(cc.rect(globalSavePos.x,globalSavePos.y,this.panels["main_panel"]["tab3"]["savebtn"].getContentSize().width,this.panels["main_panel"]["tab3"]["savebtn"].getContentSize().height),touch._point)){
				this.showAreYouSureSave(true);
				return true;
			}
			var globalSavePos = this.panels["main_panel"]["tab3"]["savebtnNo"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["savebtnNo"].isVisible() && cc.rectContainsPoint(cc.rect(globalSavePos.x,globalSavePos.y,this.panels["main_panel"]["tab3"]["savebtnNo"].getContentSize().width,this.panels["main_panel"]["tab3"]["savebtnNo"].getContentSize().height),touch._point)){
				console.log("Closin");
				this.showAreYouSureSave(false);
				return true;
			}
			var globalSavePos = this.panels["main_panel"]["tab3"]["savebtnYes"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["savebtnYes"].isVisible() && cc.rectContainsPoint(cc.rect(globalSavePos.x,globalSavePos.y,this.panels["main_panel"]["tab3"]["savebtnYes"].getContentSize().width,this.panels["main_panel"]["tab3"]["savebtnYes"].getContentSize().height),touch._point)){
				GameMap.setMapInfo({"up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText()});
				GameMap.updateServer();
				this.showAreYouSureSave(false);
				return true;
			}
			
			var globalSavePos = this.panels["main_panel"]["tab3"]["saveOnExit"].convertToWorldSpace(cc.p(0,0));
			if(this.panels["main_panel"]["tab3"]["saveOnExit"].isVisible() && cc.rectContainsPoint(cc.rect(globalSavePos.x,globalSavePos.y,this.panels["main_panel"]["tab3"]["saveOnExit"].getContentSize().width,this.panels["main_panel"]["tab3"]["saveOnExit"].getContentSize().height),touch._point)){
				this.setSaveMapOnExit(!this.saveOnExit);
				return true;
			}
			
		}
		
		return false;
	},	
	
	updateCurrentLayer:function(layerName){
		this.panels["main_panel"]["tab1"]["ground1btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["ground2btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["groundShadowbtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["mask1btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["mask2btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["mask3btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["fringe1btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["fringe2btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["fringeShadowbtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"]["fringe3btn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab1"][layerName+"btn"].setColor(cc.c4b(0,255,0,255));
		this.data["currentLayer"]=layerName;
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=tileTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	showAreYouSureClear:function(visible){
		this.panels["main_panel"]["tab3"]["clearbtnYes"].setVisible(visible);
		this.panels["main_panel"]["tab3"]["clearbtnNo"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["clear_text"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["clearbtn"].setVisible(!visible);
	},
	
	showAreYouSureSave:function(visible){
		this.panels["main_panel"]["tab3"]["savebtnYes"].setVisible(visible);
		this.panels["main_panel"]["tab3"]["savebtnNo"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["save_text"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["savebtn"].setVisible(!visible);
	},
	
	tilePressed:function(tiles,tilenum,touchtype){
		if(tiles[tilenum]==this.lastTile && touchtype=="moved"){
			return false;
		}
		this.lastTile=tiles[tilenum];
		switch(this.editMode){
			case "tiles":
				if(this.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
					GameMap.setLayer(tilenum,tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,(9-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/32))+this.mapOffset.y),this.data["currentLayer"]);
				}
			break;
			case "blocking":
				if(tiles[tilenum].getType()!=1){
					GameMap.setTileInfo(tilenum,1);
				} else{
					GameMap.setTileInfo(tilenum,0);
				}
			break;
			case "warping":
				if(Warpeditor==null || !Warpeditor._parent){
					if(tiles[tilenum].getType()!=3){
						GameMap.setTileInfo(tilenum,3,this.typeData);
					} else{
						GameMap.setTileInfo(tilenum,0,null);
					}
				}
			break;
			case "items":
				if(Itemeditor==null || !Itemeditor._parent){
					if(tiles[tilenum].getType()!=4){
						GameMap.setTileInfo(tilenum,4,this.typeData,{"amount":this.itemAmountBox.getText()});
					} else{
						GameMap.setTileInfo(tilenum,0,null);
					}
				}
			break;
			case "erasing":
				GameMap.destroyLayer(tilenum,this.data["currentLayer"]);
			break;
		}
		
	}
});














































































ItemEditor = Popup.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	
	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(420,396),
						bg: cc.c4b(0,0,100,120),
						children: {
							"tab1":{
								children:{
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,320),
										texture:tileTextureList[0]["name"],
									},
									
									"textureleftbtn" : {
										position:cc.p(208,340),
										size:cc.size(16,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"<<",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"texturerightbtn" : {
										position:cc.p(320,340),
										size:cc.size(16,32),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:">>",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"textureName" : {
										position:cc.p(224,340),
										size:cc.size(96,32),
										bg: cc.c4b(255,255,255,170),
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
										position:cc.p(0,64),
										size:cc.size(16,252),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(336,64),
										size:cc.size(16,252),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(16,320),
										size:cc.size(320,16),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(16,48),
										size:cc.size(320,16),
										bg: cc.c4b(0,0,255,255),
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
									
									"highlightnode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										bg:cc.c4b(255,100,100,255),
									},
									"selectednode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										bg:cc.c4b(100,255,100,255),
									},
								}
							},
							"tab2":{
								children:{
									"itemdetailsback":{
										position:cc.p(144,0),
										size:cc.size(210,366),
										bg: cc.c4b(0,0,255,100),
										anchorPoint:cc.p(0,0),
									},
									"name_text":{
										label:"Item Name",
										fontSize:10,
										anchorPoint:cc.p(0,0),
										position: cc.p(8,344),
									},
									"name_entry":{
										size: cc.size(136,32),
										position: cc.p(4,312),
									},
									"currencybtn" : {
										position:cc.p(8,278),
										size:cc.size(128,26),
										bg: cc.c4b(0,255,0,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Currency",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"resourcebtn" : {
										position:cc.p(8,248),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Resource",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"consumablebtn" : {
										position:cc.p(8,218),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Consumable",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"bookbtn" : {
										position:cc.p(8,188),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Book",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"armourbtn" : {
										position:cc.p(8,158),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Armour",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"weaponbtn" : {
										position:cc.p(8,128),
										size:cc.size(128,26),
										bg: cc.c4b(255,255,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Weapon",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"tile" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(8,96),
										texture:tileTextureList[0]["name"],
									},
								}
							},
							"tab3":{
								children:{
									"saveBack":{
										position:cc.p(0,78),
										size:cc.size(200,60),
										bg: cc.c4b(0,255,0,100),
										anchorPoint:cc.p(0,0),
									},
									"deleteback":{
										position:cc.p(0,138),
										size:cc.size(200,60),
										bg: cc.c4b(255,0,0,100),
										anchorPoint:cc.p(0,0),
									},
									"mapnumsback":{
										position:cc.p(0,198),
										size:cc.size(200,162),
										bg: cc.c4b(0,0,0,170),
										anchorPoint:cc.p(0,0),
									},
								}
							},
							"tab1Clickable":{
								position:cc.p(0,376),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Sprite",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab2Clickable":{
								position:cc.p(64,376),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Details",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab3Clickable":{
								position:cc.p(128,376),
								size:cc.size(60,20),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Modifier",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"okbtn" : {
								position:cc.p(76,8),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"OK",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"cancelbtn" : {
								position:cc.p(8,8),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Cancel",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,396),
						size: cc.size(420,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Item Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(391,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
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
	tabWidths:null,
	currentTab:0,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.data={"itemType":"currency","subType":"","sprite":{"texture":tileTextureList[0]["name"],"position":{x:0,y:0}},"additionalData":{},"stackable":true, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.tabWidths=null,
		this.currentTab=0,
		this.delegate=null,
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,352,352,200];
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
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
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);

		for(var i in tileTextureList){
			if(tileTextureList[i]["name"]==this.data["sprite"]["texture"]){
				this.currentTextureNumber=i;
				this.currentTexture=tileTextureList[i]["name"];
			}
		}
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		
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
		this.panels["main_panel"]["tab1"]["selectednode"].setPosition(this.panels["main_panel"]["tab1"]["tiles"].getPosition().x+tilePos.x,this.panels["main_panel"]["tab1"]["tiles"].getPosition().y-(tilePos.y+32)) ;
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTextureRect(cc.rect(Math.floor(32*this.data["sprite"]["position"].x),Math.floor(32*this.data["sprite"]["position"].y),32,32));
		this.updateCurrentLayer(this.data["itemType"]);
		this.nameBox = new EntryBox(this.panels["main_panel"]["tab2"]["name_entry"],cc.size(this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.nameBox.setDefaultFineFlag(true);
		this.setTab(1);
		this.updateMapOffset();
	},

	setTextureFromStart:function(){

	},
	
	willTerminate:function(ignoreTerminate){
		if(this.delegate){
			var self= this.delegate;
			if(ignoreTerminate==true){
				return;
			}
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
		}
	},
	
	onMouseMoved:function(pos){
		if(this.currentTab==1){
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+64;
				
				this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(127);
				this.panels["main_panel"]["tab1"]["highlightnode"].setPosition(truePos);
				return true;
			}
		}		
	},
	
	setTab:function(value){
		if(value!=this.currentTab){
			this.panels["main_panel"].setContentSize(this.tabWidths[value],this.panels["main_panel"].getContentSize().height);
			this.panels["control_panel"].setContentSize(this.tabWidths[value],this.panels["control_panel"].getContentSize().height);
			this.panels["main_panel"]["tab2"]["name_entry"].setPositionX(this.panels["main_panel"]["tab2"]["name_entry"].getPositionX()-1000);
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false)
			this.panels["main_panel"]["tab3"].setVisible(false);
			this.panels["main_panel"]["tab1Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab2Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab3Clickable"].setColor(cc.c4b(255,255,255,255));
			this.panels["main_panel"]["tab"+value].setVisible(true);
			this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
			if(value==2){
				this.panels["main_panel"]["tab2"]["name_entry"].setPositionX(8);
			}
			this.panels["control_panel"]["exitBtn"].setPositionX(this.tabWidths[value]-29);
		}
	},
	
	updateMapOffset:function(){
		if(this.panels["main_panel"]["tab1"]["tiles"].getTexture() && this.panels["main_panel"]["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(32*this.mapOffset.x),Math.floor(32*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<256?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:256));
		} else{
			this.schedule(this.updateMapOffset);
		}
	},
	
	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1Clickable"].getPositionX(),this.panels["main_panel"]["tab1Clickable"].getPositionY(),this.panels["main_panel"]["tab1Clickable"].getContentSize().width,this.panels["main_panel"]["tab1Clickable"].getContentSize().height),truePos)){
			this.setTab(1);
			return true;
		}		
		
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2Clickable"].getPositionX(),this.panels["main_panel"]["tab2Clickable"].getPositionY(),this.panels["main_panel"]["tab2Clickable"].getContentSize().width,this.panels["main_panel"]["tab2Clickable"].getContentSize().height),truePos)){
			this.setTab(2);
			return true;
		}
	
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab3Clickable"].getPositionX(),this.panels["main_panel"]["tab3Clickable"].getPositionY(),this.panels["main_panel"]["tab3Clickable"].getContentSize().width,this.panels["main_panel"]["tab3Clickable"].getContentSize().height),truePos)){
			this.setTab(3);
			return true;
		}
		
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["okbtn"].getPositionX(),this.panels["main_panel"]["okbtn"].getPositionY(),this.panels["main_panel"]["okbtn"].getContentSize().width,this.panels["main_panel"]["okbtn"].getContentSize().height),truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["name"]=this.nameBox.getText();
			this.delegate.endedEdit(this.data);
			return true;
		}
		if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["cancelbtn"].getPositionX(),this.panels["main_panel"]["cancelbtn"].getPositionY(),this.panels["main_panel"]["cancelbtn"].getContentSize().width,this.panels["main_panel"]["cancelbtn"].getContentSize().height),truePos)){
			this.ignoreTerminate=true;
			var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

		if(this.currentTab==1){
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["leftbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["leftbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["leftbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["leftbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>264 && this.mapOffset.x>0){
					this.mapOffset.x--;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["rightbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["rightbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["rightbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["rightbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-320)/32)){
					this.mapOffset.x++;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["upbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["upbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["upbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["upbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y>0){
					this.mapOffset.y--;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["downbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["downbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["downbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["downbtn"].getContentSize().height),truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/32)){
					this.mapOffset.y++;
					this.updateMapOffset();
				}
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["texturerightbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["texturerightbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["texturerightbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["texturerightbtn"].getContentSize().height),truePos)){
				this.useNextTexture();
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab1"]["textureleftbtn"].getPositionX(),this.panels["main_panel"]["tab1"]["textureleftbtn"].getPositionY(),this.panels["main_panel"]["tab1"]["textureleftbtn"].getContentSize().width,this.panels["main_panel"]["tab1"]["textureleftbtn"].getContentSize().height),truePos)){
				this.usePrevTexture();
				return true;
			}
			
			SceneManager.setActiveScene(this);
			truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+64;
				
				if(this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["tab1"]["selectednode"].setPosition(truePos);
				} else{
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
				}


				var pos = cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,((8-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-64)/32))+this.mapOffset.y)-1);
				this.panels["main_panel"]["tab2"]["tile"].setTextureRect(cc.rect(pos.x*32,pos.y*32,32,32));
				this.data["sprite"]["position"]=pos;

				return true;
			} 

		}
		if(this.currentTab==2){	
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["currencybtn"].getPositionX(),this.panels["main_panel"]["tab2"]["currencybtn"].getPositionY(),this.panels["main_panel"]["tab2"]["currencybtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["currencybtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("currency");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["resourcebtn"].getPositionX(),this.panels["main_panel"]["tab2"]["resourcebtn"].getPositionY(),this.panels["main_panel"]["tab2"]["resourcebtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["resourcebtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("resource");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["consumablebtn"].getPositionX(),this.panels["main_panel"]["tab2"]["consumablebtn"].getPositionY(),this.panels["main_panel"]["tab2"]["consumablebtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["consumablebtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("consumable");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["bookbtn"].getPositionX(),this.panels["main_panel"]["tab2"]["bookbtn"].getPositionY(),this.panels["main_panel"]["tab2"]["bookbtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["bookbtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("book");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["armourbtn"].getPositionX(),this.panels["main_panel"]["tab2"]["armourbtn"].getPositionY(),this.panels["main_panel"]["tab2"]["armourbtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["armourbtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("armour");
				return true;
			}
			if(cc.rectContainsPoint(cc.rect(this.panels["main_panel"]["tab2"]["weaponbtn"].getPositionX(),this.panels["main_panel"]["tab2"]["weaponbtn"].getPositionY(),this.panels["main_panel"]["tab2"]["weaponbtn"].getContentSize().width,this.panels["main_panel"]["tab2"]["weaponbtn"].getContentSize().height),truePos)){
				this.updateCurrentLayer("weapon");
				return true;
			}
		}	
		
		if(this.currentTab==3){
		}
		
		return false;
	},	
	
	updateCurrentLayer:function(layerName){
		switch(layerName){
			case "currency": this.data["stackable"]=true; break;
			case "resource": this.data["stackable"]=false; break;
			case "consumable": this.data["stackable"]=false; break;
			case "book": this.data["stackable"]=false; break;
			case "armour": this.data["stackable"]=false; break;
			case "weapon": this.data["stackable"]=false; break;
		}

		this.panels["main_panel"]["tab2"]["currencybtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"]["resourcebtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"]["consumablebtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"]["bookbtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"]["armourbtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"]["weaponbtn"].setColor(cc.c4b(255,255,255,255));
		this.panels["main_panel"]["tab2"][layerName+"btn"].setColor(cc.c4b(0,255,0,255));
		this.data["itemType"]=layerName;
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.data["sprite"]["texture"]=this.currentTexture;
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=tileTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
});