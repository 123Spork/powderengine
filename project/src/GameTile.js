var GameTile = cc.Node.extend({
	ground1:null,
	ground2:null,
	groundShadow:null,
	mask1:null,
	mask2:null,
	mask3:null,
	item:null,
	fringe1:null,
	fringe2:null,
	fringeShadow:null,
	fringe3:null,
	position:null,
	string:null,
	type:null,
	script:null,
	
	ctor:function(){
		this._super();
	},
	
	init:function(){
		this._super();
		this.string = cc.LabelTTF.create("","Arial",16);
		this.string.setAnchorPoint(0.5,0.5);
		this.string.setPosition(16,-16);
		this.string.setOpacity(0);
		this.string.setColor(cc.c3b(0,0,0));
		this.addChild(this.string,900);
		this.item=[];
		this.script=[];

		this.setType(0);
	},
	
	addDroppedItem:function(data){
		var texture = data["data"]["sprite"]["texture"];
		var pos = data["data"]["sprite"]["position"];
		this.setLayer(texture,pos,"item");
		for(var i=0;i<ObjectLists.getItemList().length;i++){
			if(data["name"]==ObjectLists.getItemList()[i]["name"]){
				this.setScript(i,true);
				break;
			}
		}
		this.setType(4);
	},	

	pickupItem:function(){
		if(this.script[this.script.length-1]["temp"]){
			this.item[this.item.length-1].removeFromParent();
			this.item.splice(this.item.length-1,1);
			this.popScript();
		}
	},


	setLayer:function(_texture,_tilePos,_type){
		var sprite = cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage(_texture));
		sprite.setTextureRect(cc.rect(Math.floor(32*_tilePos.x),Math.floor(32*_tilePos.y),32,32));
		sprite.setColor(cc.c4b(255,255,255,255));
		sprite.setAnchorPoint(0,1);
		switch(_type){
			case "ground1":
				if(this.ground1!=null){
					this.ground1.removeFromParent();
				}
				this.ground1 = sprite; 
				this.addChild(this.ground1);
			break;
			case "ground2":
				if(this.ground2!=null){
					this.ground2.removeFromParent();
				}
				this.ground2 = sprite;
				this.addChild(this.ground2,1);
			break;
			case "groundShadow":
				if(this.groundShadow!=null){
					this.groundShadow.removeFromParent();
				}
				this.groundShadow = sprite;
				this.addChild(this.groundShadow,2);
			break;
			case "mask1":
				if(this.mask1!=null){
					this.mask1.removeFromParent();
				}
				this.mask1 = sprite;
				this.addChild(this.mask1,3);
			break;
			case "mask2":
				if(this.mask2!=null){
					this.mask2.removeFromParent();
				}
				this.mask2 = sprite;
				this.addChild(this.mask2,4);
			break;
			case "mask3": 
				if(this.mask3!=null){
					this.mask3.removeFromParent();
				}
				this.mask3 = sprite;
				this.addChild(this.mask3,5);
			break;
			case "item": 
				this.item.push(sprite);
				this.addChild(this.item[this.item.length-1],6);
			break;
			case "fringe1":
				if(this.fringe1!=null){
					this.fringe1.removeFromParent();
				}
				this.fringe1 = sprite;
				this.addChild(this.fringe1,7);
			break;
			case "fringe2":
				if(this.fringe2!=null){
					this.fringe2.removeFromParent();
				}
				this.fringe2 = sprite;
				this.addChild(this.fringe2,8);
			break;
			case "fringeShadow": 
				if(this.fringeShadow!=null){
					this.fringeShadow.removeFromParent();
				}
				this.fringeShadow = sprite;
				this.addChild(this.fringeShadow,9);
			break;
			case "fringe3":
				if(this.fringe3!=null){
					this.fringe3.removeFromParent();
				}
				this.fringe3 = sprite;
				this.addChild(this.fringe3,10);
			break;
		}
	},
	
	isLoaded:function(){
		var loaded=true;
		if(this.ground1!=null && this.ground1.getTexture() && this.ground1.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.ground2!=null && this.ground2.getTexture() && this.ground2.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.groundShadow!=null && this.groundShadow.getTexture()  && this.groundShadow.getTexture_isLoaded==false){
			loaded=false;
		}else if(this.mask1!=null && this.mask1.getTexture() && this.mask1.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.mask2!=null && this.mask2.getTexture() && this.mask2.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.mask3!=null && this.mask3.getTexture() && this.mask3.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.item.length>0){
			for(var i in this.item){
				if(this.item[i].getTexture() && this.item[i].getTexture()._isLoaded==false){
					loaded=false;
				}
			}
		}else if(this.fringe1!=null && this.fringe1.getTexture() && this.fringe1.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.fringe2!=null && this.fringe2.getTexture() && this.fringe2.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.fringeShadow!=null && this.fringeShadow.getTexture() && this.fringeShadow.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.fringe3!=null && this.fringe3.getTexture() && this.fringe3.getTexture()._isLoaded==false){
			loaded=false;
		}
		return loaded;
	},
	
	destroy:function(){
		if(this.ground1!=null){
			this.ground1.removeFromParent();
		}
		this.ground1 = null;
		if(this.ground2!=null){
			this.ground2.removeFromParent();
		}
		this.ground2 = null;
		if(this.groundShadow!=null){
			this.groundShadow.removeFromParent();
		}
		this.groundShadow = null;
		if(this.mask1!=null){
			this.mask1.removeFromParent();
		}
		this.mask1 = null;
		if(this.mask2!=null){
			this.mask2.removeFromParent();
		}
		this.mask2 = null;
		if(this.mask3!=null){
			this.mask3.removeFromParent();
		}
		this.mask3 = null;

		for(var i=0;i<this.item.length;i++){
			this.item[i].removeFromParent();
		}
		this.item=[];
			
		this.mask3 = null;
		if(this.fringe1!=null){
			this.fringe1.removeFromParent();
		}
		this.fringe1 = null;
		if(this.fringe2!=null){
			this.fringe2.removeFromParent();
		}
		this.fringe2 = null;
		if(this.fringeShadow!=null){
			this.fringeShadow.removeFromParent();
		}
		this.fringeShadow = null;
		if(this.fringe3!=null){
			this.fringe3.removeFromParent();
		}
		this.fringe3 = null;
		this.setType(0);
		this.script=[];
		this.item=[];
	},
	
	destroyLayer:function(_type){
		switch(_type){
			case "ground1":
				if(this.ground1!=null){
					this.ground1.removeFromParent();
				}
				this.ground1 = null; 
			break;
			case "ground2":
				if(this.ground2!=null){
					this.ground2.removeFromParent();
				}
				this.ground2 = null;
			break;
			case "groundShadow":
				if(this.groundShadow!=null){
					this.groundShadow.removeFromParent();
				}
				this.groundShadow = null;
			break;
			case "mask1":
				if(this.mask1!=null){
					this.mask1.removeFromParent();
				}
				this.mask1 = null;
			break;
			case "mask2":
				if(this.mask2!=null){
					this.mask2.removeFromParent();
				}
				this.mask2 = null;
			break;
			case "mask3": 
				if(this.mask3!=null){
					this.mask3.removeFromParent();
				}
				this.mask3 = null;
			break;
			case "item": 
				for(var i=0;i<this.item.length;i++){
					this.item[i].removeFromParent();
					this.item[i].splice(i,1);
					i--;
				}
				this.item = [];
			break;
			case "fringe1":
				if(this.fringe1!=null){
					this.fringe1.removeFromParent();
				}
				this.fringe1 = null;
			break;
			case "fringe2":
				if(this.fringe2!=null){
					this.fringe2.removeFromParent();
				}
				this.fringe2 = null;
			break;
			case "fringeShadow": 
				if(this.fringeShadow!=null){
					this.fringeShadow.removeFromParent();
				}
				this.fringeShadow = null;
			break;
			case "fringe3":
				if(this.fringe3!=null){
					this.fringe3.removeFromParent();
				}
				this.fringe3 = null;
			break;
		}
	},
	
	setType:function(_in){
		this.type=_in;
		switch(this.type){
			case 0: this.string.setString(""); break;
			case 1: this.string.setString("BLK"); break;
			case 2: this.string.setString("SPW"); break;	
			case 3: this.string.setString("WRP"); break;	
			case 4: this.string.setString("ITM"); break;	
			case 5: this.string.setString("SCR"); break;	
			case 6: this.string.setString("SKL"); break;
		}
	},
	
	setScript:function(_in,isTemp){
		if(!isTemp){
			var isTemp=false;
		}
		this.script.push({"num":_in,"temp":isTemp});
	},

	popScript:function(_){
		this.script.splice(this.script.length-1,1);
	},

	getScript:function(){
		switch(this.type){
			case 3: return ObjectLists.getWarpList()[this.script[this.script.length-1]["num"]];
			case 4: return ObjectLists.getItemList()[this.script[this.script.length-1]["num"]];
		}
	},
	
	getScriptData:function(){
		switch(this.type){
			case 3: return ObjectLists.getWarpList()[this.script[this.script.length-1]["num"]].data;
			case 4: return ObjectLists.getItemList()[this.script[this.script.length-1]["num"]].data;
		}
	},
	
	setStringVisible:function(_in){
		this.string.setOpacity(_in==true?255:0);
	},
	
	getType:function(){
		return this.type;
	},
	
});

GameTile.Create=function(x,y){
	var tile = new GameTile();
	tile.init();
	tile.position = cc.p(x,y);
	return tile;
};