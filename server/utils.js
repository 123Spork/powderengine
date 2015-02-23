exports.getSpawns =function(scripts,maps){
	var spawnNPCScripts=[], spawnItemScripts=[];
	for(var i in scripts){
		for(var j in scripts[i]["data"]){
			var responses = scripts[i]["data"][j]["responses"];
			for(var k=0;k<responses.length;k++){
				switch(responses[k]["type"]){
					case "Spawn NPC":
						if(responses[k]["data"]["npc"]){
							spawnNPCScripts.push({scriptnum:i+"",npc:responses[k]["data"].npc});
						}
					break;
					case "Spawn Item":
						if(responses[k]["data"]["item"]){
							spawnItemScripts.push({scriptnum:i+"",item:responses[k]["data"].item,amount:responses[k]["data"]["amount"]});
						}
					break;		
				}
			}
		}
	}
	var spawnNPCPositions={}, spawnItemPositions={};
	for(var j in maps){
		spawnNPCPositions[j]=[];
		spawnItemPositions[j]=[];
		for(var i in maps[j]){
			if(i.substring(0,4)!="tile"){
				continue;
			}
			if(maps[j][i]["info"]){
				for(var k in spawnNPCScripts){
					if(spawnNPCScripts[k].scriptnum==maps[j][i]["info"]["script"]){
						spawnNPCPositions[j].push({index:i.substring(4),number:spawnNPCScripts[k].npc});
						break; continue;
					}
				}
				for(var k in spawnItemScripts){
					if(spawnItemScripts[k].scriptnum==maps[j][i]["info"]["script"]){
						spawnItemPositions[j].push({index:i.substring(4),number:spawnItemScripts[k].item,amount:spawnItemScripts[k].amount});
						break;
					}
				}
			}
		}	
	}
	return {npc:spawnNPCPositions,itm:spawnItemPositions};
};

exports.indexFromPos=function(x,y,width,height){
	return parseInt((width*(y)))+parseInt(x);
};

exports.findNPCPath = function(mapblocks,pathStart,pathEnd,width,height){
		var findNeighbours = function(){};
		var self=this;
		var minIndex=0;
		var maxIndex=width*height;
		var Neighbours=function(x, y){
			var	N = parseInt(y) - 1,S = parseInt(y) + 1,E = parseInt(x) + 1,W = parseInt(x) - 1,
			myN = N > -1 && exports.indexFromPos(x,N,width,height)>=minIndex && !mapblocks[exports.indexFromPos(x,N,width,height)];
			myS = S < width && exports.indexFromPos(x,S,width,height)<maxIndex && !mapblocks[exports.indexFromPos(x,S,width,height)];
			myE = E < width && exports.indexFromPos(E,y,width,height)<maxIndex && exports.indexFromPos(E,y,width,height)%width!=0 && !mapblocks[exports.indexFromPos(E,y,width,height)]
			myW = W > -1 && exports.indexFromPos(W,y,width,height)>=minIndex && exports.indexFromPos(W,y,width,height)%width!=(width-1) && !mapblocks[exports.indexFromPos(W,y,width,height)]
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
			return {Parent:Parent,value:Point.x + (Point.y * width),x:Point.x,y:Point.y,f:0,g:0};
		};
		var	mypathStart = Node(null, pathStart),
		myPathEnd = Node(null, pathEnd),
		myNeighbours,
		myNode, myPath, length, max, min, i, j,
		outer = [], Closed = [], Open = [mypathStart],
		AStar = new Array(height*width);

		while(length = Open.length){
			max =height*width;
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
					outer.push({x:(myPath.x),y:((height-1)-myPath.y)});
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
	};
