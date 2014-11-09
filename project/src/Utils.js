var DEV =0;
var LIVE = 1;

var PLAYMODE = LIVE;

var keyMap = {};


var fileUtils = cc.FileUtils.getInstance();
var platform = cc.Application.getInstance().getTargetPlatform();
fileUtils.setSearchPaths(["res/Graphics"]);
var request = new XMLHttpRequest();
request.open("GET", "res/Graphics/tile_graphics.txt", false);
request.send(null);
var returnValue = request.responseText;
var filenames = returnValue.split(',');

var tileTextureList = [];
for(var i in filenames){
    tileTextureList.push({"name":filenames[i],"texture":cc.TextureCache.getInstance().addImage(filenames[i])});
}

var isGameInSync=false;

var request = new XMLHttpRequest();
request.open("GET", "res/Graphics/character_graphics.txt", false);
request.send(null);
var returnValue = request.responseText;
var filenames = returnValue.split(',');

var characterTextureList = [];
for(var i in filenames){
    characterTextureList.push({"name":filenames[i],"texture":cc.TextureCache.getInstance().addImage(filenames[i])});
}


document.getElementById("gameCanvas").onkeydown = function (event) {
	event.preventDefault();
	keyMap[event.keyCode]=true;
};

window.onbeforeunload = function(event){
	sendMessageToServer({"disconnect":true});
};

window.onfocus = function () {
	var moveTos = [];
	for(var i=storedClientMessages.length-1;i>=0;i--){
		var msg = JSON.parse(storedClientMessages[i]);
		if(msg["moveTo"] && !moveTos[msg["id"]]) {
			moveTos[msg["id"]]=true;
			msg["setTo"]=1;
			msg["moveTo"]=null;
			storedClientMessages[i]=JSON.stringify(msg);
		}
		else if(msg["moveTo"] && moveTos[msg["id"]]){
			storedClientMessages.splice(i,1);
		}
	}
}; 

var WHITE = cc.c4b(255,255,255,255);
var GREEN = cc.c4b(0,255,0,255);
var RED = cc.c4b(255,0,0,255);


document.getElementById("gameCanvas").onkeyup = function (event) {
	keyMap[event.keyCode]=false;
	if(SceneManager.getInstance().currentScene!=null){
		event.stopPropagation();
		var button = null;	
		switch(event.keyCode){
			case 8: button="BACKSPACE"; break;
			case 9: button="TAB"; break;
			case 13: button="ENTER"; break;
			case 16: button="SHIFT"; break;
			case 17: button="CTRL"; break;
			case 18: button="ALT"; break;
			case 19: button="PAUSE"; break;
			case 20: button="CAPSLOCK"; break;
			case 27: button="ESC"; break;
			case 32: button="SPACE";break;
			case 33: button="PAGEUP";break;
			case 34: button="PAGEDOWN"; break;
			case 35: button="END";break;
			case 37: button="LEFTARROW"; break;
			case 38: button="UPARROW"; break;
			case 39: button="RIGHTARROW"; break;
			case 40: button="DOWNARROW"; break;
			case 45: button="INSERT"; break;
			case 46: button="DELETE"; break;
		}
		if(button==null){
			if((event.keyCode>47 && event.keyCode<58) || (event.keyCode>64 && event.keyCode<91)){
				button = String.fromCharCode(event.keyCode);
			}
		}
		if(button!=null){
			SceneManager.getInstance().currentScene.onKeyUp(button);
		}
	}
};

autoLoginNextTime=false;
rememberLoginNextTime=false;

