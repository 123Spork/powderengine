Shop=null;
ShopPanel = Popup.extend({
	itemContext:null,
	itemUse:false,
	listPanel:null,
	offerlistPanel:null,
	salelistPanel:null,
	contextList:null,
	amountList:null,
	maxAmount:null,
	offeritems:null,

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

	resetShop:function(){
		this.setTab(this.currentTab);
	},

	updateSaleList:function(){
		if(this.salelistPanel){
			this.salelistPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var itemList = ObjectLists.getItemList();
		this.maxAmount=[];
		if(this.currentTab==1){
			this.contextList = [];
			for(var i in itemList){
				for(var j in itemList[i]["value"]){
					if(itemList[i]["value"][j]["shopid"]==this.shopid && itemList[i]["value"][j]["sell"] && itemList[i]["value"][j]["sell"].length>0){
						this.contextList.push({name:itemList[i]["name"],value:itemList[i]["value"][j]});
						if(!this.amountList[this.contextList.length-1]){
							this.amountList[this.contextList.length-1]=1;
						}
						if(!this.maxAmount[this.contextList.length-1]){
							this.maxAmount[this.contextList.length-1]=-1;
						}
						break;
					}
				}
			}
		}else{
			var itemList = PlayersController.getYou().getInventory();
			this.contextList = [], items=[];
			gameitems = ObjectLists.getItemList();
			for(var i in itemList){
				if(itemList[i]){
					items.push(gameitems[itemList[i]["number"]]);
					if(!this.maxAmount[items.length-1]){
						this.maxAmount[items.length-1]=itemList[i]["amount"];
					}
				}else{
					items.push(null)
				}
			}
			for(var i in items){
				this.contextList.push(null);
				this.amountList.push(1);
				if(!items[i]){
					continue;
				}
				this.contextList[this.contextList.length-1]={name:items[i]["name"]+(this.maxAmount[i]>1 ? "("+this.maxAmount[i]+")":"")};
				for(var j in items[i]["value"]){
					if(items[i]["value"][j]["shopid"]==this.shopid && items[i]["value"][j]["buy"] && items[i]["value"][j]["buy"].length>0){
						this.contextList[this.contextList.length-1].value=items[i]["value"][j];
						this.amountList[this.contextList.length-1]=1;
						break;
					}
				}
			}

		}
		var list = this.contextList;
		for(var i=0;i<list.length;i++){
			if(list[i]==null){
				listnodes[i]=cc.Node.create();
				listnodes[i].setContentSize(0,0);
				callBackList.push([]);
				continue;
			}
			if(this.selectedbuyitems && this.selectedbuyitems[i] && this.selectedbuyitems[i]==true){
				listnodes[i]=cc.LayerColor.create(cc.c4b(255,255,255,127),218,32);
			}else{
				listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),218,32);
			}
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),218,1);
			element.setPosition(cc.p(0,0));						
			
			var text = cc.LabelTTF.create(list[i].name,"Arial",15);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(156,0));

			if(this.selectedbuyitems[i]==true){
				var valuebox = cc.LayerColor.create(cc.c4b(255,255,255,255),60,20);
				valuebox.setPosition(160,((text.getContentSize().height+8)/2)-10);
				listnodes[i].addChild(valuebox);
				var subtextbit = cc.LabelTTF.create("x"+this.amountList[i],"Arial",14);
				subtextbit.setPosition(4,3);
				valuebox.callBack="Edit";
				subtextbit.setAnchorPoint(cc.p(0,0));
				subtextbit.setColor(cc.c3b(0,0,0));
				valuebox.addChild(subtextbit);
			}

			listnodes[i].setContentSize(218,text.getContentSize().height+8);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].callBack="Use";
			if(this.selectedbuyitems[i]==true){
				callBackList.push([valuebox,listnodes[i]]);
			}else{
				callBackList.push([listnodes[i]]);
			}
		}

		this.salelistPanel = this.panels["main_panel"]["sale_list"];
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
		this.salelistPanel.runListCallBack=function(name,listelement,touch,object){
			switch(name){
				case "Use":
					if(!self.selectedbuyitems){
						self.selectedbuyitems=[];
						self.selectedbuyitems[listelement]=true;
					}
					else{
						self.selectedbuyitems[listelement]=!self.selectedbuyitems[listelement]
					}
					self.updateSaleList();
					self.updateOfferList();
				break;
				case "Edit":
					self.editingContext=listelement;
					self.resetValueBoxWithObject(object);
				break;
			}
		};
		this.salelistPanel.listView = ListView.create(this.salelistPanel);
		this.salelistPanel.listView.setCallBackList(callBackList);
		this.salelistPanel.addChild(this.salelistPanel.listView);
	},

	resetValueBoxWithObject:function(object){
		if(this.editBox){
			this.confirmEditBox();
		}
		this.editBox = new EntryBox(object,cc.size(object.getContentSize().width,object.getContentSize().height), cc.p(0,object.getContentSize().height), this.amountList[this.editingContext], cc.c4b(100,100,100), cc.c3b(255,255,255),false,null,this);
		this.editBox.setDefaultFineFlag(true);
		this.schedule(this.checkMouseDown);
	},

	checkMouseDown:function(){
		if(!mouseDown && this.editBox){
			this.editBox.setFocused(true)
			this.unschedule(this.checkMouseDown);
		}
	},

	hasActiveEditBox:function(){
		if(this.editBox){
			return true;
		}
		return false;
	},

	updateFromEnd:function(){
		this.confirmEditBox();
	},

	confirmEditBox:function(){
		if(parseInt(this.editBox.getText())>0 && ((parseInt(this.editBox.getText())<this.maxAmount[this.editingContext])||(this.maxAmount[this.editingContext]==-1))){
			this.amountList[this.editingContext]=parseInt(this.editBox.getText())
		}
		this.editBox.setFocused(false);
		this.editBox.removeFromParent();
		this.editBox=null;
		this.updateOfferList();
		this.updateSaleList();
	},

	updateOfferList:function(){
		if(this.offerlistPanel){
			this.offerlistPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var salelist=[];
		var list=[];
		var itemlist = ObjectLists.getItemList();
		var inventory = cloneObj(PlayersController.getYou().getInventory());

		for(var k=0;k<inventory.length;k++){
			if(!inventory[k]){
				continue;
			}
			for(var j=k+1;j<inventory.length;j++){
				if(!inventory[j]){
					continue;
				}
				if(inventory[k]["number"]==inventory[j]["number"]){
					inventory[k]["number"]=inventory[k]["number"]+inventory[j]["number"];
					inventory.splice(j,1);
				}
			}
		}

		for(var j in this.contextList){
			if(this.currentTab==1){
				if(this.contextList[j] && this.contextList[j].value){
					for(var i in this.contextList[j].value["sell"]){
						if(this.selectedbuyitems[j]==true){
							salelist.push({name:itemlist[this.contextList[j].value["sell"][i]["id"]]["name"],amount:this.contextList[j].value["sell"][i]["amount"]*this.amountList[j],number:this.contextList[j].value["sell"][i]["id"],deactivate:deactivate});
						}
					}
				}
			}else{
				if(this.contextList[j] && this.contextList[j].value){
					for(var i in this.contextList[j].value["buy"]){
						if(this.selectedbuyitems[j]==true){
							var deactivate = false;
							salelist.push({name:itemlist[this.contextList[j].value["buy"][i]["id"]]["name"],amount:this.contextList[j].value["buy"][i]["amount"]*this.amountList[j],number:this.contextList[j].value["buy"][i]["id"],deactivate:deactivate});
						}
					}
				}
			}
		}
		salelist.sort(function(a,b){
			return a.name>b.name;
		})

		for(var i=0;i<salelist.length;i++){
			for(var j=i+1;j<salelist.length;j++){
				if(salelist[i].number==salelist[j].number){
					salelist[i].amount = parseInt(salelist[i].amount)+parseInt(salelist[j].amount);
					salelist.splice(j,1);
					j--;
				}
			}
		}

		if(this.currentTab==1){
			for(var i=0;i<salelist.length;i++){
				var deactivate = true;
				for(var j=0;j<inventory.length;j++){
					if(!inventory[j]){
						continue;
					}
					if(inventory[j]["number"]==salelist[i].number){
						if(inventory[j]["amount"]>=salelist[i].amount){
							deactivate=false;
						}
						break;
					}
				}
				salelist[i].deactivate=deactivate;
			}
		}

		this.offeritems=salelist;
		list=salelist;

		this.panels["main_panel"]["confirm_button"].setVisible(true);
		if(list.length<1){
			this.panels["main_panel"]["confirm_button"].setVisible(false);
		}
		if(this.contextList && !this.saleWillHaveInventorySpace()){
			this.panels["main_panel"]["confirm_button"].setVisible(false);
			this.panels["main_panel"]["outofspacelabel"].setVisible(true);
		}else{
			this.panels["main_panel"]["outofspacelabel"].setVisible(false);
		}

		for(var i=0;i<list.length;i++){
			if(list[i].deactivate && list[i].deactivate==true){
				this.panels["main_panel"]["confirm_button"].setVisible(false);
				listnodes[i]=cc.LayerColor.create(cc.c4b(255,80,80,100),158,32);
			}else{
				listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),158,32);
			}
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),158,1);
			element.setPosition(cc.p(0,0));						
			
			var text = cc.LabelTTF.create(list[i].name,"Arial",15);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(90,0));


			var text2 = cc.LabelTTF.create("x"+list[i].amount,"Arial",15);
			text2.setColor(cc.c3b(0,0,0));
			text2.setAnchorPoint(cc.p(0,0));
			text2.setPosition(cc.p(102,4));
			text2.setDimensions(cc.size(54,0));



			listnodes[i].setContentSize(158,text.getContentSize().height+8);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
						listnodes[i].addChild(text2);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
		}
		
		this.offerlistPanel = this.panels["main_panel"]["offer_list"];
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
			/*if(name=="Use"){
				self.setTab(listelement+1);
				self.prepareList();
			}*/
		};
		this.offerlistPanel.listView = ListView.create(this.offerlistPanel);
		this.offerlistPanel.listView.setCallBackList(callBackList);
		this.offerlistPanel.addChild(this.offerlistPanel.listView);
	},
	
	getLayoutObject:function(){
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
							"sale_list":{
								position:cc.p(127,2),
								size:cc.size(218,358),
							},
							"offer_list":{
								size:cc.size(158,358),
								position:cc.p(389,1),	
							},
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
							"confirm_button":{
								size:cc.size(64,30),
								position:cc.p(435,8),
								color:cc.c3b(0,255,0),
								children:{
									"label":{
										label:"Confirm",
										color:cc.c3b(0,0,0),
										position:cc.p(6,8),
										anchorPoint:cc.p(0,0),
									}
								},
							},
							"outofspacelabel":{
								label:"Not enough inventory space for transaction.",
								color:cc.c3b(255,255,255),
								position:cc.p(6,8),
								anchorPoint:cc.p(0,0),
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
					
				}	
			}
		};
	},

	init:function(shopid){
		this._super();
		this.shopid=shopid;
	},

	didBecomeActive:function(){
		this._super();
		this.setTab(1);
		this.prepareList();
	},

	saleWillHaveInventorySpace:function(){
		var comingIn=0;
		var goingOut=0;
		var itemlist=ObjectLists.getItemList();
		var inventory=PlayersController.getYou().getInventory();
		var inventorySpace=0;
		for(var i in inventory){
			if(inventory[i]){
				inventorySpace++;
			}
		}
		inventorySpace=(40-inventorySpace);
		if(this.currentTab==1){
			for(var i=0;i<this.contextList.length;i++){
				if(this.selectedbuyitems[i]==true){
					comingIn+=this.amountList[i];
				}
			}
			var amountsToSell=[];
			for(var i=0;i<this.offeritems.length;i++){
				amountsToSell[this.offeritems[i].number]=this.offeritems[i].amount;
			}
			for(var j=0;j<inventory.length;j++){
				if(!inventory[j]){
					continue;
				}
				if(amountsToSell[inventory[j]["number"]]){
					if(inventory[j]["amount"]<=amountsToSell[inventory[j]["number"]]){
						amountsToSell[inventory[j]["number"]]-=inventory[j]["amount"];
						goingOut++;
					}
				}
			}
		}
		if(this.currentTab==2){
			for(var i=0;i<this.contextList.length;i++){
				if(this.selectedbuyitems[i]==true){
					if(inventory[i]["amount"]<=this.amountList[i]){
						goingOut++;
					}
				}
			}
			for(var i=0;i<this.offeritems.length;i++){
				comingIn+=this.offeritems[i].amount;
			}
		} 
		return inventorySpace>(comingIn-goingOut);
	},

	confirmPressed:function(){
		var itemlist=ObjectLists.getItemList();
		var inventory=PlayersController.getYou().getInventory();
		if(this.currentTab==1){
			for(var i=0;i<this.contextList.length;i++){
				var num=0;
				if(this.selectedbuyitems[i]==true){
					for(var j=0;j<itemlist.length;j++){
						if(itemlist[j]["name"]==this.contextList[i]["name"]){
							num=j;
							break;
						}
					}
					PlayersController.getYou().addInventoryItem({"number":j,"amount":this.amountList[i]})
				}
			}

			var amountsToSell=[];
			for(var i=0;i<this.offeritems.length;i++){
				amountsToSell[this.offeritems[i].number]=this.offeritems[i].amount;
			}

			for(var j=0;j<inventory.length;j++){
				if(!inventory[j]){
					continue;
				}
				if(amountsToSell[inventory[j]["number"]]){
					if(inventory[j]["amount"]>amountsToSell[inventory[j]["number"]]){
						inventory[j]["amount"]-=amountsToSell[inventory[j]["number"]];
						amountsToSell[inventory[j]["number"]]=0;
					}else if(inventory[j]["amount"]<=amountsToSell[inventory[j]["number"]]){
						amountsToSell[inventory[j]["number"]]-=inventory[j]["amount"];
						inventory[j]=null;
					}
				}
			}
			GameChat.addMessage("PURCHASE COMPLETE");
		}
		if(this.currentTab==2){
			for(var i=0;i<this.contextList.length;i++){
				if(this.selectedbuyitems[i]==true){
					if(inventory[i]["amount"]>this.amountList[i]){
						inventory[i]["amount"]-=this.amountList[i];
					}else{
						inventory[i]=null;
					}
				}
			}
			for(var i=0;i<this.offeritems.length;i++){
				PlayersController.getYou().addInventoryItem({"number":this.offeritems[i].number,"amount":this.offeritems[i].amount});
			}
		}
		if(Inventory){
			Inventory.updateTileGrid();
		}
		this.updateSaleList();
		this.updateOfferList();
		if(this.contextList && !this.saleWillHaveInventorySpace()){
			this.panels["main_panel"]["confirm_button"].setVisible(false);
			this.panels["main_panel"]["outofspacelabel"].setVisible(true);
		}else{
			this.panels["main_panel"]["outofspacelabel"].setVisible(false);
		}
	},

	setTab:function(value){
		this.currentTab=value;
		this.amountList=[];
		this.selectedbuyitems=[];
		if(value==2){
			this.panels["main_panel"]["inventory_label"].setString("Inventory");
			this.panels["main_panel"]["offer_label"].setString("Offer");
		}
		if(value==1){
			this.panels["main_panel"]["inventory_label"].setString("Store Items");
			this.panels["main_panel"]["offer_label"].setString("Price");
		}
		this.updateOfferList();
		this.updateSaleList();
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
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		if(isTouching(this.panels["main_panel"]["confirm_button"],truePos)){
			this.confirmPressed();
		}

	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
	},
});

