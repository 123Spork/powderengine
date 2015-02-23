
MapEditor = Scene.extend({
	map:null,
	mapOffset:cc.p(0,0),
	editMode:"tiles",
	lastTile:null,
	currentLayer:"ground1",
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	currentSoundNumber:-1,
	mapSize:null,

	willExitEditor:function(clicknum){
		this.saveEditor();
		return true;
	},

	getTabOptions:function(clicknum){
		return ["Tiles","Scripts","Settings"];
	},

	getCloseOptions:function(clicknum){
		return ["Cancel","Save & Exit"];
	},
	
	getLayoutObject:function(){
		this.mapSize = (screenSize.height-40)-(((screenSize.height-40))%cellsize);
		return { "panels":{
			children:{	
				"tab1":{
					children:{
						"tiles" : {
							anchorPoint:cc.p(0,1),
							position:cc.p(0,screenSize.height-40),
							texture:tileTextureList[0]["name"],
						},
						"scriptbtn" : {
							position:cc.p(360,360),
							size:cc.size(128,26),
							color: WHITE,
							anchorPoint:cc.p(0,0),
							children:{
								"text":{
									label:"Script",
									fontSize:12,
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(64,13),
									color:cc.c3b(0,0,0),
								}
							}
						},
							
						"menu_bar":{
							size:cc.size(352,20),
							position:cc.p(0,screenSize.height-40),
							color:cc.c3b(127,127,127),
							children:{
								"layerDropDown":{
									position:cc.p(0,0),
									size:cc.size(80,20),
									color: cc.c3b(127,127,127),
									anchorPoint:cc.p(0,0),
									children:{
										"lbl":{
											label:"Ground 1",
											fontSize:12,
											anchorPoint:cc.p(0.5,0),
											position:cc.p(40,3),
										}
									}
								},
								"textureDropDown": {
									position:cc.p(80,0),
									size:cc.size(80,20),
									color: cc.c3b(127,127,127),
									anchorPoint:cc.p(0,0),
									children:{
										"lbl":{
											label:(tileTextureList[0]["name"].substring(0,12)),
											fontSize:12,
											anchorPoint:cc.p(0.5,0),
											position:cc.p(40,3),
										}
									}
								},
								"fillbtn": {
									position:cc.p(160,0),
									size:cc.size(80,20),
									color: cc.c3b(127,127,127),
									anchorPoint:cc.p(0,0),
									children:{
										"lbl":{
											label:"Fill All",
											fontSize:12,
											anchorPoint:cc.p(0.5,0),
											position:cc.p(40,3),
										}
									}
								},
								"deletebtn": {
									position:cc.p(240,0),
									size:cc.size(80,20),
									color: cc.c3b(127,127,127),
									anchorPoint:cc.p(0,0),
									children:{
										"lbl":{
											label:"Delete",
											fontSize:12,
											anchorPoint:cc.p(0.5,0),
											position:cc.p(40,3),
										}
									}
								},
							}
						},
						"highlightnode" : {
							anchorPoint:cc.p(0,0),
							position:cc.p(0,0),
							size:cc.size(cellsize,cellsize),
							color:cc.c4b(255,100,100,255),
						},
						"selectednode" : {
							anchorPoint:cc.p(0,0),
							position:cc.p(0,0),
							size:cc.size(cellsize,cellsize),
							color:cc.c4b(100,255,100,255),
						},
					}
				},
				"tab2":{
					children:{
						"scriptList":{
							position:cc.p(0,0),
							size:cc.size(352,screenSize.height-20),
							anchorPoint:cc.p(0,0),
						}
					}
				},
				"tab3":{	
					children:{
						"mapname_lbl":{
							label:"Name:",
							fontSize:12,
							anchorPoint:cc.p(0,1),
							position: cc.p(4,screenSize.height-29),
						},
						"mapName_entry":{
							position:cc.p(60,screenSize.height-44),
							size:cc.size(282,16),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(180,180,180)
						},	
						"mapmusic_lbl":{
							label:"Music:",
							fontSize:12,
							anchorPoint:cc.p(0,1),
							position: cc.p(4,screenSize.height-63),
						},
						"musicList":{
							position:cc.p(60,screenSize.height-162),
							size:cc.size(282,100),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(180,180,180)
						},
						"mapconnectors_lbl":{
							label:"Joins:",
							fontSize:12,
							anchorPoint:cc.p(0,1),
							position: cc.p(4,screenSize.height-180),
						},
						"mapsizers_lbl":{
							label:"Size:",
							fontSize:12,
							anchorPoint:cc.p(0,1),
							position: cc.p(4,screenSize.height-352),
						},
						"destroyMap":{
							size:cc.size(282,20),
							position:cc.p(60,56),
							color:cc.c3b(255,0,0),
							anchorPoint:cc.p(0,0),
							children:{	
								"lbl":{
									label:"Destroy Map",
									fontSize:12,
									anchorPoint:cc.p(0.5,0),
									position:cc.p(141,3),
									color:cc.c3b(255,255,255),
								},	
							}
						},
						"connectors":{	
							size:cc.size(282,120),
							position:cc.p(60,screenSize.height-302),
							color:cc.c3b(180,180,180),
							anchorPoint:cc.p(0,0),
							children:{	
								"this_map":{
									label:"#"+ GameMap.getMapNumber(),
									fontSize:12,
									anchorPoint:cc.p(0.5,0),
									position:cc.p(140,48),
									color:cc.c3b(0,0,0),
								},			
								"mapUp_text":{
									label:"Up",
									fontSize:12,
									anchorPoint:cc.p(0,0),
									color:cc.c3b(0,0,0),
									position: cc.p(111,104),
								},
								"mapUp_entry":{
									size: cc.size(60,16),
									position: cc.p(111,90),
									color:cc.c3b(60,60,60),
								},
								"mapDown_text":{
									label:"Down:",
									color:cc.c3b(0,0,0),
									fontSize:12,
									anchorPoint:cc.p(0,0),
									position: cc.p(111,18),
								},
								"mapDown_entry":{
									size: cc.size(60,16),
									position: cc.p(111,4),
									color:cc.c3b(60,60,60),
								},
								"mapLeft_text":{
									label:"Left:",
									fontSize:12,
									anchorPoint:cc.p(0,0),
									position: cc.p(38,64),
									color:cc.c3b(0,0,0)
								},
								"mapLeft_entry":{
									size: cc.size(60,16),
									position: cc.p(38,48),
									color:cc.c3b(60,60,60),
								},
								"mapRight_text":{
									label:"Right:",
									fontSize:12,
									anchorPoint:cc.p(0,0),
									position: cc.p(182,64),
									color:cc.c3b(0,0,0),
								},
								"mapRight_entry":{
									size: cc.size(60,16),
									position: cc.p(182,48),
									color:cc.c3b(60,60,60),
								},
							}
						},
						"sizers":{
							color:cc.c3b(180,180,180),
							size:cc.size(282,38),
							position:cc.p(60,screenSize.height-360),
							children:{
								"mapHeight_text":{
									label:"Height:",
									fontSize:12,
									anchorPoint:cc.p(0,0),
									position: cc.p(182,20),
									color:cc.c3b(0,0,0),
								},
								"mapHeight_entry":{
									size: cc.size(60,16),
									position: cc.p(182,4),
									color:cc.c3b(60,60,60),
								},
								"mapWidth_text":{
									label:"Width:",
									fontSize:12,
									anchorPoint:cc.p(0,0),
									position: cc.p(38,20),
									color:cc.c3b(0,0,0),
								},
								"mapWidth_entry":{
									size: cc.size(60,16),
									position: cc.p(38,4),
									color:cc.c3b(60,60,60),
								},
							}
						}
						
					}
				},
			}
		}
		};
	},

	updateMusicList:function(){
		var list=["No Music"];
		for(var i in soundList){
			list.push(soundList[i]);
		}
		if(this.panels["tab3"]["musicList"].listView!=null){
			this.panels["tab3"]["musicList"].listView.removeFromParent();
			this.panels["tab3"]["musicList"].listView=null;
		}

		var listnodes = [];
		var callBackList=[];
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.Node.create();	
			listnodes[i]=cc.Sprite.create();
			listnodes[i].setColor(cc.c3b(180,180,180));
			listnodes[i].setAnchorPoint(cc.p(0,0));
			var text = cc.LabelTTF.create(list[i],"Arial",12);
			text.setAnchorPoint(cc.p(0,0));
			text.setColor(cc.c3b(0,0,0));
			var bottomLine= cc.LayerColor.create(cc.c4b(0,0,0,127),282,1);
			bottomLine.setPosition(cc.p(0,0))
			text.setPosition(cc.p(2,2));
			text.setDimensions(cc.size(282,0));
			listnodes[i].setTextureRect(cc.rect(0,0,282,text.getContentSize().height+4));
			listnodes[i].setContentSize(282,text.getContentSize().height+4);
			listnodes[i].addChild(text);
			listnodes[i].addChild(bottomLine);
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
			if(this.currentSoundNumber+1==i){
				listnodes[i].setColor(cc.c3b(60,60,60));
				text.setColor(cc.c3b(255,255,255));
			}
		}
		var self=this;
		this.panels["tab3"]["musicList"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(282,height);
		};
		this.panels["tab3"]["musicList"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab3"]["musicList"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab3"]["musicList"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab3"]["musicList"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab3"]["musicList"].runListCallBack=function(name,listelement){
			self.currentSoundNumber=listelement-1;
			self.updateMusicList();
		};
		this.panels["tab3"]["musicList"].listView = ListView.create(this.panels["tab3"]["musicList"]);
		
		if(this.panels["tab3"]["musicList"].listView.scrollBar){
			this.panels["tab3"]["musicList"].listView.scrollBar.setPositionX(282);
			this.panels["tab3"]["musicList"].listView.scrollBar.setContentSize(20,60);
			this.panels["tab3"]["musicList"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["tab3"]["musicList"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["tab3"]["musicList"].listView.setCallBackList(callBackList);
		this.panels["tab3"]["musicList"].addChild(this.panels["tab3"]["musicList"].listView);
	},


	updateScriptList:function(){
		var list = ObjectLists.getScriptList();
		if(this.panels["tab2"]["scriptList"].listView!=null){
			this.panels["tab2"]["scriptList"].listView.removeFromParent();
			this.panels["tab2"]["scriptList"].listView=null;
		}

		var listnodes = [];
		var callBackList=[];
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.Node.create();	
			if(list[i]["specifier"]=="Tile"){
				listnodes[i]=cc.Sprite.create();
				listnodes[i].setColor(cc.c3b(80,80,80));
				listnodes[i].setAnchorPoint(cc.p(0,0));
				var text = cc.LabelTTF.create(list[i]["name"],"Arial",12);
				text.setAnchorPoint(cc.p(0,0));
				var bottomLine= cc.LayerColor.create(cc.c4b(0,0,0,127),326,1);
				bottomLine.setPosition(cc.p(0,0))
				text.setPosition(cc.p(2,2));
				text.setDimensions(cc.size(326,0));
				listnodes[i].setTextureRect(cc.rect(0,0,326,text.getContentSize().height+4));
				listnodes[i].setContentSize(326,text.getContentSize().height+4);
				listnodes[i].addChild(text);
				listnodes[i].addChild(bottomLine);
				callBackList.push([listnodes[i]]);
				if(this.typeData==i){
					listnodes[i].setColor(cc.c3b(200,200,200));
					text.setColor(cc.c3b(0,0,0));
					listnodes[i].callBack="Use";	
				}
			}else{
				callBackList.push([]);
				listnodes[i].setContentSize(0,0);
			}
		}
		var self=this;
		this.panels["tab2"]["scriptList"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(330,height);
		};
		this.panels["tab2"]["scriptList"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab2"]["scriptList"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab2"]["scriptList"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab2"]["scriptList"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab2"]["scriptList"].runListCallBack=function(name,listelement){
			console.log(listelement);
			self.typeData=listelement;
			self.updateScriptList();
		};
		this.panels["tab2"]["scriptList"].listView = ListView.create(this.panels["tab2"]["scriptList"]);
		
		if(this.panels["tab2"]["scriptList"].listView.scrollBar){
			this.panels["tab2"]["scriptList"].listView.scrollBar.setPositionX(330);
			this.panels["tab2"]["scriptList"].listView.scrollBar.setContentSize(20,60);
			this.panels["tab2"]["scriptList"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["tab2"]["scriptList"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["tab2"]["scriptList"].listView.setCallBackList(callBackList);
		this.panels["tab2"]["scriptList"].addChild(this.panels["tab2"]["scriptList"].listView);
	},


	
	getIdentifier:function(){
		return "MapEditor";
	},

	saveEditor:function(){
		var data={"mapName":this.mapNameBox.getText(), "up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText(),"width":this.mapWidthBox.getText(),"height":this.mapHeightBox.getText()};
		data["mapMusic"]=this.currentSoundNumber>-1?this.currentSoundNumber:null;
		if(data["mapMusic"]==null){
			delete data["mapMusic"];
		}
		GameMap.setMapInfo(data);
		GameMap.updateServer();
	},

	mapOffset:null,
	mapUpBox:null,
	mapDownBox:null,
	mapLeftBox:null,
	mapRightBox:null,
	mapWidthBox:null,
	mapHeightBox:null,
	tabWidths:null,
	currentTab:0,
	typeData:null,
	
	init:function(_map){
		this._super();
		this.map =_map;
		this.setTouchPriority(-100);
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,496,200];
		if(GameMap.getMusicNumber()!=null){
			this.currentSoundNumber=GameMap.getMusicNumber();
		}else{
			this.currentSoundNumber=-1;
		}
	},
	
	didBecomeActive:function(){
		this._super();
		this.panels["tab1"]["highlightnode"].setOpacity(0);
		this.panels["tab1"]["selectednode"].setOpacity(0);
		this.mapUpBox = new EntryBox(this.panels["tab3"]["connectors"]["mapUp_entry"],cc.size(this.panels["tab3"]["connectors"]["mapUp_entry"].getContentSize().width,this.panels["tab3"]["connectors"]["mapUp_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["connectors"]["mapUp_entry"].getContentSize().height+4), GameMap.hasMapUp() ? GameMap.getMapUp():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapUpBox.setDefaultFineFlag(true);
	    this.mapUpBox.setNullAllowed(true);
	    this.mapUpBox.setBackgroundInvisible();
	    this.mapUpBox.setInputFlag(5);
		this.mapDownBox = new EntryBox(this.panels["tab3"]["connectors"]["mapDown_entry"],cc.size(this.panels["tab3"]["connectors"]["mapDown_entry"].getContentSize().width,this.panels["tab3"]["connectors"]["mapDown_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["connectors"]["mapDown_entry"].getContentSize().height+4), GameMap.hasMapDown() ? GameMap.getMapDown():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapDownBox.setDefaultFineFlag(true);
	    this.mapDownBox.setNullAllowed(true);
	    this.mapDownBox.setBackgroundInvisible();
	    this.mapDownBox.setInputFlag(5);
		this.mapLeftBox = new EntryBox(this.panels["tab3"]["connectors"]["mapLeft_entry"],cc.size(this.panels["tab3"]["connectors"]["mapLeft_entry"].getContentSize().width,this.panels["tab3"]["connectors"]["mapLeft_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["connectors"]["mapLeft_entry"].getContentSize().height+4), GameMap.hasMapLeft() ? GameMap.getMapLeft():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapLeftBox.setDefaultFineFlag(true);
		this.mapLeftBox.setNullAllowed(true);
		this.mapLeftBox.setBackgroundInvisible();
	    this.mapLeftBox.setInputFlag(5);
		this.mapRightBox = new EntryBox(this.panels["tab3"]["connectors"]["mapRight_entry"],cc.size(this.panels["tab3"]["connectors"]["mapRight_entry"].getContentSize().width,this.panels["tab3"]["connectors"]["mapRight_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["connectors"]["mapRight_entry"].getContentSize().height+4), GameMap.hasMapRight() ? GameMap.getMapRight():"" , cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapRightBox.setDefaultFineFlag(true);
		this.mapRightBox.setNullAllowed(true);
		this.mapRightBox.setBackgroundInvisible();
	    this.mapRightBox.setInputFlag(5);


		this.mapWidthBox = new EntryBox(this.panels["tab3"]["sizers"]["mapWidth_entry"],cc.size(this.panels["tab3"]["sizers"]["mapWidth_entry"].getContentSize().width,this.panels["tab3"]["sizers"]["mapWidth_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["sizers"]["mapWidth_entry"].getContentSize().height+4), GameMap.getMapWidth() ? GameMap.getMapWidth():36 , cc.c4b(255,255,255), cc.c3b(255,255,255));
		this.mapWidthBox.setDefaultFineFlag(true);
		this.mapWidthBox.setBackgroundInvisible();
	    this.mapWidthBox.setInputFlag(5);

		this.mapHeightBox = new EntryBox(this.panels["tab3"]["sizers"]["mapHeight_entry"],cc.size(this.panels["tab3"]["sizers"]["mapHeight_entry"].getContentSize().width,this.panels["tab3"]["sizers"]["mapHeight_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["sizers"]["mapHeight_entry"].getContentSize().height+4), GameMap.getMapHeight() ? GameMap.getMapHeight():36 , cc.c4b(255,255,255), cc.c3b(255,255,255));
		this.mapHeightBox.setDefaultFineFlag(true);
		this.mapHeightBox.setBackgroundInvisible();
	    this.mapHeightBox.setInputFlag(5);

	    this.mapNameBox = new EntryBox(this.panels["tab3"]["mapName_entry"],cc.size(this.panels["tab3"]["mapName_entry"].getContentSize().width,this.panels["tab3"]["mapName_entry"].getContentSize().height+4), cc.p(0,this.panels["tab3"]["mapName_entry"].getContentSize().height+4), GameMap.getMapName() ? GameMap.getMapName():"", cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.mapNameBox.setDefaultFineFlag(true);
		this.mapNameBox.setBackgroundInvisible();

		this.setTab(1);
		this.updateMapOffset();
		this.updateMusicList();
		GameMap.setStringsVisible(true);
	},
	
	selectLayer:function(layerNum){
		this.delegate.panels["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
this.delegate.panels["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
		var layerName="ground1";
		var showName="Ground 1";
		switch(layerNum){
			case 0: layerName="ground1"; showName="Ground 1"; break;
			case 1: layerName="ground2"; showName="Ground 2"; break;
			case 2: layerName="ground3"; showName="Ground 3"; break;
			case 3: layerName="mask1"; showName="Mask 1"; break;
			case 4: layerName="mask2"; showName="Mask 2"; break;
			case 5: layerName="mask3"; showName="Mask 3"; break;
			case 6: layerName="fringe1"; showName = "Fringe 1"; break;
			case 7: layerName="fringe2"; showName = "Fringe 2"; break;
			case 8: layerName="fringe3"; showName = "Fringe 3"; break;
		}
		this.delegate.currentLayer=layerName;
		this.delegate.panels["tab1"]["menu_bar"]["layerDropDown"]["lbl"].setString(showName);
	},

	
	willTerminate:function(){
		this._super();
		GameMap.setStringsVisible(false);
	},
	
	onMouseMoved:function(event){
		var pos = event.getLocation();
		if(this.currentTab==1){
			this.panels["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%cellsize);
				truePos.y = truePos.y-(truePos.y%cellsize)+((screenSize.height-40)-this.panels["tab1"]["tiles"].getContentSize().height);
				
				this.panels["tab1"]["highlightnode"].setOpacity(127);
				this.panels["tab1"]["highlightnode"].setPosition(truePos);
				return true;
			}
		}		
	},
	
	setTab:function(value){
		if(value!=this.currentTab){
			this.currentTab=value;
			this.panels["tab1"].setVisible(false);
			this.panels["tab2"].setVisible(false);
			this.panels["tab3"].setVisible(false);
			this.panels["tab"+value].setVisible(true);
		
			if(value==1){

				this.panels["tab3"].setPosition(screenSize.width,0);

				this.editMode="tiles";
				this.panels["tab1"]["menu_bar"]["deletebtn"].setColor(cc.c3b(127,127,127));
			}

			if(value==2){
				this.panels["tab3"].setPosition(screenSize.width,0);
				this.editMode="script";
				this.updateScriptList();
			}			

			if(value==3){
				this.panels["tab3"].setPosition(0,0);
			}
		}
	},
	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["tab1"]["tiles"].getTexture() && this.panels["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(cellsize*this.mapOffset.x),Math.floor(cellsize*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<352?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:352,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<this.mapSize?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:this.mapSize));
		}
	},

	noSelectedMenu:function(touch){
		this.delegate.onTouchBegan(touch);
	},

	selectFillMap:function(number){
		this.delegate.panels["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
		if(number==1){
			if(this.delegate.panels["tab1"]["selectednode"].getOpacity()!=0){
				var ySize = Math.floor(this.delegate.mapSize/cellsize)-1;
				GameMap.fillMap(tileTextureList[this.delegate.currentTextureNumber]["name"],cc.p(((this.delegate.panels["tab1"]["selectednode"].getPositionX())/cellsize)+this.delegate.mapOffset.x,(ySize-((this.delegate.panels["tab1"]["selectednode"].getPositionY())/cellsize))+this.delegate.mapOffset.y),this.delegate.currentLayer);
				GameMap.updateMap();
			}
		}
	},

	onTouchEnded:function(touch){
		this.movePosition=null;
	},

	onTouchMoved:function(touch){
		if(this.movePosition!=null){
			this.panels["tab1"]["selectednode"].setOpacity(0);
			this.panels["tab1"]["highlightnode"].setOpacity(0);
			var pos = touch._point;
			var truePos = this.panels.convertToNodeSpace(pos);
			var dist = cc.p(this.movePosition.x-truePos.x,this.movePosition.y-truePos.y);
			if(dist.x>32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>352 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-352)/cellsize)){
					this.mapOffset.x++;	this.updateMapOffset();
					this.movePosition.x=truePos.x;
				}
			}
			else if(dist.x<-32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>352 && this.mapOffset.x>0){
					this.mapOffset.x--; this.updateMapOffset();
					this.movePosition.x=truePos.x;
				}
			}
			else if(dist.y>32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>352 && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
					this.movePosition.y=truePos.y;
				}
			}
			else if(dist.y<-32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>352 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-this.mapSize)/cellsize)){
					this.mapOffset.y++;	this.updateMapOffset();
					this.movePosition.y=truePos.y;
				}
			}
			return true;
		}
		return false;
	},

	onTouchBegan:function(touch){
		var pos = touch._point;
		var truePos = this.panels.convertToNodeSpace(pos);
		this.panels["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		
		this.panels["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
		
		if(this.currentTab==1){
			if(isTouching(this.panels["tab1"]["menu_bar"]["layerDropDown"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				this.panels["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.selectLayer,["Ground 1","Ground 2","Ground 3","Mask 1","Mask 2","Mask 3","Fringe 1","Fringe 2","Fringe 3"],cc.p(0,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}

			if(isTouching(this.panels["tab1"]["menu_bar"]["textureDropDown"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				for(var i in tileTextureList){
					nameList.push(tileTextureList[i]["name"].substring(0,12));
				}
				this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.useTexture,nameList,cc.p(80,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}
		
			if(isTouching(this.panels["tab1"]["menu_bar"]["deletebtn"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				this.editMode=this.editMode=="erasing" ? "tiles" : "erasing";
				this.panels["tab1"]["menu_bar"]["deletebtn"].setColor(cc.c3b(127,127,127));
				if(this.editMode=="erasing"){
					this.panels["tab1"]["menu_bar"]["deletebtn"].setColor(RED);
				}
				return true;
			}
			if(isTouching(this.panels["tab1"]["menu_bar"]["fillbtn"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				this.panels["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.selectFillMap,["Cancel","Fill Layer"],cc.p(160,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}
			truePos = this.panels["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["tab1"]["tiles"].getContentSize().height){
				this.movePosition=cc.p(truePos.x,truePos.y);
				truePos.x = truePos.x-(truePos.x%cellsize);
				truePos.y = truePos.y-(truePos.y%cellsize)+((screenSize.height-40)-this.panels["tab1"]["tiles"].getContentSize().height);;
				this.panels["tab1"]["selectednode"].setOpacity(0);
				if(this.panels["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["tab1"]["selectednode"].setOpacity(127);
					this.panels["tab1"]["selectednode"].setPosition(truePos);
				}
				return true;
			} 
		}
		if(this.currentTab==3){
		
			if(isTouching(this.panels["tab3"]["destroyMap"],truePos)){
				var ddown = DropDownList.createWithListAndPosition(this,this.destroySelect,["Cancel","Destroy"],cc.p(60,56));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
			
			}
		}

		return false;
	},	
	
	destroySelect:function(number){
		if(number==1){
			GameMap.destroy(); this.delegate.setTab(3);
		}
	},

	updateCurrentLayer:function(layerName){
		this.panels["tab1"]["ground1btn"].setColor(WHITE);
		this.panels["tab1"]["ground2btn"].setColor(WHITE);
		this.panels["tab1"]["ground3btn"].setColor(WHITE);
		this.panels["tab1"]["mask1btn"].setColor(WHITE);
		this.panels["tab1"]["mask2btn"].setColor(WHITE);
		this.panels["tab1"]["mask3btn"].setColor(WHITE);
		this.panels["tab1"]["fringe1btn"].setColor(WHITE);
		this.panels["tab1"]["fringe2btn"].setColor(WHITE);
		this.panels["tab1"]["fringe3btn"].setColor(WHITE);
		this.panels["tab1"][layerName+"btn"].setColor(GREEN);
		this.currentLayer=layerName;
	},
	
	useTexture:function(number){
		this.delegate.currentTextureNumber=number;
		this.delegate.panels["tab1"]["tiles"].setTexture(tileTextureList[this.delegate.currentTextureNumber]["texture"]);
		this.delegate.currentTexture = tileTextureList[this.delegate.currentTextureNumber]["name"];
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(this.delegate.currentTexture);
		this.delegate.mapOffset=cc.p(0,0);
		this.delegate.updateMapOffset();
				this.delegate.panels["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
this.delegate.panels["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
	this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(tileTextureList[this.delegate.currentTextureNumber]["name"].substring(0,12));
	},

		
	useSound:function(number){
		this.delegate.panels["tab3"]["menu_bar"]["soundDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.currentSoundNumber=(number-1);
		if(number==0){
			this.delegate.panels["tab3"]["menu_bar"]["soundDropDown"]["lbl"].setString("NO MUSIC");
		}else{
			this.delegate.panels["tab3"]["menu_bar"]["soundDropDown"]["lbl"].setString(soundList[this.delegate.currentSoundNumber].substring(0,12));
		}
	},

	
	
	tilePressed:function(tiles,tilenum,touchtype){
		if(tiles[tilenum]==this.lastTile && touchtype=="moved"){
			return false;
		}
		this.lastTile=tiles[tilenum];
		switch(this.editMode){
			case "tiles":
				if(this.panels["tab1"]["selectednode"].getOpacity()!=0){
					var ySize = Math.floor(this.mapSize/cellsize)-1;
					GameMap.setLayer(tilenum,tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["tab1"]["selectednode"].getPositionX())/cellsize)+this.mapOffset.x,(ySize-((this.panels["tab1"]["selectednode"].getPositionY())/cellsize))+this.mapOffset.y),this.currentLayer);
				}
			break;
			case "script":
				if(GameMap.getTileScript(tilenum)){
					GameMap.destroyTileScript(tilenum)
				}else{
					GameMap.setTileScript(tilenum,this.typeData);
				}
			break;
			case "erasing":
				GameMap.destroyLayer(tilenum,this.currentLayer);
			break;
		}
		
	}
});
