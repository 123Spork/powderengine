var socket;
var io = null;
var storedClientMessages = [];

setupserver = function() {
	socket = io.connect(ccconfig["getServerURL"](), {
			'sync disconnect on unload': true,
			'connect timeout': 5000,
			'reconnection delay ':100,
		}
	); 

	socket.on('connect',function() {
	    LocalStorage.Create();
	    LocalStorage.Clear();
	    LocalStorage.Sync();
	   
	    console.log('Client has connected to the server!');
	    if(SceneManager){
		    var gameScreen = SceneManager.getInstance().currentScene;
		    if(gameScreen){
				gameScreen.setServerConnected(true);
			}else{
				storedClientMessages.push(JSON.stringify({"connect":true}));
		}
		}else{
			storedClientMessages.push(JSON.stringify({"connect":true}));
		}
	});


	socket.on('message',function(data) {
		//reactToSocketMessage(data);
	});


	socket.on('disconnect',function() {
	  console.log('The client has disconnected!');
	  var screen = SceneManager.getInstance().currentScene;
	  if(screen){
			screen.setServerConnected(false);
	  }	else{
			storedClientMessages.push(JSON.stringify({"disconnect":true}));
		}
	});

	socket.on('syncMessage', function (data){
		if(data["mapdata"]){
			LocalStorage.updateMapData(data["mapdata"],data["maptime"]);
		}
		if(data["itemdata"]){
			LocalStorage.updateItemData(data["itemdata"],data["itemtime"]);
		}
		if(data["skillsdata"]){
			LocalStorage.updateSkillsData(data["skillsdata"],data["skillstime"]);
		}
		if(data["npcsdata"]){
			LocalStorage.updateNPCData(data["npcsdata"],data["npcstime"]);
		}
		if(data["questdata"]){
			LocalStorage.updateQuestData(data["questdata"],data["queststime"]);
		}
		if(data["shopsdata"]){
			LocalStorage.updateShopData(data["shopsdata"],data["shopstime"]);
		}
		if(data["settingsdata"]){
			LocalStorage.updateSettingsData(data["settingsdata"],data["settingstime"]);
			settingsData = mergeSettings(settingsData,data["settingsdata"]);
		}
		if(data["scriptsdata"]){
			LocalStorage.updateScriptData(data["scriptsdata"],data["scriptstime"]);
		}
		isGameInSync=true;
		console.log("SYNC DONE");
	});

	socket.on('saveSuccessMessage', function (data){
		var screen = SceneManager.getInstance().currentScene;
		screen.gameSaved();
	});

	socket.on('loginSuccessMessage', function (data){
		var screen = SceneManager.getInstance().currentScene;
		screen.onLoginSuccess(data);
	});

	socket.on('loginFailMessage',function (data){
		var screen = SceneManager.getInstance().currentScene;
		screen.onLoginFailed(data);
	});

	socket.on('registrationSuccessMessage',function (data){
		var screen = SceneManager.getInstance().currentScene;
		screen.completedRegistration();
	});

	socket.on('registrationFailMessage',function (data){
		var screen = SceneManager.getInstance().currentScene;
		screen.failedRegistration(data["registrationfailed"]);
	});

	socket.on('movePlayerMessage', function (data){
		if(PlayersController.getPlayer(data["id"])){
			PlayersController.getPlayer(data["id"]).resetIsWalking();
			PlayersController.movePlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
		}
	});

	socket.on('playerPathMessage', function (data){
		if(PlayersController.getPlayer(data["id"])){
			PlayersController.getPlayer(data["id"]).setWalkingPath(data["path"]);
		}
	});

	socket.on('npcAttackMessage', function (data){
		SkillBars.modifyHealth("Health",data);
		GameChat.addMessage(Math.abs(data) + " damage has been delivered to you!");
	});

	socket.on("playerJoinMessage", function (data){
		PlayersController.addPlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
	});

	socket.on("playerOnlineMessage", function (data){
		console.log(data);
		console.log("NEW PLAYA");
		PlayersController.addPlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}},true);
	});

	socket.on("playerExitMessage", function (data){
		PlayersController.destroyPlayer(data);
	});

	socket.on("saveMapMessage", function (data){
		LocalStorage.changeMap(data["savemap"],data["mapdata"],data["updatetime"]);
		GameMap.setupMap(data["mapdata"]);
	});

	socket.on("chatMessage", function (data){
		GameChat.addMessage(data);
	});

	socket.on("coinFlipMessage", function (data){
		GameChat.addMessage(data);
	});

	socket.on("diceRollMessage", function (data){
		GameChat.addMessage(data);
	});

	socket.on("danceMessage", function (data){
		GameChat.addMessage(data);
	});

	socket.on("afkMessage", function (data){
		PlayersController.changePlayerStatus(data,"AFK");
	});

	socket.on("saveSettingsMessage", function (data){
		LocalStorage.updateSettingsData(data["savesettings"],data["updatetime"]);
		settingsData = mergeSettings(settingsData,data["savesettings"]);
		if(Settingseditor){
			Settingseditor.data = cloneObj(settingsData);
			Settingseditor.prepareList();
		}
	});

	socket.on("dropItemMessage", function (data){
		if(data["mapnumber"] == GameMap.getMapNumber()){
			GameMap.getTileNodeForIndex(data["index"]).addItem(data["droppeditem"],data["amount"]);
			GameMap.updateMap();
		}
	});
	
	socket.on("spawnNPCMessage", function (data){
		if(data["mapnumber"] == GameMap.getMapNumber()){
			var npcData = ObjectLists.getNPCList()[data["spawnednpc"]];
			npcData["npcID"]=data["npcID"];
			PlayersController.addNPC(npcData,data["index"],data["mapnumber"]);
		}
	});

	socket.on("setNPCPathMessage", function (data){
		if(GameMap.getMapNumber() && data["mapnumber"] == GameMap.getMapNumber()){
			PlayersController.pathNPC(data["id"],data["path"],data["mapnumber"]);
		}
	});

	socket.on("moveNPCMessage", function (data){
		if(GameMap.getMapNumber() && data["mapnumber"] == GameMap.getMapNumber()){
			PlayersController.moveNPC(data["id"],data["index"],data["mapnumber"]);
		}
	});
	

	socket.on("pickupItemMessage", function (data){
		if(data["mapnumber"] == GameMap.getMapNumber()){
			var tile = GameMap.getTileNodeForIndex(data["pickupitem"]);
			tile.removeItem();
			GameMap.updateMap();
		}
	});

}

