Shop=null;
ShopPanel = Popup.extend({
	itemContext:null,
	itemUse:false,
	listPanel:null,
	offerlistPanel:null,
	salelistPanel:null,
	contextList:null,

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

	updateSaleList:function(){
		if(this.salelistPanel){
			this.salelistPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var itemList = ObjectLists.getItemList();

		if(this.currentTab==1){
			this.contextList = [];
			for(var i in itemList){
				for(var j in itemList[i]["value"]){
					if(itemList[i]["value"][j]["shopid"]==this.shopid && itemList[i]["value"][j]["sell"] && itemList[i]["value"][j]["sell"].length>0){
						this.contextList.push({name:itemList[i]["name"],value:itemList[i]["value"][j]});
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
				}
			}
			for(var i in items){
				for(var j in items[i]["value"]){
					if(items[i]["value"][j]["shopid"]==this.shopid && items[i]["value"][j]["buy"] && items[i]["value"][j]["buy"].length>0){
						this.contextList.push({name:items[i]["name"],value:items[i]["value"][j]});
						break;
					}
				}
			}

		}
		var list = this.contextList;
		for(var i=0;i<list.length;i++){
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
			text.setDimensions(cc.size(180,0));

			listnodes[i].setContentSize(218,text.getContentSize().height+8);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
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
		this.salelistPanel.runListCallBack=function(name,listelement,touch){
			if(!self.selectedbuyitems){
				self.selectedbuyitems=[];
				self.selectedbuyitems[listelement]=true;
			}
			else{
				self.selectedbuyitems[listelement]=!self.selectedbuyitems[listelement]
			}
			self.updateSaleList();
			self.updateOfferList();
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
		var salelist=[];
		var list=[];
		var itemlist = ObjectLists.getItemList();

		for(var j in this.contextList){
			if(this.currentTab==1){
				for(var i in this.contextList[j].value["sell"]){
					if(this.selectedbuyitems[j]==true){
						salelist.push({name:itemlist[this.contextList[j].value["sell"][i]["id"]]["name"],amount:this.contextList[j].value["sell"][i]["amount"],number:this.contextList[j].value["sell"][i]["id"]});
					}
				}
			}else{
				for(var i in this.contextList[j].value["buy"]){
					if( this.selectedbuyitems[j]==true){
						salelist.push({name:itemlist[this.contextList[j].value["buy"][i]["id"]]["name"],amount:this.contextList[j].value["buy"][i]["amount"],number:this.contextList[j].value["buy"][i]["id"]});
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

		list=salelist;


		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.LayerColor.create(cc.c4b(0,0,0,0),158,32);
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

	didBecomeActive:function(){
		this._super();
		this.shopid=0;
		this.setTab(2);
		this.prepareList();
	},

	setTab:function(value){
		this.currentTab=value;
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
	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
	},
});

