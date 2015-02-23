var GameTile = cc.Node.extend({
	ground1:null,
	ground2:null,
	ground3:null,
	mask1:null,
	mask2:null,
	mask3:null,
	item:null,
	itemData:null,
	fringe1:null,
	fringe2:null,
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
		this.itemData=[];
	},
	
	addItem:function(number,amount){
		if(!amount){
			var amount=1;
		}
		var data = ObjectLists.getItemList()[number];
		if(data){
			var texture = data["sprite"]["texture"];
			var pos = data["sprite"]["position"];
			this.setLayer(texture,pos,"item");
			this.itemData.push({number:number,amount:amount});
		}
	},	

	removeItem:function(){
		if(this.itemData.length>0){
			this.itemData.splice(this.itemData.length-1,1);
		}
		if(this.itemData.length>0){
			var data = ObjectLists.getItemList()[this.itemData[this.itemData.length-1].number];
			var texture = data["sprite"]["texture"];
			var pos = data["sprite"]["position"];
			this.setLayer(texture,pos,"item");
		}else{
			if(this.item){
				this.item.removeFromParent();
				this.item=null;
			}
		}
	},

	getTopItem:function(){
		if(this.itemData.length==0){
			return null;
		}
		return this.itemData[this.itemData.length-1];
	},


	setLayer:function(_texture,_tilePos,_type){
		var sprite = cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage(_texture));
		sprite.setTextureRect(cc.rect(Math.floor(cellsize*_tilePos.x),Math.floor(cellsize*_tilePos.y),cellsize,cellsize));
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
			case "ground3":
				if(this.ground3!=null){
					this.ground3.removeFromParent();
				}
				this.ground3 = sprite;
				this.addChild(this.ground3,2);
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
				if(this.item!=null){
					this.item.removeFromParent();
				}
				this.item = sprite;
				this.addChild(this.item,6);
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
		}else if(this.ground3!=null && this.ground3.getTexture()  && this.ground3.getTexture_isLoaded==false){
			loaded=false;
		}else if(this.mask1!=null && this.mask1.getTexture() && this.mask1.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.mask2!=null && this.mask2.getTexture() && this.mask2.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.mask3!=null && this.mask3.getTexture() && this.mask3.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.item!=null && this.item.getTexture() && this.item.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.fringe1!=null && this.fringe1.getTexture() && this.fringe1.getTexture()._isLoaded==false){
			loaded=false;
		}else if(this.fringe2!=null && this.fringe2.getTexture() && this.fringe2.getTexture()._isLoaded==false){
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
		if(this.ground3!=null){
			this.ground3.removeFromParent();
		}
		this.ground3 = null;
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
		if(this.item!=null){
			this.item.removeFromParent();
		}
		this.item = null;
		this.itemData=[];
		if(this.fringe1!=null){
			this.fringe1.removeFromParent();
		}
		this.fringe1 = null;
		if(this.fringe2!=null){
			this.fringe2.removeFromParent();
		}
		this.fringe2 = null;
		if(this.fringe3!=null){
			this.fringe3.removeFromParent();
		}
		this.fringe3 = null;
		this.script=null;
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
			case "ground3":
				if(this.ground3!=null){
					this.ground3.removeFromParent();
				}
				this.ground3 = null;
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
				if(this.item!=null){
					this.item.removeFromParent();
				}
				this.item = null;
				this.itemData=[];
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
			case "fringe3":
				if(this.fringe3!=null){
					this.fringe3.removeFromParent();
				}
				this.fringe3 = null;
			break;
		}
	},

	setScript:function(_in){
		if(!isTemp){
			var isTemp=false;
		}
		this.script=_in;
		if(ObjectLists.getScriptList()[_in]){
			this.string.setString(ObjectLists.getScriptList()[_in]["abbr"]);
		}else{
			this.string.setString("_");
		}
	},

	destroyScript:function(_){
		this.script=null;
		this.string.setString("");
	},

	getScript:function(){
		return ObjectLists.getScriptList()[this.script];
	},

	getScriptID:function(){
		return this.script;
	},
	
	setStringVisible:function(_in){
		this.string.setOpacity(_in==true?255:0);
	},	
});

GameTile.Create=function(x,y){
	var tile = new GameTile();
	tile.init();
	tile.position = cc.p(x.x,x.y);
	return tile;
};