var settingsData = {
	"GENERAL":"ISSECTION",
	"Project Name":"Powder Engine Testbed",
	"Version Number": "0.705",

	"CHATBAR":"ISSECTION",
	"Welcome Message":"Welcome to the Powder Engine! Enter /help for some help.",
	"Join Message":"<PLAYER> has joined the game!",
	"Leave Message":"<PLAYER> has left the game!",
	"Default ChatBar Message": "C to popup/dismiss, enter for chat. Say /help for help.",

	"ITEMS":"ISSECTION",
	"Item Dropdown Pick Up": "Pick up <ITEM>",
	"Item Dropdown Walk To": "Walk to <ITEM>",
	"Item Pick Up": "Picked up <ITEM>.",
	"Item Dropped": "Dropped <ITEM>.",
	"Item Out-of-range": "<ITEM> is too far away to pick up!",
	"Item Dropdown Examine":"Examine <ITEM>",
	"Item Dropdown Equip": "Equip <ITEM>",
	"Item Dropdown Read": "Read <ITEM>",
	"Item Dropdown Eat": "Eat <ITEM>",
	"Item Dropdown Use" : "Use <ITEM>",
	"Item Dropdown Unequip": "Unequip <ITEM>",
	"Item Dropdown Drop": "Drop <ITEM>",

	"NPCS":"ISSECTION",
	"NPC Dropdown Examine": "Examine",
	"NPC Dropdown Attack": "Attack",
	"NPC Dropdown Talk": "Talk To",
	"NPC Dropdown Follow": "Follow",
	"NPC Dropdown Trade": "Trade",
	"NPC Dropdown Bank": "Open Bank",

	"SIGNS":"ISSECTION",
	"Sign Dropdown list Read": "Read sign <SIGN>",
	"Sign Out-of-range": "<SIGN> is too far away to read!",

	"PANELS":"ISSECTION",
	//"Use Equipment Panel": "ISYESNO",
	"Equipment Header": "Equipment",
	//"Use Inventory Panel": "ISYESNO",
	"Inventory Header": "Inventory",
	"Skills Header":"Skills List",
	//"Use Skills Panel": "ISYESNO",
	"Quest Header":"Quest Log",
	//"Use Quests Panel": "ISYESNO",

	"COMMANDS":"ISSECTION",
	"/dance" : "<PLAYER> danced the dance of his people.",
	"/diceroll": "<PLAYER> threw a dice and got <VALUE>",
	"/coinflip": "<PLAYER> flipped a coin and got <VALUE>",
};

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};


function isTouching(obj,pos){
	if(!obj){
//		return false;
	}
	return ((obj.isVisible && obj.isVisible())|| !obj.isVisible) && cc.rectContainsPoint(cc.rect(obj.getPositionX(),obj.getPositionY(),obj.getContentSize().width,obj.getContentSize().height),pos);
};


function cloneObj(obj) {
	if(!obj){
		return null;
	}
    var clone = null;
    if(typeof obj == 'object'){
    	clone={};
    }
    if(obj instanceof Array){
    	clone=[];
    }
    for (var i in obj) {
        if (obj[i] && (typeof obj[i] == 'object' || obj[i] instanceof Array)) {
            clone[i] = cloneObj(obj[i]);
        } else{
            clone[i] = obj[i];
        }
    }
    return clone;
};

isMobile= function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	if(PLAYMODE==DEV){
		return true;
	}
	return check; 
};

function requestLayout(delegate,isLayoutObject){
	if(isLayoutObject){
		var layoutObject=delegate;
	} else{
		var layoutObject = delegate.getLayoutObject();
	}
	return getLayoutNodes(layoutObject,"panels");
};

function scheduleDestroy(object){
	MainScene.scheduleOnce(function(){object=null;});
};

function destroyScriptController(object,scriptobjectContext){
	MainScene.scheduleOnce(function(){object=null;});
	if(scriptobjectContext){
		scriptobjectContext.scriptHandler=null;
	}
};

function hex2rgba(h) {
  var alpha = 255;
  h = h.replace('#','');
  if(h.length==8) {
   alpha = h.substr(6,8);
  }
  return {r:parseInt(h.substring(0,2),16),g:parseInt(h.substring(2,4),16),b:parseInt(h.substring(4,6),16),a:parseInt(alpha,16)};
}

