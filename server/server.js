/* Powder Engine Server */
process.chdir(__dirname);

// Require HTTP module (to start server) and Socket.IO
var io = require('socket.io');
var fs = require('fs');
var bcrypt = require('bcrypt');

var config = require('../config.json');
var NetworkBootstrap = require('../common/networkbootstrap.js');

var TOBECHANGED = {};
TOBECHANGED.requiredXpToNextLevel = function(currentLevel){
	return 100*(Math.pow(1.08,currentLevel));
};

TOBECHANGED.healthModifierFromLevel = function(currentLevel){
	return 100 + (currentLevel*50);
};
  
var positions = [];
var mapplayers=[];
var mapNPCS=[];
var clients =[];
var playersOnMapsCount=[];
var mapMasters=[];
var names=[];
var maps=[];
var last=[];
var warps=[];
var items=[];
var skills=[];
var signs=[];
var npcs=[];
var quests=[];
var shops=[];
var scripts=[];
var settings=null;
var updateMapIndex=0;
var updateWarpIndex=1;
var updateItemIndex=2;
var updateSkillsIndex=3;
var updateSignsIndex=4;
var updateNPCIndex=5;
var updateQuestIndex=6;
var updateSettingsIndex=7;
var updateScriptIndex=8;
var updateShopIndex=9;



var droppedItems={};

fs.readdirSync("./maps").forEach(function(file) {
  maps[parseInt(file.split('.')[0])] =require("./maps/" + file);
  playersOnMapsCount[parseInt(file.split('.')[0])]=0;
  mapNPCS[parseInt(file.split('.')[0])]=[];
});

fs.readdirSync("./additionals").forEach(function(file) {
  if(file=="warps.json"){
	warps =require("./additionals/warps.json");
  }  
  if(file=="items.json"){
	items =require("./additionals/items.json");
  }
  if(file=="skills.json"){
	skills =require("./additionals/skills.json");
  }
  if(file=="signs.json"){
	signs =require("./additionals/signs.json");
  }
  if(file=="npcs.json"){
	npcs =require("./additionals/npcs.json");
  }
  if(file=="quests.json"){
	quests =require("./additionals/quests.json");
  }
  if(file=="shops.json"){
	shops =require("./additionals/shops.json");
  }
  if(file=="settings.json"){
	settings =require("./additionals/settings.json");
  }
  if(file=="scripts.json"){
  	scripts=[
		{"data":[{"type":"Will Enter","responses":[{"type":"Block Entry","data":{}}],"requirements":[],"data":{}}],"name":"Block","specifier":"Default","implementsAs":"Tile","abbr":"BLK"},
		{"data":[{"type":"On Game load","responses":[{"type":"Spawn NPC","data":{}}],"requirements":[],"data":{}}],"name":"Spawn NPC","specifier":"Default","implementsAs":"Tile","isTemplate":"1","abbr":"NPC"},
		{"data":[{"type":"On Game load","responses":[{"type":"Spawn Item","data":{}}],"requirements":[],"data":{}}],"name":"Spawn Item","specifier":"Default","implementsAs":"Tile","isTemplate":"1","abbr":"ITM"},
		{"data":[{"type":"On Enter","responses":[{"type":"Warp Player","data":{}}],"requirements":[],"data":{}}],"name":"Warp Player","specifier":"Default","implementsAs":"Tile","isTemplate":"1","abbr":"WRP"}
  	];
	var userscripts =require("./additionals/scripts.json");
	for(var i in userscripts){
		scripts.push(userscripts[i]);
	}
  }
});


if(fs.existsSync('./tools/updatedata.json')){
	try{
		last=require('./tools/updatedata.json');
	}catch(e){

	}
}

var requestHandler = function(req, res){ 
    // Send HTML headers and message
    res.writeHead(200,{ 'Content-Type': 'text/html' }); 
    res.end('<h1>Hello Socket Lover!</h1>');
};

var parsedPort = parseInt(config.server.port || 1337);
var networkBootstrap = new NetworkBootstrap(config);
var server = networkBootstrap.createServerInstance(requestHandler);

