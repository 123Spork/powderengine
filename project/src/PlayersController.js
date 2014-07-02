var PlayersController=cc.Layer.extend({
	instance:null,
	players:[],
	you:null,
});

PlayersController.getInstance=function(){
	return this.instance;
};

PlayersController.setInstanceNull = function(){
	this.instance.removeFromParent();
	this.instance=null;
};

PlayersController.create=function(youData){
	if(!this.instance){
		this.instance = new PlayersController();
		this.instance.you = PlayerCharacter.create(youData);
		this.instance.you.setPosition(320,320);
		this.instance.addChild(this.instance.you);
	}
	return this.instance;
};

PlayersController.getYou = function(){
	return this.instance.you;
};

PlayersController.getPlayer=function(id){
	return this.instance.players[id];
};

PlayersController.addPlayer=function(id){
		var withData ={
			name: id,
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:1,
			textureName: "sprites1.png",
			spriteId: 1,
		};
		this.instance.players[id] = PlayerCharacter.create(withData);
		this.instance.players[id].setPosition(320,320);
		PlayersController.showPlayersInMapOnly();
		this.instance.addChild(this.instance.players[id]);
		GameChat.addMessage(id + strings.gameChat.playerJoin);
};

PlayersController.destroyPlayer=function(id){
	if(this.instance.players[id]){
		this.instance.players[id].removeFromParent();
		this.instance.players[id]=null;
		GameChat.addMessage(id + strings.gameChat.playerLeave);
		for(var i=0;i<storedClientMessages.length;i++){
			var msg = JSON.parse(storedClientMessages[i]);
			if(msg["id"] && msg["id"]==id) {
				storedClientMessages.splice(i,1);
				i--;
			}
		}
	}
};

PlayersController.movePlayer=function(id,index){
	if(this.instance.players[id] && index!="default"){
		this.instance.players[id].walkToIndex(index);
	} else{
		var withData ={
			name: id,
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:1,
			textureName: "sprites1.png",
			spriteId: 1,
		};
		this.instance.players[id] = PlayerCharacter.create(withData);
		this.instance.players[id].setPosition(320,320);
		this.instance.players[id].setPosition(cc.p((index % gridWidth)*32,(Math.floor(index/gridWidth))*32)); 
		PlayersController.showPlayersInMapOnly();
		this.instance.addChild(this.instance.players[id]);
		GameChat.addMessage(id + strings.gameChat.playerJoin);
	}
};
	
PlayersController.positionPlayer=function(id,index){
	if(this.instance.players[id] && index!="default"){
		this.instance.players[id].setPosition(cc.p((index % gridWidth)*32,(Math.floor(index/gridWidth))*32));
	} else{
		var withData ={
			name: id,
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:1,
			textureName: "sprites1.png",
			spriteId: 1,
		};
		this.instance.players[id] = PlayerCharacter.create(withData);
		this.instance.players[id].setPosition(cc.p((index % gridWidth)*32,(Math.floor(index/gridWidth))*32)); 
		PlayersController.showPlayersInMapOnly();
		this.instance.addChild(this.instance.players[id]);
		GameChat.addMessage(id + strings.gameChat.playerJoin);
	}
};

PlayersController.changePlayerStatus=function(id,status){
	if(this.instance.players[id]){
		this.instance.players[id].updateStatus(status);
	}
};

PlayersController.showPlayersInMapOnly=function(){
	var map = this.instance.you.getMap();
	for(var i in this.instance.players){
		if(this.instance.players[i]!=null){
			this.instance.players[i].setVisible((this.instance.players[i].getMap()==map));
		}
	}
};

PlayersController.destroy = function(){
	for(var i in this.instance.players){
		if(this.instance.players[i]!=null){
			PlayersController.destroyPlayer(i);
		}
	}
	this.instance.you.removeFromParent();
	this.instance.you=null;
};

PlayersController.changePlayerMap=function(id,mapnum){
	this.instance.players[id].setMap(mapnum);
	this.instance.players[id].setVisible((this.instance.you.getMap()==mapnum));
};
	