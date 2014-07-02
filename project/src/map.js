var GameMap=cc.Layer.extend({
	instance:null,
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
	currentMap:1,
	
	findPath:function(pathStart, pathEnd){
		var findNeighbours = function(){};
		var self=this;
		var Neighbours=function(x, y){
			var	N = y - 1,S = y + 1,E = x + 1,W = x - 1,
			myN = N > -1 && self.tileNodes["tile"+indexFromPos(x,N)] && self.tileNodes["tile"+ indexFromPos(x,N)].getType()!=1
			myS = S < gridWidth && self.tileNodes["tile"+indexFromPos(x,S)] && self.tileNodes["tile"+ indexFromPos(x,S)].getType()!=1
			myE = E < gridWidth && self.tileNodes["tile"+indexFromPos(E,y)] && self.tileNodes["tile"+ indexFromPos(E,y)].getType()!=1
			myW = W > -1 && self.tileNodes["tile"+indexFromPos(W,y)] && self.tileNodes["tile"+ indexFromPos(W,y)].getType()!=1
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
			this.tileData=data;
			for(var i in data){
				if(i.substring(0,4)=="tile"){
					for(var j in data[i]){
						if(j!="info"){
							if(data[i][j]!=null){
								this.tileNodes[i].setLayer(data[i][j]["texture"],data[i][j]["frame"],j);
							}
						} else{
							this.tileNodes[i].setType(data[i][j]["type"]);
							if(data[i][j]["script"]){
								this.tileNodes[i].setScript(data[i][j]["script"]);
							}
						}
					}
				}
				else if(i=="mapdata"){
					this.mapUp = (data[i]["mapConnectors"]["up"]!="" && data[i]["mapConnectors"]["up"]!=null) ? data[i]["mapConnectors"]["up"] : null;
					this.mapDown = (data[i]["mapConnectors"]["down"]!="" && data[i]["mapConnectors"]["down"]!=null) ? data[i]["mapConnectors"]["down"] : null;
					this.mapLeft = (data[i]["mapConnectors"]["left"]!="" && data[i]["mapConnectors"]["left"]!=null) ? data[i]["mapConnectors"]["left"] : null;
					this.mapRight = (data[i]["mapConnectors"]["right"]!="" && data[i]["mapConnectors"]["right"]!=null) ? data[i]["mapConnectors"]["right"] : null;
				}
			}
		}
		this.schedule(this.refreshRenderTexture);
	},
	
	setup:function(mapnumber){
		PlayersController.getInstance().setVisible(false);
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
			this.tileData=data;
			for(var i in data){
				if(i.substring(0,4)=="tile"){
					for(var j in data[i]){
						if(j!="info"){
							if(data[i][j]!=null){
								this.tileNodes[i].setLayer(data[i][j]["texture"],data[i][j]["frame"],j);
							}
						} else{
							this.tileNodes[i].setType(data[i][j]["type"]);
							if(data[i][j]["script"]){
								this.tileNodes[i].setScript(data[i][j]["script"]);
							}
						}
					}
				}
				else if(i=="mapdata"){
					this.mapUp = (data[i]["mapConnectors"]["up"]!="" && data[i]["mapConnectors"]["up"]!=null) ? data[i]["mapConnectors"]["up"] : null;
					this.mapDown = (data[i]["mapConnectors"]["down"]!="" && data[i]["mapConnectors"]["down"]!=null) ? data[i]["mapConnectors"]["down"] : null;
					this.mapLeft = (data[i]["mapConnectors"]["left"]!="" && data[i]["mapConnectors"]["left"]!=null) ? data[i]["mapConnectors"]["left"] : null;
					this.mapRight = (data[i]["mapConnectors"]["right"]!="" && data[i]["mapConnectors"]["right"]!=null) ? data[i]["mapConnectors"]["right"] : null;
				}
			}
		}
		this.schedule(this.refreshRenderTexture);
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
		if(this.interactionDelegate){
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x,touch._point.y+32))){
						this.interactionDelegate.tilePressed(this.tileNodes,i);
						GameMap.updateMap();
					}
				}
			}
		} else{
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x,touch._point.y+32))){
						var gp = PlayersController.getYou().getGridPosition();
						PlayersController.getYou().setWalkingPath(this.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),cc.p(this.tileNodes[i].getPosition().x/32,this.tileNodes[i].getPosition().y/32)));
					}
				}
			}
		}
		return true;
	},
	
	onTouchMoved:function(touch){
		if(this.interactionDelegate){
			for(var i in this.tileNodes){
				if(i.substring(0,4)=="tile"){
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x,touch._point.y+32))){
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
					if(cc.rectContainsPoint(this.tileNodes[i].getBoundingBox(),cc.p(touch._point.x,touch._point.y+32))){
						var gp = PlayersController.getYou().getGridPosition();
						PlayersController.getYou().setWalkingPath(this.findPath(cc.p(Math.floor(gp.x),Math.ceil(gp.y)),cc.p(this.tileNodes[i].getPosition().x/32,this.tileNodes[i].getPosition().y/32)));
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
				this.tileNodes[i].setVisible(false);
				}
			}
			this.overPlayerRenderTexture.end();
			this.isMapDirty=false;
		}
	}
	
});

