/*jshint curly: true, node: true, plusplus: false*/
//"use strict";

/*jslint nomen: true*/
process.chdir(__dirname);
/*jslint nomen: false*/

var xport            = require('node-xport')(module),
    io               = require('socket.io'),
    fs               = require('fs'),
    bcrypt           = require('bcryptjs'),
    networkConfig    = require('../config.json'),
    config           = require('./server.config.json'),
    NetworkBootstrap = require('../common/networkBootstrap.js'),
    utils            = require('./utils.js');
    cereal            = require('./cycle.js');

var formulas = {};
/*jshint unused: false, evil: true*/
formulas.xpTNL = function (currentLevel) {
    return eval(String(config.game.formulae.xp || "100 * Math.pow(1.08, currentLevel)"));
};

formulas.baseHealth = function (currentLevel, previousHealth) {
    return eval(String(config.game.formulae.hp || "100 + (currentLevel * 50)"));
};
/*jshint evil: false*/

var clients = [];
var maps = [];
var mapsQ =[];
var last = [];
var items = [];
var skills = [];
var npcs = [];
var quests = [];
var shops = [];
var scripts = [];
var settings = null;

var mapblocks = [];

var updateMapIndex = 0, updateWarpIndex = 1, updateItemIndex = 2, updateSkillsIndex = 3, updateSignsIndex = 4,
updateNPCIndex = 5, updateQuestIndex = 6, updateSettingsIndex = 7, updateScriptIndex = 8, updateShopIndex = 9;

fs.readdirSync("./maps").forEach(function (file) {
    var n = parseInt(file.split('.')[0], 10);
    mapsQ[n]={};
    mapsQ[n].items=[];
    mapsQ[n].npcs=[];
});


fs.readdirSync("./maps").forEach(function (file) {
    var n = parseInt(file.split('.')[0], 10);
    maps[n] = require("./maps/" + file);

});



fs.readdirSync("./additionals").forEach(function (file) {
    if (file === "warps.json") {
        warps = require("./additionals/warps.json");
    }

    if (file === "items.json") {
        items = require("./additionals/items.json");
    }

    if (file === "skills.json") {
        skills = require("./additionals/skills.json");
    }

    if (file === "npcs.json") {
        npcs = require("./additionals/npcs.json");
    }

    if (file === "quests.json") {
        quests = require("./additionals/quests.json");
    }

    if (file === "shops.json") {
        shops = require("./additionals/shops.json");
    }

    if (file === "settings.json") {
        settings = require("./additionals/settings.json");
    }

    if (file === "scripts.json") {
        scripts = [
            { "data": [{ "type": "Will Enter", "responses": [{ "type": "Block Entry", "data": {} }], "requirements": [], "data": {} }], "name": "Block", "specifier": "Default", "implementsAs": "Tile", "abbr": "BLK" },
            { "data": [{ "type": "On Game load", "responses": [{ "type": "Spawn NPC", "data": {} }], "requirements": [], "data": {} }], "name": "Spawn NPC", "specifier": "Default", "implementsAs": "Tile", "isTemplate": "1", "abbr": "NPC" },
            { "data": [{ "type": "On Game load", "responses": [{ "type": "Spawn Item", "data": {} }], "requirements": [], "data": {} }], "name": "Spawn Item", "specifier": "Default", "implementsAs": "Tile", "isTemplate": "1", "abbr": "ITM" },
            { "data": [{ "type": "On Enter", "responses": [{ "type": "Warp Player", "data": {} }], "requirements": [], "data": {} }], "name": "Warp Player", "specifier": "Default", "implementsAs": "Tile", "isTemplate": "1", "abbr": "WRP" }
        ];

        var userscripts = require("./additionals/scripts.json");
        for (var i in userscripts) {
            scripts.push(userscripts[i]);
        }
    }
});


if (fs.existsSync('./tools/updatedata.json')) {
    try {
        last = require('./tools/updatedata.json');
    } catch(e) {

    }
}

