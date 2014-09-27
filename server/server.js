// Require HTTP module (to start server) and Socket.IO
//Server file
var http = require('http');
var fs = require('fs');
var io = require('socket.io');


var fs = require('fs')
fs.readFile('config.txt', 'utf8', function (err,data) {
var port = parseInt(data.split("\n")[1]);
  
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
   if(file=="settings.json"){
	settings =require("./additionals/settings.json");
  }
  if(file=="scripts.json"){
	scripts =require("./additionals/scripts.json");
  }
});



last=require('./tools/updatedata.json');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 
    // Send HTML headers and message
    res.writeHead(200,{ 'Content-Type': 'text/html' }); 
    res.end('<h1>Hello Socket Lover!</h1>');
});

server.listen(port);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

socket.on('message',function(data) {
  console.log('Received a message from the server!',data);
});

saveNewPlayer = function(client,playerName,playerData){
	var outputFilename = 'users/'+playerName+'.json';
	fs.writeFile(outputFilename, JSON.stringify(playerData), function(err) {
		client.send(JSON.stringify({"registrationsuccess":1}));
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

var setScriptData = function(data){
	var outputFilename = './additionals/scripts.json';
	fs.writeFile(outputFilename, JSON.stringify(data), function(err) {});
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
				var newPlayerData = {
					"pass":event["password"],
					"email":event["email"],
					"registrationdate":Date.now(),
					"rank":1,
					"location":{"mapnumber":1,"position":100},
					"race":0,
					"class":0,
					"clan":"",
					"guilds":[],
					"quests":[],
					"friends":[],
					"skills":[],
					"pets":[],
					"pmessages":[],
					"lastchats":[],
					"health":100,
					"inventory":[],
					"equipment":[]
				}
				saveNewPlayer(client,event["name"],newPlayerData);
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
					client.send(JSON.stringify({"login_fail":"Login failed, Username or Password is incorrect."}));
				}else{
					var playerData = require("./users/"+event["username"]+".json");
					if(event["password"]!=playerData["pass"]){
						client.send(JSON.stringify({"login_fail":"Login failed, Username or Password is incorrect."}))
					}else{
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
							"health":100,
							"location":playerData["location"],
							"inventory":playerData["inventory"],
							"equipment":playerData["equipment"],
						};
						client.send(JSON.stringify({"login_success":playerData}));
						names[client.id]=event["username"];
						clients[client.id]=client;
						mapplayers[event["username"]]=1;
						if(playersOnMapsCount[1]==0){
							mapMasters[1]=names[client.id];
							client.send(JSON.stringify({"mapmaster":true}));
						}
						playersOnMapsCount[1]++;
						client.broadcast.send(JSON.stringify({"newPlayer":event["username"]}));
						for(var i in clients){
							if(i!=client.id && clients[i]){
								if(positions[i]){
									client.send(JSON.stringify({"moveTo":positions[i],"id":names[i]}));
									client.send(JSON.stringify({"changemap":mapplayers[names[i]],"id":names[i],"setTo":positions[i]}));
								} else{
									client.send(JSON.stringify({"moveTo":"default","id":names[i]}));
								}
							}
						}
						for(var i in droppedItems[1]){
							client.send(JSON.stringify(droppedItems[1][i]));
						}
						for(var i in mapNPCS[1]){
							client.send(JSON.stringify({"changeNPCPosition":mapNPCS[1][i],"npcID":i}));
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
			client.broadcast.send(JSON.stringify({"moveTo":event["moveTo"],"id":names[client.id]}));
			positions[client.id]= event["moveTo"];
		}
		if(event["droppeditem"]){
			client.send(JSON.stringify({"droppeditem":event["droppeditem"], "mapnumber":event["mapnumber"], "index":event["index"]}));
			client.broadcast.send(JSON.stringify({"droppeditem":event["droppeditem"],"mapnumber":event["mapnumber"],"index":event["index"]}));
			if(!droppedItems[event["mapnumber"]]){
				droppedItems[event["mapnumber"]]=[];
			}
			droppedItems[event["mapnumber"]].push({"droppeditem":event["droppeditem"],"mapnumber":event["mapnumber"],"index":event["index"]});
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
			client.broadcast.send(JSON.stringify({"id":names[client.id],"changemap":event["changemap"],"setTo":event["setTo"]}));
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
				client.send(JSON.stringify({"droppeditem":droppedItems[event["changemap"]][i]["droppeditem"],"mapnumber":event["changemap"],"index":droppedItems[event["changemap"]][i]["index"]}));
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
    });
});

  
  
  
  
  
  
});