GameMap.create=function(){
	if(!this.instance){
		this.instance = new GameMap();
		this.instance.tileNodes = requestLayout(this.instance);
		this.instance.addChild(this.instance.tileNodes);
		this.instance.underPlayerRenderTexture = cc.RenderTexture.create(gamePanelSize.width,gamePanelSize.height);
		this.instance.underPlayerRenderTexture.setPosition(cc.p(Math.floor(gamePanelSize.width/2),Math.floor(gamePanelSize.height/2)));	
		this.instance.addChild(this.instance.underPlayerRenderTexture);
		this.instance.underPlayerRenderTexture.setVisible(false);
		
		this.instance.playerLayer=cc.Node.create();
		this.instance.addChild(this.instance.playerLayer);
		
		this.instance.overPlayerRenderTexture = cc.RenderTexture.create(gamePanelSize.width,gamePanelSize.height);
		this.instance.overPlayerRenderTexture.setPosition(cc.p(Math.floor(gamePanelSize.width/2),Math.floor(gamePanelSize.height/2)));	
		this.instance.addChild(this.instance.overPlayerRenderTexture);
		this.instance.overPlayerRenderTexture.setVisible(false);
		this.instance.setTouchPriority(-15);
		this.instance.init();
	}
	return this.instance;
};

GameMap.getInstance = function(mapnumber){
	return this.instance;
};

GameMap.setInstanceNull = function(){
	this.instance.removeFromParent();
	this.instance=null;
};

GameMap.updateMap=function(){
	if(!this.instance){
		this.instance = GameMap.create();
	}
	this.instance.isMapDirty=true;
};

GameMap.setupMap=function(data){
	this.instance.setupFromServer(data);
};

GameMap.getInstance=function(){
	return this.instance;
};

GameMap.setLayer=function(id,texture,frame,type){
	this.instance.tileNodes[id].setLayer(texture,frame,type);
	this.instance.tileData[id][type]={"texture":texture,"frame":frame};
};

GameMap.updateServer=function(){
	sendMessageToServer({"savemap":this.instance.currentMap, "mapdata":this.instance.tileData});
};

GameMap.destroyLayer=function(id,type){
	this.instance.tileData[id][type]=null;
	this.instance.tileNodes[id].destroyLayer(type);
};

GameMap.setTileInfo=function(id,type,script){
	this.instance.tileNodes[id].setType(type);
	if(script){
		this.instance.tileNodes[id].setScript(script);
		this.instance.tileData[id]["info"]={"type":type, "script":script};
		return;
	}
	this.instance.tileData[id]["info"]={"type":type};
};

