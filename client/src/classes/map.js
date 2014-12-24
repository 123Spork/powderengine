gameMapInstance=null;
var GameMap=cc.Layer.extend({
	tileData:null,
	tileNodes:null,
	isMapDirty:false,
	underPlayerRenderTexture:null,
	overPlayerRenderTexture:null,
	playerLayer:null,
	interactionDelegate:null,
	mapUp:null,
	mapDown:null,
	mapLeft:null,
	mapRight:null,
	mapWidth:null,
	mapHeight:null,
	mapOffset:cc.p(0,0),
	currentMap:1,
	
	isTileBlocked:function(tileid){
		if(typeof tileid ==='string'){
			if(this.tileNodes[tileid].getScriptID()==0){
				return true;
			}
			var script = this.tileNodes[tileid].getScript();
		}else{
			if(tileid.getScriptID()==0){
				return true;
			}
			var script = tileid.getScript();
		}
		if(!script){
			return false;
		}
		else{
			var checkers = ["Will Enter","On Enter"];
			for(var j=0;j<script["data"].length;j++){
				if(checkers.indexOf(script["data"][j]["type"])>-1){
					if(checkRequirements(script["data"][j]["requirements"])){
						var responses = script["data"][j]["responses"];
						for(var i=0;i<responses.length;i++){
							if(responses[i]["type"]=="Block Entry"){
								return true;
							}
						}
					}
				}
			}
			return false;
		}
	},

	isTileSign:function(tileid){
		if(typeof tileid ==='string'){
			if(this.tileNodes[tileid].getScriptID()==0){
				return false;
			}
			var script = this.tileNodes[tileid].getScript();
		}else{
			if(tileid.getScriptID()==0){
				return false;
			}
			var script = tileid.getScript();
		}
		if(!script){
			return false;
		}
		else{
			var checkers = ["Interact On","Interact Facing"];
			for(var j=0;j<script["data"].length;j++){
				if(checkers.indexOf(script["data"][j]["type"])>-1){
					if(checkRequirements(script["data"][j]["requirements"])){
						var responses = script["data"][j]["responses"];
						for(var i=0;i<responses.length;i++){
							if(responses[i]["type"]=="Show Sign"){
								return true;
							}
						}
					}
				}
			}
			return false;
		}
	},

	isNPCTalk:function(npc){
		var script = ObjectLists.getScriptList()[npc.script];
		if(!script){
			return false;
		}
		else{
			var checkers = ["Default Event"];
			for(var j=0;j<script["data"].length;j++){
				if(checkers.indexOf(script["data"][j]["type"])>-1){
					if(checkRequirements(script["data"][j]["requirements"])){
						var responses = script["data"][j]["responses"];
						for(var i=0;i<responses.length;i++){
							if(responses[i]["type"]=="Talk"){
								return true;
							}
						}
					}
				}
			}
			return false;
		}
	},

	findPath:function(pathStart, pathEnd){
		var findNeighbours = function(){};
		var self=this;
		var Neighbours=function(x, y){
			var	N = y - 1,S = y + 1,E = x + 1,W = x - 1,
			myN = N > -1 && self.tileNodes["tile"+indexFromPos(x,N)] && !self.isTileBlocked("tile"+ indexFromPos(x,N));
			myS = S < gridWidth && self.tileNodes["tile"+indexFromPos(x,S)] && !self.isTileBlocked("tile"+ indexFromPos(x,S));
			myE = E < gridWidth && self.tileNodes["tile"+indexFromPos(E,y)] && !self.isTileBlocked("tile"+ indexFromPos(E,y));
			myW = W > -1 && self.tileNodes["tile"+indexFromPos(W,y)] && !self.isTileBlocked("tile"+ indexFromPos(W,y));
			result = [];
			if(myN)
				result.push({x:x, y:N});
			if(myE)
				result.push({x:E, y:y});
			if(myS)
				result.push({x:x, y:S});
			if(myW)
				result.push({x:W, y:y});
			findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
			return result;
		};
		var Node=function(Parent, Point){
			return {Parent:Parent,value:Point.x + (Point.y * gridWidth),x:Point.x,y:Point.y,f:0,g:0};
		};
		var	mypathStart = Node(null, pathStart),
		myPathEnd = Node(null, pathEnd),
		myNeighbours,
		myNode, myPath, length, max, min, i, j,
		outer = [], Closed = [], Open = [mypathStart],
		AStar = new Array(gridHeight*gridWidth);

		while(length = Open.length){
			max = gridHeight*gridWidth;
			min = -1;
			for(i = 0; i < length; i++){
				if(Open[i].f < max){
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === myPathEnd.value){
				myPath = Closed[Closed.push(myNode) - 1];
				do{
					outer.push(cc.p(myPath.x, myPath.y));
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				outer.reverse();
			}
			else{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++){
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value]){
						myPath.g = myNode.g + (Math.abs(myNeighbours[i].x - myNode.x) + Math.abs(myNeighbours[i].y - myNode.y));
						myPath.f = myPath.g + (Math.abs(myNeighbours[i].x - myPathEnd.x) + Math.abs(myNeighbours[i].y - myPathEnd.y));
						Open.push(myPath);
						AStar[myPath.value] = true;
					}
				}
				Closed.push(myNode);
			}
		}
		return outer;
	},
	
	
	
	setupFromServer:function(data){
		this.tileData={}
		this.tileData["mapdata"]={};
		for(var i in this.tileNodes){
			if(i.substring(0,4)=="tile"){
				this.tileNodes[i].destroy();
				this.tileData[i]={};
			}
		}
		
		if(data){
			if(data["mapdata"]){
				this.mapUp = (data["mapdata"]["mapConnectors"]["up"]!="" && data["mapdata"]["mapConnectors"]["up"]!=null) ? data["mapdata"]["mapConnectors"]["up"] : null;
				this.mapDown = (data["mapdata"]["mapConnectors"]["down"]!="" && data["mapdata"]["mapConnectors"]["down"]!=null) ? data["mapdata"]["mapConnectors"]["down"] : null;
				this.mapLeft = (data["mapdata"]["mapConnectors"]["left"]!="" && data["mapdata"]["mapConnectors"]["left"]!=null) ? data["mapdata"]["mapConnectors"]["left"] : null;
				this.mapRight = (data["mapdata"]["mapConnectors"]["right"]!="" && data["mapdata"]["mapConnectors"]["right"]!=null) ? data["mapdata"]["mapConnectors"]["right"] : null;
				if(gameMapInstance.mapWidth!=data["mapdata"]["mapConnectors"]["width"] || gameMapInstance.mapHeight!=data["mapdata"]["mapConnectors"]["height"]){
					gridWidth=data["mapdata"]["mapConnectors"]["width"];
					gridHeight=data["mapdata"]["mapConnectors"]["height"];
					updateScreenSize();
					gameMapInstance.tileNodes.removeFromParent();
					var amount=0;
					for(var i in gameMapInstance.tileData){
						if(i!="mapdata"){
							amount++;
						}
					}
					if(amount>gridWidth*gridHeight){
						for(var i=gridWidth*gridHeight;i<amount;i++){
							delete gameMapInstance.tileData["tile"+i];
						}
					}
					for(var i=0;i<gridWidth*gridHeight;i++){
						if(!gameMapInstance.tileData["tile"+i]){
							gameMapInstance.tileData["tile"+i]={};
						}
					} 
				}
				this.mapWidth = (data["mapdata"]["mapConnectors"]["width"]!="" && data["mapdata"]["mapConnectors"]["width"]!=null) ? data["mapdata"]["mapConnectors"]["width"] : 36;
				this.mapHeight = (data["mapdata"]["mapConnectors"]["height"]!="" && data["mapdata"]["mapConnectors"]["height"]!=null) ? data["mapdata"]["mapConnectors"]["height"] : 36;
				if(PlayersController && PlayersController.getYou()){
					var gp = PlayersController.getYou().getGridPosition()
					if(gp.y>this.mapHeight){
						PlayersController.getYou().setPositionY(cellsize*(this.mapHeight))
					}
					if(gp.x>this.mapWidth-1){
						PlayersController.getYou().setPositionX(cellsize*(this.mapWidth-1))
					}
				}
				this.tileNodes.removeFromParent();
				this.underPlayerRenderTexture.removeFromParent();
				this.overPlayerRenderTexture.removeFromParent();
				this.playerLayer.removeFromParent();
				this.tileNodes = requestLayout(this);
				this.addChild(this.tileNodes);
				this.underPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
				this.underPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
				this.addChild(this.underPlayerRenderTexture);
				this.addChild(this.playerLayer);
				this.overPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
				this.overPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
				this.addChild(this.overPlayerRenderTexture);
			}
			this.tileData=data;
			for(var i in data){
				if(i.substring(0,4)=="tile"){
					for(var j in data[i]){
						if(j!="info"){
							if(data[i][j]!=null){
								if(this.tileNodes[i]){
									this.tileNodes[i].setLayer(data[i][j]["texture"],data[i][j]["frame"],j);
								}
							}
						} else{
							//this.tileNodes[i].setType(data[i][j]["type"]);
							if(data[i][j]["script"]!=null && data[i][j]["script"]!=='undefined'){
								if(this.tileNodes[i]){
									this.tileNodes[i].setScript(data[i][j]["script"]);
									handleScript("On Game load",this.tileNodes[i],"Tile");
								}
							}
						}
					}
				}
			}
		}
		if(PlayersController && PlayersController.getYou()){
			var pos = PlayersController.getYou().getGridPosition();
			GameMap.goToOffsetFromPosition(pos.x*cellsize,pos.y*cellsize);
			this.schedule(this.refreshRenderTexture);
		}
	},
	
	setup:function(mapnumber){
		var data = LocalStorage.getMapData(mapnumber);
		this.tileData={}
		this.tileData["mapdata"]={};
		for(var i in this.tileNodes){
			if(i.substring(0,4)=="tile"){
				this.tileNodes[i].destroy();
				this.tileData[i]={};
			}
		}
		
		if(data){
			if(data["mapdata"]){
				this.mapUp = (data["mapdata"]["mapConnectors"]["up"]!="" && data["mapdata"]["mapConnectors"]["up"]!=null) ? data["mapdata"]["mapConnectors"]["up"] : null;
				this.mapDown = (data["mapdata"]["mapConnectors"]["down"]!="" && data["mapdata"]["mapConnectors"]["down"]!=null) ? data["mapdata"]["mapConnectors"]["down"] : null;
				this.mapLeft = (data["mapdata"]["mapConnectors"]["left"]!="" && data["mapdata"]["mapConnectors"]["left"]!=null) ? data["mapdata"]["mapConnectors"]["left"] : null;
				this.mapRight = (data["mapdata"]["mapConnectors"]["right"]!="" && data["mapdata"]["mapConnectors"]["right"]!=null) ? data["mapdata"]["mapConnectors"]["right"] : null;
				
				if(gameMapInstance.mapWidth!=data["mapdata"]["mapConnectors"]["width"] || gameMapInstance.mapHeight!=data["mapdata"]["mapConnectors"]["height"]){
					gridWidth=data["mapdata"]["mapConnectors"]["width"];
					gridHeight=data["mapdata"]["mapConnectors"]["height"];
					updateScreenSize();
					gameMapInstance.tileNodes.removeFromParent();
					var amount=0;
					for(var i in gameMapInstance.tileData){
						if(i!="mapdata"){
							amount++;
						}
					}
					if(amount>gridWidth*gridHeight){
						for(var i=gridWidth*gridHeight;i<amount;i++){
							delete gameMapInstance.tileData["tile"+i];
						}
					}
					for(var i=0;i<gridWidth*gridHeight;i++){
						if(!gameMapInstance.tileData["tile"+i]){
							gameMapInstance.tileData["tile"+i]={};
						}
					} 
				}
				this.mapWidth = (data["mapdata"]["mapConnectors"]["width"]!="" && data["mapdata"]["mapConnectors"]["width"]!=null) ? data["mapdata"]["mapConnectors"]["width"] : 36;
				this.mapHeight = (data["mapdata"]["mapConnectors"]["height"]!="" && data["mapdata"]["mapConnectors"]["height"]!=null) ? data["mapdata"]["mapConnectors"]["height"] : 36;
				if(PlayersController && PlayersController.getYou()){
					var gp = PlayersController.getYou().getGridPosition()
					if(gp.y>this.mapHeight){
						PlayersController.getYou().setPositionY(cellsize*(this.mapHeight))
					}
					if(gp.x>this.mapWidth-1){
						PlayersController.getYou().setPositionX(cellsize*(this.mapWidth-1))
					}
				}
				this.tileNodes.removeFromParent();
				this.underPlayerRenderTexture.removeFromParent();
				this.overPlayerRenderTexture.removeFromParent();
				this.playerLayer.removeFromParent();
				this.tileNodes = requestLayout(this);
				this.addChild(this.tileNodes);
				this.underPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
				this.underPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
				this.addChild(this.underPlayerRenderTexture);
				this.addChild(this.playerLayer);
				this.overPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
				this.overPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
				this.addChild(this.overPlayerRenderTexture);
			}
			this.tileData=data;
			for(var i in data){
				if(i.substring(0,4)=="tile"){
					for(var j in data[i]){
						if(j!="info"){
							if(data[i][j]!=null){
								if(this.tileNodes[i]){
									this.tileNodes[i].setLayer(data[i][j]["texture"],data[i][j]["frame"],j);
								}
							}
						} else{
							if(data[i][j]["script"]!=null && data[i][j]["script"]!=='undefined'){
								if(this.tileNodes[i]){
									this.tileNodes[i].setScript(data[i][j]["script"]);
									handleScript("On Game load",this.tileNodes[i],"Tile");
								}
							}
						}
					}
				}
			}
		}
		if(PlayersController && PlayersController.getYou()){
			var pos = PlayersController.getYou().getGridPosition();
			GameMap.goToOffsetFromPosition(pos.x*cellsize,pos.y*cellsize);
			this.schedule(this.refreshRenderTexture);
		}
	},
	
	refreshRenderTexture:function(){
		for(var i in this.tileNodes){
			if(i.substring(0,4)=="tile"){
				if(this.tileNodes[i].isLoaded()==false){
					return;
				}
			}
		}
		PlayersController.getInstance().setVisible(true);
		PlayersController.showPlayersInMapOnly();
		this.unschedule(this.refreshRenderTexture);
		this.overPlayerRenderTexture.setVisible(true);
		this.underPlayerRenderTexture.setVisible(true);
		this.isMapDirty=true;
	},
	
	getLayoutObject:function(){
		var gameTiles={};
		for(var i=0;i<gridWidth;i++){
			for(var j=0;j<gridHeight;j++){
				var index= (i + j*gridWidth);
				gameTiles["tile"+index] = {
					size:cc.size(cellsize,cellsize),
					anchorPoint:cc.p(0,0),
					position:cc.p(i*cellsize,((gridHeight)-j)*cellsize),
					isGameTile:true,
					tileXY: cc.p(j,i),
					visible:false,
				};
			}
		}
		return {"panels":{children:gameTiles}};
	},
	
	init:function(){
		this.setTouchEnabled(true);
		this.setTouchMode(1);
	},
	
	onTouchBegan:function(touch){
		if(this.interactionDelegate && (!Mapeditor || !Mapeditor._parent)){
			Mapeditor=null;
			this.interactionDelegate=null;
		}
		if(this.interactionDelegate){
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x-this.mapOffset.x,touch._point.y+cellsize-this.mapOffset.y))){
						this.interactionDelegate.tilePressed(this.tileNodes,i);
						GameMap.updateMap();
					}
				}
			}
		} else{
			if((Shop && Shop._parent) || (Bank && Bank._parent)){
				return;
			}

			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x-this.mapOffset.x,touch._point.y+cellsize-this.mapOffset.y))){
						var npc = GameMap.getNPCForXY(this.tileNodes[i].getPositionX()/cellsize,this.tileNodes[i].getPositionY()/cellsize);
						var sign = this.isTileSign(i);
						if(this.tileNodes[i].getTopItem()){
							var item=ObjectLists.getItemList()[this.tileNodes[i].getTopItem()["number"]];
							var pickupString = settingsData["Item Dropdown Pick Up"]+"";
							var walktoString = settingsData["Item Dropdown Walk To"]+"";
							pickupString = pickupString.replace("<ITEM>",item["name"]);
							walktoString = walktoString.replace("<ITEM>",item["name"]);
							this._parent.addChild(DropDownList.createWithListAndPosition(this,this.itemClicked,[pickupString,walktoString],touch._point));
							this.clickContext=i;
						}else if(npc){
							if(this.isNPCTalk(npc)){
								var talktoString = settingsData["NPC Dropdown Talk"]+"";
								talktoString = talktoString.replace("<NPC>",npc["name"]);
							}
							var walktoString = settingsData["NPC Dropdown Walk To"]+"";
							
							walktoString = walktoString.replace("<NPC>",npc["name"]);
							if(talktoString){
								this._parent.addChild(DropDownList.createWithListAndPosition(this,this.npcClicked,[talktoString,walktoString],touch._point,null,{npc:npc}));
							}else{
								this._parent.addChild(DropDownList.createWithListAndPosition(this,this.npcClicked,[walktoString],touch._point));
							}
							this.clickContext=i;
						}else if(sign){
							var readSignString = settingsData["Sign Dropdown list Read"]+"";
							readSignString = readSignString.replace("<SIGN>",this.tileNodes[i].getScript()["name"]);
							this._parent.addChild(DropDownList.createWithListAndPosition(this,this.signClicked,[readSignString],touch._point));
							this.clickContext=i;
						}
						else{
							var gp = PlayersController.getYou().getGridPosition();
							PlayersController.getYou().setWalkingPath(this.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),cc.p(this.tileNodes[i].getPosition().x/cellsize,this.tileNodes[i].getPosition().y/cellsize)));
						}
					}
				}
			}
		}
		return true;
	},

	clickContext:null,

	itemClicked:function(val){
		if(this.delegate.clickContext!=null){
			var item = ObjectLists.getItemList()[this.delegate.tileNodes[gameMapInstance.clickContext].getTopItem()["number"]];
			var gp = PlayersController.getYou().getGridPosition();
			var itemPosition = cc.p(gameMapInstance.tileNodes[gameMapInstance.clickContext].getPosition().x/cellsize,gameMapInstance.tileNodes[gameMapInstance.clickContext].getPosition().y/cellsize);
			switch(val){
				case 0:
					if(gp.x>itemPosition.x){
						var xSize=gp.x-itemPosition.x;
					} else{
						var xSize=itemPosition.x-gp.x;
					}
					if(gp.y>itemPosition.y){
						var ySize=gp.y-itemPosition.y;
					} else{
						var ySize=itemPosition.y-gp.y;
					}
					xSize*=xSize;
					ySize*=ySize;
					var distance = Math.sqrt(xSize+ySize);
					if(distance<5){
						PlayersController.getYou().interactWithGivenTile(gameMapInstance.tileNodes[gameMapInstance.clickContext]);
					}else{
						var pickupFailString = settingsData["Item Out-of-range"]+"";
						pickupFailString = pickupFailString.replace("<ITEM>",item["name"]);
						GameChat.addMessage(pickupFailString);
					}
				break;


				case 1:
					PlayersController.getYou().setWalkingPath(gameMapInstance.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),itemPosition));
					this.delegate.clickContext=null;
				break;
			}
		}
	},


	npcClicked:function(val,touch,list,extras){
		if(this.delegate.clickContext!=null){
			var gp = PlayersController.getYou().getGridPosition();
			if(list.length==1){
				PlayersController.getYou().setWalkingPath(gameMapInstance.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),itemPosition));
				this.delegate.clickContext=null;
				return;
			}else{
				var npcPosition = cc.p(extras.npc.getPosition().x/cellsize,extras.npc.getPosition().y/cellsize);
				switch(val){
				case 0:
					if(gp.x>npcPosition.x){
						var xSize=gp.x-npcPosition.x;
					} else{
						var xSize=npcPosition.x-gp.x;
					}
					if(gp.y>npcPosition.y){
						var ySize=gp.y-npcPosition.y;
					} else{
						var ySize=npcPosition.y-gp.y;
					}
					xSize*=xSize;
					ySize*=ySize;
					var distance = Math.sqrt(xSize+ySize);
					if(distance<5){
						handleScript("Default Event",extras.npc,"NPC");
						this.delegate.clickContext=null;
					}else{
						var talkFailString = settingsData["NPC Out-of-range"]+"";
						talkFailString = talkFailString.replace("<NPC>",extras.npc["name"]);
						GameChat.addMessage(talkFailString);
					}
					break;
					case 1:
						PlayersController.getYou().setWalkingPath(gameMapInstance.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),itemPosition));
						this.delegate.clickContext=null;
					break;
				}
			}
		}
	},
	
	signClicked:function(val){
		if(this.delegate.clickContext!=null){
			var gp = PlayersController.getYou().getGridPosition();
			var itemPosition = cc.p(gameMapInstance.tileNodes[gameMapInstance.clickContext].getPosition().x/cellsize,gameMapInstance.tileNodes[gameMapInstance.clickContext].getPosition().y/cellsize);
			switch(val){
				case 0:
					if(gp.x>itemPosition.x){
						var xSize=gp.x-itemPosition.x;
					} else{
						var xSize=itemPosition.x-gp.x;
					}
					if(gp.y>itemPosition.y){
						var ySize=gp.y-itemPosition.y;
					} else{
						var ySize=itemPosition.y-gp.y;
					}
					xSize*=xSize;
					ySize*=ySize;
					var distance = Math.sqrt(xSize+ySize);
					if(distance<5){
						handleScript("Interact Facing",this.delegate.tileNodes[gameMapInstance.clickContext],"Tile");
						this.delegate.clickContext=null;
					}else{
						var readFailString = settingsData["Sign Out-of-range"]+"";
						readFailString = readFailString.replace("<SIGN>",this.delegate.tileNodes[gameMapInstance.clickContext].getScript()["name"]);
						GameChat.addMessage(readFailString);
					}
				break;
			}
		}
	},



	onTouchMoved:function(touch){
		if(this.interactionDelegate){
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x-this.mapOffset.x,touch._point.y+cellsize-this.mapOffset.y))){
						this.interactionDelegate.tilePressed(this.tileNodes,i,"moved");
						GameMap.updateMap();
					}
				}
			}
			return true;
		}
		else{
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x-this.mapOffset.x,touch._point.y+cellsize-this.mapOffset.y))){
						var gp = PlayersController.getYou().getGridPosition();
						PlayersController.getYou().setWalkingPath(this.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),cc.p(this.tileNodes[i].getPosition().x/cellsize,this.tileNodes[i].getPosition().y/cellsize)));
					}
				}
			}
		}
	},
		
	visit:function(){
		this._super();
		if(this.isMapDirty==true){
			this.underPlayerRenderTexture.beginWithClear(0,0,0,0);
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
				this.tileNodes[i].setVisible(true);
				if(this.tileNodes[i].fringe1!=null) 
					this.tileNodes[i].fringe1.setVisible(false);
				 if(this.tileNodes[i].fringe2!=null) 
					this.tileNodes[i].fringe2.setVisible(false);
				 if(this.tileNodes[i].fringeShadow!=null) 
					this.tileNodes[i].fringeShadow.setVisible(false);
				 if(this.tileNodes[i].fringe3!=null) 
					this.tileNodes[i].fringe3.setVisible(false);
				this.tileNodes[i].visit();
				 if(this.tileNodes[i].fringe1!=null)
					this.tileNodes[i].fringe1.setVisible(true);
				 if(this.tileNodes[i].fringe2!=null) 
					this.tileNodes[i].fringe2.setVisible(true);
				 if(this.tileNodes[i].fringeShadow!=null) 
					this.tileNodes[i].fringeShadow.setVisible(true);
				 if(this.tileNodes[i].fringe3!=null) 
					this.tileNodes[i].fringe3.setVisible(true);
				this.tileNodes[i].setVisible(false);
				}
			}
			this.underPlayerRenderTexture.end();
			this.overPlayerRenderTexture.beginWithClear(0,0,0,0);
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
				this.tileNodes[i].setVisible(true);
				 if(this.tileNodes[i].ground1!=null) 
					this.tileNodes[i].ground1.setVisible(false);
				 if(this.tileNodes[i].ground2!=null) 
					this.tileNodes[i].ground2.setVisible(false);
				 if(this.tileNodes[i].groundShadow!=null)
					this.tileNodes[i].groundShadow.setVisible(false);
				 if(this.tileNodes[i].mask1!=null) 
					this.tileNodes[i].mask1.setVisible(false);
				 if(this.tileNodes[i].mask2!=null) 
					this.tileNodes[i].mask2.setVisible(false);
				 if(this.tileNodes[i].mask3!=null) 
					this.tileNodes[i].mask3.setVisible(false);
				 if(this.tileNodes[i].item!=null)
					this.tileNodes[i].item.setVisible(false);
				this.tileNodes[i].visit();
				 if(this.tileNodes[i].ground1!=null)
					this.tileNodes[i].ground1.setVisible(true);
				 if(this.tileNodes[i].ground2!=null)
					this.tileNodes[i].ground2.setVisible(true);
				 if(this.tileNodes[i].groundShadow!=null)
					this.tileNodes[i].groundShadow.setVisible(true);
				 if(this.tileNodes[i].mask1!=null)
					this.tileNodes[i].mask1.setVisible(true);
				 if(this.tileNodes[i].mask2!=null) 
					this.tileNodes[i].mask2.setVisible(true);
				 if(this.tileNodes[i].mask3!=null) 
					this.tileNodes[i].mask3.setVisible(true);
				 if(this.tileNodes[i].item!=null)
					this.tileNodes[i].item.setVisible(true);
				this.tileNodes[i].setVisible(false);
				}
			}
			this.overPlayerRenderTexture.end();
			this.isMapDirty=false;
		}
	}
	
});

