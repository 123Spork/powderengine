Character = cc.Sprite.extend({
	name:null,
	stats:null,
	textureData:null,
	animFrame:null,
	toPosition:null,
	isWalking:false,
	nameLabel:null,
	spriteFrame:null,
	isPlayer:false,
	isNPC:-1,
	status:null,
	onMap:null,
	path:null,
	facing:"DOWN",

	init:function(withData){
		this.setTextureData(withData.textureName,withData.spriteId);
		this.stats = new StatsController(withData.statData,this);
		this.addChild(this.stats);
		
		this.name = withData.name;
		if(withData.script){
			this.script=withData.script;
		}
		if(withData.isPlayer){
			this.isPlayer=withData.isPlayer;
		} if(withData.map){
			this.onMap=withData.map;
		} if(withData.isNPC!=null && withData.isNPC!=="undefined"){
			this.isNPC=withData.isNPC;
		}
		this.setAnchorPoint(0,1);
		this.nameLabel = cc.LabelTTF.create("","Arial",12);
		this.nameLabel.setAnchorPoint(0.5,0);
		this.nameLabel.setColor(255,0,0);
		this.nameLabel.setPosition(Math.floor(this.getContentSize().width/2),this.getContentSize().width+3);
		this.addChild(this.nameLabel);
		this.updateNameString();
	},
	
	getFacing:function(){
		return this.facing;
	},

	setMap:function(value){
		this.onMap=value;
	},
	
	getMap:function(){
	 return this.onMap;
	},
	
	updateStatus:function(status){
		if(status && status!=this.status){
			this.status = status;
		} else{
			this.status=null;
		}
		this.updateNameString();
	},
	
	updateNameString:function(){
		if(this.status!=null){
			this.nameLabel.setString(this.name+"-"+this.status);
		} else{
		    this.nameLabel.setString(this.name);
		}
	},
	
	getName:function(){
		return this.name;
	},
	
	setSpriteFrame:function(x,y,dir){
		this.setTextureRect(cc.rect(x*charactersize,((this.textureData.id*4)*charactersize)+(y*charactersize),charactersize,charactersize));
		this.spriteFrame=cc.p(x,y);
		this.facing=dir;
	},
	
	getSpriteFrame:function(x,y){
		return this.spriteFrame;
	},
	
	
	setTextureData:function(textureName, spriteId){
		this.textureData = {name:textureName, id:spriteId};
		this.setTexture(cc.TextureCache.getInstance().addImage(textureName));
		this.setSpriteFrame(1,0);
	},
	
	getGridPosition:function(){
		return cc.p(this.getPosition().x/cellsize,this.getPosition().y/cellsize);
	},
	
	animationCounter:((60/1000)*4),
	velocity: ((60/1000)*4),
	distToMove: 2,
	
	warpPlayer:function(data){
		var x=data["position"] % gridWidth;
		var y=Math.floor(data["position"]/gridWidth);
		this.setPosition(x*cellsize,y*cellsize);
		sendMessageToServer({"changemap":data["mapTo"], "setTo":data["position"]});
		GameMap.goToMap(data["mapTo"]);
		GameMap.goToOffsetFromPosition(x*cellsize,y*cellsize);
	},


	interactWithTile:function(){
		if(!this.isWalking){
			var gp = this.getGridPosition();
			var tile = GameMap.getTileNodeForXY(gp.x,gp.y);
			if(tile){
				if(tile.getTopItem()){
					this.pickupItem(tile.getTopItem());
				}
				if(tile.getScript()){
					handleScript("Interact On",tile,"Tile");
				}
			}
		}
	},

	interactWithGivenTile:function(tile){
		if(!tile){
			return;
		}
		if(!this.isWalking){
			if(tile){
				if(tile.getTopItem()){
					this.pickupItemFromTile(tile.getTopItem(),tile);
					return;
				}
				if(tile.getScript()){
					handleScript("Interact On",tile,"Tile");
				}
			}
		}
	},

	interactWithFacing:function(){
		if(!this.isWalking){
			var gp = this.getGridPosition();
			switch(this.facing){
				case "RIGHT": gp.x+=1; break;
				case "LEFT": gp.x-=1; break;
				case "UP": gp.y+=1;break;
				case "DOWN": gp.y-=1; break;
			}
				
			var npc = GameMap.getNPCForXY(gp.x,gp.y);
			if(npc){
				handleScript("Default Event",npc,"NPC"); return;
			}
			var tile = GameMap.getTileNodeForXY(gp.x,gp.y);
			if(tile){
				if(tile.getScript()){
					handleScript("Interact Facing",tile,"Tile");
				}
			}

		}
	},
	
	walk:function(dt){
		this.animationCounter+=dt;
		var pos = this.getPosition();
		var sf =this.getSpriteFrame();
		if(this.animationCounter>this.velocity){
			this.animationCounter=0;
			if(this.toPosition.x<pos.x){
				this.setSpriteFrame((sf.x+1)%3,1,"LEFT");
			} else if(this.toPosition.x>pos.x){
				this.setSpriteFrame((sf.x+1)%3,2,"RIGHT");
			} else if(this.toPosition.y<pos.y){
				this.setSpriteFrame((sf.x+1)%3,0,"DOWN");
			} else if(this.toPosition.y>pos.y){
				this.setSpriteFrame((sf.x+1)%3,3,"UP");
			}
		}
			
		if(this.toPosition.x<pos.x){
			this.setPositionX(pos.x-this.distToMove);
			if(this.isPlayer){
				GameMap.updateOffset(+this.distToMove,0);
			}
		} else if(this.toPosition.x>pos.x){
			this.setPositionX(pos.x+this.distToMove);
			if(this.isPlayer){
				GameMap.updateOffset(-this.distToMove,0);
			}
		} else if(this.toPosition.y<pos.y){
			this.setPositionY(pos.y-this.distToMove);
			if(this.isPlayer){
				GameMap.updateOffset(0,this.distToMove);
			}
		} else if(this.toPosition.y>pos.y){
			this.setPositionY(pos.y+this.distToMove);
			if(this.isPlayer){
				GameMap.updateOffset(0,-this.distToMove);
			}
		}
		if(pos.y==this.toPosition.y && pos.x==this.toPosition.x){
			this.isWalking=false;
			if(this.leavePosition){
				handleScript("On Leave",GameMap.getTileNodeForXY(this.leavePosition.x,this.leavePosition.y),"Tile");
			}
			this.leavePosition=null;
			handleScript("On Enter",GameMap.getTileNodeForXY(this.getGridPosition().x,this.getGridPosition().y),"Tile");
			this.unschedule(this.walk);
			if(this.path!=null){
				this.beginPathWalk();
			}
		}
	},
	
	walkTo:function(x,y){
		if(this.isVisible()==false){
			return;
		}
		var tile = GameMap.getTileNodeForXY(x,y);
		var sf = this.spriteFrame;
		var gp = this.getGridPosition();
		
		if(gp.x>x){
			this.setSpriteFrame(sf.x,1,"LEFT");
		} else if(gp.x<x){
			this.setSpriteFrame(sf.x,2,"RIGHT");
		} if(gp.y>y){
			this.setSpriteFrame(sf.x,0,"DOWN");
		} else if(gp.y<y){
			this.setSpriteFrame(sf.x,3,"UP");
		}
		if(!tile){
			if(Mapeditor!=null && !Mapeditor._parent) Mapeditor=null;
			if(this.isPlayer && Mapeditor==null){
				if(gp.x<x && GameMap.hasMapRight()){
					var newMapSize = GameMap.getMapSizeForIndex(GameMap.getMapRight());
					this.setPosition(0,cellsize*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapRight()), "setTo":((0) + ((y) * newMapSize.width))});
					GameMap.goToMapRight();
					GameMap.goToOffsetLeft();
				} else if(gp.x>x && GameMap.hasMapLeft()){
					var newMapSize = GameMap.getMapSizeForIndex(GameMap.getMapLeft());
					this.setPosition(cellsize*(newMapSize.width-1),cellsize*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapLeft()), "setTo":((newMapSize.width-1) + ((y) * newMapSize.width))});
					GameMap.goToMapLeft();
					GameMap.goToOffsetRight();
				} if(gp.y<y && GameMap.hasMapUp()){
					var newMapSize = GameMap.getMapSizeForIndex(GameMap.getMapUp());
					this.setPosition(cellsize*x,cellsize);
					sendMessageToServer({"changemap":parseInt(GameMap.getMapUp()), "setTo":((x) + ((1) * newMapSize.width))});
					GameMap.goToMapUp();
					GameMap.goToOffsetUp();
				} else if(gp.y>y && GameMap.hasMapDown()){
					var newMapSize = GameMap.getMapSizeForIndex(GameMap.getMapDown());
					sendMessageToServer({"changemap":parseInt(GameMap.getMapDown()),"setTo":((x) + ((newMapSize.height) * newMapSize.width))});
					this.setPosition(cellsize*x,cellsize*(newMapSize.height));
					GameMap.goToMapDown();
					GameMap.goToOffsetDown();
				}
			}
			return;
		}
		if(this.isWalking==false && tile){	
			if(gameMapInstance.isTileBlocked(tile)){
				return;
			}
			handleScript("Will Leave",GameMap.getTileNodeForXY(this.getGridPosition().x,this.getGridPosition().y),"Tile");
			this.leavePosition=cc.p(this.getGridPosition().x,this.getGridPosition().y);
			this.toPosition = cc.p(cellsize*x,cellsize*y);
			this.isWalking=true;
			handleScript("Will Enter",GameMap.getTileNodeForXY(x,y),"Tile");
			this.schedule(this.walk);
			this.walk(0);
			if(this.isPlayer){
				sendMessageToServer({"moveTo":((this.toPosition.x/cellsize) + ((this.toPosition.y/cellsize) * gridWidth))});
			} else if(this.isNPC>-1){
				sendMessageToServer({"npcID":(this.isNPC+""),"mapnumber":this.onMap, "moveNPC":((this.toPosition.x/cellsize) + ((this.toPosition.y/cellsize) * gridWidth))});
			}
		}
	},
	
	beginPathWalk:function(){
		if(this.path.length==0){
			this.path=null;
			return;
		}
		this.path.splice(0,1);
		if(this.path.length==0){
			this.path=null;
			return;
		}
		this.walkTo(this.path[0].x,this.path[0].y);
	},
	
	setWalkingPath:function(path){
		if(this.path!=null && path.length==0){
			return;
		}
		this.path=path;
		this.beginPathWalk();
	},

	walkToIndex:function(index){
		if(this.isVisible()==false){
			return;
		}
		var x=index % gridWidth;
		var y=Math.floor(index/gridWidth); 
		if(this.isWalking==false){
			var sf = this.spriteFrame;
			var gp = this.getGridPosition();
			if(Math.abs(cc.pDistance(cc.p(x,y),gp))>4){
				this.setPosition(cc.p(cellsize*x,cellsize*y));
				return;
			}
			if(gp.x>x){
				this.setSpriteFrame(sf.x,1,"LEFT");
			} else if(gp.x<x){
				this.setSpriteFrame(sf.x,2,"RIGHT");
			} else if(gp.y>y){
				this.setSpriteFrame(sf.x,0,"DOWN");
			} else if(gp.y<y){
				this.setSpriteFrame(sf.x,3,"UP");
			}
			this.toPosition = cc.p(cellsize*x,cellsize*y);
			this.isWalking=true;
			this.schedule(this.walk);
			this.walk(0);
		}
	}
});

