var Item = cc.Sprite.extend({
	type:null,
	name:null,
	stats:null,
	texture:null,
	spriteframe:null,
	
	init:function(withData){
		if(withData){
			if(widthData.type){
				this.type=widthData.type;
			}
			if(widthData.name){
				this.name=widthData.name;
			}
			if(widthData.stats){
				this.stats=widthData.stats;
			}
			if(widthData.texture){
				this.texture=widthData.texture;
				this.setTexture(cc.TextureCache.getInstance().addImage(this.texture));
			}
			if(widthData.spriteframe){
				this.spriteframe=widthData.spriteframe;
			}
		}
	},
	
	getType:function(){
		return this.type;
	},
		
	setType:function(_in){
		this.type=_in;
	},
	
	getName:function(){
		return this.name;
	},

	setName:function(_in){
		this.name=_in;
	},
});