function getLayoutNodes(nodes,request,parent){
		if(parent){
			var data = parent[request];
		} else{
			var data = nodes[request];
		}
		if(typeof(data.isGameTile)!='undefined'){
			var node = GameTile.Create(data.tileXY);
		}else if(typeof(data.bg)!='undefined'){
			var layerSize = data.size ? data.size : cc.size(100,100);
			var node = cc.LayerColor.create(data.bg,layerSize.width,layerSize.height);
		}else if(typeof(data.isSprite)!='undefined'){
			var node = cc.Sprite.create();
		} else if(typeof(data.texture)!='undefined'){
			var node = cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage(data.texture));
		} else if(typeof(data.label)!='undefined'){
			var font = data.font ? data.fontFace : "Arial";
			var size = data.fontSize ? data.fontSize : 14;
			var node = cc.LabelTTF.create(data.label,font,size);
		} else {
			var node = cc.Node.create();
		}
		
		if(typeof(data.size)!='undefined'){
			node.setContentSize(Math.floor(data.size.width),Math.floor(data.size.height));
		}
		if(typeof(data.position)!='undefined'){
			node.setPosition(cc.p(Math.floor(data.position.x),Math.floor(data.position.y)));
		}
		if(typeof(data.visible)!='undefined'){
			node.setVisible(data.visible);
		}
		if(typeof(data.anchorPoint)!='undefined'){
			node.setAnchorPoint(data.anchorPoint);
		}
		if(typeof(data.opacity)!='undefined'){
			node.setOpacity(data.opacity);
		}
		if(typeof(data.color)!='undefined'){
			if(!node.setColor){
				console.log(data)
			}
			node.setColor(data.color);
		}
		if(typeof(data.children)!='undefined'){
			for(var i in data.children){
				node[i] = getLayoutNodes(nodes,i,data.children);
				node.addChild(node[i]);
			}
		}
		return node;
};

var gamePanelSize = cc.size(960,640);
var gameGridSize=cc.size(1600,1600);
var cellsize = 32;
var gridHeight = Math.floor(gameGridSize.height/cellsize);
var gridWidth = Math.floor(gameGridSize.width/cellsize);

function indexFromPos(x,y){
	return parseInt((gridWidth*((gridHeight)-y)))+parseInt(x);
};

function merge_objects(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = cloneObj(obj1[attrname]); }
	for (var attrname in obj2) { obj3[attrname] = cloneObj(obj2[attrname]); }
	return obj3;
};

function mergeSettings(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]+""; }
	for (var attrname in obj2) { if(obj3[attrname]) obj3[attrname] = obj2[attrname]+""; }
	return obj3;
};




