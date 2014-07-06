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
	status:null,
	onMap:null,
	path:null,


	init:function(withData){
		this.setTextureData(withData.textureName,withData.spriteId);
		this.stats = new StatsController(withData.statData,this);
		this.addChild(this.stats);
		
		this.name = withData.name;
		if(withData.isPlayer){
			this.isPlayer=withData.isPlayer;
		} if(withData.map){
			this.onMap=withData.map;
		}
		this.setAnchorPoint(0,1);
		this.nameLabel = cc.LabelTTF.create("","Arial",12);
		this.nameLabel.setAnchorPoint(0.5,0);
		this.nameLabel.setColor(255,0,0);
		this.nameLabel.setPosition(Math.floor(this.getContentSize().width/2),this.getContentSize().width+3);
		this.addChild(this.nameLabel);
		this.updateNameString();
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
	
	setSpriteFrame:function(x,y){
		this.setTextureRect(cc.rect(x*32,((this.textureData.id*4)*32)+(y*32),32,32));
		this.spriteFrame=cc.p(x,y);
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
	
	walk:function(dt){
		this.animationCounter+=dt;
		var pos = this.getPosition();
		var sf =this.getSpriteFrame();
		if(this.animationCounter>this.velocity){
			this.animationCounter=0;
			if(this.toPosition.x<pos.x){
				this.setSpriteFrame((sf.x+1)%3,1);
			} else if(this.toPosition.x>pos.x){
				this.setSpriteFrame((sf.x+1)%3,2);
			} else if(this.toPosition.y<pos.y){
				this.setSpriteFrame((sf.x+1)%3,0);
			} else if(this.toPosition.y>pos.y){
				this.setSpriteFrame((sf.x+1)%3,3);
			}
		}
			
		if(this.toPosition.x<pos.x){
			this.setPositionX(pos.x-this.distToMove);
		} else if(this.toPosition.x>pos.x){
			this.setPositionX(pos.x+this.distToMove);
		} else if(this.toPosition.y<pos.y){
			this.setPositionY(pos.y-this.distToMove);
		} else if(this.toPosition.y>pos.y){
			this.setPositionY(pos.y+this.distToMove);
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
			this.setSpriteFrame(sf.x,1);
		} else if(gp.x<x){
			this.setSpriteFrame(sf.x,2);
		} if(gp.y>y){
			this.setSpriteFrame(sf.x,0);
		} else if(gp.y<y){
			this.setSpriteFrame(sf.x,3);
		}
		if(!tile){
			if(this.isPlayer && Mapeditor==null){
				if(gp.x<x && GameMap.hasMapRight()){
					this.setPosition(0,32*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapRight()), "setTo":((0) + ((y) * gridWidth))});
					GameMap.goToMapRight();
				} else if(gp.x>x && GameMap.hasMapLeft()){
					this.setPosition(32*(gridWidth-1),32*y)
					sendMessageToServer({"changemap":parseInt(GameMap.getMapLeft()), "setTo":((gridWidth-1) + ((y) * gridWidth))});
					GameMap.goToMapLeft();
				} if(gp.y<y && GameMap.hasMapUp()){
					this.setPosition(32*x,32);
					sendMessageToServer({"changemap":parseInt(GameMap.getMapUp()), "setTo":((x) + ((1) * gridWidth))});
					GameMap.goToMapUp();
				} else if(gp.y>y && GameMap.hasMapDown()){
					sendMessageToServer({"changemap":parseInt(GameMap.getMapDown()),"setTo":((x) + ((gridHeight) * gridWidth))});
					GameMap.goToMapDown();
					this.setPosition(32*x,32*(gridHeight));
				}
			}
			return;
		}
		if(this.isWalking==false && tile){	
			switch(tile.getType()){
				case 0: break;
				case 1: return;
				case 3: this.warpPlayer(tile.getScriptData()); return;
			}
			this.toPosition = cc.p(32*x,32*y);
			this.isWalking=true;
			this.schedule(this.walk);
			this.walk(0);
			if(this.isPlayer){
				sendMessageToServer({"moveTo":((this.toPosition.x/32) + ((this.toPosition.y/32) * gridWidth))});
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
				this.setSpriteFrame(sf.x,1);
			} else if(gp.x<x){
				this.setSpriteFrame(sf.x,2);
			} else if(gp.y>y){
				this.setSpriteFrame(sf.x,0);
			} else if(gp.y<y){
				this.setSpriteFrame(sf.x,3);
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
	init:function(withData){
		this._super(withData);
		this.items = {"stored":[], "equipped":{}};
	},

	updateItemData:function(name,item){
		for(var i=0;i<this.items["stored"].length;i++){
			if(this.items["stored"][i]["name"]==name){
				this.items["stored"][i]=item;
			}
		}
	},
	
	pickupItem:function(item){
		var gp = this.getGridPosition();
		var tile = GameMap.getTileNodeForXY(gp.x,gp.y);
		if(tile.getScriptObject()["temp"]){
			sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
		} else{
			sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
		}

		if(item["stackable"]==true){
			for(var i=0;i<40;i++){
				if(this.items["stored"][i] && this.items["stored"][i]["name"]==item["name"]){
					if(Inventory){
						this.items["stored"][i]["amount"] +=item["amount"];
						Inventory.setStackableLabel(i,this.items["stored"][i]["amount"]);	
					}
					GameChat.addMessage(strings.gameChat.pickedUpItem + item["name"]);
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
				var added=true;
				break;
			}
		}
		if(added==false){
			GameChat.addMessage(strings.gameChat.inventoryFull);
		}
	},
	
	dropItem:function(itemnumber){
		var gp = this.getGridPosition();
		GameChat.addMessage(strings.gameChat.droppedItem + this.items["stored"][itemnumber]["name"]);
		sendMessageToServer({"droppeditem":this.items["stored"][itemnumber],"mapnumber":GameMap.getMapNumber(),"index":indexFromPos(gp.x,gp.y)});
		

		if(this.items["stored"][itemnumber]["stackable"]==true && this.items["stored"][itemnumber]["amount"]>1){
			Inventory.setStackableLabel(itemnumber,0);
		}
	
		this.items["stored"][itemnumber]=null;
		if(Inventory){
			Inventory.updateTileGrid();
		}
	},

	useItem:function(itemnumber){
		switch(this.items["stored"][itemnumber]["itemType"]){
			case "book": if(Book!=null && !Book._parent) Itemeditor=null;
				if(Book){
					Book.willTerminate();
					Book.removeFromParent();
					Book=null;
				}
				Book = new BookPopup();
				Book.init(this.items["stored"][itemnumber]);
				Book.didBecomeActive();
				this._parent._parent._parent.addChild(Book);
		}
	},
	
	equipItem:function(itemnumber){
		this.items[stored][itemnumber].removeFromParent();
		this.items[equipped][this.items[stored][itemnumber].getType()]=this.items[stored][itemnumber];
		this.items[stored].splice(itemnumber,1);
	},
	
	dequipItem:function(itemtype){
		this.items[stored][itemtype].removeFromParent();
		this.items[stored].push(this.items[equipped][itemtype])
		this.items[equipped][itemtype]=null;
	},	

	getInventory:function(){
		return this.items["stored"];
	},
});
PlayerCharacter.create = function(withData){
	var playerCharacter = new PlayerCharacter();
	playerCharacter.init(withData);
	return playerCharacter;
};

NonPlayerCharacter = Character.extend({
	loot:null,
});