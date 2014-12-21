var storedClientMessages=[];

var socket = io.connect(ccconfig["SERVER:PORT"],{
		'sync disconnect on unload':true,
		'connect timeout':5000,
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
	reactToSocketMessage(data);
});

reactToSocketMessage=function(data){
	data = JSON.parse(data);
	var allow=false;
	for(var prop in data){ allow=true; break;}
	//Objects without data are useless.
	if(allow==false)
		return;
	console.log('Received a message from the server!',data);
	
	if(data["sync"]){
		if(data["mapdata"]){
			LocalStorage.updateMapData(data["mapdata"],data["maptime"]);
		}
		if(data["warpdata"]){
			LocalStorage.updateWarpData(data["warpdata"],data["warptime"]);
		}
		if(data["itemdata"]){
			LocalStorage.updateItemData(data["itemdata"],data["itemtime"]);
		}
		if(data["skillsdata"]){
			LocalStorage.updateSkillsData(data["skillsdata"],data["skillstime"]);
		}
		if(data["signsdata"]){
			LocalStorage.updateSignsData(data["signsdata"],data["signstime"]);
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
		return;
	}
	
	var screen = SceneManager.getInstance().currentScene;
	if(screen){
		if(data["connect"]){
			screen.setServerConnected(true);
		} else if(data["disconnect"]){
			screen.setServerConnected(false);
		}
		if(screen.getIdentifier()=="Game"){
			if(data["newPlayer"]){
				PlayersController.addPlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
			}else if(data["playerLeft"]){
				if(PlayersController.getPlayer(data["playerLeft"]).getMap()==PlayersController.getYou().getMap()) {
					MapMaster=false;
				}
				PlayersController.destroyPlayer(data["playerLeft"]);
			} 
			else if(data["setTo"]){
				if(!PlayersController.getPlayer(data["id"])|| (PlayersController.getPlayer(data["id"]) && PlayersController.getPlayer(data["id"]).isWalking ==false)){
					for(var i=0;i<storedClientMessages.length;i++){
						var msg = JSON.parse(storedClientMessages[i]);
						if(msg["moveTo"] && msg["moveTo"]!=null && msg["id"]==data["id"]) {
							storedClientMessages.splice(i,1);
							i--;
						}
					}

					PlayersController.positionPlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
				
					if(PlayersController.getPlayer(data["id"]).getMap()==PlayersController.getYou().getMap()) {
						MapMaster=false;
					}
					PlayersController.changePlayerMap(data["id"],data["mapnumber"]);


				}else{
					storedClientMessages.push(JSON.stringify(data));
				}
			}
			else if(data["moveTo"]){
				if(!PlayersController.getPlayer(data["id"]) || (PlayersController.getPlayer(data["id"]) && PlayersController.getPlayer(data["id"]).isWalking ==false)){
					PlayersController.movePlayer({"id":data["id"],"location":{"position":data["position"],"mapnumber":data["mapnumber"]}});
				}else{
					storedClientMessages.push(JSON.stringify(data));
				}
			}
			else if(data["chatMessage"]){
				GameChat.addMessage(data["chatMessage"]);
			}
			else if(data["coinflip"]){
				GameChat.addMessage(data["coinflip"]);
			} 
			else if(data["diceroll"]){
				GameChat.addMessage(data["diceroll"]);
			} 
			else if(data["dance"]){
				GameChat.addMessage(data["dance"]);
			} 
			else if(data["afk"]){
				PlayersController.changePlayerStatus(data["afk"],"AFK");
			} 
			else if(data["savemap"]){
				LocalStorage.changeMap(data["savemap"],data["mapdata"],data["updatetime"]);
				GameMap.setupMap(data["mapdata"]);
			}
			else if(data["mapmaster"]){
				MapMaster=true;
			}
			else if(data["savewarps"]){
				LocalStorage.changeWarp(parseInt(data["savewarps"]),data["warpdata"],data["updatetime"]);
				ObjectLists.getWarpList()[parseInt(data["savewarps"])]=data["warpdata"];
				if(Warpeditor){
					Warpeditor.editList = ObjectLists.getWarpList();
					Warpeditor.didBecomeActive();	
				}	
			}
			else if(data["savewarpswhole"]){
				LocalStorage.refreshWarp(data["savewarpswhole"],data["updatetime"]);
				ObjectLists.setWarpList(data["savewarpswhole"]);
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
			else if(data["savesettings"]){
				LocalStorage.updateSettingsData(data["savesettings"],data["updatetime"]);
				settingsData = mergeSettings(settingsData,data["savesettings"]);
				if(Settingseditor){
					Settingseditor.data = cloneObj(settingsData);
					Settingseditor.prepareList();
				}
			}
			else if(data["savequests"]){
				LocalStorage.changeQuest(parseInt(data["savequests"]),data["questdata"],data["updatetime"]);
				ObjectLists.getQuestList()[parseInt(data["savequests"])]=data["questdata"];
				if(Questeditor){
					Questeditor.editList = ObjectLists.getQuestList();
					Questeditor.didBecomeActive();	
				}	
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
			else if(data["savesigns"]){
				LocalStorage.changeSigns(parseInt(data["savesigns"]),data["signsdata"],data["updatetime"]);
				ObjectLists.getSignsList()[parseInt(data["savesigns"])]=data["signsdata"];
				if(Signeditor){
					Signeditor.editList = ObjectLists.getSignsList();
					Signeditor.didBecomeActive();	
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

			else if(data["savesignswhole"]){
				LocalStorage.refreshSigns(data["savesignswhole"],data["updatetime"]);
				ObjectLists.setSignsList(data["savesignswhole"]);
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
				if(Itemeditor){
					Itemeditor.editList = ObjectLists.getItemList();
					Itemeditor.didBecomeActive();	
				}			
				if(Inventory){
					Inventory.updateTileGrid();
				}
				PlayersController.getYou().updateItemData(oldItemName,data["itemdata"])
			}
			else if(data["droppeditem"]){
				if(data["mapnumber"] == GameMap.getMapNumber() && GameMap.getInstance().isMapDirty==false){
					var tile = GameMap.getTileNodeForIndex(data["index"]);
					tile.addItem(data["droppeditem"],data["amount"]);
					GameMap.updateMap();
				} else{
					storedClientMessages.push(JSON.stringify(data));
				}
			}
			else if(data["pickupitem"]){
				if(data["mapnumber"] == GameMap.getMapNumber()){
					var tile = GameMap.getTileNodeForIndex(data["pickupitem"]);
					tile.removeItem();
					GameMap.updateMap();
				}
			}
			else if(data["saveitemswhole"]){
				LocalStorage.refreshItems(data["saveitemswhole"],data["updatetime"]);
				ObjectLists.setItemList(data["saveitemswhole"]);
			}
			else if(data["savesuccess"]){
				screen.gameSaved();
			}
		} else if(screen.getIdentifier()=="Login"){
			if(data["login_success"]){
				screen.onLoginSuccess(data["login_success"]);
			} else if(data["login_fail"]){
				screen.onLoginFailed(data["login_fail"]);
			}else if(data["registrationsuccess"]){
				screen.completedRegistration();
			}else if(data["registrationfailed"]){
				screen.failedRegistration(data["registrationfailed"]);
			}
		}
	} else{
		storedClientMessages.push(JSON.stringify(data));
	}
};



socket.on('disconnect',function() {
  console.log('The client has disconnected!');
  var screen = SceneManager.getInstance().currentScene;
  if(screen){
		screen.setServerConnected(false);
  }	else{
		storedClientMessages.push(JSON.stringify({"disconnect":true}));
	}
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
  socket.send(JSON.stringify(message));
};