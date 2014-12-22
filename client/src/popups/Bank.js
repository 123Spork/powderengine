Bank=null;
BankPanel = Popup.extend({
	itemContext:null,
	itemUse:false,

	getIdentifier:function(){
		return "Bank";
	},
	
	getLayoutObject:function(){
		var inventory_panel = {};
		var bank_panel={};
		for(var x=0;x<5;x++){
			for(var y=0;y<8;y++){
				inventory_panel[(5 * y + x)+""]={
					size: cc.size(32,32),
					position: cc.p((x*40)+8,(((8-1)-y)*40)+40),
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

		for(var x=0;x<9;x++){
			for(var y=0;y<8;y++){
				bank_panel[(9 * y + x)+""]={
					size: cc.size(32,32),
					position: cc.p(220+((x*40)+8),(((8-1)-y)*40)+40),
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
						},
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
						texture:"GUI/bank.png",
						size: cc.size(590,348),
						children: {
							"inventory":{
								children: inventory_panel
							},
							"inventory_label":{
								label:settingsData["Bank Header"],
								color:cc.c3b(255,255,255),
								position:cc.p(8,324),
								fontSize:16,
								anchorPoint:cc.p(0,0),
							},
							"bank":{
								children:bank_panel
							},
							"bank_label":{
								label:"Stored",
								color:cc.c3b(255,255,255),
								position:cc.p(228,324),
								fontSize:16,
								anchorPoint:cc.p(0,0),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,348),
						size: cc.size(590,32),
						children:{
							"header":{
								label:settingsData["Bank Header"],
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
		this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"].setVisible(false);
		if(amount>1){
			this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"].setVisible(true);
			this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"]["stacklabel"].setString(amount);
			this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"].setContentSize(this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"]["stacklabel"].getContentSize());
		}
	},

	setBankStackableLabel:function(itemNum,amount){
		this.panels["main_panel"]["bank"][(itemNum+"")]["stacklabelbg"].setVisible(false);
		if(amount>1){
			this.panels["main_panel"]["bank"][(itemNum+"")]["stacklabelbg"].setVisible(true);
			this.panels["main_panel"]["bank"][(itemNum+"")]["stacklabelbg"]["stacklabel"].setString(amount);
			this.panels["main_panel"]["bank"][(itemNum+"")]["stacklabelbg"].setContentSize(this.panels["main_panel"]["inventory"][(itemNum+"")]["stacklabelbg"]["stacklabel"].getContentSize());
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
				this.panels["main_panel"]["inventory"][(i+"")].setAnchorPoint(0,1);
				this.panels["main_panel"]["inventory"][(i+"")].setTexture(texture);
				this.panels["main_panel"]["inventory"][(i+"")].setTextureRect(cc.rect(item["sprite"]["position"].x*32, (item["sprite"]["position"].y*32),32,32));
				this.setInventoryStackableLabel(i,inventoryList[i]["amount"]);
			} else{
				this.panels["main_panel"]["inventory"][(i+"")].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
				this.setInventoryStackableLabel(i,0);
			}
		}


		for(var i=0;i<72;i++){
			if(bankList[i]){
				var item = ObjectLists.getItemList()[bankList[i]["number"]];
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==item["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				this.panels["main_panel"]["bank"][(i+"")].setAnchorPoint(0,1);
				this.panels["main_panel"]["bank"][(i+"")].setTexture(texture);
				this.panels["main_panel"]["bank"][(i+"")].setTextureRect(cc.rect(item["sprite"]["position"].x*32, (item["sprite"]["position"].y*32),32,32));
				this.setBankStackableLabel(i,bankList[i]["amount"]);
			} else{
				this.panels["main_panel"]["bank"][(i+"")].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
				this.setBankStackableLabel(i,0);
			}
		}

	},

	scheduledupdateTileGrid:function(){
		if(this.panels["main_panel"]["inventory"][(i+"")].getTexture()){
			this.unschedule(this.scheduledupdateTileGrid);
			this.updateTileGrid();
		}
	},

	didBecomeActive:function(){
		this._super();
		if(!this.panels["main_panel"]["inventory"][(i+"")].getTexture()){
			this.schedule(this.scheduledupdateTileGrid);
		}else{
			this.updateTileGrid();
		}
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
		var truePos = this.panels["main_panel"]["inventory"].convertToNodeSpace(touch._point);

		var hasInventorySpace=false, hasBankSpace=false;
		for(var i=0;i<40;i++){
			if(!PlayersController.getYou().getInventory()[i]){
				hasInventorySpace=true;
				break;
			}
		}

		for(var i=0;i<72;i++){
			if(!PlayersController.getYou().getBank()[i]){
				hasBankSpace=true;
				break;
			}
		}


		for(var i=0;i<40;i++){
			if(PlayersController.getYou().getInventory()[i]){
				var reducer= 32;
				if(isTouching(this.panels["main_panel"]["inventory"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
					this.addChild(DropDownList.createWithListAndPosition(this,this.depositSelected,["Deposit","Cancel"],touch._point,[{"enabled":hasInventorySpace},{"enabled":true}]));
					this.itemContext=i;
					this.panels["item_name"].setVisible(false)
					return true;
				}
			}
		}

		for(var i=0;i<72;i++){
			if(PlayersController.getYou().getBank()[i]){
				var reducer= 32;
				if(isTouching(this.panels["main_panel"]["bank"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
					this.addChild(DropDownList.createWithListAndPosition(this,this.withdrawSelected,["Withdraw","Cancel"],touch._point,[{"enabled":hasBankSpace},{"enabled":true}]));
					this.itemContext=i;
					this.panels["item_name"].setVisible(false)
					return true;
				}
			}
		}

	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
		var truePos = this.panels["main_panel"]["inventory"].convertToNodeSpace(pos);
		for(var i=0;i<40;i++){
			if(PlayersController.getYou().getInventory()[i]){
				var reducer= 32;
				if(isTouching(this.panels["main_panel"]["inventory"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
					this.panels["item_name"]["content"].setString(ObjectLists.getItemList()[PlayersController.getYou().getInventory()[i]["number"]]["name"]);
					this.panels["item_name"].setVisible(true);
					this.panels["item_name"].setContentSize(this.panels["item_name"]["content"].getContentSize());
					this.panels["item_name"]["content"].setPositionX(this.panels["item_name"]["content"].getContentSize().width/2);
					this.panels["item_name"].setPosition(cc.p(this.panels["main_panel"]["inventory"][(i+"")].getPositionX()-(this.panels["item_name"]["content"].getContentSize().width/2)+16,this.panels["main_panel"]["inventory"][(i+"")].getPositionY()));
					return true;
				}
			}
		}
	},
});

