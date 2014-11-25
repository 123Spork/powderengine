Equipment=null;
EquipmentPanel = Popup.extend({
	getIdentifier:function(){
		return "Equipment";
	},
	getLayoutObject:function(){
		var equipment_panel={};
		equipment_panel["head"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(88,162),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["legs"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(88,82),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["feet"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(88,40),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["body"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(88,122),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["lArm"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(48,122),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["rArm"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(128,122),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		equipment_panel["mod"] = {
			texture:"GUI/defaultitem.png",
			position:cc.p(8,162),
			size: cc.size(32,32),
			anchorPoint:cc.p(0,1),
		};
		
		return {
			"panels":{
				position:cc.p(100,300),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(168,168),
						texture:"GUI/equipment.png",
						children: equipment_panel,
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,168),
						size: cc.size(168,32),
						children:{
							"header":{
								label:settingsData["Equipment Header"],
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(144,6),
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

	updateTileGrid:function(){
		var equipmentList = PlayersController.getYou().getEquipment();
		this.panels["main_panel"]["head"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["body"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["legs"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["feet"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["lArm"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["rArm"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		this.panels["main_panel"]["mod"].setTexture(cc.TextureCache.getInstance().addImage("GUI/defaultitem.png"));
		for(var i in equipmentList){
			if(equipmentList[i]){
				var item = ObjectLists.getItemList()[equipmentList[i]["number"]];
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==item["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				if(this.panels["main_panel"][i]){
					this.panels["main_panel"][i].setAnchorPoint(0,1);
					this.panels["main_panel"][i].setTexture(texture);
					this.panels["main_panel"][i].setTextureRect(cc.rect(item["sprite"]["position"].x*32, (item["sprite"]["position"].y*32),32,32));
				}
			}
		}
	},

	listItemSelected:function(val){
		switch(val){
			case 0:PlayersController.getYou().dequipItem(this.delegate.itemContext);break;
			case 1: PlayersController.getYou().dropItem(this.delegate.itemContext,"equipped"); break;
		}
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var truePos = this.panels["main_panel"].convertToNodeSpace(touch._point);
		var equipmentList = PlayersController.getYou().getEquipment();
		for(var i in equipmentList){
			if(equipmentList[i]){
				var item = ObjectLists.getItemList()[equipmentList[i]["number"]];
				var reducer= 32;
				if(isTouching(this.panels["main_panel"][i],cc.p(truePos.x,truePos.y+reducer))){
					this.itemContext=i;
					this.panels["item_name"].setVisible(false)
					var firstItem = settingsData["Item Dropdown Unequip"]+"";
					firstItem = firstItem.replace("<ITEM>",(item["name"]));
					var secondItem = settingsData["Item Dropdown Drop"]+"";
					secondItem = secondItem.replace("<ITEM>",(item["name"]));
					this.addChild(DropDownList.createWithListAndPosition(this,this.listItemSelected,[firstItem,secondItem],touch._point));
					return true;
				}
			}
		}
	},

	onMouseMoved:function(event){
		var pos = event.getLocation();
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		this.panels["item_name"].setVisible(false);
		  var equipmentList = PlayersController.getYou().getEquipment();
			for(var i in equipmentList){
				if(equipmentList[i]){
					var item = ObjectLists.getItemList()[equipmentList[i]["number"]];
					var reducer= 32;
					if(isTouching(this.panels["main_panel"][i],cc.p(truePos.x,truePos.y+reducer))){
						this.panels["item_name"]["content"].setString(item["name"]);
						this.panels["item_name"].setVisible(true);
						this.panels["item_name"].setContentSize(this.panels["item_name"]["content"].getContentSize());
						this.panels["item_name"]["content"].setPositionX(this.panels["item_name"]["content"].getContentSize().width/2);
						this.panels["item_name"].setPosition(cc.p(this.panels["main_panel"][i].getPositionX()-(this.panels["item_name"]["content"].getContentSize().width/2)+16,this.panels["main_panel"][i].getPositionY()));
						return true;
					}
				}
			}
	},

    scheduledupdateTileGrid:function(){
		if(this.panels["main_panel"]["head"].getTexture()){
			this.unschedule(this.scheduledupdateTileGrid);
			this.updateTileGrid();
		}
	},

	didBecomeActive:function(){
		this._super();
		if(!this.panels["main_panel"]["head"].getTexture()){
			this.schedule(this.scheduledupdateTileGrid);
		}else{
			this.updateTileGrid();
		}
	},
});