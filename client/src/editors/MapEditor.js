Mapeditor=null;
MapEditor = Popup.extend({
	map:null,
	mapOffset:cc.p(0,0),
	editMode:"tiles",
	lastTile:null,
	currentLayer:"ground1",
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	
	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(420,400),
						color: cc.c4b(0,0,100,120),
						children: {
							"tab1":{
								children:{
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,336),
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
									"textureleftbtn" : {
										position:cc.p(200,360),
										size:cc.size(16,32),
										texture:"GUI/texture_change_left.png",
										anchorPoint:cc.p(0,0),
									},
									"texturerightbtn" : {
										position:cc.p(310,360),
										size:cc.size(16,32),
										texture:"GUI/texture_change_right.png",
										anchorPoint:cc.p(0,0),
									},
									"textureName" : {
										position:cc.p(214,360),
										size:cc.size(96,32),
										texture:"GUI/texture_change_middle.png",
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:tileTextureList[0]["name"],
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(48,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									
									"deletebtn" : {
										position:cc.p(360,308),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Erase",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"leftbtn" : {
										position:cc.p(0,16),
										size:cc.size(16,320),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"<",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,160),
												color:cc.c3b(255,255,255),
											}
										}
									},
									"rightbtn" : {
										position:cc.p(336,16),
										size:cc.size(16,320),
										color: cc.c4b(0,0,255,255),
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:">",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,160),
												color:cc.c3b(255,255,255),
											}
										}
									},
									"upbtn" : {
										position:cc.p(16,336),
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
									"fillbtn" : {
										position:cc.p(428,308),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fill",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"ground1btn" : {
										position:cc.p(360,278),
										size:cc.size(128,26),
										color: GREEN,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"ground2btn" : {
										position:cc.p(360,248),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"groundShadowbtn" : {
										position:cc.p(360,218),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Ground Shadow",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask1btn" : {
										position:cc.p(360,188),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask2btn" : {
										position:cc.p(360,158),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"mask3btn" : {
										position:cc.p(360,128),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Mask 3",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe1btn" : {
										position:cc.p(360,98),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 1",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe2btn" : {
										position:cc.p(360,68),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 2",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringeShadowbtn" : {
										position:cc.p(360,38),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe Shadow",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"fringe3btn" : {
										position:cc.p(360,8),
										size:cc.size(128,26),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Fringe 3",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
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
									"saveBack":{
										position:cc.p(0,78),
										size:cc.size(200,60),
										color: cc.c4b(0,255,0,100),
										anchorPoint:cc.p(0,0),
									},
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
									"savebtn" : {
										position:cc.p(70,90),
										size:cc.size(60,32),
										color: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Save",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(32,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"save_text":{
										label:"Save Map: You sure?",
										fontSize:14,
										anchorPoint:cc.p(0.5,0),
										position: cc.p(100,122),
									},
									"savebtnNo" : {
										position:cc.p(10,90),
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
									"savebtnYes" : {
										position:cc.p(130,90),
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
									"saveOnExit" : {
										position:cc.p(40,30),
										size:cc.size(120,32),
										color: WHITE,
										anchorPoint:cc.p(0.5,0),
										children:{
											"content":{
												label:"",
												fontSize:14,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(60,15),
												color:cc.c3b(0,0,0),
											}
										}
									},
								}
							},
							"tab1Clickable":{
								position:cc.p(0,380),
								size:cc.size(60,20),
								color: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Editor",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab2Clickable":{
								position:cc.p(62,380),
								size:cc.size(60,20),
								color: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Settings",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							}
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,400),
						size: cc.size(420,32),
						color: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Map Editor - Map #" + GameMap.getMapNumber(),
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(391,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								color: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}
			}
		};
	},
	
	getIdentifier:function(){
		return "MapEditor";
	},
	mapOffset:null,
	mapUpBox:null,
	mapDownBox:null,
	mapLeftBox:null,
	mapRightBox:null,
	tabWidths:null,
	currentTab:0,
	typeData:null,
	
	init:function(_map){
		this._super();
		this.map =_map;
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,496,200];
	},
	
	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
		this.mapUpBox = new EntryBox(this.panels["main_panel"]["tab2"]["mapUp_entry"],cc.size(this.panels["main_panel"]["tab2"]["mapUp_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["mapUp_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["mapUp_entry"].getContentSize().height), GameMap.hasMapUp() ? GameMap.getMapUp():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapUpBox.setDefaultFineFlag(true);
		this.mapUpBox.setNullAllowed(true);
		this.mapDownBox = new EntryBox(this.panels["main_panel"]["tab2"]["mapDown_entry"],cc.size(this.panels["main_panel"]["tab2"]["mapDown_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["mapDown_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["mapDown_entry"].getContentSize().height), GameMap.hasMapDown() ? GameMap.getMapDown():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapDownBox.setDefaultFineFlag(true);
	    this.mapDownBox.setNullAllowed(true);
		this.mapLeftBox = new EntryBox(this.panels["main_panel"]["tab2"]["mapLeft_entry"],cc.size(this.panels["main_panel"]["tab2"]["mapLeft_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["mapLeft_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["mapLeft_entry"].getContentSize().height), GameMap.hasMapLeft() ? GameMap.getMapLeft():"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapLeftBox.setDefaultFineFlag(true);
		this.mapLeftBox.setNullAllowed(true);
		this.mapRightBox = new EntryBox(this.panels["main_panel"]["tab2"]["mapRight_entry"],cc.size(this.panels["main_panel"]["tab2"]["mapRight_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["mapRight_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["mapRight_entry"].getContentSize().height), GameMap.hasMapRight() ? GameMap.getMapRight():"" , cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapRightBox.setDefaultFineFlag(true);
		this.mapRightBox.setNullAllowed(true);
		this.showAreYouSureClear(false);
		this.showAreYouSureSave(false);
		this.saveOnExit=LocalStorage.getMapSaveOnExit();
		this.setSaveMapOnExit(this.saveOnExit);
		this.setTab(1);
		this.updateMapOffset();
		GameMap.setStringsVisible(true);
	},
	
	setTypeData:function(value,data){
		if(Itemeditor){
			Itemeditor.willTerminate();
			this.scheduleOnce(function(){Itemeditor.removeFromParent(); Itemeditor=null;});
			this.typeData=value;
			this.setTouchEnabled(true);
		}
		if(NPCeditor){
			NPCeditor.willTerminate();
			this.scheduleOnce(function(){NPCeditor.removeFromParent(); NPCeditor=null;});
			this.typeData=value;
			this.setTouchEnabled(true);
		}
	},
	
	willTerminate:function(){
		this._super();
		if(this.saveOnExit==true){
			GameMap.setMapInfo({"up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText()});
			GameMap.updateServer();
		}
		GameMap.setStringsVisible(false);
	},
	
	onMouseMoved:function(event){
		var pos = event.getLocation();
		if(this.currentTab==1){
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%cellsize)+16;
				truePos.y = truePos.y-(truePos.y%cellsize)+16;
				
				this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(127);
				this.panels["main_panel"]["tab1"]["highlightnode"].setPosition(truePos);
				return true;
			}
		}		
	},
	
	setTab:function(value){
		if(value!=this.currentTab){
			this.panels["main_panel"].setContentSize(this.tabWidths[value],this.panels["main_panel"].getContentSize().height);
			this.panels["control_panel"].setContentSize(this.tabWidths[value],this.panels["control_panel"].getContentSize().height);
			if(this.currentTab==3 || this.currentTab==0){
				this.panels["main_panel"]["tab2"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapUp_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab2"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapLeft_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab2"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapDown_entry"].getPositionX()-1000);
				this.panels["main_panel"]["tab2"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapRight_entry"].getPositionX()-1000);
			}
			if(this.currentTab==1){
				if(this.editMode=="erasing" || this.editMode=="tiles"){
					this.editMode="blocking";
				}
			}
			if(this.currentTab==2){
				if(this.editMode=="blocking"){
					this.editMode="tiles";
				}
			}
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false);
			this.panels["main_panel"]["tab1Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab2Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab"+value].setVisible(true);
			this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
			if(value==3){
				this.panels["main_panel"]["tab2"]["mapUp_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapUp_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab2"]["mapLeft_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapLeft_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab2"]["mapDown_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapDown_entry"].getPositionX()+1000);
				this.panels["main_panel"]["tab2"]["mapRight_entry"].setPositionX(this.panels["main_panel"]["tab2"]["mapRight_entry"].getPositionX()+1000);
			}
			this.panels["control_panel"]["exitBtn"].setPositionX(this.tabWidths[value]-29);
		}
	},
	
	setSaveMapOnExit:function(value){
		LocalStorage.setMapSaveOnExit(value);
		this.saveOnExit=value;
		this.panels["main_panel"]["tab2"]["saveOnExit"].setColor(cc.c3b(255,0,0));
		this.panels["main_panel"]["tab2"]["saveOnExit"]["content"].setString("Save on exit: NO");
		if(value=="true" || value==true){
			this.panels["main_panel"]["tab2"]["saveOnExit"].setColor(cc.c3b(0,255,0));
			this.panels["main_panel"]["tab2"]["saveOnExit"]["content"].setString("Save on exit: YES");
		}
	},
	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["main_panel"]["tab1"]["tiles"].getTexture() && this.panels["main_panel"]["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(cellsize*this.mapOffset.x),Math.floor(cellsize*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:320));
		}
	},
	
	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(isTouching(this.panels["main_panel"]["tab1Clickable"],truePos)){
			this.setTab(1);
			return true;
		}		
	
		if(isTouching(this.panels["main_panel"]["tab2Clickable"],truePos)){
			this.setTab(2);
			return true;
		}	
		
		if(this.currentTab==1){
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
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["downbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/cellsize)){
					this.mapOffset.y++;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["ground1btn"],truePos)){
				this.updateCurrentLayer("ground1"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["ground2btn"],truePos)){
				this.updateCurrentLayer("ground2");	return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["groundShadowbtn"],truePos)){
				this.updateCurrentLayer("groundShadow"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["mask1btn"],truePos)){
				this.updateCurrentLayer("mask1"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["mask2btn"],truePos)){
				this.updateCurrentLayer("mask2"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["mask3btn"],truePos)){
				this.updateCurrentLayer("mask3"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["fringe1btn"],truePos)){
				this.updateCurrentLayer("fringe1");	return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["fringe2btn"],truePos)){
				this.updateCurrentLayer("fringe2"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["fringeShadowbtn"],truePos)){
				this.updateCurrentLayer("fringeShadow"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["fringe3btn"],truePos)){
				this.updateCurrentLayer("fringe3"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["texturerightbtn"],truePos)){
				this.useNextTexture(); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["textureleftbtn"],truePos)){
				this.usePrevTexture(); return true;
			}

			if(isTouching(this.panels["main_panel"]["tab1"]["deletebtn"],truePos)){
				this.editMode=this.editMode=="erasing" ? "tiles" : "erasing";
				this.panels["main_panel"]["tab1"]["deletebtn"].setColor(WHITE);
				if(this.editMode=="erasing"){
					this.panels["main_panel"]["tab1"]["deletebtn"].setColor(RED);
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["fillbtn"],truePos)){
				if(this.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
					var ySize = Math.floor(320/cellsize)-1;
					GameMap.fillMap(tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/cellsize)+this.mapOffset.x,(ySize-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/cellsize))+this.mapOffset.y),this.currentLayer);
					GameMap.updateMap();
				}
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
		if(this.currentTab==2){
			if(isTouching(this.panels["main_panel"]["tab2"]["clearbtn"],truePos)){
				this.showAreYouSureClear(true); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["clearbtnNo"],truePos)){
				this.showAreYouSureClear(false); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["clearbtnYes"],truePos)){
				GameMap.destroy(); this.showAreYouSureClear(false); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["savebtn"],truePos)){
				this.showAreYouSureSave(true); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["savebtnNo"],truePos)){
				this.showAreYouSureSave(false); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["savebtnYes"],truePos)){
				GameMap.setMapInfo({"up": this.mapUpBox.getText(),"down":this.mapDownBox.getText(),"left":this.mapLeftBox.getText(),"right":this.mapRightBox.getText()});
				GameMap.updateServer(); this.showAreYouSureSave(false); return true;
			}
			
			if(isTouching(this.panels["main_panel"]["tab2"]["saveOnExit"],truePos)){
				this.setSaveMapOnExit(!this.saveOnExit); return true;
			}
		}

		return false;
	},	
	
	updateCurrentLayer:function(layerName){
		this.panels["main_panel"]["tab1"]["ground1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["ground2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["groundShadowbtn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["mask3btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe1btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe2btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringeShadowbtn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"]["fringe3btn"].setColor(WHITE);
		this.panels["main_panel"]["tab1"][layerName+"btn"].setColor(GREEN);
		this.currentLayer=layerName;
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=tileTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	showAreYouSureClear:function(visible){
		this.panels["main_panel"]["tab2"]["clearbtnYes"].setVisible(visible);
		this.panels["main_panel"]["tab2"]["clearbtnNo"].setVisible(visible);	
		this.panels["main_panel"]["tab2"]["clear_text"].setVisible(visible);	
		this.panels["main_panel"]["tab2"]["clearbtn"].setVisible(!visible);
	},
	
	showAreYouSureSave:function(visible){
		this.panels["main_panel"]["tab2"]["savebtnYes"].setVisible(visible);
		this.panels["main_panel"]["tab2"]["savebtnNo"].setVisible(visible);	
		this.panels["main_panel"]["tab2"]["save_text"].setVisible(visible);	
		this.panels["main_panel"]["tab2"]["savebtn"].setVisible(!visible);
	},
	
	tilePressed:function(tiles,tilenum,touchtype){
		if(tiles[tilenum]==this.lastTile && touchtype=="moved"){
			return false;
		}
		this.lastTile=tiles[tilenum];
		switch(this.editMode){
			case "tiles":
				if(this.panels["main_panel"]["tab1"]["selectednode"].getOpacity()!=0){
					var ySize = Math.floor(320/cellsize)-1;
					GameMap.setLayer(tilenum,tileTextureList[this.currentTextureNumber]["name"],cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/cellsize)+this.mapOffset.x,(ySize-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/cellsize))+this.mapOffset.y),this.currentLayer);
				}
			break;
			case "erasing":
				GameMap.destroyLayer(tilenum,this.currentLayer);
			break;
		}
		
	}
});
