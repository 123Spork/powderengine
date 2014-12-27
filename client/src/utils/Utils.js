var DEV =0;
var LIVE = 1;
var ccconfig=document["ccConfig"];
var PLAYMODE = LIVE;
var keyMap = {};
var isGameInSync=false;

var tileTextureList = [], characterTextureList=[];
cc.FileUtils.getInstance().setSearchPaths(["res/Graphics"]);
for(var i in document["ccConfig"]["tileSheets"]){
    tileTextureList.push({"name":document["ccConfig"]["tileSheets"][i],"texture":cc.TextureCache.getInstance().addImage(document["ccConfig"]["tileSheets"][i])});
}
for(var i in document["ccConfig"]["characterSheets"]){
    characterTextureList.push({"name":document["ccConfig"]["characterSheets"][i],"texture":cc.TextureCache.getInstance().addImage(document["ccConfig"]["characterSheets"][i])});
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

var mouseDown = false;
document.body.onmousedown = function() { 
  mouseDown=true;
}
document.body.onmouseup = function() {
  mouseDown=false;
}

autoLoginNextTime=false;
rememberLoginNextTime=false;

var settingsData = lang[ccconfig["language"]];
console.log(settingsData);
function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};


function isTouching(obj,pos){
	if(!obj){
		return false;
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


function requestLayout(delegate,isLayoutObject){
	if(isLayoutObject){
		var layoutObject=delegate;
	} else{
		var layoutObject = delegate.getLayoutObject();
	}
	return getLayoutNodes(layoutObject,"panels");
};

function getLayoutNodes(nodes,request,parent){
		if(parent){
			var data = parent[request];
		} else{
			var data = nodes[request];
		}
		if(!data){
			return;
		}
		if(typeof(data.isGameTile)!='undefined'){
			var node = GameTile.Create(data.tileXY);
		}
		else if(typeof(data.texture)!='undefined'){
			var node = cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage(data.texture));
		} else if(typeof(data.label)!='undefined'){
			var font = data.font ? data.fontFace : "Arial";
			var size = data.fontSize ? data.fontSize : 14;
			var node = cc.LabelTTF.create(data.label,font,size);
		} else {
			if(typeof(data.color)!='undefined' && typeof(data.size)!='undefined'){
				var node = cc.Sprite.create();
				node.setTextureRect(cc.rect(0,0,data.size.width,data.size.height));
				node.setAnchorPoint(cc.p(0,0));
			}else{
				var node = cc.Node.create();
			}
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
		if(typeof(data.color)!='undefined'){
			if(node.setColor){
				node.setColor(data.color);
				if(data.color.a){
					node.setOpacity(data.color.a);
				}
			}
		}
		if(typeof(data.opacity)!='undefined'){
			node.setOpacity(data.opacity);
		}
		if(typeof(data.children)!='undefined'){
			for(var i in data.children){
				node[i] = getLayoutNodes(nodes,i,data.children);
				if(node[i]){
					node.addChild(node[i]);
				}
			}
		}
		return node;
};

function resetLayoutsFromObject(object,panels){
	return updateLayoutNodes(object,"panels",panels);
};

function updateLayoutNodes(nodes,request,current,parent){
		var data = nodes[request];
		
		/*if(typeof(data.bg)!='undefined'){
			var layerSize = data.size ? data.size : cc.size(100,100);
			var node = cc.LayerColor.create(data.bg,layerSize.width,layerSize.height);
		}else */

		if(typeof(data.size)!='undefined'){
			current.setContentSize(Math.floor(data.size.width),Math.floor(data.size.height));
		}
		if(typeof(data.position)!='undefined'){
			current.setPosition(cc.p(Math.floor(data.position.x),Math.floor(data.position.y)));
		}
		if(typeof(data.visible)!='undefined'){
			current.setVisible(data.visible);
		}
		if(typeof(data.anchorPoint)!='undefined'){
			current.setAnchorPoint(data.anchorPoint);
		}
		if(typeof(data.opacity)!='undefined'){
			current.setOpacity(data.opacity);
		}
		if(typeof(data.color)!='undefined'){
			current.setColor(data.color);
		}
		if(typeof(data.children)!='undefined'){
			for(var i in data.children){
				updateLayoutNodes(data.children,i,current[i]);
			}
		}
};

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var gamePanelSize=null
var gameGridSize=null;
var cellsize=ccconfig["tileSize"];
var charactersize=ccconfig["characterSize"];
var gridHeight = Math.floor(36);
var gridWidth = Math.floor(36);

function updateScreenSize(){
 	screenSize=cc.EGLView.getInstance().getFrameSize();
 	gamePanelSize = cc.size(screenSize.width,screenSize.height);
	gameGridSize=cc.size(gridWidth*cellsize,gridHeight*cellsize);
};

function indexFromPos(x,y){
	return parseInt((gridWidth*((gridHeight)-y)))+parseInt(x);
};

function indexFromPosAndGridSize(x,y,width,height){
	return parseInt((width*(y+1)))+parseInt(x);
};

function merge_objects(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = cloneObj(obj1[attrname]); }
	for (var attrname in obj2) { obj3[attrname] = cloneObj(obj2[attrname]); }
	return obj3;
};

function merge_objects_withoutclone(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	return obj3;
};


function mergeSettings(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]+""; }
	for (var attrname in obj2) { if(obj3[attrname]) obj3[attrname] = obj2[attrname]+""; }
	return obj3;
};