//blitz@uprpg.com;

GameMap.updateOffset=function(x,y){
	if((gameMapInstance.mapOffset.x+(gameGridSize.width-(screenSize.width/2))+x>=0&&PlayersController.getYou().getPosition().x<(gameGridSize.width-(screenSize.width/2))) && (gameMapInstance.mapOffset.x+x<=0 && PlayersController.getYou().getPosition().x>screenSize.width/2)) {
		gameMapInstance.mapOffset.x+=x;
	}
	if((gameMapInstance.mapOffset.y+(gameGridSize.height-(screenSize.height/2))+y>=0&&PlayersController.getYou().getPosition().y<(gameGridSize.height-(screenSize.height/2))) && (gameMapInstance.mapOffset.y+y<=0 && PlayersController.getYou().getPosition().y>screenSize.height/2)) {
		gameMapInstance.mapOffset.y+=y;
	}

	if(gameGridSize.height<screenSize.height){
		gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
	}
	if(gameGridSize.width<screenSize.width){
		gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
	}
	gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
};

GameMap.goToOffsetFromPosition=function(x,y){
	x=parseInt(x); y=parseInt(y);
	if(gameMapInstance.isMapDirty==true){
		if(offsetFromPositionScheduledX==0 && offsetFromPositionScheduledY==0){
			offsetFromPositionScheduledX=x;
			offsetFromPositionScheduledY=y;
			gameMapInstance.schedule(GameMap.scheduledOffsetFromPosition);
		}
		return;
	} else{
		if(x>gameGridSize.width-(screenSize.width/2)){
			gameMapInstance.mapOffset.x = -(gameGridSize.width-screenSize.width);
		} else if(x<screenSize.width/2){
			gameMapInstance.mapOffset.x = 0;
		} else{
			gameMapInstance.mapOffset.x = -(x-(screenSize.width/2));
		}
		if(y>gameGridSize.height-(screenSize.height/2)){
			gameMapInstance.mapOffset.y = -(gameGridSize.height-screenSize.height);
		} else if(y<screenSize.height/2){
			gameMapInstance.mapOffset.y = 0;
		} else{
			gameMapInstance.mapOffset.y = -(y-(screenSize.height/2));
		}
		offsetFromPositionScheduledX=0;
		offsetFromPositionScheduledY=0;
		gameMapInstance.unschedule(GameMap.scheduledOffsetFromPosition);

	    if(gameGridSize.height<screenSize.height){
			gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
		}
		if(gameGridSize.width<screenSize.width){
			gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
		}
		gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
	}
};
offsetFromPositionScheduledX=0;
offsetFromPositionScheduledY=0;
GameMap.scheduledOffsetFromPosition=function(){
	GameMap.goToOffsetFromPosition(offsetFromPositionScheduledX,offsetFromPositionScheduledY);
};

