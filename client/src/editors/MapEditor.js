Mapeditor=null;
MapEditor = Scene.extend({
	map:null,
	mapOffset:cc.p(0,0),
	editMode:"tiles",
	lastTile:null,
	currentLayer:"ground1",
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	mapSize:null,

	getTabOptions:function(clicknum){
		return ["Tiles","Scripts","Settings"];
	},
	
	getLayoutObject:function(){
		this.mapSize = (screenSize.height-40)-(((screenSize.height-40)-16)%cellsize);

		return { "panels":{
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						children: {
							"tab1":{
								children:{
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,this.mapSize),
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
									
									
									
									"leftbtn" : {
										position:cc.p(0,16),
										size:cc.size(16,this.mapSize-16),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"<",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,(this.mapSize-16)/2),
												color:cc.c3b(255,255,255),
											}
										}
									},
									"rightbtn" : {
										position:cc.p(336,16),
										size:cc.size(16,this.mapSize-16),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:">",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,(this.mapSize-16)/2),
												color:cc.c3b(255,255,255),
											}
										}
									},
									"upbtn" : {
										position:cc.p(16,this.mapSize),
										size:cc.size(320,16),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"^",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(160,8),
												color:cc.c3b(255,255,255),
											}
										}
									},
									"downbtn" : {
										position:cc.p(16,0),
										size:cc.size(320,16),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"v",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(160,8),
												color:cc.c3b(255,255,255),
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
									
									"deleteback":{
										position:cc.p(0,138),
										size:cc.size(200,60),
										color: cc.c4b(255,0,0,100),
										anchorPoint:cc.p(0,0),
									},
									"mapnumsback":{
										position:cc.p(0,198),
										size:cc.size(200,162),
										color: cc.c4b(0,0,0,170),
										anchorPoint:cc.p(0,0),
									},
									"mapUp_text":{
										label:"Map Up",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,344),
									},
									"mapUp_entry":{
										size: cc.size(60,32),
										position: cc.p(70,312),
									},
									"mapDown_text":{
										label:"Map Down",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,232),
									},
									"mapDown_entry":{
										size: cc.size(60,32),
										position: cc.p(70,200),
									},
									"mapLeft_text":{
										label:"Map Left",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(38,290),
									},
									"mapLeft_entry":{
										size: cc.size(60,32),
										position: cc.p(8,258),
									},
									"mapRight_text":{
										label:"Map Right",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(162,290),
									},
									"mapRight_entry":{
										size: cc.size(60,32),
										position: cc.p(132,258),
									},
									"mapHeight_text":{
										label:"Map Height",
										fontSize:10,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(162,122),
									},
									"mapHeight_entry":{
										size: cc.size(60,32),
										position: cc.p(128,90),
										color:cc.c3b(255,255,255),
									},
									"mapWidth_text":{
										label:"Map Width",
										fontSize:10,
										anchorPoint:cc.p(0,0),
										position: cc.p(10,122),
									},
									"mapWidth_entry":{
										size: cc.size(60,32),
										position: cc.p(10,90),
										color:cc.c3b(255,255,255),
									},


									"this_map":{
										position:cc.p(70,248),
										size:cc.size(60,60),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"THIS MAP\n#"+ GameMap.getMapNumber(),
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(30,30),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clearbtn" : {
										position:cc.p(70,150),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Clear",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clear_text":{
										label:"Clear Map: You sure?",
										fontSize:14,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,182),
									},
									"clearbtnNo" : {
										position:cc.p(10,150),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"NO",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"clearbtnYes" : {
										position:cc.p(130,150),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"YES",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
								}
							},
							
						}
					},
				}
			}
		};
	},

	updateScriptList:function(){
		var list = ObjectLists.getScriptList();
		if(this.panels["main_panel"]["tab2"]["scriptList"].listView!=null){
			this.panels["main_panel"]["tab2"]["scriptList"].listView.removeFromParent();
			this.panels["main_panel"]["tab2"]["scriptList"].listView=null;
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
		this.panels["main_panel"]["tab2"]["scriptList"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(330,height);
		};
		this.panels["main_panel"]["tab2"]["scriptList"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["main_panel"]["tab2"]["scriptList"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["main_panel"]["tab2"]["scriptList"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["main_panel"]["tab2"]["scriptList"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["main_panel"]["tab2"]["scriptList"].runListCallBack=function(name,listelement){
			console.log(listelement);
			self.typeData=listelement;
			self.updateScriptList();
		};
		this.panels["main_panel"]["tab2"]["scriptList"].listView = ListView.create(this.panels["main_panel"]["tab2"]["scriptList"]);
		
		if(this.panels["main_panel"]["tab2"]["scriptList"].listView.scrollBar){
			this.panels["main_panel"]["tab2"]["scriptList"].listView.scrollBar.setPositionX(330);
			this.panels["main_panel"]["tab2"]["scriptList"].listView.scrollBar.setContentSize(20,60);
			this.panels["main_panel"]["tab2"]["scriptList"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["main_panel"]["tab2"]["scriptList"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["main_panel"]["tab2"]["scriptList"].listView.setCallBackList(callBackList);
		this.panels["main_panel"]["tab2"]["scriptList"].addChild(this.panels["main_panel"]["tab2"]["scriptList"].listView);
	},


	
	getIdentifier:function(){
		return "MapEditor";
	},

	saveEditor:function(){
		GameMap.setMapInfo({"up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText(),"width":this.mapWidthBox.getText(),"height":this.mapHeightBox.getText()});
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
	},
	
	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
		this.mapUpBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapUp_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapUp_entry"].getContentSize().height), GameMap.hasMapUp() ? GameMap.getMapUp():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapUpBox.setDefaultFineFlag(true);
		this.mapUpBox.setNullAllowed(true);
		this.mapDownBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapDown_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapDown_entry"].getContentSize().height), GameMap.hasMapDown() ? GameMap.getMapDown():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapDownBox.setDefaultFineFlag(true);
	    this.mapDownBox.setNullAllowed(true);
		this.mapLeftBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapLeft_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapLeft_entry"].getContentSize().height), GameMap.hasMapLeft() ? GameMap.getMapLeft():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapLeftBox.setDefaultFineFlag(true);
		this.mapLeftBox.setNullAllowed(true);
		this.mapRightBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapRight_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapRight_entry"].getContentSize().height), GameMap.hasMapRight() ? GameMap.getMapRight():"" , cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapRightBox.setDefaultFineFlag(true);
		this.mapRightBox.setNullAllowed(true);


		this.mapWidthBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapWidth_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapWidth_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapWidth_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapWidth_entry"].getContentSize().height), GameMap.getMapWidth() ? GameMap.getMapWidth():36 , cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.mapWidthBox.setDefaultFineFlag(true);

		this.mapHeightBox = new EntryBox(this.panels["main_panel"]["tab3"]["mapHeight_entry"],cc.size(this.panels["main_panel"]["tab3"]["mapHeight_entry"].getContentSize().width,this.panels["main_panel"]["tab3"]["mapHeight_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["mapHeight_entry"].getContentSize().height), GameMap.getMapHeight() ? GameMap.getMapHeight():36 , cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.mapHeightBox.setDefaultFineFlag(true);


		this.showAreYouSureClear(false);
		this.setTab(1);
		this.updateMapOffset();
		GameMap.setStringsVisible(true);
	},
	
	selectLayer:function(layerNum){
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
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
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"]["lbl"].setString(showName);
	},

	
	willTerminate:function(){
		this._super();
		GameMap.setStringsVisible(false);
	},
	
	onMouseMoved:function(event){
		var pos = event.getLocation();
		if(this.currentTab==1){
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%cellsize)+16;
				truePos.y = truePos.y-(truePos.y%cellsize)+17;
				
				this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(127);
				this.panels["main_panel"]["tab1"]["highlightnode"].setPosition(truePos);
				return true;
			}
		}		
	},
	
	setTab:function(value){
		if(value!=this.currentTab){
			this.panels["main_panel"].setContentSize(this.tabWidths[value],this.panels["main_panel"].getContentSize().height);
			
			if(this.currentTab==3 || this.currentTab==0){
				this.panels["main_panel"]["tab3"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapUp_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapDown_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapRight_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapWidth_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapWidth_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab3"]["mapHeight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapHeight_entry"].getPositionX()-1000);
			}
			if(this.currentTab==1){
				if(this.editMode=="erasing" || this.editMode=="tiles"){
					this.editMode="blocking";
				}
			}
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false);
			this.panels["main_panel"]["tab3"].setVisible(false);
			this.panels["main_panel"]["tab"+value].setVisible(true);
		
			if(value==1){
				this.editMode="tiles";
				this.panels["main_panel"]["tab1"]["menu_bar"]["deletebtn"].setColor(cc.c3b(127,127,127));
			}

			if(value==2){
				this.editMode="script";
				this.updateScriptList();
			}

			if(value==3){
				this.panels["main_panel"]["tab3"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapUp_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapLeft_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapDown_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapRight_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapWidth_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapWidth_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab3"]["mapHeight_entry"].setPositionX(this.panels["main_panel"]["tab3"]["mapHeight_entry"].getPositionX()+1000);
			}
			
		}
	},
	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["main_panel"]["tab1"]["tiles"].getTexture() && this.panels["main_panel"]["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(cellsize*this.mapOffset.x),Math.floor(cellsize*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<this.mapSize?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:this.mapSize));
		}
	},

	noSelectedMenu:function(touch){
		this.delegate.onTouchBegan(touch);
	},

	selectFillMap:function(number){
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
		if(number==1){
			if(this.delegate.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
				var ySize = Math.floor(this.delegate.mapSize/cellsize)-1;
				GameMap.fillMap(tileTextureList[this.delegate.currentTextureNumber]["name"],cc.p(((this.delegate.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/cellsize)+this.delegate.mapOffset.x,(ySize-((this.delegate.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/cellsize))+this.delegate.mapOffset.y),this.delegate.currentLayer);
				GameMap.updateMap();
			}
		}
	},

	onTouchBegan:function(touch){
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		this.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		this.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
		
		if(this.currentTab==1){
			if(isTouching(this.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"],this.panels["main_panel"]["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				this.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.selectLayer,["Ground 1","Ground 2","Ground 3","Mask 1","Mask 2","Mask 3","Fringe 1","Fringe 2","Fringe 3"],cc.p(0,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}

			if(isTouching(this.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"],this.panels["main_panel"]["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				for(var i in tileTextureList){
					nameList.push(tileTextureList[i]["name"].substring(0,12));
				}
				this.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.useTexture,nameList,cc.p(80,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}


			if(isTouching(this.panels["main_panel"]["tab1"]["leftbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x>0){
					this.mapOffset.x--; this.updateMapOffset();
				}
				return true;
			}



			if(isTouching(this.panels["main_panel"]["tab1"]["rightbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-320)/cellsize)){
					this.mapOffset.x++;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["upbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>this.mapSize && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["downbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>this.mapSize && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-this.mapSize)/cellsize)){
					this.mapOffset.y++;	this.updateMapOffset();
				}
				return true;
			}
			

			if(isTouching(this.panels["main_panel"]["tab1"]["menu_bar"]["deletebtn"],this.panels["main_panel"]["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				this.editMode=this.editMode=="erasing" ? "tiles" : "erasing";
				this.panels["main_panel"]["tab1"]["menu_bar"]["deletebtn"].setColor(cc.c3b(127,127,127));
				if(this.editMode=="erasing"){
					this.panels["main_panel"]["tab1"]["menu_bar"]["deletebtn"].setColor(RED);
				}
				return true;
			}
			
			if(isTouching(this.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"],this.panels["main_panel"]["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				this.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.selectFillMap,["Cancel","Fill Layer"],cc.p(160,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}

			truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%cellsize)+16;
				truePos.y = truePos.y-(truePos.y%cellsize)+16;
				this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
				if(this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["tab1"]["selectednode"].setPosition(truePos);
				}
				return true;
			} 
		
		}
		if(this.currentTab==3){
			if(isTouching(this.panels["main_panel"]["tab3"]["clearbtn"],truePos)){
				this.showAreYouSureClear(true); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab3"]["clearbtnNo"],truePos)){
				this.showAreYouSureClear(false); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab3"]["clearbtnYes"],truePos)){
				GameMap.destroy(); this.showAreYouSureClear(false); return true;
			}
		}

		return false;
	},	
	
	updateCurrentLayer:function(layerName){
		this.panels["main_panel"]["tab1"]["ground1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["ground2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["ground3btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask3btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe3btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"][layerName+"btn"].setColor(GREEN);
		this.currentLayer=layerName;
	},
	
	useTexture:function(number){
		this.delegate.currentTextureNumber=number;
		this.delegate.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.delegate.currentTextureNumber]["texture"]);
		this.delegate.currentTexture = tileTextureList[this.delegate.currentTextureNumber]["name"];
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(this.delegate.currentTexture);
		this.delegate.mapOffset=cc.p(0,0);
		this.delegate.updateMapOffset();
				this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["layerDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["fillbtn"].setColor(cc.c3b(127,127,127));
	
	this.delegate.panels["main_panel"]["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(tileTextureList[this.delegate.currentTextureNumber]["name"].substring(0,12));
	},
	
	showAreYouSureClear:function(visible){
		this.panels["main_panel"]["tab3"]["clearbtnYes"].setVisible(visible);
		this.panels["main_panel"]["tab3"]["clearbtnNo"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["clear_text"].setVisible(visible);	
		this.panels["main_panel"]["tab3"]["clearbtn"].setVisible(!visible);
	},
	
	
	tilePressed:function(tiles,tilenum,touchtype){
		if(tiles[tilenum]==this.lastTile && touchtype=="moved"){
			return false;
		}
		this.lastTile=tiles[tilenum];
		switch(this.editMode){
			case "tiles":
				if(this.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
					var ySize = Math.floor(this.mapSize/cellsize)-1;
					GameMap.setLayer(tilenum,tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/cellsize)+this.mapOffset.x,(ySize-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/cellsize))+this.mapOffset.y),this.currentLayer);
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
