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
			msg["setTo"]=msg["moveTo"];
			msg["moveTo"]=null;
			storedClientMessages[i]=JSON.stringify(msg);
		}
		else if(msg["moveTo"] && moveTos[msg["id"]]){
			storedClientMessages.splice(i,1);
		}
	}
}; 



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

function cloneObj(obj) {
    var clone = {};

    for (var i in obj) {
        if (obj[i] && typeof obj[i] == 'object') {
            clone[i] = cloneObj(obj[i]);
        } else {
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
var cellsize = 32;
var gridHeight = Math.floor(gamePanelSize.height/cellsize);
var gridWidth = Math.floor(gamePanelSize.width/cellsize);

function indexFromPos(x,y){
	return parseInt((gridWidth*((gridHeight)-y)))+parseInt(x);
};

function merge_objects(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = cloneObj(obj1[attrname]); }
	for (var attrname in obj2) { obj3[attrname] = cloneObj(obj2[attrname]); }
	return obj3;
};