GameMap.goToOffsetRight=function(){
	if(gameMapInstance.isMapDirty==true){
		gameMapInstance.schedule(GameMap.goToOffsetRight);
		return;
	} else{
		gameMapInstance.unschedule(GameMap.goToOffsetRight);
		gameMapInstance.mapOffset.x = -(gameGridSize.width-screenSize.width);
		if(gameGridSize.height<screenSize.height){
		gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
	}
	if(gameGridSize.width<screenSize.width){
		gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
	}
		gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
	}
};

GameMap.goToOffsetLeft=function(){
	if(gameMapInstance.isMapDirty==true){
		gameMapInstance.schedule(GameMap.goToOffsetLeft);
		return;
	} else{
		gameMapInstance.unschedule(GameMap.goToOffsetLeft);
		gameMapInstance.mapOffset.x = 0;
		if(gameGridSize.height<screenSize.height){
		gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
	}
	if(gameGridSize.width<screenSize.width){
		gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
	}
		gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
	}
};


GameMap.goToOffsetDown=function(){
	if(gameMapInstance.isMapDirty==true){
		gameMapInstance.schedule(GameMap.goToOffsetDown);
		return;
	} else{
		gameMapInstance.unschedule(GameMap.goToOffsetDown);
		gameMapInstance.mapOffset.y = -(gameGridSize.height-screenSize.height);
		if(gameGridSize.height<screenSize.height){
		gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
	}
	if(gameGridSize.width<screenSize.width){
		gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
	}

		gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
	}
};


