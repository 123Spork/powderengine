StatsController = cc.Sprite.extend({
	data:null,
	lastData:null,
	delegate:null,

	init:function(withData,delegate){
		this.data = withData;
		this.delegate=delegate;
		//	"health":{level:,value:0,maxval:0,maxlvl:0},
		this.scheduleUpdate();
	},
	
	update:function(dt){
		for(var i in this.data){
			if(this.lastData){
				if(this.data[i].value==0 && this.lastData[i]>0){
					this.delegate.statBecameZero(i);
				}
				if(this.data[i].level>this.lastData[i].level){
					this.delegate.statLeveledUp(i);
				}
			}
			this.lastData[i] = this.data[i];
		}
	},
	
	getStatValue:function(stat){
		return this.data[stat].value;
	},
	
	getStatLevel:function(stat){
		return this.data[stat].level;
	},
	
	modStatValue:function(stat, modifier){
		this.data[stat].value+=modifier;
		if(this.data[stat].value>this.data[stat].maxval){
			this.data[stat].value=this.data[stat].maxval;
		}
		if(this.data[stat].value<0){
			this.data[stat].value=0;
		}
	},
	
	changeStatValue:function(stat, modifier){
		this.data[stat].value=modifier;
		if(this.data[stat].value>this.data[stat].maxval){
			this.data[stat].value=this.data[stat].maxval;
		}
		if(this.data[stat].value<0){
			this.data[stat].value=0;
		}
	},
	
	modStatLevel:function(stat, modifier){
		this.data[stat].level+=modifier;
		if(this.data[stat].level>this.data[stat].maxlvl){
			this.data[stat].level=this.data[stat].maxlvl;
		}
		if(this.data[stat].level<0){
			this.data[stat].level=0;
		}
	},
	
	changeStatValue:function(stat, modifier){
		this.data[stat].level=modifier;
		if(this.data[stat].level>this.data[stat].maxlvl){
			this.data[stat].level=this.data[stat].maxlvl;
		}
		if(this.data[stat].level<0){
			this.data[stat].level=0;
		}
	},
	
	changeMaxLvl:function(stat, modifier){
		this.data[stat].maxlvl=modifier;
	},
	
	changeMaxValue:function(stat, modifier){
		this.data[stat].maxval=modifier;
	}
	

});