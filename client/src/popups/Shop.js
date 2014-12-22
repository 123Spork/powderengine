Shop=null;
ShopPanel = Popup.extend({
	itemContext:null,
	itemUse:false,
	listPanel:null,
	offerlistPanel:null,
	salelistPanel:null,

	selectedbuyitems:null,

	getIdentifier:function(){
		return "Shop";
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var list = ["Buy","Sell"];
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),118,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),118,1);
			element.setPosition(cc.p(0,0));						
			
			var text = cc.LabelTTF.create(list[i],"Arial",15);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(90,0));
			listnodes[i].setContentSize(118,text.getContentSize().height+8);

			if(this.currentTab==(i+1)){
				listnodes[i]=cc.LayerColor.create(cc.c4b(100,0,0,255),118,text.getContentSize().height+8);
				var selectedElement=cc.Sprite.createWithTexture(tc.addImage("GUI/selected.png"));
				selectedElement.setPosition(cc.p(94,((text.getContentSize().height+8)-20)/2));
				selectedElement.setAnchorPoint(cc.p(0,0));
				listnodes[i].addChild(selectedElement);
				text.setColor(cc.c3b(255,255,255));
			}
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
		}
		if(listnodes.length<1){
			listnodes[0]=cc.LayerColor.create(cc.c4b(0,0,0,0),420,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),212,1);
			element.setPosition(cc.p(4,0));						
			var questname = cc.LabelTTF.create("THERES NO QUESTS!","Arial",15);
			questname.setColor(cc.c3b(0,0,0));
			questname.setAnchorPoint(cc.p(0,0));
			questname.setPosition(cc.p(4,4));
			questname.setDimensions(cc.size(216,0));
			listnodes[0].setContentSize(216,questname.getContentSize().height+8);
			listnodes[0].addChild(questname);
			callBackList.push([]);
		}

		this.listPanel = this.panels["main_panel"]["buyselllist"];
		var self=this;
		this.listPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(216,height);
		};
		this.listPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.listPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.listPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.listPanel.runListCallBack=function(name,listelement,touch){
			if(name=="Use"){
				self.setTab(listelement+1);
				self.prepareList();
			}
		};
		this.listPanel.listView = ListView.create(this.listPanel);
		this.listPanel.listView.setCallBackList(callBackList);
		this.listPanel.addChild(this.listPanel.listView);
	},

	updateSaleList:function(){
		if(this.salelistPanel){
			this.salelistPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();

		var itemList = ObjectLists.getItemList();
		var contextList = [];
		for(var i in itemList){
			for(var j in itemList[i]["value"]){
				if(itemList[i]["value"][j]["shopid"]==this.shopid){
					contextList.push(itemList[i]["name"]);
					break;
				}
			}
		}



		var list = contextList;
		for(var i=0;i<list.length;i++){
			if(this.selectedbuyitems && this.selectedbuyitems[i] && this.selectedbuyitems[i]==true){
				listnodes[i]=cc.LayerColor.create(cc.c4b(255,255,255,127),218,32);
			}else{
				listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),218,32);
			}
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),218,1);
			element.setPosition(cc.p(0,0));						
			
			var text = cc.LabelTTF.create(list[i],"Arial",15);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(214,0));
			listnodes[i].setContentSize(218,text.getContentSize().height+8);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
		}

		this.salelistPanel = this.panels["main_panel"]["tab1"]["sale_list"];
		var self=this;
		this.salelistPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(218,height);
		};
		this.salelistPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.salelistPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.salelistPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.salelistPanel.runListCallBack=function(name,listelement,touch){
			if(!self.selectedbuyitems){
				self.selectedbuyitems=[];
				self.selectedbuyitems[listelement]=true;
			}
			else{
				self.selectedbuyitems[listelement]=!self.selectedbuyitems[listelement]
			}
			self.updateSaleList();
		};
		this.salelistPanel.listView = ListView.create(this.salelistPanel);
		this.salelistPanel.listView.setCallBackList(callBackList);
		this.salelistPanel.addChild(this.salelistPanel.listView);
	},


	updateOfferList:function(){
		if(this.offerlistPanel){
			this.offerlistPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var list = ["Buy","Sell"];
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),118,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),118,1);
			element.setPosition(cc.p(0,0));						
			
			var text = cc.LabelTTF.create(list[i],"Arial",15);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(90,0));
			listnodes[i].setContentSize(118,text.getContentSize().height+8);

			if(this.currentTab==(i+1)){
				listnodes[i]=cc.LayerColor.create(cc.c4b(100,0,0,255),118,text.getContentSize().height+8);
				var selectedElement=cc.Sprite.createWithTexture(tc.addImage("GUI/selected.png"));
				selectedElement.setPosition(cc.p(94,((text.getContentSize().height+8)-20)/2));
				selectedElement.setAnchorPoint(cc.p(0,0));
				listnodes[i].addChild(selectedElement);
				text.setColor(cc.c3b(255,255,255));
			}
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
		}
		if(listnodes.length<1){
			listnodes[0]=cc.LayerColor.create(cc.c4b(0,0,0,0),420,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),212,1);
			element.setPosition(cc.p(4,0));						
			var questname = cc.LabelTTF.create("THERES NO QUESTS!","Arial",15);
			questname.setColor(cc.c3b(0,0,0));
			questname.setAnchorPoint(cc.p(0,0));
			questname.setPosition(cc.p(4,4));
			questname.setDimensions(cc.size(216,0));
			listnodes[0].setContentSize(216,questname.getContentSize().height+8);
			listnodes[0].addChild(questname);
			callBackList.push([]);
		}

		this.offerlistPanel = this.panels["main_panel"]["tab2"]["offer_list"];
		var self=this;
		this.offerlistPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(216,height);
		};
		this.offerlistPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.offerlistPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.offerlistPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.offerlistPanel.runListCallBack=function(name,listelement,touch){
			if(name=="Use"){
				self.setTab(listelement+1);
				self.prepareList();
			}
		};
		this.offerlistPanel.listView = ListView.create(this.offerlistPanel);
		this.offerlistPanel.listView.setCallBackList(callBackList);
		this.offerlistPanel.addChild(this.offerlistPanel.listView);
	},
	
	getLayoutObject:function(){
		var inventory_panel = {};
		var bank_panel={};
		for(var x=0;x<5;x++){
			for(var y=0;y<8;y++){
				inventory_panel[(5 * y + x)+""]={
					size: cc.size(32,32),
					position: cc.p((x*40)+140,(((8-1)-y)*40)+80),
					texture:"GUI/defaultitem.png",
					anchorPoint:cc.p(0,1),
					children:{	
						"stacklabelbg":{
							position: cc.p(1,1),
							size: cc.size(10,6),
							anchorPoint:cc.p(0,0),
							color: cc.c4b(255,255,255,200),
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
						texture:"GUI/shop.png",
						size: cc.size(590,388),
						children: {
							"buyselllist":{
								size:cc.size(118,386),
								position:cc.p(2,2),
								anchorPoint:cc.p(0,0),
							},
							"tab2":{
								children:{
									"inventory":{
										children: inventory_panel
									},
									"inventory_label":{
										label:"Inventory",
										color:cc.c3b(255,255,255),
										position:cc.p(138,364),
										fontSize:16,
										anchorPoint:cc.p(0,0),
									},
									"offer_label":{
										label:"Offer",
										color:cc.c3b(255,255,255),
										position:cc.p(400,364),
										fontSize:16,
										anchorPoint:cc.p(0,0),
									},
									"offer_list":{
										size:cc.size(158,358),
										position:cc.p(389,1),	
									}
								}
							},
							"tab1":{
								children:{
									"inventory_label":{
										label:"Store Items",
										color:cc.c3b(255,255,255),
										position:cc.p(138,364),
										fontSize:16,
										anchorPoint:cc.p(0,0),
									},
									"offer_label":{
										label:"Price",
										color:cc.c3b(255,255,255),
										position:cc.p(400,364),
										fontSize:16,
										anchorPoint:cc.p(0,0),
									},
									"sale_list":{
										position:cc.p(127,2),
										size:cc.size(218,358),
									}
								}
							}
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,388),
						size: cc.size(590,32),
						children:{
							"header":{
								label:settingsData["Shop Header"],
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(566,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
							}
						}
					},
					"item_name":{
						position:cc.p(0,0),
						color:cc.c4b(200,200,200,200),
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
				}	
			}
		};
	},

	setInventoryStackableLabel:function(itemNum,amount){
		this.panels["main_panel"]["tab2"]["inventory"][(itemNum+"")]["stacklabelbg"].setVisible(false);
		if(amount>1){
			this.panels["main_panel"]["tab2"]["inventory"][(itemNum+"")]["stacklabelbg"].setVisible(true);
			this.panels["main_panel"]["tab2"]["inventory"][(itemNum+"")]["stacklabelbg"]["stacklabel"].setString(amount);
			this.panels["main_panel"]["tab2"]["inventory"][(itemNum+"")]["stacklabelbg"].setContentSize(this.panels["main_panel"]["tab2"]["inventory"][(itemNum+"")]["stacklabelbg"]["stacklabel"].getContentSize());
		}
	},

	updateTileGrid:function(){
		var inventoryList = PlayersController.getYou().getInventory();
		var bankList = PlayersController.getYou().getBank();

		for(var i=0;i<40;i++){
			if(inventoryList[i]){
				var item = ObjectLists.getItemList()[inventoryList[i]["number"]];
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==item["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				this.panels["main_panel"]["tab2"]["inventory"][(i+"")].setAnchorPoint(0,1);
				this.panels["main_panel"]["tab2"]["inventory"][(i+"")].setTexture(texture);
				this.panels["main_panel"]["tab2"]["inventory"][(i+"")].setTextureRect(cc.rect(item["sprite"]["position"].x*32, (item["sprite"]["position"].y*32),32,32));
				this.setInventoryStackableLabel(i,inventoryList[i]["amount"]);
			} else{
				this.panels["main_panel"]["tab2"]["inventory"][(i+"")].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
				this.setInventoryStackableLabel(i,0);
			}
		}

	},

	scheduledupdateTileGrid:function(){
		if(this.panels["main_panel"]["tab2"]["inventory"][(i+"")].getTexture()){
			this.unschedule(this.scheduledupdateTileGrid);
			this.updateTileGrid();
		}
	},

	didBecomeActive:function(){
		this._super();
		this.shopid=0;
		if(!this.panels["main_panel"]["tab2"]["inventory"][(i+"")].getTexture()){
			this.schedule(this.scheduledupdateTileGrid);
		}else{
			this.updateTileGrid();
		}
		this.setTab(2);
		this.prepareList();
	},

	setTab:function(value){
		this.currentTab=value;
		this.panels["main_panel"]["tab1"].setVisible(false);
		this.panels["main_panel"]["tab2"].setVisible(false);
		if(value==2){
			this.updateOfferList();
		}
		if(value==1){
			this.updateSaleList();
		}
		this.panels["main_panel"]["tab"+value].setVisible(true);
	},



	withdrawSelected:function(val){
		if(val==0){
			var itm = PlayersController.getYou().getBank()[this.delegate.itemContext];
			var itemList = ObjectLists.getItemList();
			PlayersController.getYou().addToInventory({"number":itm["number"],"amount":itm["amount"]});
			PlayersController.getYou().getBank().splice(this.delegate.itemContext,1);
			if(Inventory){
				Inventory.updateTileGrid();
			}
			if(Equipment){
				Equipment.updateTileGrid();
			}
			this.delegate.updateTileGrid();
		}
		this.delegate.itemContext=null;
	},

	depositSelected:function(val){
		if(val==0){
			var itm = PlayersController.getYou().getInventory()[this.delegate.itemContext];
			var itemList = ObjectLists.getItemList();
			var context=0;
			PlayersController.getYou().addToBank({"number":itm["number"],"amount":itm["amount"]});
			PlayersController.getYou().getInventory().splice(this.delegate.itemContext,1);
			if(Inventory){
				Inventory.updateTileGrid();
			}
			if(Equipment){
				Equipment.updateTileGrid();
			}
			this.delegate.updateTileGrid();
		}
		this.delegate.itemContext=null;
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var truePos = this.panels["main_panel"]["tab2"]["inventory"].convertToNodeSpace(touch._point);

		if(this.currentTab==1){
			var hasInventorySpace=false, hasBankSpace=false;
			for(var i=0;i<40;i++){
				if(!PlayersController.getYou().getInventory()[i]){
					hasInventorySpace=true;
					break;
				}
			}
			for(var i=0;i<40;i++){
				if(PlayersController.getYou().getInventory()[i]){
					var reducer= 32;
					if(isTouching(this.panels["main_panel"]["tab2"]["inventory"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
						this.addChild(DropDownList.createWithListAndPosition(this,this.depositSelected,["Deposit","Cancel"],touch._point,[{"enabled":hasInventorySpace},{"enabled":true}]));
						this.itemContext=i;
						this.panels["item_name"].setVisible(false)
						return true;
					}
				}
			}
		}
	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
		var truePos = this.panels["main_panel"]["tab2"]["inventory"].convertToNodeSpace(pos);
		if(this.currentTab==1){
			for(var i=0;i<40;i++){
				if(PlayersController.getYou().getInventory()[i]){
					var reducer= 32;
					if(isTouching(this.panels["main_panel"]["tab2"]["inventory"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
						this.panels["item_name"]["content"].setString(ObjectLists.getItemList()[PlayersController.getYou().getInventory()[i]["number"]]["name"]);
						this.panels["item_name"].setVisible(true);
						this.panels["item_name"].setContentSize(this.panels["item_name"]["content"].getContentSize());
						this.panels["item_name"]["content"].setPositionX(this.panels["item_name"]["content"].getContentSize().width/2);
						this.panels["item_name"].setPosition(cc.p(this.panels["main_panel"]["tab2"]["inventory"][(i+"")].getPositionX()-(this.panels["item_name"]["content"].getContentSize().width/2)+16,this.panels["main_panel"]["tab2"]["inventory"][(i+"")].getPositionY()));
						return true;
					}
				}
			}
		}
	},
});