GameMap.goToOffsetUp=function(){
	if(gameMapInstance.isMapDirty==true){
		gameMapInstance.schedule(GameMap.goToOffsetUp);
		return;
	} else{
		gameMapInstance.unschedule(GameMap.goToOffsetUp);
		gameMapInstance.mapOffset.y = 0;
		if(gameGridSize.height<screenSize.height){
		gameMapInstance.mapOffset.y=((screenSize.height-gameGridSize.height)/2)
	}
	if(gameGridSize.width<screenSize.width){
		gameMapInstance.mapOffset.x=((screenSize.width-gameGridSize.width)/2)
	}

		gameMapInstance.setPosition(gameMapInstance.mapOffset.x,gameMapInstance.mapOffset.y)
	}
};



GameMap.create=function(){
	if(!gameMapInstance){
		gameMapInstance = new GameMap();
		gameMapInstance.tileNodes = requestLayout(gameMapInstance);
		gameMapInstance.addChild(gameMapInstance.tileNodes);
		gameMapInstance.underPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
		gameMapInstance.underPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
		gameMapInstance.addChild(gameMapInstance.underPlayerRenderTexture);
		gameMapInstance.underPlayerRenderTexture.setVisible(false);
		
		gameMapInstance.playerLayer=cc.Node.create();
		gameMapInstance.addChild(gameMapInstance.playerLayer);
		
		gameMapInstance.overPlayerRenderTexture = cc.RenderTexture.create(gameGridSize.width,gameGridSize.height);
		gameMapInstance.overPlayerRenderTexture.setPosition(cc.p(Math.floor(gameGridSize.width/2),Math.floor(gameGridSize.height/2)));	
		gameMapInstance.addChild(gameMapInstance.overPlayerRenderTexture);
		gameMapInstance.overPlayerRenderTexture.setVisible(false);
		gameMapInstance.setTouchPriority(-15);
		gameMapInstance.init();
	}
	return gameMapInstance;
};

