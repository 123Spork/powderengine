var storedClientMessages=[];

var request = new XMLHttpRequest();
request.open("GET", "config.txt", false);
request.send(null);
var returnValue = request.responseText;

var host = returnValue.split("\n")[0];
var port = returnValue.split("\n")[1];
if(port){
	host+=":"+port;
}

var socket = io.connect(host,{
		'sync disconnect on unload':true,
		'connect timeout':5000,
		'reconnection delay ':100,
	}
); 

socket.on('connect',function() {
   LocalStorage.Create();
   LocalStorage.Sync();
   
   console.log('Client has connected to the server!');
   var gameScreen = SceneManager.getInstance().currentScene;
   if(gameScreen){
		gameScreen.setServerConnected(true);
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
				PlayersController.addPlayer(data["newPlayer"]);
			}else if(data["playerLeft"]){
				PlayersController.destroyPlayer(data["playerLeft"]);
			} else if(data["changemap"]){
				for(var i=0;i<storedClientMessages.length;i++){
					var msg = JSON.parse(storedClientMessages[i]);
					if(msg["moveTo"] && msg["id"]==data["id"]) {
						console.log("REMOVIN");
						storedClientMessages.splice(i,1);
						i--;
					}
				}
				PlayersController.changePlayerMap(data["id"],data["changemap"]);
				PlayersController.positionPlayer(data["id"],data["setTo"]);
			}
			else if(data["setTo"]){
				if(!PlayersController.getPlayer(data["id"])|| (PlayersController.getPlayer(data["id"]) && PlayersController.getPlayer(data["id"]).isWalking ==false)){
					PlayersController.positionPlayer(data["id"],data["setTo"]);
				}else{
					storedClientMessages.push(JSON.stringify(data));
				}
			}
			else if(data["moveTo"]){
				if(!PlayersController.getPlayer(data["id"]) || (PlayersController.getPlayer(data["id"]) && PlayersController.getPlayer(data["id"]).isWalking ==false)){
					PlayersController.movePlayer(data["id"],data["moveTo"]);
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
			else if(data["savewarps"]){
				LocalStorage.changeWarp(parseInt(data["savewarps"]),data["warpdata"],data["updatetime"]);
				ObjectLists.getWarpList()[parseInt(data["savewarps"])]=data["warpdata"];
			}
			else if(data["savewarpswhole"]){
				LocalStorage.refreshWarp(data["savewarpswhole"],data["updatetime"]);
				ObjectLists.setWarpList(data["savewarpswhole"]);
			}
			else if(data["saveitems"]){
				LocalStorage.changeItem(parseInt(data["saveitems"]),data["itemdata"],data["updatetime"]);
				ObjectLists.getItemList()[parseInt(data["savewarps"])]=data["itemdata"];
				GameMap.goToMap(GameMap.getMapNumber());
			}
			else if(data["droppeditem"]){
				if(data["mapnumber"] == GameMap.getMapNumber()){
					var tile = GameMap.getTileNodeForIndex(data["index"]);
					tile.addDroppedItem(data["droppeditem"]);
					GameMap.updateMap();
				}
			}
			else if(data["pickupitem"]){
				if(data["mapnumber"] == GameMap.getMapNumber()){
					var tile = GameMap.getTileNodeForIndex(data["pickupitem"]);
					tile.pickupItem();
					GameMap.updateMap();
				}
			}
			else if(data["saveitemswhole"]){
				LocalStorage.refreshItems(data["saveitemswhole"],data["updatetime"]);
				ObjectLists.setItemList(data["saveitemswhole"]);
			}
		} else if(screen.getIdentifier()=="Login"){
			if(data["login_success"]){
				screen.onLoginSuccess();
			} else if(data["login_fail"]){
				screen.onLoginFailed(data["login_fail"]);
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