var checkRequirements = function(requirements,type,context,ignoreList){
	if(requirements.length==0){
		return true;
	}
	for(var k=0;k<requirements.length;k++){
		if(ignoreList && ignoreList[requirements[k]["type"]]){
			continue;
		}
		switch(requirements[k]["type"]){
			case "Is Quest Point":
				var questData = PlayersController.getYou().getQuestData(requirements[k]["data"]["quest"]);
				if(!questData){
					questData=0;
				}
				if(questData!=requirements[k]["data"]["objective"]){
					return false;
				}			
			break;
			case "Script Requirement":
				if(type=="Tile"){
					var data=cloneObj(PlayersController.getYou().getExtraData(context.getScriptID()));
				}else if(type=="NPC"){
					var data=cloneObj(PlayersController.getYou().getExtraData(context.script));
				}else if(type=="Item"){
					var data=cloneObj(PlayersController.getYou().getExtraData(context["script"]));
				}
				if(!data){
					data={};
				}
				try{
					var unparsedData = requirements[k]["data"]["functionContent"].replace(/,/g,'').split(':');
					var string = "{";
					for(var i in unparsedData){
						if(i%2==0){
							string+="\""+unparsedData[i]+"\":";
						}else if(i!=unparsedData.length-1){
							string+="\""+unparsedData[i]+"\",";
						}else{
							string+="\""+unparsedData[i]+"\""
						}	
					}
					string+="}";
					var tempDat = JSON.parse(string);
					for(var i in tempDat){
						if(!data[i]){
							data[i]="null";
						}
						if(data[i]!=tempDat[i]){
							return false;
						}
					}
				}catch(e){
					GameChat.addMessage("your custom require script failed");
					return false;
				}
			break;
			case "Is Panel Visibility":
				var visible = requirements[k]["data"]["visible"]==1?true:false;
				switch(requirements[k]["data"]["panel"]){
					case 0: 
						if(Inventory!=null && !Inventory._parent) Inventory=null;
						if(Inventory && !visible){
							return false;
						}
						if(!Inventory && visible){
							return false;
						}
					break;
					case 1:
						if(Equipment!=null && !Equipment._parent) Equipment=null;
						if(Equipment && !visible){
							return false;
						}
						if(!Equipment && visible){
							return false;
						}
					break;
					case 2:
						if(Skills!=null && !Skills._parent) Skills=null;
						if(Skills && !visible){
							return false;
						}
						if(!Skills && visible){
							return false;
						}
					break;
				}
			break;
			case "Is Player Inventory Space":
				if(!requirements[k]["data"]["space"]){
					var space=0;
				}else{
					var space = requirements[k]["data"]["space"]
				}
				var count=0;
				for(var p=0;p<40;p++){
					if(!userItems["stored"][p]){
						count++;
					}
				}
				if(count<space){
					return false;
				}
			break;
			case "Has Player Item":
				if(requirements[k]["data"]["item"]){
					if(!requirements[k]["data"]["amount"]){
						var amount=0;
					}else{
						var amount=requirements[k]["data"]["amount"];
					}	
					var count=0;
					var itemName = ObjectLists.getItemList()[requirements[k]["data"]["item"]]["name"];
					for(var i in userItems["stored"]){
						if(userItems["stored"][i] && userItems["stored"][i]["name"]==itemName){
							count++;
						}
					}
					if(count<amount){
						return false;
					}
				}
			break;
			case "Is Player Statistics":
				var name = ObjectLists.getSkillsList()[requirements[k]["data"]["skill"]]["name"];
				if(!requirements[k]["data"]["levelUpper"]){
					requirements[k]["data"]["levelUpper"]=0;
				}
				if(!requirements[k]["data"]["levelLower"]){
					requirements[k]["data"]["levelLower"]=0;
				}
				if(!requirements[k]["data"]["healthUpper"]){
					requirements[k]["data"]["healthUpper"]=0;
				}
				if(!requirements[k]["data"]["healthLower"]){
					requirements[k]["data"]["healthLower"]=0;
				}
				if(!requirements[k]["data"]["xpUpper"]){
					requirements[k]["data"]["xpUpper"]=0;
				}
				if(!requirements[k]["data"]["xpLower"]){
					requirements[k]["data"]["xpLower"]=0;
				}
				if(requirements[k]["data"]["levelUpper"]!=0 || requirements[k]["data"]["levelLower"]!=0){
					var valtocheck = SkillBarsInstance.skillsData[name]["level"]+1;
					if(valtocheck>requirements[k]["data"]["levelUpper"] || valtocheck<requirements[k]["data"]["levelLower"]){
						return false;
					}
				}
				if(requirements[k]["data"]["healthUpper"]!=0 || requirements[k]["data"]["healthLower"]!=0){
					var valtocheck = SkillBarsInstance.skillsData[name]["currenthealth"];
					if(valtocheck>requirements[k]["data"]["healthUpper"] || valtocheck<requirements[k]["data"]["healthLower"]){
						return false;
					}
				}

				if(requirements[k]["data"]["xpUpper"]!=0 || requirements[k]["data"]["xpLower"]!=0){
					var valtocheck = SkillBarsInstance.skillsData[name]["experience"];
					if(valtocheck>requirements[k]["data"]["xpUpper"] || valtocheck<requirements[k]["data"]["xpLower"]){
						return false;
					}
				}
			break;
		}
	}
	return true;
};