GameMap.getInstance = function(mapnumber){
	return gameMapInstance;
};

GameMap.setInstanceNull = function(){
	gameMapInstance.removeFromParent();
	gameMapInstance=null;
};

GameMap.updateMap=function(){
	if(!gameMapInstance){
		gameMapInstance = GameMap.create();
	}
	gameMapInstance.isMapDirty=true;
};

GameMap.setupMap=function(data){
	gameMapInstance.setupFromServer(data);
};

GameMap.getInstance=function(){
	return gameMapInstance;
};

GameMap.setLayer=function(id,texture,frame,type){
	if(gameMapInstance.tileData[id]){
		gameMapInstance.tileNodes[id].setLayer(texture,frame,type);
		gameMapInstance.tileData[id][type]={"texture":texture,"frame":frame};
	}
};

GameMap.updateServer=function(){
	PlayersController.destroyNPCs();
	sendMessageToServer({"savemap":gameMapInstance.currentMap, "mapdata":gameMapInstance.tileData});
};

GameMap.destroyLayer=function(id,type){
	gameMapInstance.tileData[id][type]=null;
	gameMapInstance.tileNodes[id].destroyLayer(type);
};

GameMap.setTileScript=function(id,scriptID){
	if(scriptID!=null && scriptID!=='undefined'){
		gameMapInstance.tileNodes[id].setScript(scriptID);
		gameMapInstance.tileData[id]["info"]={"script":scriptID};
		return;
	}
};