var handleItemScript = function(eventname,item,ignoreList){
	MainScene.scheduleOnce(function(){
		var scriptData=[];
		var userItems=PlayersController.getYou().items;
		if(item && item["script"]){
			scriptData = ObjectLists.getScriptList()[item["script"]]["data"];
		}
		for(var j=0;j<scriptData.length;j++){
			if(scriptData[j]["type"]==eventname){
				var defaultEvent = scriptData[j]["responses"];
				var allowContinue=true;
				for(var k=0;k<defaultEvent.length;k++){
					switch(defaultEvent[k]["type"]){
						case "Is Panel Visibility":
							if(ignoreList && ignoreList["Is Panel Visibility"]){
								break;
							}
							var visible = defaultEvent[k]["data"]["visible"]==1?true:false;
							switch(defaultEvent[k]["data"]["panel"]){
								case 0: 
									if(Inventory!=null && !Inventory._parent) Inventory=null;
									if(Inventory && !visible){
										allowContinue=false; break; break;
									}
									if(!Inventory && visible){
										allowContinue=false; break; break;
									}
								break;
								case 1:
									if(Equipment!=null && !Equipment._parent) Equipment=null;
									if(Equipment && !visible){
										allowContinue=false; break; break;
									}
									if(!Equipment && visible){
										allowContinue=false; break; break;
									}
								break;
								case 2:
									if(Skills!=null && !Skills._parent) Skills=null;
									if(Skills && !visible){
										allowContinue=false; break; break;
									}
									if(!Skills && visible){
										allowContinue=false; break; break;
									}
								break;
							}
						break;
						case "Is Player Inventory Space":
							if(ignoreList && ignoreList["Is Player Inventory Space"]){
								break;
							}
							if(!defaultEvent[k]["data"]["space"]){
								var space=0;
							}else{
								var space = defaultEvent[k]["data"]["space"]
							}
							var count=0;
							for(var p=0;p<40;p++){
								if(!userItems["stored"][p]){
									count++;
								}
							}
							if(count<space){
								allowContinue=false; break; break;
							}
						break;
						case "Has Player Item":
							if(ignoreList && ignoreList["Has Player Item"]){
								break;
							}
							if(defaultEvent[k]["data"]["item"]){
								if(!defaultEvent[k]["data"]["amount"]){
									var amount=0;
								}else{
									var amount=defaultEvent[k]["data"]["amount"];
								}	
								var count=0;
								var itemName = ObjectLists.getItemList()[defaultEvent[k]["data"]["item"]]["name"];
								for(var i in userItems["stored"]){
									if(userItems["stored"][i] && userItems["stored"][i]["name"]==itemName){
										count++;
									}
								}
								if(count<amount){
									allowContinue=false; break; break;
								}
							}
						break;
						case "Is Player Statistics":
							if(ignoreList && ignoreList["Is Player Statistics"]){
								break;
							}
							var name = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
							if(!defaultEvent[k]["data"]["levelUpper"]){
								defaultEvent[k]["data"]["levelUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["levelLower"]){
								defaultEvent[k]["data"]["levelLower"]=0;
							}
							if(!defaultEvent[k]["data"]["healthUpper"]){
								defaultEvent[k]["data"]["healthUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["healthLowe"]){
								defaultEvent[k]["data"]["healthLower"]=0;
							}
							if(!defaultEvent[k]["data"]["xpUpper"]){
								defaultEvent[k]["data"]["xpUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["xpLower"]){
								defaultEvent[k]["data"]["xpLower"]=0;
							}
							if(defaultEvent[k]["data"]["levelUpper"]!=0 || defaultEvent[k]["data"]["levelLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["level"]+1;
								if(valtocheck>defaultEvent[k]["data"]["levelUpper"] || valtocheck<defaultEvent[k]["data"]["levelLower"]){
									allowContinue=false; break; break;
								}
							}
							if(defaultEvent[k]["data"]["healthUpper"]!=0 || defaultEvent[k]["data"]["healthLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["currenthealth"];
								if(valtocheck>defaultEvent[k]["data"]["healthUpper"] || valtocheck<defaultEvent[k]["data"]["healthLower"]){
									allowContinue=false; break; break;
								}
							}

							if(defaultEvent[k]["data"]["xpUpper"]!=0 || defaultEvent[k]["data"]["xpLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["experience"];
								if(valtocheck>defaultEvent[k]["data"]["xpUpper"] || valtocheck<defaultEvent[k]["data"]["xpLower"]){
									allowContinue=false; break; break;
								}
							}
						break;
					}
					var defaultEvent = scriptData[j]["responses"];
					for(var k=0;k<defaultEvent.length;k++){
						switch(defaultEvent[k]["type"]){
							case "Equip Item":
								if(ignoreList && ignoreList["Equip Item"]){
									break;
								}
								var place = defaultEvent[k]["data"]["equip"];
								if(place=="bothArms"){
									place="lArm";
									if(!userItems["equipped"]["rArm"]){
										place="rArm";
									}
								}
								var temp=null;
								if(userItems["equipped"][place]){
									temp = cloneObj(userItems["equipped"][place]);
									handleItemScript("On Dequip",temp)
								}
								userItems["equipped"][place]=cloneObj(item);
								item=temp;
								if(Inventory){
									Inventory.updateTileGrid();
								}
								if(Equipment){
									Equipment.updateTileGrid();
								}
							break;
							case "Give /Take Item":
								if(ignoreList && ignoreList["Give /Take Item"]){
									break;
								}
								if(!defaultEvent[k]["data"]["amount"] || defaultEvent[k]["data"]["item"]==null || defaultEvent[k]["data"]["item"]=='undefined'){
									break;
								}
								var contextitem = ObjectLists.getItemList()[defaultEvent[k]["data"]["item"]];
								if(defaultEvent[k]["data"]["amount"]>0){
									var space = defaultEvent[k]["data"]["amount"];
									if(contextitem["stackable"]==true){
										for(var p=0;p<40;p++){
											if(userItems["stored"][p] && userItems["stored"][p]["name"]==contextitem["name"]){
												space=0;
											}
										}
										if(count!=0){
											space=1;
										}
									}else{
										var count=0;
										for(var p=0;p<40;p++){
											if(!userItems["stored"][p]){
												count++;
											}
										}
									}
									if(count<space){
										break;
									}else{
										if(contextitem["stackable"]==true){
											var doneAdd=false;
											for(var p=0;p<40;p++){
												if(userItems["stored"][p] && userItems["stored"][p]["name"]==contextitem["name"]){
													userItems["stored"][p]["amount"] +=defaultEvent[k]["data"]["amount"];
													if(Inventory){
														Inventory.setStackableLabel(p,userItems["stored"][p]["amount"]);	
													}
													doneAdd=true;
													break;
												}
											}
											if(doneAdd==false){
												for(var p=0;p<40;p++){
													if(!userItems["stored"][p]){
														userItems["stored"][p]=cloneObj(contextitem);
														userItems["stored"][p]["amount"]=defaultEvent[k]["data"]["amount"];
														if(Inventory){
															Inventory.setStackableLabel(p,userItems["stored"][p]["amount"]);	
														}
														break;
													}
												}
											}
										}else{
											for(var n=0;n<defaultEvent[k]["data"]["amount"];n++){
												for(var p=0;p<40;p++){
													if(!userItems["stored"][p]){
														userItems["stored"][p]=cloneObj(contextitem);
														break;
													}
												}
											}
										}
									}
								}else if(defaultEvent[k]["data"]["amount"]<0){
									var amount=Math.abs(defaultEvent[k]["data"]["amount"]);
									var count=0;
									var itemName = contextitem["name"];
									for(var p in userItems["stored"]){
										if(userItems["stored"][p] && userItems["stored"][p]["name"]==itemName){
											count++;
										}
									}
									if(count<amount){
										break;
									}else{
										for(var n=0;n<Math.abs(defaultEvent[k]["data"]["amount"]);n++){
											for(var p in userItems["stored"]){
												if(userItems["stored"][p] && userItems["stored"][p]["name"]==itemName){
													console.log("gettin rid"+n);
													user["stored"][p]=null;
													break;
												}
											}
										}
									}
								}
								if(Inventory){
									Inventory.updateTileGrid();
								}
								if(Equipment){
									Equipment.updateTileGrid();
								}
							break;
							case "Modify Player Stats":
								if(ignoreList && ignoreList["Modify Player Stats"]){
									break;
								}
								if(ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]){
									var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
									SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
									SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
									SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
								}
							break;
							case "Warp Player":
								if(ignoreList && ignoreList["Warp Player"]){
									break;
								}
								var x=defaultEvent[k]["data"]["index"] % gridWidth;
								var y=Math.floor(defaultEvent[k]["data"]["index"]/gridWidth);
								PlayersController.getYou().setPosition(x*32,y*32);
								sendMessageToServer({"changemap":defaultEvent[k]["data"]["mapnum"], "setTo":defaultEvent[k]["data"]["index"]});
								GameMap.goToMap(defaultEvent[k]["data"]["mapnum"]);
								GameMap.goToOffsetFromPosition(x*32,y*32);
							break;
							case "Read Item":
								if(ignoreList && ignoreList["Read Item"]){
									break;
								}
								MainScene.showBook(item["name"],defaultEvent[k]["data"]["say"]);
							break;
							case "Open/Close Panel":
								if(ignoreList && ignoreList["Open/Close Panel"]){
									break;
								}
								var show = defaultEvent[k]["data"]["visible"]==1?true:false;
								switch(defaultEvent[k]["data"]["panel"]){
									case 0: 
										if(Inventory!=null && !Inventory._parent) Inventory=null;
										if(show==true){
											if(Inventory){
												Inventory.updateTileGrid();
											}else{
												Inventory = new InventoryPanel();
												Inventory.init();
												Inventory.didBecomeActive();
												MainScene.addChild(Inventory);
											}
										}else{
											if(Inventory){
												Inventory.willTerminate();
												Inventory.removeFromParent();
												Inventory=null;
											}
										}
									break;
									case 1:
										if(Equipment!=null && !Equipment._parent) Equipment=null;
										if(show==true){
											if(Equipment){
												Equipment.updateTileGrid();
											}else{
												Equipment = new EquipmentPanel();
												Equipment.init();
												Equipment.didBecomeActive();
												MainScene.addChild(Equipment);
											}
										}else{
											if(Equipment){
												Equipment.willTerminate();
												Equipment.removeFromParent();
												Equipment=null;
											}
										}
									break;
									case 2:
										if(Skills!=null && !Skills._parent) Skills=null;
										if(show==true){
											if(Skills){
												Skills.updateTileGrid();
											}else{
												Skills = new SkillsPanel();
												Skills.init();
												Skills.didBecomeActive();
												MainScene.addChild(Skills);
											}
										}else{
											if(Skills){
												Skills.willTerminate();
												Skills.removeFromParent();
												Skills=null;
											}
										}
									break;
								}
							break;
							case "Destroy":
								if(ignoreList && ignoreList["Destroy"]){
									break;
								}
								item=null;
								if(tile.getScriptObject()["temp"]){
									sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
								} else{
									sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
								}
								if(Inventory){
									Inventory.updateTileGrid();
								}
								k=defaultEvent.length;
							break;
													
						}
					}	
				}
			}
		}
	});
};




var handleNPCScript = function(eventname,npc,ignoreList){
	MainScene.scheduleOnce(function(){
		var scriptData=[];
		var userItems=PlayersController.getYou().items;
		if(npc && npc.script){
			scriptData = ObjectLists.getScriptList()[npc.script]["data"];
		}
		for(var j=0;j<scriptData.length;j++){
			if(scriptData[j]["type"]==eventname){
				var defaultEvent = scriptData[j]["responses"];
				var allowContinue=true;
				for(var k=0;k<defaultEvent.length;k++){
					switch(defaultEvent[k]["type"]){
						case "Is Panel Visibility":
							if(ignoreList && ignoreList["Is Panel Visibility"]){
								break;
							}
							var visible = defaultEvent[k]["data"]["visible"]==1?true:false;
							switch(defaultEvent[k]["data"]["panel"]){
								case 0: 
									if(Inventory!=null && !Inventory._parent) Inventory=null;
									if(Inventory && !visible){
										allowContinue=false; break; break;
									}
									if(!Inventory && visible){
										allowContinue=false; break; break;
									}
								break;
								case 1:
									if(Equipment!=null && !Equipment._parent) Equipment=null;
									if(Equipment && !visible){
										allowContinue=false; break; break;
									}
									if(!Equipment && visible){
										allowContinue=false; break; break;
									}
								break;
								case 2:
									if(Skills!=null && !Skills._parent) Skills=null;
									if(Skills && !visible){
										allowContinue=false; break; break;
									}
									if(!Skills && visible){
										allowContinue=false; break; break;
									}
								break;
							}
						break;
						case "Is Player Inventory Space":
							if(ignoreList && ignoreList["Is Player Inventory Space"]){
								break;
							}
							if(!defaultEvent[k]["data"]["space"]){
								var space=0;
							}else{
								var space = defaultEvent[k]["data"]["space"]
							}
							var count=0;
							for(var p=0;p<40;p++){
								if(!userItems["stored"][p]){
									count++;
								}
							}
							if(count<space){
								allowContinue=false; break; break;
							}
						break;
						case "Has Player Item":
							if(ignoreList && ignoreList["Has Player Item"]){
								break;
							}
							if(defaultEvent[k]["data"]["item"]){
								if(!defaultEvent[k]["data"]["amount"]){
									var amount=0;
								}else{
									var amount=defaultEvent[k]["data"]["amount"];
								}	
								var count=0;
								var itemName = ObjectLists.getItemList()[defaultEvent[k]["data"]["item"]]["name"];
								for(var i in userItems["stored"]){
									if(userItems["stored"][i] && userItems["stored"][i]["name"]==itemName){
										count++;
									}
								}
								if(count<amount){
									allowContinue=false; break; break;
								}
							}
						break;
						case "Is Player Statistics":
							if(ignoreList && ignoreList["Is Player Statistics"]){
								break;
							}
							var name = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
							if(!defaultEvent[k]["data"]["levelUpper"]){
								defaultEvent[k]["data"]["levelUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["levelLower"]){
								defaultEvent[k]["data"]["levelLower"]=0;
							}
							if(!defaultEvent[k]["data"]["healthUpper"]){
								defaultEvent[k]["data"]["healthUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["healthLowe"]){
								defaultEvent[k]["data"]["healthLower"]=0;
							}
							if(!defaultEvent[k]["data"]["xpUpper"]){
								defaultEvent[k]["data"]["xpUpper"]=0;
							}
							if(!defaultEvent[k]["data"]["xpLower"]){
								defaultEvent[k]["data"]["xpLower"]=0;
							}
							if(defaultEvent[k]["data"]["levelUpper"]!=0 || defaultEvent[k]["data"]["levelLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["level"]+1;
								if(valtocheck>defaultEvent[k]["data"]["levelUpper"] || valtocheck<defaultEvent[k]["data"]["levelLower"]){
									allowContinue=false; break; break;
								}
							}
							if(defaultEvent[k]["data"]["healthUpper"]!=0 || defaultEvent[k]["data"]["healthLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["currenthealth"];
								if(valtocheck>defaultEvent[k]["data"]["healthUpper"] || valtocheck<defaultEvent[k]["data"]["healthLower"]){
									allowContinue=false; break; break;
								}
							}

							if(defaultEvent[k]["data"]["xpUpper"]!=0 || defaultEvent[k]["data"]["xpLower"]!=0){
								var valtocheck = SkillBarsInstance.skillsData[name]["experience"];
								if(valtocheck>defaultEvent[k]["data"]["xpUpper"] || valtocheck<defaultEvent[k]["data"]["xpLower"]){
									allowContinue=false; break; break;
								}
							}
						break;
					}
					var defaultEvent = scriptData[j]["responses"];
					for(var k=0;k<defaultEvent.length;k++){
						switch(defaultEvent[k]["type"]){
							case "Talk":
								if(ignoreList && ignoreList["Talk"]){
									break;
								}
								var eventnumber=parseInt(j);
								MainScene.showNPCTalk(npc,scriptData,eventnumber,npc["name"],defaultEvent[k]["data"]["say"],defaultEvent[k]["data"]["options"]);
							break;
							case "Give /Take Item":
								if(ignoreList && ignoreList["Give /Take Item"]){
									break;
								}
								if(!defaultEvent[k]["data"]["amount"] || defaultEvent[k]["data"]["item"]==null || defaultEvent[k]["data"]["item"]=='undefined'){
									break;
								}
								var contextitem = ObjectLists.getItemList()[defaultEvent[k]["data"]["item"]];
								if(defaultEvent[k]["data"]["amount"]>0){
									var space = defaultEvent[k]["data"]["amount"];
									if(contextitem["stackable"]==true){
										for(var p=0;p<40;p++){
											if(userItems["stored"][p] && userItems["stored"][p]["name"]==contextitem["name"]){
												space=0;
											}
										}
										if(count!=0){
											space=1;
										}
									}else{
										var count=0;
										for(var p=0;p<40;p++){
											if(!userItems["stored"][p]){
												count++;
											}
										}
									}
									if(count<space){
										break;
									}else{
										if(contextitem["stackable"]==true){
											var doneAdd=false;
											for(var p=0;p<40;p++){
												if(userItems["stored"][p] && userItems["stored"][p]["name"]==contextitem["name"]){
													userItems["stored"][p]["amount"] +=defaultEvent[k]["data"]["amount"];
													if(Inventory){
														Inventory.setStackableLabel(p,userItems["stored"][p]["amount"]);	
													}
													doneAdd=true;
													break;
												}
											}
											if(doneAdd==false){
												for(var p=0;p<40;p++){
													if(!userItems["stored"][p]){
														userItems["stored"][p]=cloneObj(contextitem);
														userItems["stored"][p]["amount"]=defaultEvent[k]["data"]["amount"];
														if(Inventory){
															Inventory.setStackableLabel(p,userItems["stored"][p]["amount"]);	
														}
														break;
													}
												}
											}
										}else{
											for(var n=0;n<defaultEvent[k]["data"]["amount"];n++){
												for(var p=0;p<40;p++){
													if(!userItems["stored"][p]){
														userItems["stored"][p]=cloneObj(contextitem);
														break;
													}
												}
											}
										}
									}
								}else if(defaultEvent[k]["data"]["amount"]<0){
									var amount=Math.abs(defaultEvent[k]["data"]["amount"]);
									var count=0;
									var itemName = contextitem["name"];
									for(var p in userItems["stored"]){
										if(userItems["stored"][p] && userItems["stored"][p]["name"]==itemName){
											count++;
										}
									}
									if(count<amount){
										break;
									}else{
										for(var n=0;n<Math.abs(defaultEvent[k]["data"]["amount"]);n++){
											for(var p in userItems["stored"]){
												if(userItems["stored"][p] && userItems["stored"][p]["name"]==itemName){
													console.log("gettin rid"+n);
													user["stored"][p]=null;
													break;
												}
											}
										}
									}
								}
								if(Inventory){
									Inventory.updateTileGrid();
								}
								if(Equipment){
									Equipment.updateTileGrid();
								}
							break;
							case "Modify Player Stats":
								if(ignoreList && ignoreList["Modify Player Stats"]){
									break;
								}
								if(ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]){
									var skillname = ObjectLists.getSkillsList()[defaultEvent[k]["data"]["skill"]]["name"];
									SkillBars.modifyModifier(skillname,defaultEvent[k]["data"]["level"]);
									SkillBars.modifyHealth(skillname,defaultEvent[k]["data"]["health"]);
									SkillBars.modifyXP(skillname,defaultEvent[k]["data"]["xp"]);
								}
							break;
							case "Warp Player":
								if(ignoreList && ignoreList["Warp Player"]){
									break;
								}
								var x=defaultEvent[k]["data"]["index"] % gridWidth;
								var y=Math.floor(defaultEvent[k]["data"]["index"]/gridWidth);
								PlayersController.getYou().setPosition(x*32,y*32);
								sendMessageToServer({"changemap":defaultEvent[k]["data"]["mapnum"], "setTo":defaultEvent[k]["data"]["index"]});
								GameMap.goToMap(defaultEvent[k]["data"]["mapnum"]);
								GameMap.goToOffsetFromPosition(x*32,y*32);
							break;
							case "Open/Close Panel":
								if(ignoreList && ignoreList["Open/Close Panel"]){
									break;
								}
								var show = defaultEvent[k]["data"]["visible"]==1?true:false;
								switch(defaultEvent[k]["data"]["panel"]){
									case 0: 
										if(Inventory!=null && !Inventory._parent) Inventory=null;
										if(show==true){
											if(Inventory){
												Inventory.updateTileGrid();
											}else{
												Inventory = new InventoryPanel();
												Inventory.init();
												Inventory.didBecomeActive();
												MainScene.addChild(Inventory);
											}
										}else{
											if(Inventory){
												Inventory.willTerminate();
												Inventory.removeFromParent();
												Inventory=null;
											}
										}
									break;
									case 1:
										if(Equipment!=null && !Equipment._parent) Equipment=null;
										if(show==true){
											if(Equipment){
												Equipment.updateTileGrid();
											}else{
												Equipment = new EquipmentPanel();
												Equipment.init();
												Equipment.didBecomeActive();
												MainScene.addChild(Equipment);
											}
										}else{
											if(Equipment){
												Equipment.willTerminate();
												Equipment.removeFromParent();
												Equipment=null;
											}
										}
									break;
									case 2:
										if(Skills!=null && !Skills._parent) Skills=null;
										if(show==true){
											if(Skills){
												Skills.updateTileGrid();
											}else{
												Skills = new SkillsPanel();
												Skills.init();
												Skills.didBecomeActive();
												MainScene.addChild(Skills);
											}
										}else{
											if(Skills){
												Skills.willTerminate();
												Skills.removeFromParent();
												Skills=null;
											}
										}
									break;
								}
							break;
							/*case "Destroy":
								if(ignoreList && ignoreList["Destroy"]){
									break;
								}
								npc=null;
								if(tile.getScriptObject()["temp"]){
									sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber(),"temp":true});
								} else{
									sendMessageToServer({"pickupitem":indexFromPos(gp.x,gp.y),"mapnumber":GameMap.getMapNumber()});
								}
								if(Inventory){
									Inventory.updateTileGrid();
								}
								k=defaultEvent.length;
							break;*/
													
						}
					}	
				}
			}
		}
	});
};