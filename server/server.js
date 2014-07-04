// Require HTTP module (to start server) and Socket.IO
//Server file
var http = require('http');
var fs = require('fs');
var io = require('socket.io');


var fs = require('fs')
fs.readFile('config.txt', 'utf8', function (err,data) {
var port = parseInt(data.split("\n")[1]);
  
var positions = [];
var clients =[];
var names=[];
var maps=[];
var last=[];
var warps=[];
var items=[];
var updateMapIndex=0;
var updateWarpIndex=1;
var updateItemIndex=2;


var droppedItems={};

fs.readdirSync("./maps").forEach(function(file) {
  maps[parseInt(file.split('.')[0])] =require("./maps/" + file);
});
fs.readdirSync("./additionals").forEach(function(file) {
  if(file=="warps.json"){
	warps =require("./additionals/warps.json");
  }  
  if(file=="items.json"){
	items =require("./additionals/items.json");
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

var saveLastAccessData = function(){
	var outputFilename = 'tools/updatedata.json';
	fs.writeFile(outputFilename, JSON.stringify(last), function(err) {});
};


// Add a connect listener
socket.on('connection', function(client){ 
    // Success!  Now listen to messages to be received
    client.on('message',function(event){
		event = JSON.parse(event);
		if(event["login"]){
			for(var i in names){
				if(names[i]==event["username"]){
					client.send(JSON.stringify({"login_fail":"Username in use already."}));
					return;
				}
			}
			if(names.indexOf(event["username"])==-1){
				client.send(JSON.stringify({"login_success":true}));
				names[client.id]=event["username"];
				clients[client.id]=true;
				client.broadcast.send(JSON.stringify({"newPlayer":event["username"]}));
				for(var i in clients){
					if(i!=client.id && clients[i]==true){
						if(positions[i]){
							client.send(JSON.stringify({"moveTo":positions[i],"id":names[i]}));
						} else{
							client.send(JSON.stringify({"moveTo":"default","id":names[i]}));
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
			if(!last[updateMapIndex] || event["warpupdate"]<last[updateWarpIndex]){
				if(!last[updateWarpIndex]){
					last[updateWarpIndex]=Date.now();
					saveLastAccessData();
				}
				returner["warptime"] = last[updateMapIndex];
				returner["warpdata"] = warps;
			}
			if(!last[updateMapIndex] || event["itemupdate"]<last[updateItemIndex]){
				if(!last[updateItemIndex]){
					last[updateItemIndex]=Date.now();
					saveLastAccessData();
				}
				returner["itemtime"] = last[updateMapIndex];
				returner["itemdata"] = items;
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
			for(var i in droppedItems[event["changemap"]]){
				client.send(JSON.stringify({"droppeditem":droppedItems[event["changemap"]][i]["droppeditem"],"mapnumber":event["changemap"],"index":droppedItems[event["changemap"]][i]["index"]}));
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
       client.broadcast.send(JSON.stringify({"playerLeft":names[client.id]}));
	   client.send(JSON.stringify({"disconnect":true}));
	   console.log("CLIENT HAS DISCONNECTED");
	   clients[client.id]=undefined;
	   names[client.id]=undefined;
	   positions[client.id]=undefined;
    });
});

  
  
  
  
  
  
});