var getBlockLevelsForMap=function(mapnum){
    var map = maps[mapnum];
    var blockers=[];
    for(var k in map){
        var i = parseInt(k.substring(4));
        if(j=="mapdata"){
            continue;
        }
        if(map["tile"+i] && map["tile"+i]["info"] && map["tile"+i]["info"]["script"]!=='undefined' && map["tile"+i]["info"]["script"]!=null){
            var scriptID = map["tile"+i]["info"]["script"];
            if(scriptID==0){
                blockers[i]=true;
                continue;
            }
            var sData = scripts[scriptID]["datas"]
            for(var m in sData){
                var responses = sData[m]["responses"];
                for(var n in responses){
                    if(responses[n]["type"]=="Block Entry"){
                        blockers[i]=true;
                        break; break; continue;
                    }
                }
            }
            blockers[i]=false;
        }else{
            blockers[i]=false;
        }
    }
    return blockers;
};


for(var i in maps){
    mapblocks[i]=getBlockLevelsForMap(i);
}



var spawns =utils.getSpawns(scripts,maps);
var controlNPCFunc = function(self){
    return self?function(){
        if(self.isAggro){
            if(!clients[self.isAggro] || clients[self.isAggro].map!=self.map){
                delete self.isAggro;
            }else{
                var width = parseInt(maps[self.map].mapdata.mapConnectors.width);
                var height = parseInt(maps[self.map].mapdata.mapConnectors.height);
                var npcPos = {x:(self.index%width),y:(Math.floor(self.index/width))};
                var playerPos = {x:(parseInt(clients[self.isAggro].position)%width),y:(Math.floor(parseInt(clients[self.isAggro].position)/width))};
                var path = utils.findNPCPath(mapblocks[self.map],npcPos,playerPos,width,height);
                if(path.length>2){
                    self.index=utils.indexFromPos(path[1].x,(height-1)-path[1].y,width,height); 
                    var newIndex=0+self.index;
                }else{
                    var damage=-10;
                    clients[self.isAggro].emit('npcAttackMessage',damage);
                }
            }
        }else{
            var maxIndex = (parseInt(maps[self.map].mapdata.mapConnectors.width)*parseInt(maps[self.map].mapdata.mapConnectors.height));
            var minIndex = 0;
            var newIndex=-1;
            switch(Math.floor(Math.random() * 4) + 1){
                case 1: 
                 newIndex = parseInt(self.index)+parseInt(maps[self.map].mapdata.mapConnectors.width)
                 if(newIndex<maxIndex && !mapblocks[self.map][newIndex]){
                     self.index=newIndex;
                 }
                break;
                case 2:
                 newIndex = parseInt(self.index)-parseInt(maps[self.map].mapdata.mapConnectors.width);
                 if(newIndex>=minIndex && !mapblocks[self.map][newIndex]){
                     self.index=newIndex;
                 }
                break;
                case 3: 
                 newIndex = parseInt(self.index)+1;
                 if(newIndex<maxIndex && newIndex%parseInt(maps[self.map].mapdata.mapConnectors.width)!=0 && !mapblocks[self.map][newIndex]){
                    self.index=newIndex;
                 }
                break;
                case 4:
                 newIndex = parseInt(self.index)-1;
                 if(newIndex>=minIndex && newIndex%parseInt(maps[self.map].mapdata.mapConnectors.width)!=(parseInt(maps[self.map].mapdata.mapConnectors.width)-1) && !mapblocks[self.map][newIndex]){
                    self.index=newIndex;
                 };
                break;
            }
        }
        if(self.index==newIndex){
            for(var k in clients){
                var dataSend = {mapnumber:self.map,index:self.index,id:self.npcID};
                if(self.map==5){
            }
                clients[k].broadcast.emit('moveNPCMessage',dataSend);
                clients[k].emit('moveNPCMessage',dataSend)
                break;
            }   
        }
        if(self.walkable==true){
            self.scheduleUpdate();
        }
    }:null;
};

var npcID=0;
for(var i in spawns.npc){
    for(var j in spawns.npc[i]){
        var getIndex = function(index){
            return function(){ return parseInt(index)};
        };
        mapsQ[i].npcs[npcID]=spawns.npc[i][j];
        mapsQ[i].npcs[npcID].walkable = npcs[spawns.npc[i][j].number].walkable;
        mapsQ[i].npcs[npcID].map=getIndex(i)();
        mapsQ[i].npcs[npcID].npcID=getIndex(npcID)();
        mapsQ[i].npcs[npcID].scheduleUpdate=function(){
            var delay = this.isAggro ? 1 : Math.random()*20+1;
            var self=this;
            this.timeout = setTimeout(controlNPCFunc(self),delay*1000);
        }
        if(mapsQ[i].npcs[npcID].walkable==true){
            mapsQ[i].npcs[npcID].scheduleUpdate();
        }
        npcID++;
    }
}

