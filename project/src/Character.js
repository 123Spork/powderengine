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
		if(withData.isPlayer){
			this.isPlayer=withData.isPlayer;
		} if(withData.map){
			this.onMap=withData.map;
		} if(withData.isNPC!=null && withData.isNPC!=="undefined"){
			console.log(this.isNPC);
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
		this.setTextureRect(cc.rect(x*32,((this.textureData.id*4)*32)+(y*32),32,32));
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
		return cc.p(this.getPosition().x/32,this.getPosition().y/32);
	},
	
	animationCounter:((60/1000)*4),
	velocity: ((60/1000)*4),
	distToMove: 2,
	
	warpPlayer:function(data){
		var x=data["position"] % gridWidth;
		var y=Math.floor(data["position"]/gridWidth);
		this.setPosition(x*32,y*32);
		sendMessageToServer({"changemap":data["mapTo"], "setTo":data["position"]});
		GameMap.goToMap(data["mapTo"]);
		GameMap.goToOffsetFromPosition(x*32,y*32);
	},


	interactWithTile:function(){
		if(!this.isWalking){
			var gp = this.getGridPosition();
			var tile = GameMap.getTileNodeForXY(gp.x,gp.y);
			switch(tile.getType()){
				case 4: this.pickupItem(tile.getScript()); return;
			}
		}
	},

	interactWithGivenTile:function(tile){
		if(!tile){
			return;
		}
		if(!this.isWalking){
			switch(tile.getType()){
				case 4: this.pickupItemFromTile(tile.getScript(),tile); return;
				case 7: MainScene.showSign(tile.getScript()); return;
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
			var tile = GameMap.getTileNodeForXY(gp.x,gp.y);
			if(tile){
				switch(tile.getType()){
					case 7: MainScene.showSign(tile.getScript()); return;
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
			if(this.isPlayer && Mapeditor==null){
				if(gp.x<x && GameMap.hasMapRight()){
					this.setPosition(0,32*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapRight()), "setTo":((0) + ((y) * gridWidth))});
					GameMap.goToMapRight();
					GameMap.goToOffsetLeft();
				} else if(gp.x>x && GameMap.hasMapLeft()){
					this.setPosition(32*(gridWidth-1),32*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapLeft()), "setTo":((gridWidth-1) + ((y) * gridWidth))});
					GameMap.goToMapLeft();
					GameMap.goToOffsetRight();
				} if(gp.y<y && GameMap.hasMapUp()){
					this.setPosition(32*x,32);
					sendMessageToServer({"changemap":parseInt(GameMap.getMapUp()), "setTo":((x) + ((1) * gridWidth))});
					GameMap.goToMapUp();
					GameMap.goToOffsetUp();
				} else if(gp.y>y && GameMap.hasMapDown()){
					sendMessageToServer({"changemap":parseInt(GameMap.getMapDown()),"setTo":((x) + ((gridHeight) * gridWidth))});
					GameMap.goToMapDown();
					this.setPosition(32*x,32*(gridHeight));
					GameMap.goToOffsetDown();
				}
			}
			return;
		}
		if(this.isWalking==false && tile){	
			switch(tile.getType()){
				case 0: break;
				case 1: case 7: return;
				case 3: this.warpPlayer(tile.getScriptData()); return;
			}
			this.toPosition = cc.p(32*x,32*y);
			this.isWalking=true;
			this.schedule(this.walk);
			this.walk(0);
			if(this.isPlayer){
				sendMessageToServer({"moveTo":((this.toPosition.x/32) + ((this.toPosition.y/32) * gridWidth))});
			} else if(this.isNPC>-1){
				sendMessageToServer({"npcID":(this.isNPC+""),"mapnumber":this.onMap, "moveNPC":((this.toPosition.x/32) + ((this.toPosition.y/32) * gridWidth))});
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
				this.setPosition(cc.p(32*x,32*y));
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
			this.toPosition = cc.p(32*x,32*y);
			this.isWalking=true;
			this.schedule(this.walk);
			this.walk(0);
		}
	}

	
});

