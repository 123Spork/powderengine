Inventory=null;
InventoryPanel = Popup.extend({
	itemContext:null,
	itemUse:false,

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
					texture:"GUI/defaultitem.png",
					anchorPoint:cc.p(0,1),
					children:{	
						"stacklabelbg":{
							position: cc.p(0,0),
							size: cc.size(10,12),
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
						texture:"GUI/inventory.png",
						size: cc.size(208,328),
						children: inventory_panel
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,328),
						size: cc.size(208,32),
						children:{
							"header":{
								label:settingsData["Inventory Header"],
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(184,6),
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

	setStackableLabel:function(itemNum,amount){
		this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setVisible(false);
		if(amount>1){
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setVisible(true);
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"]["stacklabel"].setString(amount);
			this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].setContentSize(this.panels["main_panel"][(itemNum+"")]["stacklabelbg"]["stacklabel"].getContentSize().width,	this.panels["main_panel"][(itemNum+"")]["stacklabelbg"].getContentSize().height);
		}
	},

	updateTileGrid:function(){
		var inventoryList = PlayersController.getYou().getInventory();

		for(var i=0;i<40;i++){
			if(inventoryList[i]){
				var item = ObjectLists.getItemList()[inventoryList[i]["number"]];
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==item["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				this.panels["main_panel"][(i+"")].setAnchorPoint(0,1);
				this.panels["main_panel"][(i+"")].setTexture(texture);
				this.panels["main_panel"][(i+"")].setTextureRect(cc.rect(item["sprite"]["position"].x*32, (item["sprite"]["position"].y*32),32,32));
				this.setStackableLabel(i,inventoryList[i]["amount"]);
			} else{
				this.panels["main_panel"][(i+"")].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
				this.setStackableLabel(i,0);
			}
		}
	},

	scheduledupdateTileGrid:function(){
		if(this.panels["main_panel"][(i+"")].getTexture()){
			this.unschedule(this.scheduledupdateTileGrid);
			this.updateTileGrid();
		}
	},

	didBecomeActive:function(){
		this._super();
		if(!this.panels["main_panel"][(i+"")].getTexture()){
			this.schedule(this.scheduledupdateTileGrid);
		}else{
			this.updateTileGrid();
		}
	},

	listItemSelected:function(val){
		switch(val){
			case 0:
				if(this.delegate.itemUse == true){
					PlayersController.getYou().useItem(this.delegate.itemContext);
				} else{
					PlayersController.getYou().dropItem(this.delegate.itemContext,"stored");
				} break;
			case 1: PlayersController.getYou().dropItem(this.delegate.itemContext,"stored"); break;
		}
		this.delegate.itemUse=false;
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var truePos = this.panels["main_panel"].convertToNodeSpace(touch._point);

		for(var i=0;i<40;i++){
			if(PlayersController.getYou().getInventory()[i]){
				var reducer= 32;
				if(isTouching(this.panels["main_panel"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
					var item = ObjectLists.getItemList()[PlayersController.getYou().getInventory()[i]["number"]];
					var scriptData=[];
					if(item["script"] && ObjectLists.getScriptList()[item["script"]]){
						scriptData = ObjectLists.getScriptList()[item["script"]]["data"];
					}
					if(!scriptData){
						continue;
					}
					for(var j=0;j<scriptData.length;j++){
						if(scriptData[j]["type"]=="Default Event"){
							var firstItem="Use Item";
							var defaultEvent = scriptData[j]["responses"];
							for(var k=0;k<defaultEvent.length;k++){
								console.log(defaultEvent[k]["type"]);
								switch(defaultEvent[k]["type"]){
									case "Equip Item":
										firstItem = settingsData["Item Dropdown Equip"]+"";
									break;
									case "Read Item":
										firstItem=settingsData["Item Dropdown Read"]+"";
									break;
								}						
							}
						}
					}
					
					var secondItem = settingsData["Item Dropdown Drop"]+"";
					secondItem = secondItem.replace("<ITEM>",(item["name"]));
					
					if(firstItem){
						this.itemUse=true;
						firstItem = firstItem.replace("<ITEM>",(item["name"]));
						this.addChild(DropDownList.createWithListAndPosition(this,this.listItemSelected,[firstItem,secondItem],touch._point));
					}else{
						this.addChild(DropDownList.createWithListAndPosition(this,this.listItemSelected,[secondItem],touch._point));
					}
					this.itemContext=i;
					this.panels["item_name"].setVisible(false)

					return true;
				}
			}
		}
	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		for(var i=0;i<40;i++){
			if(PlayersController.getYou().getInventory()[i]){
				var reducer= 32;
				if(isTouching(this.panels["main_panel"][(i+"")],cc.p(truePos.x,truePos.y+reducer))){
					this.panels["item_name"]["content"].setString(ObjectLists.getItemList()[PlayersController.getYou().getInventory()[i]["number"]]["name"]);
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