for(var i in spawns.itm){
    for(var j in spawns.itm[i]){
        mapsQ[i].items.push(spawns.itm[i][j])
    }
}

var requestHandler = function (req, res) {
    // Send HTML headers and message
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(' < h1 < Hello Socket Lover! < /h1 < ');
};

var parsedPort = parseInt(networkConfig.server.port || 1337);
var networkBootstrap = new NetworkBootstrap(networkConfig);
var server = networkBootstrap.createServerInstance(requestHandler);

server.listen(parsedPort);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server, { origins: '*:*' });
socket.set('log level', 2);

socket.on('message', function (data) {
   // console.log('Received a message from the server!',data);
});

var saveNewPlayer = function (client,playerName,playerData) {
    var outputFilename = 'users/' + playerName + '.json';
    fs.writeFile(outputFilename, JSON.stringify(playerData), function (err) {
        client.emit("registrationSuccessMessage",null);
    });
};

var savePlayer = function (client,playerData) {
    var outputFilename = 'users/' + client.name + '.json';
    fs.writeFile(outputFilename, JSON.stringify(playerData), function (err) {
        client.emit('saveSuccessMessage',null);
    });
};

var setMapData = function (mapnumber,data) {
    var outputFilename = 'maps/' + mapnumber + '.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setItemData = function (data) {
    var outputFilename = './additionals/items.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setSkillsData = function (data) {
    var outputFilename = './additionals/skills.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setNPCData = function (data) {
    var outputFilename = './additionals/npcs.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setQuestData = function (data) {
    var outputFilename = './additionals/quests.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setShopData = function (data) {
    var outputFilename = './additionals/shops.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var setScriptData = function (data) {
    var outputFilename = './additionals/scripts.json';
    var newData = [];
    for (var i = 4; i < data.length; i++) {
        newData.push(data[i]);
    }
    fs.writeFile(outputFilename, JSON.stringify(newData), function (err) {});
};


var setSettingsData = function (data) {
    var outputFilename = './additionals/settings.json';
    fs.writeFile(outputFilename, JSON.stringify(data), function (err) {});
};

var saveLastAccessData = function () {
    var outputFilename = 'tools/updatedata.json';
    fs.writeFile(outputFilename, JSON.stringify(last), function (err) {});
};

