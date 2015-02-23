var pControllerInstance=null;
var PlayersController=cc.Layer.extend({
	instance:null,
	players:[],
	npcs:[],
	you:null,
});

PlayersController.getInstance=function(){
	return pControllerInstance;
};

PlayersController.setInstanceNull = function(){
	pControllerInstance.removeFromParent();
	pControllerInstance=null;
};

PlayersController.create=function(youData){
	if(!pControllerInstance){
		pControllerInstance = new PlayersController();
		pControllerInstance.you = PlayerCharacter.create(youData);
		pControllerInstance.addChild(pControllerInstance.you);
	}
	return pControllerInstance;
};

PlayersController.NPCsInMap = function(mapNumber){
	var NPCList=[];
	for(var i in pControllerInstance.npcs){
		if(pControllerInstance.npcs[i].getMap()==mapNumber){
			NPCList.push(pControllerInstance.npcs[i]);
		}
	}
	return NPCList;
};

PlayersController.getNPC=function(id){
	return pControllerInstance.npcs[id];
};

PlayersController.pathNPC=function(id,path,map){
	if(pControllerInstance.npcs[id] && path){
		if(pControllerInstance.you.getMap()==map){
			pControllerInstance.npcs[id].setWalkingPath(path);
		}
	}
};

PlayersController.killPlayer=function(){
	sendToServer('playerDiedMessage',null);
	GameChat.addMessage("You died!");
};

PlayersController.moveNPC=function(id,index,map){
	if(pControllerInstance.npcs[id] && index!="default"){
		if(pControllerInstance.you.getMap()==map){
			pControllerInstance.npcs[id].walkToIndex(index);
		}
	}
};

PlayersController.repositionNPC=function(id,index){
	if(pControllerInstance.npcs[id] && index!="default"){
		pControllerInstance.npcs[id].setPosition(cc.p((index % gridWidth)*cellsize,(Math.floor(index/gridWidth))*cellsize));
	}
};



PlayersController.destroyNPCs=function(){
	for(var i in pControllerInstance.npcs){
		pControllerInstance.npcs[i].removeFromParent();
	}
	pControllerInstance.npcs=[];
};

PlayersController.addNPC=function(data,position,map){
	if(!data || !data["sprite"]){
		return;
	}
	var npcID = data["npcID"];
	var withData ={
		name: data["name"],
		stats: {
			"health":{level:1,value:100,maxval:200,maxlvl:900},
			"mana":{level:1,value:100,maxval:200,maxlvl:99},
		},
		map:map,
		textureName: "sprites1.png",
		spriteId: data["sprite"]["number"],
		isNPC:npcID,
		script:data["script"]
	};
	var mapSize = GameMap.getMapSizeForIndex(map);
	var x =position % mapSize.width;
	var y=mapSize.height-Math.floor(position/mapSize.width);
	pControllerInstance.npcs[npcID]=NonPlayerCharacter.create(withData);
	pControllerInstance.npcs[npcID].setPosition(x*cellsize,y*cellsize);
	pControllerInstance.addChild(pControllerInstance.npcs[npcID]);
};


PlayersController.getYou = function(){
	return pControllerInstance.you;
};

PlayersController.getPlayer=function(id){
	if(pControllerInstance){
		if(pControllerInstance.you && id==pControllerInstance.you.getName()){
			return pControllerInstance.you;
		}
		if(pControllerInstance.players[id]){
			return pControllerInstance.players[id];
		}
	}
	return null;
};

PlayersController.addPlayer=function(data,ignoreAddMessage){
	var withData ={
		name: data["id"],
		stats: {
			"health":{level:1,value:100,maxval:200,maxlvl:900},
			"mana":{level:1,value:100,maxval:200,maxlvl:99},
		},
		map:data["location"]["mapnumber"],
		textureName: "sprites1.png",
		spriteId: 1,
	};
	pControllerInstance.players[data["id"]] = PlayerCharacter.create(withData);
	var position=data["location"]["position"];

	var mapSize = GameMap.getMapSizeForIndex(data["location"]["mapnumber"]);
	var x =position % mapSize.width;
	var y=Math.floor(position/mapSize.width);
	pControllerInstance.players[data["id"]].setPosition(x*cellsize,y*cellsize);
	PlayersController.showPlayersInMapOnly();
	pControllerInstance.addChild(pControllerInstance.players[data["id"]]);
	var playerJoinString = settingsData["Join Message"]+"";
	playerJoinString = playerJoinString.replace("<PLAYER>",data["id"]);
	if(!ignoreAddMessage){
		GameChat.addMessage(playerJoinString);
	}
};