GameMap.getTileScript=function(id,scriptID){
		return gameMapInstance.tileNodes[id].getScript();
};

GameMap.destroyTileScript=function(id,scriptID){
		gameMapInstance.tileNodes[id].destroyScript();
		gameMapInstance.tileData[id]["info"]={"script":null};
};


GameMap.setMapInfo=function(data){
	gameMapInstance.tileData["mapdata"]["mapConnectors"] = data;
	gameMapInstance.mapUp = data["up"];
	gameMapInstance.mapDown = data["down"];
	gameMapInstance.mapLeft = data["left"];
	gameMapInstance.mapRight = data["right"];

	if(gameMapInstance.mapWidth!=data["width"] || gameMapInstance.mapHeight!=data["height"]){
		gridWidth=data["width"];
		gridHeight=data["height"];
		updateScreenSize();
		gameMapInstance.tileNodes.removeFromParent();
		var amount=0;
		for(var i in gameMapInstance.tileData){
			if(i!="mapdata"){
				amount++;
			}
		}
		if(amount>gridWidth*gridHeight){
			for(var i=gridWidth*gridHeight;i<amount;i++){
				delete gameMapInstance.tileData["tile"+i];
			}
		}
		for(var i=0;i<gridWidth*gridHeight;i++){
			if(!gameMapInstance.tileData["tile"+i]){
				gameMapInstance.tileData["tile"+i]={};
			}
		} 
	}
	gameMapInstance.mapWidth = data["width"];
	gameMapInstance.mapHeight = data["height"];
};