var runResponses =function(responses,type,context,ignoreList,scriptData,j){
	var functionArray=[];
	if(responses.length<1){
		return;
	}
	var userItems=PlayersController.getYou().items;
	for(var k=0;k<responses.length;k++){
		if(ignoreList && ignoreList[responses[k]["type"]]){
			continue;
		}
		var newK = (function(index) {return index;})(k);
		functionArray.push([newK,
			function(){
				switch(responses[k]["type"]){
					case "Spawn NPC":
						return function(newK){
							if(responses[newK]["data"]["npc"]!=null && responses[newK]["data"]["npc"]!=='undefined'){
								PlayersController.addNPC(ObjectLists.getNPCList()[responses[newK]["data"]["npc"]],cc.p(context.getPosition().x/cellsize,context.getPosition().y/cellsize),GameMap.getMapNumber());
							}
						};
					case "Equip Item":
						return function(newK){
							var place = responses[newK]["data"]["equip"];
							if(place=="bothArms"){
								place="lArm";
								if(!userItems["equipped"]["rArm"]){
									place="rArm";
								}
							}
							var temp=null;
							if(userItems["equipped"][place]){
								temp = cloneObj(userItems["equipped"][place]);
								handleScript("On Dequip",temp,"Item")
							}
							var itemList = ObjectLists.getItemList();
							for(var i in itemList){
								if(itemList[i]["name"]==context["name"]){
									userItems["equipped"][place]={"number":i,"amount":context["amount"]};
									break;
								}
							}
							userItems["stored"][context.itemnumber]=temp;
							if(Inventory){
								Inventory.updateTileGrid();
							}
							if(Equipment){
								Equipment.updateTileGrid();
							}
						};
					case "Read Item":
						return function(newK){
							MainScene.showBook(context["name"],responses[newK]["data"]["say"]);
						};
					case "Spawn Item":
						return function(newK){
							context.addItem(responses[newK]["data"]["item"],responses[newK]["data"]["amount"]);
						};
					case "Talk":
						var newJ = (function(index) {return index;})(j);
						return function(newK){
							MainScene.showNPCTalk(context,scriptData,newJ,context["name"],responses[newK]["data"]["say"],responses[newK]["data"]["options"]);
						};
					case "Script Response":
						return function(newK){
							if(type=="Tile"){
								var data=cloneObj(PlayersController.getYou().getExtraData(context.getScriptID()));
							}else if(type=="NPC"){
								var data=cloneObj(PlayersController.getYou().getExtraData(context.script));
							}else if(type=="Item"){
								var data=cloneObj(PlayersController.getYou().getExtraData(context["script"]));
							}
							if(!data){data={};} 
							try{
								var unparsedDataOriginal = responses[newK]["data"]["functionContent"].replace(/,/g,'')
								var unparsedData = unparsedDataOriginal.split(':');
								var string = "{";
								for(var i in unparsedData){
									if(i%2==0){
										string+="\""+unparsedData[i]+"\":";
									}else if(i!=unparsedData.length-1){
										string+="\""+unparsedData[i]+"\",";
									}else{
										string+="\""+unparsedData[i]+"\""
									}	
								}
								string+="}";
								var tempData = JSON.parse(string)
								data=merge_objects_withoutclone(data,tempData);
								if(type=="Tile"){
									PlayersController.getYou().setExtraData(context.getScriptID(),cloneObj(data));
								}else if(type=="NPC"){
									PlayersController.getYou().setExtraData(context.script,cloneObj(data));
								}else if(type=="Item"){
									PlayersController.getYou().setExtraData(context["script"],cloneObj(data));
								}
							}catch(e){
								GameChat.addMessage("Your custom response script failed");
							}
						};
				case "Give /Take Item":
					return function(newK){
						var contextitem = ObjectLists.getItemList()[responses[newK]["data"]["item"]];
						if(responses[newK]["data"]["amount"]>0){
							var space = responses[newK]["data"]["amount"];
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
								return;
							}else{
								if(contextitem["stackable"]==true){
									var doneAdd=false;
									for(var p=0;p<40;p++){
										if(userItems["stored"][p] && userItems["stored"][p]["name"]==contextitem["name"]){
											userItems["stored"][p]["amount"] +=responses[newK]["data"]["amount"];
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
												userItems["stored"][p]["amount"]=responses[newK]["data"]["amount"];
												if(Inventory){
													Inventory.setStackableLabel(p,userItems["stored"][p]["amount"]);	
												}
												break;
											}
										}
									}
								}else{
									for(var n=0;n<responses[newK]["data"]["amount"];n++){
										for(var p=0;p<40;p++){
											if(!userItems["stored"][p]){
												userItems["stored"][p]=cloneObj(contextitem);
												break;
											}
										}
									}
								}
							}
						}else if(responses[newK]["data"]["amount"]<0){
							var amount=Math.abs(responses[newK]["data"]["amount"]);
							var count=0;
							var itemName = contextitem["name"];
							for(var p in userItems["stored"]){
								if(userItems["stored"][p] && userItems["stored"][p]["name"]==itemName){
									count++;
								}
							}
							if(count<amount){
								return;
							}else{
								for(var n=0;n<Math.abs(responses[newK]["data"]["amount"]);n++){
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
					};
				case "Modify Player Stats":
					return function(newK){
						if(ObjectLists.getSkillsList()[responses[newK]["data"]["skill"]]){
							var skillname = ObjectLists.getSkillsList()[responses[newK]["data"]["skill"]]["name"];
							SkillBars.modifyModifier(skillname,responses[newK]["data"]["level"]);
							SkillBars.modifyHealth(skillname,responses[newK]["data"]["health"]);
							SkillBars.modifyXP(skillname,responses[newK]["data"]["xp"]);
						}
					};
				case "Show Sign":
					return function(newK){
						MainScene.showSign(responses[newK]["data"]["title"],responses[newK]["data"]["content"]);								
					};
				case "Set Quest Point":
					return function(newK){
						PlayersController.getYou().setQuestData(responses[newK]["data"]["quest"],responses[newK]["data"]["objective"]);								
					};
				case "Warp Player":
					return function(newK){
						var mapSize = GameMap.getMapSizeForIndex(responses[newK]["data"]["mapnum"]);
						var x=responses[newK]["data"]["index"] % mapSize.width;
						var y=Math.floor(responses[newK]["data"]["index"]/mapSize.width);
						sendMessageToServer({"mapnumber":""+responses[newK]["data"]["mapnum"], "warpTo":responses[newK]["data"]["index"]});
						GameMap.goToMap(responses[newK]["data"]["mapnum"]);
						PlayersController.getYou().setPosition(x*cellsize,y*cellsize);
						PlayersController.getYou().isWalking=false;
					};
				case "Open/Close Shop":
					return function(newK){
						var show = responses[newK]["data"]["visible"]==1?true:false;
						if(Shop!=null && !Shop._parent) Shop=null;
						if(Shop){
							Shop.willTerminate();
							Shop.removeFromParent();
							Shop=null;
						} 
						if(show==true){
							Shop = new ShopPanel();
							Shop.init(responses[newK]["data"]["id"]);
							Shop.didBecomeActive();
							MainScene.addChild(Shop);
						}
					};
				break;
				case "Open/Close Panel":
					return function(newK){
						var show = responses[newK]["data"]["visible"]==1?true:false;
						switch(responses[newK]["data"]["panel"]){
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
							case 3:
								if(Quests!=null && !Quests._parent) Quests=null;
								if(show==true){
									if(Quests){
										Quests.updateTileGrid();
									}else{
										Quests = new QuestsPanel();
										Quests.init();
										Quests.didBecomeActive();
										MainScene.addChild(Quests);
									}
								}else{
									if(Quests){
										Quests.willTerminate();
										Quests.removeFromParent();
										Quests=null;
									}
								}
							break;
							case 4:
								if(Inventory!=null && !Inventory._parent) Inventory=null;
								if(Inventory){
									Inventory.willTerminate();
									Inventory.removeFromParent();
									Inventory=null;
								}
								if(Bank!=null && !Bank._parent) Bank=null;
								if(show==true){
									if(Bank){
										Bank.updateTileGrid();
									}else{
										Bank = new BankPanel();
										Bank.init();
										Bank.didBecomeActive();
										MainScene.addChild(Bank);
									}
								}else{
									if(Bank){
										Bank.willTerminate();
										Bank.removeFromParent();
										Bank=null;
									}
								}
							break;
						}
					};
				case "Destroy":
					item=null;
					if(Inventory){
						Inventory.updateTileGrid();
					}
					k=responses.length;
				break;			
				}
			}()]);
	}
	for(var i=0;i<functionArray.length;i++){
		functionArray[i][1](functionArray[i][0]);
		functionArray.splice(i,1);
		i--;
	}
};

var handleScript = function(eventname,context,type,ignoreList,itemnumber){
	MainScene.scheduleOnce(function(){
		var scriptData=[];
		if(context){
			if(type=="Item"){
				if(context["script"] && ObjectLists.getScriptList()[context["script"]]){
					if(itemnumber){
						context.itemnumber=itemnumber;
					}
					scriptData = ObjectLists.getScriptList()[context["script"]]["data"];
				}
			}else if(type=="Tile"){
				if(context.getScript()){
					scriptData = context.getScript()["data"];
				}
			}else if(type=="NPC"){
				if(context.script){
					scriptData = ObjectLists.getScriptList()[context.script]["data"];
				}
			}
		}
		for(var j=0;j<scriptData.length;j++){
			if(scriptData[j]["type"]!=eventname){
				continue;
			}
			if(checkRequirements(scriptData[j]["requirements"],type,ignoreList)){
				runResponses(scriptData[j]["responses"],type,context,ignoreList,scriptData,j)	
			}
		}
		if(itemnumber){
			context.itemnumber=null;
		}
	});
};