PlayersController.destroyPlayer=function(id){
	if(pControllerInstance.players[id]){
		pControllerInstance.players[id].removeFromParent();
		pControllerInstance.players[id]=null;
		var playerLeaveString = settingsData["Leave Message"]+"";
		playerLeaveString = playerLeaveString.replace("<PLAYER>",id);
		GameChat.addMessage(playerLeaveString);
		for(var i=0;i<storedClientMessages.length;i++){
			var msg = JSON.parse(storedClientMessages[i]);
			if(msg["id"] && msg["id"]==id) {
				storedClientMessages.splice(i,1);
				i--;
			}
		}
	}
};

PlayersController.movePlayer=function(data){
	var pContext = PlayersController.getPlayer(data["id"]);
	if(pContext){
		pContext.walkToIndex(data["location"]["position"]);
	} else{
		var withData ={
			name: data["id"],
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:data["location"]["mapnumber"],
			textureName: "sprites1.png",
			spriteId: 1,
		};
		pControllerInstance.players[data["id"]] = PlayerCharacter.create(withData);
		var index=data["location"]["position"];
		var mapSize = GameMap.getMapSizeForIndex(data["location"]["mapnumber"]);
		pControllerInstance.players[data["id"]].setPosition(cc.p((index % mapSize.width)*cellsize,(Math.floor(index/mapSize.width))*cellsize)); 
		PlayersController.showPlayersInMapOnly();
		pControllerInstance.addChild(pControllerInstance.players[data["id"]]);
		var playerJoinString = settingsData["Join Message"]+"";
		playerJoinString = playerJoinString.replace("<PLAYER>",data["id"]);
		GameChat.addMessage(playerJoinString);
	}
};
	
PlayersController.positionPlayer=function(data){
	if(pControllerInstance.players[data["id"]]){
		var index = data["location"]["position"];
		var mapSize = GameMap.getMapSizeForIndex(parseInt(data["location"]["mapnumber"]));
		pControllerInstance.players[data["id"]].setPosition(cc.p((index % mapSize.width)*cellsize,(Math.floor(index/mapSize.width))*cellsize)); 
	} else{
		var withData ={
			name: data["id"],
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:data["location"]["mapnumber"],
			textureName: "sprites1.png",
			spriteId: 1,
		};
		pControllerInstance.players[data["id"]] = PlayerCharacter.create(withData);
				pControllerInstance.players[data["id"]].isWarping=false;
		var index = data["location"]["position"];	var mapSize = GameMap.getMapSizeForIndex(data["location"]["mapnumber"]);
		pControllerInstance.players[data["id"]].setPosition(cc.p((index % mapSize.width)*cellsize,(Math.floor(index/mapSize.width))*cellsize)); 
		PlayersController.showPlayersInMapOnly();
		pControllerInstance.addChild(pControllerInstance.players[data["id"]]);
		var string = settingsData["Join Message"];
		string = string.replace("<PLAYER>",data["id"]);
		GameChat.addMessage(string);
	}
};

PlayersController.changePlayerStatus=function(id,status){
	if(pControllerInstance.players[id]){
		pControllerInstance.players[id].updateStatus(status);
	}
};

PlayersController.showPlayersInMapOnly=function(){
	var map = pControllerInstance.you.getMap();
	for(var i in pControllerInstance.players){
		if(pControllerInstance.players[i]!=null){
			pControllerInstance.players[i].setVisible((pControllerInstance.players[i].getMap()==map));
		}
	}
};

PlayersController.destroy = function(){
	for(var i in pControllerInstance.players){
		if(pControllerInstance.players[i]!=null){
			PlayersController.destroyPlayer(i);
		}
	}
	pControllerInstance.you.removeFromParent();
	pControllerInstance.you=null;
};

PlayersController.changePlayerMap=function(id,mapnum){
	pControllerInstance.players[id].setMap(mapnum);
	pControllerInstance.players[id].setVisible((PlayersController.getYou().getMap()==mapnum));
};
	