PlayerCharacter = Character.extend({
	items:null,
	access:3,
	extraData:null,
	quests:null,
	init:function(withData){
		this._super(withData);
		this.extraData=[];
		this.quests=[];
		if(withData.access){
			this.access=withData.access;
		}
		this.items = {"stored":[], "equipped":{}, "bank":[]};
		if(withData.position){
			var mapSize = GameMap.getMapSizeForIndex(withData.map);
			var x=withData.position % mapSize.width;
			var y=Math.floor(withData.position/mapSize.width);
			this.setPosition(x*cellsize,y*cellsize);
			GameMap.goToMapWithoutPlayer(withData.map);
			GameMap.goToOffsetFromPosition(x*cellsize,y*cellsize);
			this.onMap=withData.map;
		}
		if(withData.inventory){
			this.items["stored"]=withData.inventory;
		}
		if(withData.bank){
			this.items["bank"]=withData.bank;
		}
		if(withData.extraData){
			this.extraData=withData.extraData;
		}
		if(withData.quests){
			this.quests=withData.quests;
		}
		if(withData.equipment){
			this.items["equipped"]=withData.equipment;
			for(var i in this.items["equipped"]){
				var item = this.items["equipped"][i];
				handleScript("Default Event",item,"Item",{"Equip Item":true,"Give /Take Item":true,"Warp Player":true,"Read Item":true,"Open/Close Panel":true,"Destroy":true});
			}
		}
		this.clearExtraData();
		
	},

	clearExtraData:function(){
		this.extraData=[];
		sendMessageToServer({
			"saveUserExtra":[],
			"name":this.getName(),
		});
	},

	setExtraData:function(scriptID,data){
		this.extraData[scriptID]=data;
		sendMessageToServer({
			"saveUserExtra":this.extraData,
			"name":this.getName(),
		});
	},

	getExtraData:function(scriptID){
		if(this.extraData[scriptID]){
			return this.extraData[scriptID];
		}
		return null;
	},

	setQuestData:function(questID,objectiveID){
		this.quests[questID]=objectiveID;
	},

	getQuestData:function(questID){
		return this.quests[questID];
	},

	updateItemData:function(name,item){
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
	},
	
	addToBank:function(data){
		var context=0;
		for(var i=0;i<72;i++){
			if(!this.items["bank"][i]){
				var context=i;
				break;
			}
		}
		this.items["bank"][context]=data;
	},

	addToInventory:function(data){
		var context=0;
		for(var i=0;i<this.items["stored"].length;i++){
			if(!this.items["stored"][i]){
				var context=i;
				break;
			}
		}
		this.items["stored"][context]=data;
	},

	addInventoryItem:function(ref){
		item=ObjectLists.getItemList()[ref.number];
		var gp = this.getGridPosition();
		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["number"]==ref.number){
					this.items["stored"][i]["amount"]+=ref.amount;
					if(Inventory){
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					return;
				}
			}
		}
			
		var added=false;
		var amount=ref.amount;
		for(var i=0;ref.amount>0;i++){
			if(this.items["stored"][i]==null){
				if(item["stackable"]==true){
					this.items["stored"][i]={"number":ref.number,"amount":ref.amount};
					if(Inventory){
						Inventory.setStackableLabel(i,ref.amount);	
					}
					var added=true;
					break;
				}else{
					ref.amount--;
					this.items["stored"][i]={"number":ref.number,"amount":1};
					if(Inventory){
						Inventory.setStackableLabel(i,ref.amount);	
					}
					var added=true;
				}
			}
		}
		if(added==false){
			GameChat.addMessage(settingsData["Inventory Full"]);
		}
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
	},

	pickupItem:function(ref){
		item=ObjectLists.getItemList()[ref.number];
		var gp = this.getGridPosition();
		handleScript("On Pickup",item,"Item");
		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["number"]==ref.number){
					this.items["stored"][i]["amount"]+=ref.amount;
					if(Inventory){
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					var string = settingsData["Item Pick Up"];
					string = string.replace("<ITEM>",item["name"]);
					GameChat.addMessage(string);
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
					return;
				}
			}
		}
			
		var added=false;
		var amount=ref.amount;
		for(var i=0;ref.amount>0;i++){
			if(this.items["stored"][i]==null){
				if(item["stackable"]==true){
					this.items["stored"][i]={"number":ref.number,"amount":ref.amount};
					if(Inventory){
						Inventory.setStackableLabel(i,ref.amount);	
					}
					var added=true;
					break;
				}else{
					ref.amount--;
					this.items["stored"][i]={"number":ref.number,"amount":1};
					if(Inventory){
						Inventory.setStackableLabel(i,ref.amount);	
					}
					var added=true;
				}
			}
		}
		if(added==false){
			GameChat.addMessage(settingsData["Inventory Full"]);
		}else{
			var string = settingsData["Item Pick Up"];
			string = string.replace("<ITEM>",item["name"]);
			GameChat.addMessage(string);
			sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
		}
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
	},

	pickupItemFromTile:function(ref,tile){
		item=ObjectLists.getItemList()[ref.number];
		var gp = cc.p(tile.getPositionX()/cellsize,tile.getPositionY()/cellsize);
		handleScript("On Pickup",item,"Item");
		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["number"]==ref.number){
					if(Inventory){
						this.items["stored"][i]["amount"] +=ref.amount;
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					var string = settingsData["Item Pick Up"];
					string = string.replace("<ITEM>",item["name"]);
					GameChat.addMessage(string);
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
					return;
				}
			}
		}
			
		var added=false;
		for(var i=0;i<40;i++){
			if(this.items["stored"][i]==null){
				this.items["stored"][i]={"number":ref.number,"amount":ref.amount};
				if(Inventory){
					Inventory.setStackableLabel(i,ref.amount);	
				}
				var string = settingsData["Item Pick Up"];
					string = string.replace("<ITEM>",item["name"]);
					GameChat.addMessage(string);
				sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
				var added=true;
				break;
			}
		}
		if(added==false){
			GameChat.addMessage(settingsData["Inventory Full"]);
		}
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
	},
	
	dropItem:function(itemnumber,itembox){
		var gp = this.getGridPosition();
		var itemref = this.items[itembox][itemnumber];
		var item = ObjectLists.getItemList()[itemref["number"]];
		handleScript("On Drop",item,"Item");
		if(this.items[itembox][itemnumber]){
			var string = settingsData["Item Dropped"];
			string= string.replace("<ITEM>",item["name"]);
					GameChat.addMessage(string);
			sendMessageToServer({"droppeditem":itemref["number"],"mapnumber":GameMap.getMapNumber(),"index":indexFromPos(gp.x,gp.y),"amount":itemref["amount"]});
			if(item["stackable"]==true && itemref["amount"]>1){
				Inventory.setStackableLabel(itemnumber,0);
			}
			this.items[itembox][itemnumber]=null;
		}
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
		if(Shop){
			Shop.resetShop();
		}
	},

	useItem:function(itemnumber){
		var item = ObjectLists.getItemList()[this.items["stored"][itemnumber]["number"]];
		handleScript("Default Event",item,"Item",{},itemnumber);
	},
	
	dequipItem:function(itemtype){
		for(var i=0;i<40;i++){
			if(this.items["stored"][i]==null){
				this.items["stored"][i] = cloneObj(this.items["equipped"][itemtype]);
				this.items["equipped"][itemtype]=null;
				if(Inventory){
					Inventory.updateTileGrid();
				}
				if(Equipment){
					Equipment.updateTileGrid();
				}
				handleScript("On Dequip",this.items["stored"][i],"Item")
				return;
			}
		}
		GameChat.addMessage("No space in inventory to dequip this item.");
	},	

	getInventory:function(){
		return this.items["stored"];
	},


	getBank:function(){
		return this.items["bank"];
	},

	getEquipment:function(){
		return this.items["equipped"];
	},
});
PlayerCharacter.create = function(withData){
	var playerCharacter = new PlayerCharacter();
	playerCharacter.init(withData);
	return playerCharacter;
};

NonPlayerCharacter = Character.extend({
	loot:null,
	preparing:false,

	setPreparing:function(position,delay){
		this.preparing=true;
		this.scheduleOnce(function(){this.walkTo(position.x,position.y); this.preparing=false;},delay);
	},

	isPreparing:function(){
		return this.preparing;
	},

});
NonPlayerCharacter.create = function(withData){
	var nonplayerCharacter = new NonPlayerCharacter();
	nonplayerCharacter.init(withData);
	return nonplayerCharacter;
};