PlayerCharacter = Character.extend({
	items:null,
	access:3,
	init:function(withData){
		this._super(withData);
		if(withData.access){
			this.access=withData.access;
		}
		this.items = {"stored":[], "equipped":{}};
		if(withData.position){
			var x=withData.position % gridWidth;
			var y=Math.floor(withData.position/gridWidth);
			this.setPosition(x*32,y*32);
			GameMap.goToMapWithoutPlayer(withData.map);
			GameMap.goToOffsetFromPosition(x*32,y*32);
			this.onMap=withData.map;
		}
		if(withData.inventory){
			this.items["stored"]=withData.inventory;
		}
		if(withData.equipment){
			this.items["equipped"]=withData.equipment;

			this.scheduleOnce(function(){
			for(var i in this.items["equipped"]){
				var item = this.items["equipped"][i];
				var scriptData=[];
				if(item && item["script"]){
					scriptData = ObjectLists.getScriptList()[item["script"]]["data"];
				}
				for(var j=0;j<scriptData.length;j++){
					if(scriptData[j]["type"]=="Default Event"){
						var defaultEvent = scriptData[j]["responses"];
						for(var k=0;k<defaultEvent.length;k++){
							switch(defaultEvent[k]["type"]){
								case "Modify Player Stats":
									var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
									console.log("modifying stat: " + skillname);
									SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
									SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
									SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
								break;
							}						
						}
					}
				}
			}
			});




		}
		
	},

	updateItemData:function(name,item){
		for(var i=0;i<this.items["stored"].length;i++){
			if(this.items["stored"][i] && this.items["stored"][i]["name"]==name){
				this.items["stored"][i]=item;
			}
		}
		console.log(this.items);
	},
	
	pickupItem:function(item){
		var gp = this.getGridPosition();
		var tile = GameMap.getTileNodeForXY(gp.x,gp.y);

		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["name"]==item["name"]){
					if(Inventory){
						this.items["stored"][i]["amount"] +=item["amount"];
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					GameChat.addMessage(strings.gameChat.pickedUpItem + item["name"]);
					if(tile.getScriptObject()["temp"]){
						sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
					} else{
						sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
					}
					console.log(this.items);
					return;
				}
			}
		}
		
		var added=false;
		for(var i=0;i<40;i++){
			if(this.items["stored"][i]==null){
				this.items["stored"][i]=cloneObj(item);
				if(Inventory){
					Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
				}
				GameChat.addMessage(strings.gameChat.pickedUpItem + item["name"]);
				if(tile.getScriptObject()["temp"]){
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
				} else{
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
				}
				var added=true;
				break;
			}
		}
		if(added==false){
			GameChat.addMessage(strings.gameChat.inventoryFull);
		}
		console.log(this.items);
	},

	pickupItemFromTile:function(item,tile){
		var gp = cc.p(tile.getPositionX()/32,tile.getPositionY()/32);
		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["name"]==item["name"]){
					if(Inventory){
						this.items["stored"][i]["amount"] +=item["amount"];
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					GameChat.addMessage(strings.gameChat.pickedUpItem + item["name"]);
					if(tile.getScriptObject()["temp"]){
						sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
					} else{
						sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
					}
					return;
				}
			}
		}
		
		var added=false;
		for(var i=0;i<40;i++){
			if(this.items["stored"][i]==null){
				this.items["stored"][i]=cloneObj(item);
				if(Inventory){
					Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
				}
				GameChat.addMessage(strings.gameChat.pickedUpItem + item["name"]);
				if(tile.getScriptObject()["temp"]){
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
				} else{
					sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
				}
				var added=true;
				break;
			}
		}
		if(added==false){
			GameChat.addMessage(strings.gameChat.inventoryFull);
		}
	},
	
	dropItem:function(itemnumber,itembox){
		var gp = this.getGridPosition();
		GameChat.addMessage(strings.gameChat.droppedItem + this.items[itembox][itemnumber]["name"]);
		sendMessageToServer({"droppeditem":this.items[itembox][itemnumber],"mapnumber":GameMap.getMapNumber(),"index":indexFromPos(gp.x,gp.y)});
		

		if(this.items[itembox][itemnumber]["stackable"]==true && this.items[itembox][itemnumber]["amount"]>1){
			Inventory.setStackableLabel(itemnumber,0);
		}
	
		this.items[itembox][itemnumber]=null;
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
	},

	useItem:function(itemnumber){
		var item = this.items["stored"][itemnumber];
		var scriptData=[];
		if(item["script"]){
			scriptData = ObjectLists.getScriptList()[item["script"]]["data"];
		}
		for(var j=0;j<scriptData.length;j++){
			if(scriptData[j]["type"]=="Default Event"){
				var defaultEvent = scriptData[j]["responses"];
				for(var k=0;k<defaultEvent.length;k++){
					switch(defaultEvent[k]["type"]){
						case "Equip Item":
							this.equipItem(itemnumber,defaultEvent[k]["data"]["equip"]);
						break;
						case "Modify Player Stats":
							var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
							console.log("modifying stat: " + skillname);
							SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
							SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
							SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
						break;
						case "Read Item":
							MainScene.showBook(item["name"],defaultEvent[k]["data"]["say"]);
						break;
						case "Open/Close Panel":
							var show = defaultEvent[k]["data"]["visible"]==1?true:false;
							switch(defaultEvent[k]["data"]["panel"]){
								case 0: 
									if(Inventory!=null && !Inventory._parent) Inventory=null;
									if(show==true){
										if(Inventory){
											Inventory.updateTileGrid();
										}else{
											Inventory = new InventoryPanel();
											Inventory.init();
											Inventory.didBecomeActive();
											MainScene.addChild(Inventory);
										}
									}else{
										if(Inventory){
											Inventory.willTerminate();
											Inventory.removeFromParent();
											Inventory=null;
										}
									}
								break;
								case 1:
									if(Equipment!=null && !Equipment._parent) Equipment=null;
									if(show==true){
										if(Equipment){
											Equipment.updateTileGrid();
										}else{
											Equipment = new EquipmentPanel();
											Equipment.init();
											Equipment.didBecomeActive();
											MainScene.addChild(Equipment);
										}
									}else{
										if(Equipment){
											Equipment.willTerminate();
											Equipment.removeFromParent();
											Equipment=null;
										}
									}
								break;
								case 2:
									if(Skills!=null && !Skills._parent) Skills=null;
									if(show==true){
										if(Skills){
											Skills.updateTileGrid();
										}else{
											Skills = new SkillsPanel();
											Skills.init();
											Skills.didBecomeActive();
											MainScene.addChild(Skills);
										}
									}else{
										if(Skills){
											Skills.willTerminate();
											Skills.removeFromParent();
											Skills=null;
										}
									}
								break;
							}
						break;
						case "Destroy":
							this.items["stored"][itemnumber]=null;
							if(Inventory){
								Inventory.updateTileGrid();
							}
						break;
					}						
				}
			}
		}
	},
	
	equipItem:function(itemnumber,place){

		if(place=="bothArms"){
			place="lArm";
			if(!this.items["equipped"]["rArm"]){
				place="rArm";
			}
		}

		var temp=null;
		if(this.items["equipped"][place]){
			var temp = cloneObj(this.items["equipped"][place]);

			var scriptData=[];
			if(temp["script"]){
				scriptData = ObjectLists.getScriptList()[temp["script"]]["data"];
			}
			for(var j=0;j<scriptData.length;j++){
				if(scriptData[j]["type"]=="On Dequip"){
					var defaultEvent = scriptData[j]["responses"];
					for(var k=0;k<defaultEvent.length;k++){
						switch(defaultEvent[k]["type"]){
							case "Modify Player Stats":
								var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
								console.log("modifying stat: " + skillname);
								SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
								SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
								SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
							break;
							case "Open/Close Panel":
								var show = defaultEvent[k]["data"]["visible"]==1?true:false;
								switch(defaultEvent[k]["data"]["panel"]){
									case 0: 
										if(Inventory!=null && !Inventory._parent) Inventory=null;
										if(show==true){
											if(Inventory){
												Inventory.updateTileGrid();
											}else{
												Inventory = new InventoryPanel();
												Inventory.init();
												Inventory.didBecomeActive();
												MainScene.addChild(Inventory);
											}
										}else{
											if(Inventory){
												Inventory.willTerminate();
												Inventory.removeFromParent();
												Inventory=null;
											}
										}
									break;
									case 1:
										if(Equipment!=null && !Equipment._parent) Equipment=null;
										if(show==true){
											if(Equipment){
												Equipment.updateTileGrid();
											}else{
												Equipment = new EquipmentPanel();
												Equipment.init();
												Equipment.didBecomeActive();
												MainScene.addChild(Equipment);
											}
										}else{
											if(Equipment){
												Equipment.willTerminate();
												Equipment.removeFromParent();
												Equipment=null;
											}
										}
									break;
									case 2:
										if(Skills!=null && !Skills._parent) Skills=null;
										if(show==true){
											if(Skills){
												Skills.updateTileGrid();
											}else{
												Skills = new SkillsPanel();
												Skills.init();
												Skills.didBecomeActive();
												MainScene.addChild(Skills);
											}
										}else{
											if(Skills){
												Skills.willTerminate();
												Skills.removeFromParent();
												Skills=null;
											}
										}
									break;
								}
							break;
							case "Destroy":
								temp=null;
								if(Inventory){
									Inventory.updateTileGrid();
								}
							break;
						}						
					}
				}
			}
		}

		this.items["equipped"][place]=cloneObj(this.items["stored"][itemnumber]);
		this.items["stored"][itemnumber]=temp;
		if(Inventory){
			Inventory.updateTileGrid();
		}
		if(Equipment){
			Equipment.updateTileGrid();
		}
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


				var item = this.items["stored"][i]
				var scriptData=[];
				if(item["script"]){
					scriptData = ObjectLists.getScriptList()[item["script"]]["data"];
				}
				for(var j=0;j<scriptData.length;j++){
					if(scriptData[j]["type"]=="On Dequip"){
						var defaultEvent = scriptData[j]["responses"];
						for(var k=0;k<defaultEvent.length;k++){
							switch(defaultEvent[k]["type"]){
								case "Modify Player Stats":
									var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
									SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
									SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
									SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
								break;
								case "Open/Close Panel":
									var show = defaultEvent[k]["data"]["visible"]==1?true:false;
									switch(defaultEvent[k]["data"]["panel"]){
										case 0: 
											if(Inventory!=null && !Inventory._parent) Inventory=null;
											if(show==true){
												if(Inventory){
													Inventory.updateTileGrid();
												}else{
													Inventory = new InventoryPanel();
													Inventory.init();
													Inventory.didBecomeActive();
													MainScene.addChild(Inventory);
												}
											}else{
												if(Inventory){
													Inventory.willTerminate();
													Inventory.removeFromParent();
													Inventory=null;
												}
											}
										break;
										case 1:
											if(Equipment!=null && !Equipment._parent) Equipment=null;
											if(show==true){
												if(Equipment){
													Equipment.updateTileGrid();
												}else{
													Equipment = new EquipmentPanel();
													Equipment.init();
													Equipment.didBecomeActive();
													MainScene.addChild(Equipment);
												}
											}else{
												if(Equipment){
													Equipment.willTerminate();
													Equipment.removeFromParent();
													Equipment=null;
												}
											}
										break;
										case 2:
											if(Skills!=null && !Skills._parent) Skills=null;
											if(show==true){
												if(Skills){
													Skills.updateTileGrid();
												}else{
													Skills = new SkillsPanel();
													Skills.init();
													Skills.didBecomeActive();
													MainScene.addChild(Skills);
												}
											}else{
												if(Skills){
													Skills.willTerminate();
													Skills.removeFromParent();
													Skills=null;
												}
											}
										break;
									}
								break;
								case "Destroy":
									this.items["stored"][i]=null;
									if(Inventory){
										Inventory.updateTileGrid();
									}
								break;
							}						
						}
					}
				}



				return;
			}
		}
		GameChat.addMessage("No space in inventory to dequip this item.");
	},	

	getInventory:function(){
		return this.items["stored"];
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