GameMap.fillMap = function(texture,frame,type){
	for(var i in gameMapInstance.tileNodes){
		if(i.substring(0,4)=="tile" && gameMapInstance.tileData[i]){
			gameMapInstance.tileNodes[i].setLayer(texture,frame,type);
			gameMapInstance.tileData[i][type]={"texture":texture,"frame":frame};
		}
	}
};

GameMap.setStringsVisible=function(value){
	for(var i in gameMapInstance.tileNodes){
		if(i.substring(0,4)=="tile"){
			gameMapInstance.tileNodes[i].setStringVisible(value);
		}
	}
	SkillBarsInstance.setVisible(!value);
	gameChatInstance.setVisible(!value);
	gameMapInstance.isMapDirty=true;
};

GameMap.setStringsToIndex=function(){
	for(var i in gameMapInstance.tileNodes){
		if(i.substring(0,4)=="tile"){
			gameMapInstance.tileNodes[i].string.setString(i.substring(4));
		}
	}
	gameMapInstance.isMapDirty=true;
};

GameMap.hasMapUp=function(){
	return gameMapInstance.mapUp!=null;
};

GameMap.hasMapDown=function(){
	return gameMapInstance.mapDown!=null;
};

GameMap.hasMapLeft=function(){
	return gameMapInstance.mapLeft!=null;
};