server.listen(parsedPort);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server, { origins: '*:*' });

socket.on('message',function(data) {
  console.log('Received a message from the server!',data);
});

saveNewPlayer = function(client,playerName,playerData){
	var outputFilename = 'users/'+playerName+'.json';
	fs.writeFile(outputFilename, JSON.stringify(playerData), function(err) {
		client.send(JSON.stringify({"registrationsuccess":1}));
	});
};

savePlayer = function(client,playerName,playerData){
	var outputFilename = 'users/'+playerName+'.json';
	fs.writeFile(outputFilename, JSON.stringify(playerData), function(err) {
		client.send(JSON.stringify({"savesuccess":1}));
	});
};

var setMapData = function(mapnumber,data){
	var outputFilename = 'maps/'+mapnumber+'.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setWarpData = function(data){
	var outputFilename = './additionals/warps.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setItemData = function(data){
	var outputFilename = './additionals/items.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setSkillsData = function(data){
	var outputFilename = './additionals/skills.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setSignsData = function(data){
	var outputFilename = './additionals/signs.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setNPCData = function(data){
	var outputFilename = './additionals/npcs.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setQuestData = function(data){
	var outputFilename = './additionals/quests.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setShopData = function(data){
	var outputFilename = './additionals/shops.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var setScriptData = function(data){
	var outputFilename = './additionals/scripts.json';
	var newData = [];
	for(var i=4;i<data.length;i++){
		newData.push(data[i]);
	}
	fs.writeFile(outputFilename, JSON.stringify(newData), function(err) {});
};


var setSettingsData = function(data){
	var outputFilename = './additionals/settings.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
};

var saveLastAccessData = function(){
	var outputFilename = 'tools/updatedata.json';
	fs.writeFile(outputFilename, JSON.stringify(last), function(err) {});
};