sendToServer=function(messageType,data){
	socket.emit(messageType,data);
},

reactToSocketMessage=function(data){
	data = JSON.parse(data);
	var allow=false;
	for(var prop in data){ allow=true; break;}
	//Objects without data are useless.
	if(allow==false)
		return;
	console.log('Received a message from the server!',data);
	
	var screen = SceneManager.getInstance().currentScene;
	if(screen){
		if(data["connect"]){
			screen.setServerConnected(true);
		} else if(data["disconnect"]){
			screen.setServerConnected(false);
		}
		if(screen.getIdentifier()=="Game"){
		
			if(data["setTo"]){
				if(PlayersController.getPlayer(data["id"])){
					PlayersController.getPlayer(data["id"]).resetIsWalking();
				}
				if(!PlayersController.getPlayer(data["id"])|| (PlayersController.getPlayer(data["id"]) && PlayersController.getPlayer(data["id"]).isWalking ==false)){
					for(var i=0;i<storedClientMessages.length;i++){
						var msg = JSON.parse(storedClientMessages[i]);
						if(msg["moveTo"] && msg["moveTo"]!=null && msg["id"]==data["id"]) {
							storedClientMessages.splice(i,1);
							i--;
						}
					}
					PlayersController.positionPlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
					PlayersController.changePlayerMap(data["id"],data["mapnumber"]);
				}else{
					storedClientMessages.push(JSON.stringify(data));
				}
			}
			else if(data["savescripts"]){
				LocalStorage.changeScript(parseInt(data["savescripts"]),data["scriptsdata"],data["updatetime"]);
				ObjectLists.getScriptList()[parseInt(data["savescripts"])]=data["scriptsdata"];
				if(Scripteditor){
					Scripteditor.editList = ObjectLists.getScriptList();
					Scripteditor.didBecomeActive();	
				}	
			}
			else if(data["savescriptswhole"]){
				LocalStorage.refreshScript(data["savescriptswhole"],data["updatetime"]);
				ObjectLists.setScriptList(data["savescriptswhole"]);
			}
			
			else if(data["savequests"]){
				LocalStorage.changeQuest(parseInt(data["savequests"]),data["questdata"],data["updatetime"]);
				ObjectLists.getQuestList()[parseInt(data["savequests"])]=data["questdata"];
			}
			else if(data["savequestswhole"]){n
				LocalStorage.refreshQuest(data["savequestswhole"],data["updatetime"]);
				ObjectLists.setQuestList(data["savequestswhole"]);
			}
			else if(data["saveshops"]){
				LocalStorage.changeShop(parseInt(data["saveshops"]),data["shopsdata"],data["updatetime"]);
				ObjectLists.getShopList()[parseInt(data["saveshops"])]=data["shopsdata"];
				if(Shopeditor){
					Shopeditor.editList = ObjectLists.getShopList();
					Shopeditor.didBecomeActive();	
				}	
			}
			else if(data["saveshopswhole"]){
				LocalStorage.refreshShop(data["saveshopswhole"],data["updatetime"]);
				ObjectLists.setShopList(data["saveshopswhole"]);
			}
			else if(data["saveskills"]){
				LocalStorage.changeSkills(parseInt(data["saveskills"]),data["skillsdata"],data["updatetime"]);
				ObjectLists.getSkillsList()[parseInt(data["saveskills"])]=data["skillsdata"];
				if(Skillseditor){
					Skillseditor.editList = ObjectLists.getSkillsList();
					Skillseditor.didBecomeActive();	
				}	
				SkillBars.update();
				if(Skills){
					Skills.updateTileGrid();
				}
			}
			else if(data["saveskillswhole"]){
				LocalStorage.refreshSkills(data["saveskillswhole"],data["updatetime"]);
				ObjectLists.setSkillsList(data["saveskillswhole"]);
				SkillBars.update();
				if(Skills){
					Skills.updateTileGrid();
				}
			}
			else if(data["moveNPC"]){
				data["npcID"]=parseInt(data["npcID"]);
				if(!PlayersController.getNPC(data["npcID"]) || (PlayersController.getNPC(data["npcID"]) && PlayersController.getNPC(data["npcID"]).isWalking ==false)){
					PlayersController.moveNPC(data["npcID"],data["moveNPC"],data["mapnumber"]);
				}else{
					storedClientMessages.push(JSON.stringify(data));
				}
			} else if(data["changeNPCPosition"]){
				if(PlayersController.getNPC(data["npcID"])){
					data["npcID"]=parseInt(data["npcID"]);
					if((PlayersController.getNPC(data["npcID"]) && PlayersController.getNPC(data["npcID"]).isWalking ==false)){
						PlayersController.repositionNPC(data["npcID"],data["changeNPCPosition"]);
					}else{
						storedClientMessages.push(JSON.stringify(data));
					}
				}
			}
			else if(data["savenpcs"]){
				LocalStorage.changeNPC(parseInt(data["savenpcs"]),data["npcsdata"],data["updatetime"]);
				ObjectLists.getNPCList()[parseInt(data["savenpcs"])]=data["npcsdata"];
				GameMap.goToMap(GameMap.getMapNumber(),true);
				if(NPCeditor){
					NPCeditor.editList = ObjectLists.getNPCList();
					NPCeditor.didBecomeActive();	
				}
			}
			else if(data["savenpcswhole"]){
				LocalStorage.refreshNPC(data["savenpcswhole"],data["updatetime"]);
				ObjectLists.setNPCList(data["savenpcswhole"]);
				GameMap.goToMap(GameMap.getMapNumber(),true);
				if(NPCeditor){
					NPCeditor.editList = ObjectLists.getNPCList();
					NPCeditor.didBecomeActive();	
				}
			}
			else if(data["saveitems"]){
				LocalStorage.changeItems(parseInt(data["saveitems"]),data["itemdata"],data["updatetime"]);
				var oldItemName = ObjectLists.getItemList()[parseInt(data["saveitems"])]["name"];
				ObjectLists.getItemList()[parseInt(data["saveitems"])]=data["itemdata"];
				GameMap.goToMap(GameMap.getMapNumber());
		
				if(Inventory){
					Inventory.updateTileGrid();
				}
				PlayersController.getYou().updateItemData(oldItemName,data["itemdata"])
			}

			else if(data["saveitemswhole"]){
				LocalStorage.refreshItems(data["saveitemswhole"],data["updatetime"]);
				ObjectLists.setItemList(data["saveitemswhole"]);
			}

		} 
	} else{
		storedClientMessages.push(JSON.stringify(data));
	}
};


var script = document.createElement("SCRIPT");
script.type = "text/javascript";
script.src = document["ccConfig"]["getServerURL"]() + "/socket.io/socket.io.js";
script.onreadystatechange = setupserver;
script.onload = setupserver;
document.getElementById("gameCanvas").appendChild(script); 