GameMap.hasMapRight=function(){
	return gameMapInstance.mapRight!=null;
};

GameMap.getMapNumber=function(){
	return gameMapInstance.currentMap;
};

GameMap.getMapUp=function(){
	return gameMapInstance.mapUp;
};

GameMap.getMapDown=function(){
	return gameMapInstance.mapDown;
};

GameMap.getMapLeft=function(){
	return gameMapInstance.mapLeft;
};

GameMap.getMapRight=function(){
	return gameMapInstance.mapRight;
};

GameMap.getMapWidth=function(){
	return gameMapInstance.mapWidth;
};

GameMap.getMapHeight=function(){
	return gameMapInstance.mapHeight;
};

GameMap.goToMap=function(id,ignoreResetMaster){
	if(!ignoreResetMaster){
		MapMaster=false;
	}
	PlayersController.getInstance().setVisible(false);
	PlayersController.destroyNPCs();
	GameMap.destroy();
	gameMapInstance.currentMap=id;
	PlayersController.getYou().setMap(id);
	PlayersController.showPlayersInMapOnly();
	gameMapInstance.setup(id);
};

GameMap.goToMapWithoutPlayer=function(id){
	PlayersController.destroyNPCs();
	GameMap.destroy();
	gameMapInstance.currentMap=id;
	gameMapInstance.setup(id);
};

GameMap.goToMapUp=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	gameMapInstance.currentMap=gameMapInstance.mapUp;
	PlayersController.getYou().setMap(gameMapInstance.mapUp);
	PlayersController.showPlayersInMapOnly();
	gameMapInstance.setup(gameMapInstance.mapUp);
};

GameMap.goToMapDown=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	gameMapInstance.currentMap=gameMapInstance.mapDown;
	PlayersController.getYou().setMap(gameMapInstance.mapDown);
	PlayersController.showPlayersInMapOnly();
	gameMapInstance.setup(gameMapInstance.mapDown);
};

GameMap.goToMapLeft=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	gameMapInstance.currentMap=gameMapInstance.mapLeft;
	PlayersController.getYou().setMap(gameMapInstance.mapLeft);
	PlayersController.showPlayersInMapOnly();
	gameMapInstance.setup(gameMapInstance.mapLeft);
};

GameMap.getMapSizeForIndex=function(index){
	if(!LocalStorage.getMapData(index)){
		return cc.size(36,36);
	}
	var data = LocalStorage.getMapData(index)["mapdata"]["mapConnectors"];
	return cc.size(data["width"],data["height"]);
};

GameMap.goToMapRight=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	gameMapInstance.currentMap=gameMapInstance.mapRight;
	PlayersController.getYou().setMap(gameMapInstance.mapRight);
	PlayersController.showPlayersInMapOnly();
	gameMapInstance.setup(gameMapInstance.mapRight);
};

GameMap.setInteractionDelegate=function(delegate){
	gameMapInstance.interactionDelegate=delegate;
};

GameMap.getTileNodeForXY=function(x,y){
	if(x>(gridWidth-1)||x<0){
		return undefined;
	}
	return gameMapInstance.tileNodes["tile"+(x + (gridHeight-y) * gridWidth)];
};

GameMap.getNPCForXY=function(x,y){
	for(var i in PlayersController.getInstance().npcs){
		var npcGridPos = PlayersController.getInstance().npcs[i].getGridPosition();
		if(npcGridPos.x==x && npcGridPos.y==y){
			return PlayersController.getInstance().npcs[i];
		}
	}
	return null;
};

GameMap.getTileNodeForIndex=function(idx){
	return gameMapInstance.tileNodes["tile"+idx];
};

GameMap.addPlayersController=function(_in){
	gameMapInstance.playerLayer.addChild(_in);
	GameMap.goToOffsetFromPosition(PlayersController.getYou().getPositionX(),PlayersController.getYou().getPositionY());
};

GameMap.destroy=function(){
	gameMapInstance.tileData={};
	for(var i in gameMapInstance.tileNodes){
		if(i.substring(0,4)=="tile"){
			gameMapInstance.tileNodes[i].destroy();
			gameMapInstance.tileData[i]={};
		}
	}
	gameMapInstance.tileData["mapdata"]={};
	gameMapInstance.isMapDirty=true;
};