GameMap.setMapInfo=function(data){
	this.instance.tileData["mapdata"]["mapConnectors"] = data;
	this.instance.mapUp = data["up"];
	this.instance.mapDown = data["down"];
	this.instance.mapLeft = data["left"];
	this.instance.mapRight = data["right"];
};


GameMap.fillMap = function(texture,frame,type){
	for(var i in this.instance.tileNodes){
		if(i.substring(0,4)=="tile"){
			this.instance.tileNodes[i].setLayer(texture,frame,type);
			this.instance.tileData[i][type]={"texture":texture,"frame":frame};
		}
	}
};

GameMap.setStringsVisible=function(value){
	for(var i in this.instance.tileNodes){
		if(i.substring(0,4)=="tile"){
			this.instance.tileNodes[i].setStringVisible(value);
		}
	}
	this.instance.isMapDirty=true;
};

GameMap.setStringsToIndex=function(){
	for(var i in this.instance.tileNodes){
		if(i.substring(0,4)=="tile"){
			this.instance.tileNodes[i].string.setString(i.substring(4));
		}
	}
	this.instance.isMapDirty=true;
};

GameMap.hasMapUp=function(){
	return this.instance.mapUp!=null;
};

GameMap.hasMapDown=function(){
	return this.instance.mapDown!=null;
};

GameMap.hasMapLeft=function(){
	return this.instance.mapLeft!=null;
};

GameMap.hasMapRight=function(){
	return this.instance.mapRight!=null;
};

GameMap.getMapNumber=function(){
	return this.instance.currentMap;
};

GameMap.getMapUp=function(){
	return this.instance.mapUp;
};

GameMap.getMapDown=function(){
	return this.instance.mapDown;
};

GameMap.getMapLeft=function(){
	return this.instance.mapLeft;
};

GameMap.getMapRight=function(){
	return this.instance.mapRight;
};

GameMap.goToMap=function(id){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	this.instance.currentMap=id;
	PlayersController.getYou().setMap(id);
	PlayersController.showPlayersInMapOnly();
	this.instance.setup(id);
};

GameMap.goToMapUp=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	this.instance.currentMap=this.instance.mapUp;
	PlayersController.getYou().setMap(this.instance.mapUp);
	PlayersController.showPlayersInMapOnly();
	this.instance.setup(this.instance.mapUp);
};

GameMap.goToMapDown=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	this.instance.currentMap=this.instance.mapDown;
	PlayersController.getYou().setMap(this.instance.mapDown);
	PlayersController.showPlayersInMapOnly();
	this.instance.setup(this.instance.mapDown);
};

GameMap.goToMapLeft=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	this.instance.currentMap=this.instance.mapLeft;
	PlayersController.getYou().setMap(this.instance.mapLeft);
	PlayersController.showPlayersInMapOnly();
	this.instance.setup(this.instance.mapLeft);
};

GameMap.goToMapRight=function(){
	PlayersController.getInstance().setVisible(false);
	GameMap.destroy();
	this.instance.currentMap=this.instance.mapRight;
	PlayersController.getYou().setMap(this.instance.mapRight);
	PlayersController.showPlayersInMapOnly();
	this.instance.setup(this.instance.mapRight);
};

GameMap.setInteractionDelegate=function(delegate){
	this.instance.interactionDelegate=delegate;
};

GameMap.getTileNodeForXY=function(x,y){
	if(x>(gridWidth-1)||x<0){
		return undefined;
	}
	return this.instance.tileNodes["tile"+(x + (gridHeight-y) * gridWidth)];
};

GameMap.addPlayersController=function(_in){
	this.instance.playerLayer.addChild(_in);
};

GameMap.destroy=function(){
	this.instance.tileData={};
	for(var i in this.instance.tileNodes){
		if(i.substring(0,4)=="tile"){
			this.instance.tileNodes[i].destroy();
			this.instance.tileData[i]={};
		}
	}
	this.instance.tileData["mapdata"]={};
	this.instance.isMapDirty=true;
};