// Add a connect listener
socket.on('connection', function (client) {
// Success!  Now listen to messages to be received

client.on('registerMessage',function (data){
    if (fs.existsSync("users/" + data.name + ".json")) {
        client.emit("registrationFailMessage","UserTaken");
    } else {
        var skillLevels = {};
        for (var i in skills) {
            skillLevels[skills[i].name] = { "level": 0, "experience": 0, "currenthealth": 100, "maxhealth": 100, "modifier": 0 };
        }
        var newPlayerData = {
            "pass": bcrypt.hashSync(data.password, 10),
            "email": data.email,
            "registrationdate": Date.now(),
            "rank": 3,
            "location": { "mapnumber": 1, "position": 100 },
            "race": 0,
            "class": 0,
            "clan": "",
            "guilds": [],
            "quests": [],
            "friends": [],
            "skills": skillLevels,
            "pets": [],
            "pmessages": [],
            "lastchats": [],
            "inventory": [],
            "bank": [],
            "equipment": {},
            "extraData": [],
        };
        saveNewPlayer(client, data.name, newPlayerData);
    }
});

client.on('logoutMessage',function (data){
    client.broadcast.send("playerExitMessage",client.name);
    delete clients[client.name];
});


client.on('loginMessage', function (data) {
    if (clients[data.username]) {
        client.emit("loginFailMessage","Login failed, user is already online.");
    }
    else{
        if (!fs.existsSync("users/" + data.username+ ".json")) {
            client.emit("loginFailMessage","Login failed, Username doesn't exist.");
        } else {
            var playerData = require("./users/" + data.username+ ".json");
            if (!bcrypt.compareSync(data.password, playerData.pass)) {
                client.emit("loginFailMessage","Login failed, password is incorrect.");
            } else {
                var skillLevels = {};
                for (var i in skills) {
                    if (!playerData.skills[skills[i].name]) {
                        playerData.skills[skills[i].name] = { "level":0, "experience":0, "currenthealth":100, "maxhealth":100, "modifier":0 };
                    }
                }

                for (var i in playerData.skills) {
                    playerData.skills[i].requirement =formulas.xpTNL(playerData.skills[i].level);
                }

                playerData = {
                    "name":data.username,
                    "rank":playerData.rank,
                    "race":playerData.race,
                    "class":playerData.class,
                    "clan":playerData.clan,
                    "guilds":playerData.guilds,
                    "quests":playerData.quests,
                    "friends":playerData.friends,
                    "skills":playerData.skills,
                    "pets":playerData.pets,
                    "pmessages":playerData.pmessages,
                    "lastchats":playerData.lastchats,
                    "location":playerData.location,
                    "inventory":playerData.inventory,
                    "bank":playerData.bank,
                    "equipment":playerData.equipment,
                    "extraData":playerData.extraData,
                };
                client.emit("loginSuccessMessage",playerData);
                client.name = data.username;
                client.position = playerData.location.position;
                client.map = playerData.location.mapnumber;
                clients[data.username] = client;
                client.broadcast.emit("playerJoinMessage",{"id":data.username, "position":playerData.location.position, "mapnumber":playerData.location["mapnumber"]});
                for (var i in clients) {
                    if (i != client.name) {
                        client.emit("playerOnlineMessage",{ "id":clients[i].name, "mapnumber":clients[i].map, "position":clients[i].position});
                    }
                }
                for (var i in mapsQ[client.map].items) {
                    client.emit('dropItemMessage',{"droppeditem":mapsQ[client.map].items[i].number,"index":mapsQ[client.map].items[i].index,"mapnumber":client.map,"amount":mapsQ[client.map].items[i].amount});
                }
                for (var i in mapsQ[client.map].npcs) {
                    client.emit('spawnNPCMessage',{"spawnednpc":mapsQ[client.map].npcs[i].number, "index":mapsQ[client.map].npcs[i].index,"mapnumber":client.map, "npcID":mapsQ[client.map].npcs[i].npcID});
                }
            }
        }
    }
});

client.on('saveGameMessage',function (data){
    if (fs.existsSync("users/" + client.name+ ".json")) {
        var playerData = require("./users/" + client.name + ".json");
        playerData.location = {position: client.position, mapnumber:client.map};
        playerData.inventory = data.inventory;
        playerData.equipment = data.equipment;
        playerData.bank = data.bank;
        playerData.extraData = data.extraData;
        savePlayer(client,playerData);
    }
});

client.on('saveExtrasMessage',function (data){
    if (fs.existsSync("users/" + client.name+ ".json")) {
        var playerData = require("./users/" + client.name + ".json");
        playerData.extraData = data.extraData;
        savePlayer(client,playerData);
    }
});

client.on('playerDiedMessage', function (data){
    for(var i in mapsQ[client.map].npcs){
        if(mapsQ[client.map].npcs[i].isAggro==client.name){
            delete mapsQ[client.map].npcs[i].isAggro;
        }
    }
});

client.on('aggroNPCMessage', function (data){
    mapsQ[client.map].npcs[data].isAggro=client.name;
    clearTimeout(mapsQ[client.map].npcs[data].timeout);
    mapsQ[client.map].npcs[data].scheduleUpdate=function(){
        var delay = this.isAggro?1:Math.random()*20+1;
        var self=this;
        this.timeout = setTimeout(controlNPCFunc(self),delay*1000);     
    };
});

client.on('movePlayerMessage',function (data){
    client.broadcast.emit("movePlayerMessage",{"position":data, "mapnumber":client.map, "id":client.name});
    client.emit("movePlayerMessage",{"position":data, "mapnumber":client.map, "id":client.name});
    client.position = data;
});

client.on('playerPathMessage',function (data){
    client.broadcast.emit("playerPathMessage",{"path":data, "mapnumber":client.map, "id":client.name});
    client.emit("playerPathMessage",{"path":data, "mapnumber":client.map, "id":client.name});
    client.position=data[0];
});

client.on('updateServerPosMessage',function (data){
    client.position=data;
});

client.on('changePlayerMap', function (data){
    client.broadcast.send(JSON.stringify({ "id":client.name, "position":client.position, "mapnumber":data.changemap, "setTo":1}));
    client.map = data.changemap;
    for (var i in mapsQ[client.map].items) {
        client.emit('dropItemMessage',{"droppeditem":mapsQ[client.map].items[i].number,"index":mapsQ[client.map].items[i].index,"mapnumber":client.map,"amount":mapsQ[client.map].items[i].amount});
    }
    for (var i in mapsQ[client.map].npcs) {
        client.emit('spawnNPCMessage',{"spawnednpc":mapsQ[client.map].npcs[i].number, "index":mapsQ[client.map].npcs[i].index,"mapnumber":client.map, "npcID":mapsQ[client.map].npcs[i].npcID});
    }
});

client.on('warpPlayerMessage', function (data){
    client.broadcast.send(JSON.stringify({ "id":client.name, "position":data.warpTo, "mapnumber":data.mapnumber, "setTo":1}));
    client.position = data.warpTo;
    client.map = data.mapnumber;
    if(maps[client.map]){
        for (var i in mapsQ[client.map].items) {
            client.emit('dropItemMessage',{"droppeditem":mapsQ[client.map].items[i].number,"index":mapsQ[client.map].items[i].index,"mapnumber":client.map,"amount":mapsQ[client.map].items[i].amount});
        }
        for (var i in mapsQ[client.map].npcs) {
            client.emit('spawnNPCMessage',{"spawnednpc":mapsQ[client.map].npcs[i].number, "index":mapsQ[client.map].npcs[i].index,"mapnumber":client.map, "npcID":mapsQ[client.map].npcs[i].npcID});
        }
    }
});

client.on('dropItemMessage',function (data){
    client.emit('dropItemMessage',{ "droppeditem":data.item, "mapnumber":client.map, "index":data.index, "amount":data.amount});
    client.broadcast.emit('dropItemMessage',{"number":data.item, "mapnumber":client.map,"index":data.index,"amount":data.amount});
    mapsQ[client.map].items.push({"number":data.item, "index":data.index, "amount":data.amount});
});

client.on('pickupItemMessage',function (data){
    client.emit('pickupItemMessage',{ "pickupitem":data.index, "mapnumber":client.map});
    client.broadcast.emit('pickupItemMessage',{ "pickupitem":data.index, "mapnumber":client.map});
    if(mapsQ[client.map].items.length>0){
        mapsQ[client.map].items.pop();
    }
});

client.on('chatMessage',function (data){
   client.broadcast.emit('danceMessage',client.name+ ": " + data);
});

client.on('diceRollMessage',function (data){
    client.broadcast.emit('diceRollMessage',data);
});
        
client.on('coinFlipMessage',function (data){
    client.broadcast.emit('coinFlipMessage',data);
});
        
client.on('danceMessage',function (data){
    client.broadcast.emit('danceMessage',data);
});

client.on('afkMessage',function (data){
    client.broadcast.emit('afkMessage',client.name);
});


client.on('moveNPCMessage', function (data){
    client.broadcast.send(JSON.stringify(data));
    mapNPCS[data.mapnumber][event.npcID] = data.moveNPC;
});


client.on('syncMessage',function (data){
    var returner ={};
    if (!last[updateMapIndex] || data.mapupdate < last[updateMapIndex]) {
        if (!last[updateMapIndex]) {
            last[updateMapIndex] =Date.now();
            saveLastAccessData();
        }
        returner.maptime = last[updateMapIndex];
        returner.mapdata = maps;
    }

     if (!last[updateScriptIndex] || data.scriptsupdate < last[updateScriptIndex]) {
        if (!last[updateScriptIndex]) {
            last[updateScriptIndex] =Date.now();
            saveLastAccessData();
        }
        returner.scriptstime = last[updateScriptIndex];
        returner.scriptsdata = scripts;
    }
    if (!last[updateItemIndex] || data.itemupdate < last[updateItemIndex]) {
        if (!last[updateItemIndex]) {
            last[updateItemIndex] =Date.now();
            saveLastAccessData();
        }
        returner.itemtime = last[updateItemIndex];
        returner.itemdata = items;
    }
    if (!last[updateSkillsIndex] || data.skillsupdate < last[updateSkillsIndex]) {
        if (!last[updateSkillsIndex]) {
            last[updateSkillsIndex] =Date.now();
            saveLastAccessData();
        }
        returner.skillstime = last[updateSkillsIndex];
        returner.skillsdata = skills;
    }
    if (!last[updateNPCIndex] || data.npcsupdate < last[updateNPCIndex]) {
        if (!last[updateNPCIndex]) {
            last[updateNPCIndex] =Date.now();
            saveLastAccessData();
        }
        returner.npcstime = last[updateNPCIndex];
        returner.npcsdata = npcs;
    }
    if (!last[updateQuestIndex] || data.questsupdate < last[updateQuestIndex]) {
        if (!last[updateQuestIndex]) {
            last[updateQuestIndex] =Date.now();
            saveLastAccessData();
        }
        returner.queststime = last[updateQuestIndex];
        returner.questdata = quests;
    }
    if (!last[updateShopIndex] || data.shopsupdate < last[updateShopIndex]) {
        if (!last[updateShopIndex]) {
            last[updateShopIndex] =Date.now();
            saveLastAccessData();
        }
        returner.shopstime = last[updateShopIndex];
        returner.shopsdata = shops;
    }
    if (!last[updateSettingsIndex] || data.settingsupdate < last[updateSettingsIndex]) {
        if (!last[updateSettingsIndex]) {
            last[updateSettingsIndex] =Date.now();
            saveLastAccessData();
        }
        returner.settingstime = last[updateSettingsIndex];
        returner.settingsdata = settings;
    }
        console.log(JSON.stringify(maps));
    client.emit("syncMessage",returner);
});

client.on("saveMapMessage",function (data){
    last[updateMapIndex] =Date.now();
    saveLastAccessData();
    setMapData(data.savemap, data.mapdata);
    maps[data.savemap] = data.mapdata;
    mapsQ[data.savemap].npcs=[];
    mapsQ[data.savemap].items=[];

    for(var i in maps){
        mapblocks[i]=getBlockLevelsForMap(i);
    }
    var spawns =utils.getSpawns(scripts,maps);
    var npcID=0;
    for(var j in spawns.npc[data.savemap]){
        var getIndex = function(index){
            return function(){ return parseInt(index)};
        };
        mapsQ[data.savemap].npcs[npcID]=spawns.npc[data.savemap][j];
        mapsQ[data.savemap].npcs[npcID].position=spawns.npc[data.savemap][j].index;
        mapsQ[data.savemap].npcs[npcID].walkable = npcs[spawns.npc[data.savemap][j].number].walkable;
        mapsQ[data.savemap].npcs[npcID].map=data.savemap
        mapsQ[data.savemap].npcs[npcID].npcID=getIndex(npcID)();
        mapsQ[data.savemap].npcs[npcID].scheduleUpdate=function(){
            var delay = this.isAggro?1:Math.random()*20+1;
            var self=this;
            this.timeout = setTimeout(controlNPCFunc(self),delay*1000);     
        }
        if(mapsQ[data.savemap].npcs[npcID].walkable){
            mapsQ[data.savemap].npcs[npcID].scheduleUpdate();
        }
        npcID++;
    }

   

    for(var j in spawns.itm[data.savemap]){
        mapsQ[data.savemap].items.push(spawns.itm[data.savemap][j])
    }
    data.updatetime=last[updateMapIndex];
    client.broadcast.emit('saveMapMessage',data);
    client.emit('saveMapMessage',data);

    for (var i in mapsQ[client.map].items) {
        client.broadcast.emit('dropItemMessage',{"droppeditem":mapsQ[client.map].items[i].number,"index":mapsQ[client.map].items[i].index,"mapnumber":client.map,"amount":mapsQ[client.map].items[i].amount});
        client.emit('dropItemMessage',{"droppeditem":mapsQ[client.map].items[i].number,"index":mapsQ[client.map].items[i].index,"mapnumber":client.map,"amount":mapsQ[client.map].items[i].amount});  
    }
    for (var i in mapsQ[client.map].npcs) {
        client.broadcast.emit('spawnNPCMessage',{"spawnednpc":mapsQ[client.map].npcs[i].number, "index":mapsQ[client.map].npcs[i].index,"mapnumber":client.map, "npcID":mapsQ[client.map].npcs[i].npcID});
        client.emit('spawnNPCMessage',{"spawnednpc":mapsQ[client.map].npcs[i].number, "index":mapsQ[client.map].npcs[i].index,"mapnumber":client.map, "npcID":mapsQ[client.map].npcs[i].npcID});
    }

});

client.on("saveNewScriptMessage", function (data){
    last[updateScriptIndex] =Date.now();
    saveLastAccessData();
    scripts[parseInt(data.savescripts)] = data.scriptsdata;
    setScriptData(scripts);
    data.updatetime=last[updateScriptIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteScriptMessage", function (data){
    last[updateScriptIndex] =Date.now();
    saveLastAccessData();
    scripts= data;
    setScriptData(scripts);
    data.updatetime=last[updateScriptIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("saveSettingsMessage", function (data){
    last[updateSettingsIndex] =Date.now();
    saveLastAccessData();
    settings = data;
    setSettingsData(settings);
    data.updatetime=last[updateSettingsIndex];
    client.broadcast.emit('saveSettingsMessage',data);
});

client.on("saveNewItemMessage", function (data){
    last[updateItemIndex] =Date.now();
    saveLastAccessData();
    items[parseInt(data.saveitems)] = data.itemdata;
    setItemData(items);
    data.updatetime=last[updateItemIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteItemMessage", function (data){
    last[updateItemIndex] =Date.now();
    saveLastAccessData();
    items= data.saveitemswhole;
    setItemData(items);
    data.updatetime=last[updateItemIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("saveNewNPCMessage", function (data){
    last[updateNPCIndex] =Date.now();
    saveLastAccessData();
    npcs[parseInt(data.savenpcs)] = data.npcsdata;
    setNPCData(npcs);
    data.updatetime=last[updateNPCIndex];
    for(var i in maps){
        for(var j in mapsQ[i].npcs){
            if(mapsQ[i].npcs[j].number==data["savenpcs"]){
                mapsQ[i].npcs[j].walkable = data["npcsdata"].walkable;
                if( mapsQ[i].npcs[j].walkable==true){
                    mapsQ[i].npcs[j].scheduleUpdate();
                }
            }
        }
    }
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteNPCMessage", function (data){
    last[updateNPCIndex] =Date.now();
    saveLastAccessData();
    npcs= data.savenpcswhole;
    setNPCData(npcs);
    data.updatetime=last[updateNPCIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data))
});


client.on("saveNewQuestMessage", function (data){
    last[updateQuestIndex] =Date.now();
    saveLastAccessData();
    quests[parseInt(data.savequests)] = data.questdata;
    setQuestData(quests);
    data.updatetime=last[updateQuestIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteQuestMessage", function (data){
    last[updateQuestIndex] =Date.now();
    saveLastAccessData();
    quests= data.savequestswhole;
    setQuestData(quests);
    data.updatetime=last[updateQuestIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});


client.on("saveNewShopMessage", function (data){
    last[updateShopIndex] =Date.now();
    saveLastAccessData();
    shops[parseInt(data.saveshops)] = data.shopsdata;
    setShopData(shops);
    data.updatetime=last[updateShopIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteShopMessage", function (data){
    last[updateShopIndex] =Date.now();
    saveLastAccessData();
    shops= data.saveshopswhole;
    setShopData(shops);
    data.updatetime=last[updateShopIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("saveNewSkillMessage", function (data){
    last[updateSkillsIndex] =Date.now();
    saveLastAccessData();
    skills[parseInt(data.saveskills)] = data.skillsdata;
    setSkillsData(skills);
    data.updatetime=last[updateSkillsIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});

client.on("deleteSkillMessage", function (data){
    last[updateSkillsIndex] =Date.now();
    saveLastAccessData();
    skills= data.saveskillswhole;
    setSkillsData(skills);
    data.updatetime=last[updateSkillsIndex];
    client.broadcast.send(JSON.stringify(data));
    client.send(JSON.stringify(data));
});





client.on('disconnect',function () {
   if (client.name) {
       client.broadcast.emit("playerExitMessage",client.name);
       client.send(JSON.stringify({ "disconnect":true}));
       delete clients[client.name];
    }
});





});