// Add a connect listener
socket.on('connection', function(client){ 
    // Success!  Now listen to messages to be received
    client.on('message',function(event){
		event = JSON.parse(event);
		if(event["newUser"]){

			if(fs.existsSync("users/"+event["name"]+".json")){
				client.send(JSON.stringify({"registrationfailed":"UserTaken"}));
			}else{
				var skillLevels = {};
				for(var i in skills){
					skillLevels[skills[i]["name"]]={"level":0,"experience":0,"currenthealth":100,"maxhealth":100, "modifier":0};
				}


				var newPlayerData = {
					"pass": bcrypt.hashSync(event["password"], 10),
					"email": event["email"],
					"registrationdate": Date.now(),
					"rank":3,
					"location":{"mapnumber":1,"position":100},
					"race":0,
					"class":0,
					"clan":"",
					"guilds":[],
					"quests":[],
					"friends":[],
					"skills":skillLevels,
					"pets":[],
					"pmessages":[],
					"lastchats":[],
					"inventory":[],
					"bank":[],
					"equipment":{},
					"extraData":[],
				}
				saveNewPlayer(client,event["name"],newPlayerData);
			}
		}

		if(event["saveUser"]){
			if(fs.existsSync("users/"+event["name"]+".json")){
				var playerData = require("./users/"+event["name"]+".json");
				playerData["location"]=event["location"];
				playerData["inventory"]=event["inventory"];
				playerData["equipment"]=event["equipment"];
				playerData["bank"]=event["bank"];
				playerData["extraData"]=event["extraData"];
				savePlayer(client,event["name"],playerData);
			}
		}

		if(event["saveUserExtra"]){
			if(fs.existsSync("users/"+event["name"]+".json")){
				var playerData = require("./users/"+event["name"]+".json");
				playerData["extraData"]=event["saveUserExtra"];
				savePlayer(client,event["name"],playerData);
			}
		}

		if(event["login"]){
			for(var i in names){
				if(names[i]==event["username"]){
					client.send(JSON.stringify({"login_fail":"Login failed, user is already online."}));
					return;
				}
			}
			if(names.indexOf(event["username"])==-1){
				if(!fs.existsSync("users/"+event["username"]+".json")){
					client.send(JSON.stringify({"login_fail":"Login failed, Username doesn't exist."}));
				}else{
					var playerData = require("./users/"+event["username"]+".json");
					if(!bcrypt.compareSync(event["password"], playerData["pass"])){
						client.send(JSON.stringify({"login_fail":"Login failed, password is incorrect."}))
					}else{

						var skillLevels = {};
						for(var i in skills){
							if(!playerData["skills"][skills[i]["name"]]){
								playerData["skills"][skills[i]["name"]]={"level":0,"experience":0,"currenthealth":100,"maxhealth":100,"modifier":0};
							}
						}

						for(var i in playerData["skills"]){
							playerData["skills"][i]["requirement"]=TOBECHANGED.requiredXpToNextLevel(playerData["skills"][i]["level"]);
						}

						playerData={
							"name":event["username"],
							"rank":playerData["rank"],
							"race":playerData["race"],
							"class":playerData["class"],
							"clan":playerData["clan"],
							"guilds":playerData["guilds"],
							"quests":playerData["quests"],
							"friends":playerData["friends"],
							"skills":playerData["skills"],
							"pets":playerData["pets"],
							"pmessages":playerData["pmessages"],
							"lastchats":playerData["lastchats"],
							"location":playerData["location"],
							"inventory":playerData["inventory"],
							"bank":playerData["bank"],
							"equipment":playerData["equipment"],
							"extraData":playerData["extraData"],
						};
						client.send(JSON.stringify({"login_success":playerData}));
						names[client.id]=event["username"];
						clients[client.id]=client;
						mapplayers[event["username"]]=playerData["location"]["mapnumber"];
						if(playersOnMapsCount[playerData["location"]["mapnumber"]]==0){
							mapMasters[playerData["location"]["mapnumber"]]=names[client.id];
							client.send(JSON.stringify({"mapmaster":true}));
						}
						playersOnMapsCount[playerData["location"]["mapnumber"]]++;
						client.broadcast.send(JSON.stringify({"newPlayer":1,"id":event["username"],"position":playerData["location"]["position"],"mapnumber":playerData["location"]["mapnumber"]}));
						for(var i in clients){
							if(i!=client.id && clients[i]){
								if(positions[i]){
									client.send(JSON.stringify({"id":names[i],"mapnumber":mapplayers[names[i]], "position":positions[i], "setTo":1}));
								}
							}
						}
						for(var i in droppedItems[playerData["location"]["mapnumber"]]){
							client.send(JSON.stringify(droppedItems[playerData["location"]["mapnumber"]][i]));
						}
						for(var i in mapNPCS[playerData["location"]["mapnumber"]]){
							client.send(JSON.stringify({"changeNPCPosition":mapNPCS[playerData["location"]["mapnumber"]][i],"npcID":i}));
						}
					}
				}
			}
		}
		
		if(event["sync"]){
			var returner = {"sync":true};
			if(!last[updateMapIndex] || event["mapupdate"]<last[updateMapIndex]){
				if(!last[updateMapIndex]){
					last[updateMapIndex]=Date.now();
					saveLastAccessData();
				}
				returner["maptime"] = last[updateMapIndex];
				returner["mapdata"] = maps;
			}
			if(!last[updateWarpIndex] || event["warpupdate"]<last[updateWarpIndex]){
				if(!last[updateWarpIndex]){
					last[updateWarpIndex]=Date.now();
					saveLastAccessData();
				}
				returner["warptime"] = last[updateWarpIndex];
				returner["warpdata"] = warps;
			}
			if(!last[updateScriptIndex] || event["scriptsupdate"]<last[updateScriptIndex]){
				if(!last[updateScriptIndex]){
					last[updateScriptIndex]=Date.now();
					saveLastAccessData();
				}
				returner["scriptstime"] = last[updateScriptIndex];
				returner["scriptsdata"] = scripts;
			}
			if(!last[updateItemIndex] || event["itemupdate"]<last[updateItemIndex]){
				if(!last[updateItemIndex]){
					last[updateItemIndex]=Date.now();
					saveLastAccessData();
				}
				returner["itemtime"] = last[updateItemIndex];
				returner["itemdata"] = items;
			}
			if(!last[updateSkillsIndex] || event["skillsupdate"]<last[updateSkillsIndex]){
				if(!last[updateSkillsIndex]){
					last[updateSkillsIndex]=Date.now();
					saveLastAccessData();
				}
				returner["skillstime"] = last[updateSkillsIndex];
				returner["skillsdata"] = skills;
			}
			if(!last[updateSignsIndex] || event["signsupdate"]<last[updateSignsIndex]){
				if(!last[updateSignsIndex]){
					last[updateSignsIndex]=Date.now();
					saveLastAccessData();
				}
				returner["signstime"] = last[updateSignsIndex];
				returner["signsdata"] = signs;
			}
			if(!last[updateNPCIndex] || event["npcsupdate"]<last[updateNPCIndex]){
				if(!last[updateNPCIndex]){
					last[updateNPCIndex]=Date.now();
					saveLastAccessData();
				}
				returner["npcstime"] = last[updateNPCIndex];
				returner["npcsdata"] = npcs;
			}
			if(!last[updateQuestIndex] || event["questsupdate"]<last[updateQuestIndex]){
				if(!last[updateQuestIndex]){
					last[updateQuestIndex]=Date.now();
					saveLastAccessData();
				}
				returner["queststime"] = last[updateQuestIndex];
				returner["questdata"] = quests;
			}



			if(!last[updateShopIndex] || event["shopsupdate"]<last[updateShopIndex]){
				if(!last[updateShopIndex]){
					last[updateShopIndex]=Date.now();
					saveLastAccessData();
				}
				returner["shopstime"] = last[updateShopIndex];
				returner["shopsdata"] = shops;
			}
			if(!last[updateSettingsIndex] || event["settingsupdate"]<last[updateSettingsIndex]){
				if(!last[updateSettingsIndex]){
					last[updateSettingsIndex]=Date.now();
					saveLastAccessData();
				}
				returner["settingstime"] = last[updateSettingsIndex];
				returner["settingsdata"] = settings;
			}
			client.send(JSON.stringify(returner));
		}

		
		if(event["moveTo"]){
			client.broadcast.send(JSON.stringify({"moveTo":1,"position":event["moveTo"],"mapnumber":mapplayers[names[client.id]],"id":names[client.id]}));
			positions[client.id]= event["moveTo"];
		}
		if(event["droppeditem"]){
			client.send(JSON.stringify({"droppeditem":event["droppeditem"], "mapnumber":event["mapnumber"], "index":event["index"],"amount":event["amount"]}));
			client.broadcast.send(JSON.stringify({"droppeditem":event["droppeditem"],"mapnumber":event["mapnumber"],"index":event["index"],"amount":event["amount"]}));
			if(!droppedItems[event["mapnumber"]]){
				droppedItems[event["mapnumber"]]=[];
			}
			droppedItems[event["mapnumber"]].push({"droppeditem":event["droppeditem"],"mapnumber":event["mapnumber"],"index":event["index"],"amount":event["amount"]});
		}
		if(event["pickupitem"]){
			client.send(JSON.stringify({"pickupitem":event["pickupitem"],"mapnumber":event["mapnumber"]}));
			client.broadcast.send(JSON.stringify({"pickupitem":event["pickupitem"],"mapnumber":event["mapnumber"]}));
			if(event["temp"]){
				var droppedarr = droppedItems[event["mapnumber"]];
				for(var i=droppedarr.length-1;i>=0;i--){
					if(droppedarr[i]["index"]==event["pickupitem"]){
						droppedItems[event["mapnumber"]].splice(i,1);
						break;
					}
				}
			}
		}
		if(event["savemap"]){
			last[updateMapIndex]=Date.now();
			saveLastAccessData();
			setMapData(event["savemap"],event["mapdata"]);
			maps[event["savemap"]]=event["mapdata"];
			event["updatetime"]=last[updateMapIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savewarps"]){
			last[updateWarpIndex]=Date.now();
			saveLastAccessData();
			warps[parseInt(event["savewarps"])]=event["warpdata"];
			setWarpData(warps);
			event["updatetime"]=last[updateWarpIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savewarpswhole"]){
			last[updateWarpIndex]=Date.now();
			saveLastAccessData();
			warps=event["savewarpswhole"];
			setWarpData(warps);
			event["updatetime"]=last[updateWarpIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savescripts"]){
			last[updateScriptIndex]=Date.now();
			saveLastAccessData();
			scripts[parseInt(event["savescripts"])]=event["scriptsdata"];
			setScriptData(scripts);
			event["updatetime"]=last[updateScriptIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savescriptswhole"]){
			last[updateScriptIndex]=Date.now();
			saveLastAccessData();
			scripts=event["savescriptswhole"];
			setScriptData(scripts);
			event["updatetime"]=last[updateScriptIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savesettings"]){
			last[updateSettingsIndex]=Date.now();
			saveLastAccessData();
			settings = event["savesettings"];
			setSettingsData(event["savesettings"]);
			event["updatetime"]=last[updateSettingsIndex];
			client.broadcast.send(JSON.stringify(event));
		}
        if(event["saveitems"]){
			last[updateItemIndex]=Date.now();
			saveLastAccessData();
			items[parseInt(event["saveitems"])]=event["itemdata"];
			setItemData(items);
			event["updatetime"]=last[updateItemIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["saveitemswhole"]){
			last[updateItemIndex]=Date.now();
			saveLastAccessData();
			items=event["saveitemswhole"];
			setItemData(items);
			event["updatetime"]=last[updateItemIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
        if(event["savenpcs"]){
			last[updateNPCIndex]=Date.now();
			saveLastAccessData();
			npcs[parseInt(event["savenpcs"])]=event["npcsdata"];
			setNPCData(npcs);
			event["updatetime"]=last[updateNPCIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savenpcswhole"]){
			last[updateNPCIndex]=Date.now();
			saveLastAccessData();
			npcs=event["savenpcswhole"];
			setNPCData(npcs);
			event["updatetime"]=last[updateNPCIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
 		 if(event["savequests"]){
			last[updateQuestIndex]=Date.now();
			saveLastAccessData();
			quests[parseInt(event["savequests"])]=event["questdata"];
			setQuestData(quests);
			event["updatetime"]=last[updateQuestIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savequestswhole"]){
			last[updateQuestIndex]=Date.now();
			saveLastAccessData();
			quests=event["savequestswhole"];
			setQuestData(quests);
			event["updatetime"]=last[updateQuestIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["saveshops"]){
			last[updateShopIndex]=Date.now();
			saveLastAccessData();
			shops[parseInt(event["saveshops"])]=event["shopsdata"];
			setShopData(shops);
			event["updatetime"]=last[updateShopIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["saveshopswhole"]){
			last[updateShopIndex]=Date.now();
			saveLastAccessData();
			shops=event["saveshopswhole"];
			setShopData(shops);
			event["updatetime"]=last[updateShopIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["moveNPC"]){
			client.broadcast.send(JSON.stringify(event));
			mapNPCS[event["mapnumber"]][event["npcID"]]=event["moveNPC"];
		}
       if(event["saveskills"]){
			last[updateSkillsIndex]=Date.now();
			saveLastAccessData();
			skills[parseInt(event["saveskills"])]=event["skillsdata"];
			setSkillsData(skills);
			event["updatetime"]=last[updateSkillsIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["saveskillswhole"]){
			last[updateSkillsIndex]=Date.now();
			saveLastAccessData();
			skills=event["saveskillswhole"];
			setSkillsData(skills);
			event["updatetime"]=last[updateSkillsIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
       if(event["savesigns"]){
			last[updateSignsIndex]=Date.now();
			saveLastAccessData();
			signs[parseInt(event["savesigns"])]=event["signsdata"];
			setSignsData(signs);
			event["updatetime"]=last[updateSignsIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["savesignswhole"]){
			last[updateSignsIndex]=Date.now();
			saveLastAccessData();
			signs=event["savesignswhole"];
			setSignsData(signs);
			event["updatetime"]=last[updateSignsIndex];
			client.broadcast.send(JSON.stringify(event));
			client.send(JSON.stringify(event));
		}
		if(event["chatMessage"]){
			client.broadcast.send(JSON.stringify({"chatMessage":names[client.id]+": "+event["chatMessage"]}));
		}
		if(event["logout"]){
			client.broadcast.send(JSON.stringify({"playerLeft":names[client.id]}));
			names[client.id]=undefined;
			positions[client.id]=undefined;
		}
		if(event["disconnect"]){
			client.broadcast.send(JSON.stringify({"playerLeft":names[client.id]}));
			clients[client.id]=undefined;
			names[client.id]=undefined;
			positions[client.id]=undefined;
		}
		if(event["changemap"]){
			client.broadcast.send(JSON.stringify({"id":names[client.id],"position":positions[client.id],"mapnumber":event["changemap"],"setTo":1}));
			if(playersOnMapsCount[event["changemap"]]==0){
				client.send(JSON.stringify({"mapmaster":true}));
				mapMasters[event["changemap"]]=names[client.id];
			}
			playersOnMapsCount[event["changemap"]]++;
			if(mapplayers[names[client.id]]){
				var mapNumberFrom = mapplayers[names[client.id]];
				playersOnMapsCount[mapplayers[names[client.id]]]--;
				mapplayers[names[client.id]]=event["changemap"];
				for(var i in clients){
					if(mapplayers[names[i]]==mapNumberFrom){
						console.log("New Master is " + i)
						clients[i].send(JSON.stringify({"mapmaster":true}));
						mapMasters[mapplayers[names[i]]]=mapplayers[names[i]];
						break;
					}
				}
			}
			for(var i in droppedItems[event["changemap"]]){
				client.send(JSON.stringify({"droppeditem":droppedItems[event["changemap"]][i]["droppeditem"],"mapnumber":event["changemap"],"index":droppedItems[event["changemap"]][i]["index"],"amount":event["amount"]}));
			}
			for(var i in mapNPCS[event["changemap"]]){
				client.send(JSON.stringify({"changeNPCPosition":mapNPCS[event["changemap"]][i],"npcID":i}));
			}
		}
		if(event["diceroll"]){
			client.broadcast.send(JSON.stringify({"diceroll":event["diceroll"]}));
		}
		if(event["coinflip"]){
			client.broadcast.send(JSON.stringify({"coinflip":event["coinflip"]}));
		}
		if(event["dance"]){
			client.broadcast.send(JSON.stringify({"dance":event["dance"]}));
		}
		if(event["afk"]){
			var number = Math.floor( Math.random() * (6 - 1) + 1);
			client.broadcast.send(JSON.stringify({"afk":names[client.id]}));
		}
    });

    client.on('disconnect',function(){
       if(names[client.id]){
	       var mapNumberFrom = mapplayers[names[client.id]];
	       client.broadcast.send(JSON.stringify({"playerLeft":names[client.id]}));
		   client.send(JSON.stringify({"disconnect":true}));
		   console.log(names[client.id]+" HAS DISCONNECTED");
		   playersOnMapsCount[mapplayers[names[client.id]]]--;
		   mapplayers[names[client.id]]=undefined;
		   clients[client.id]=undefined;
		   names[client.id]=undefined;
		   positions[client.id]=undefined;
			for(var i in clients){
				if(clients[i]){
					if(mapplayers[names[i]]==mapNumberFrom){
						clients[i].send(JSON.stringify({"mapmaster":true}));
						mapMasters[mapplayers[names[i]]]=mapplayers[names[i]];
						break;
					}
				}
			}
		}
    });
});

  
  
  
  
  
  

