Itemeditor=null,
ItemEditor = Popup.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	
	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(420,396),
						bg: cc.c4b(0,0,100,120),
						children: {
							"tab1":{
								children:{
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,320),
										texture:tileTextureList[0]["name"],
									},
									
									"textureleftbtn" : {
										position:cc.p(208,340),
										size:cc.size(16,32),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"<<",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"texturerightbtn" : {
										position:cc.p(320,340),
										size:cc.size(16,32),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:">>",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(8,16),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"textureName" : {
										position:cc.p(224,340),
										size:cc.size(96,32),
										bg: cc.c4b(255,255,255,170),
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
									"leftbtn" : {
										position:cc.p(0,64),
										size:cc.size(16,252),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(336,64),
										size:cc.size(16,252),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(16,320),
										size:cc.size(320,16),
										bg: cc.c4b(0,0,255,255),
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
										position:cc.p(16,48),
										size:cc.size(320,16),
										bg: cc.c4b(0,0,255,255),
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
									
									"highlightnode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										bg:cc.c4b(255,100,100,255),
									},
									"selectednode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										bg:cc.c4b(100,255,100,255),
									},
								}
							},
							"tab2":{
								children:{
									"itemdetailsback":{
										position:cc.p(144,0),
										size:cc.size(250,366),
										bg: cc.c4b(0,0,255,100),
										anchorPoint:cc.p(0,0),
									},
									"name_text":{
										label:"Item Name",
										fontSize:10,
										anchorPoint:cc.p(0,0),
										position: cc.p(8,344),
									},
									"name_entry":{
										size: cc.size(136,32),
										position: cc.p(4,312),
									},
									"resourcetab":{
										visible:false,
									},
									"consumabletab":{
										visible:false,
									},
									"booktab":{
										visible:false,
										children:{
											"book_text":{
												label:"Book Contents",
												fontSize:10,
												anchorPoint:cc.p(0,0),
												position: cc.p(152,348),
											},
											"book_entry":{
												size: cc.size(240,340),
												position: cc.p(-100000,8),
											},
										}
									},
									"wearabletab":{
										visible:false,
										children:{
											"head" : {
												position:cc.p(250,230),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"Head",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"body" : {
												position:cc.p(250,200),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"Body",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"legs" : {
												position:cc.p(250,170),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"Legs",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"feet" : {
												position:cc.p(250,140),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"Feet",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"larm" : {
												position:cc.p(180,200),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"L Arm",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"rarm" : {
												position:cc.p(320,200),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"R Arm",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
											"mod" : {
												position:cc.p(150,230),
												size:cc.size(64,26),
												bg: GREEN,
												anchorPoint:cc.p(0,0),
												children:{
													"text":{
														label:"Mod",
														fontSize:12,
														anchorPoint:cc.p(0.5,0.5),
														position:cc.p(32,13),
														color:cc.c3b(0,0,0),
													}
												}
											},
										}	
									},
									"resourcebtn" : {
										position:cc.p(8,248),
										size:cc.size(128,26),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Resource",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"consumablebtn" : {
										position:cc.p(8,218),
										size:cc.size(128,26),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Consumable",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"bookbtn" : {
										position:cc.p(8,188),
										size:cc.size(128,26),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"Book",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"wearablebtn" : {
										position:cc.p(8,158),
										size:cc.size(128,26),
										bg: WHITE,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"wearable",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
									"tile" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(55,130),
										texture:tileTextureList[0]["name"],
									},
									"stackbtn" : {
										position:cc.p(8,48),
										size:cc.size(128,26),
										bg: RED,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"NOT STACKABLE",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},
								}
							},
							"tab3":{
								children:{
									"saveBack":{
										position:cc.p(0,78),
										size:cc.size(200,60),
										bg: cc.c4b(0,255,0,100),
										anchorPoint:cc.p(0,0),
									},
									"deleteback":{
										position:cc.p(0,138),
										size:cc.size(200,60),
										bg: cc.c4b(255,0,0,100),
										anchorPoint:cc.p(0,0),
									},
									"mapnumsback":{
										position:cc.p(0,198),
										size:cc.size(200,162),
										bg: cc.c4b(0,0,0,170),
										anchorPoint:cc.p(0,0),
									},
								}
							},
							"tab1Clickable":{
								position:cc.p(0,376),
								size:cc.size(60,20),
								bg: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Sprite",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab2Clickable":{
								position:cc.p(64,376),
								size:cc.size(60,20),
								bg: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Details",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"tab3Clickable":{
								position:cc.p(128,376),
								size:cc.size(60,20),
								bg: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Modifier",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,10),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"okbtn" : {
								position:cc.p(76,8),
								size:cc.size(60,32),
								bg: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"OK",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"cancelbtn" : {
								position:cc.p(8,8),
								size:cc.size(60,32),
								bg: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Cancel",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,396),
						size: cc.size(420,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Item Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(391,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
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
		return "itemEditor";
	},
	nameBox:null,
	tabWidths:null,
	currentTab:0,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.data={"itemType":"resource","subType":"","sprite":{"texture":tileTextureList[0]["name"],"position":{x:0,y:0}},"additionalData":{},"stackable":false, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.tabWidths=null,
		this.currentTab=0,
		this.delegate=null,
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,352,400,200];
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
		}
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"saveitems":num+"","itemdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"saveitemswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);

		for(var i in tileTextureList){
			if(tileTextureList[i]["name"]==this.data["sprite"]["texture"]){
				this.currentTextureNumber=i;
				this.currentTexture=tileTextureList[i]["name"];
			}
		}
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		
		var posX = this.data["sprite"]["position"].x;
		while(posX>=10){
			posX--;
			this.mapOffset.x++;
		}
		var posY = this.data["sprite"]["position"].y;
		while(posY>=8){
			posY--;
			this.mapOffset.y++;
		}
		var tilePos = cc.p((this.data["sprite"]["position"].x-this.mapOffset.x)*32,(this.data["sprite"]["position"].y-this.mapOffset.y)*32);
		this.panels["main_panel"]["tab1"]["selectednode"].setPosition(this.panels["main_panel"]["tab1"]["tiles"].getPosition().x+tilePos.x,this.panels["main_panel"]["tab1"]["tiles"].getPosition().y-(tilePos.y+32)) ;
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTextureRect(cc.rect(Math.floor(32*this.data["sprite"]["position"].x),Math.floor(32*this.data["sprite"]["position"].y),32,32));
		this.nameBox = new EntryBox(this.panels["main_panel"]["tab2"]["name_entry"],cc.size(this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["name_entry"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.nameBox.setDefaultFineFlag(true);
		this.bookEntryBox = new EntryBox(this.panels["main_panel"]["tab2"]["booktab"]["book_entry"],cc.size(this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].getContentSize().height), this.data["additionalData"]["Contents"]? this.data["additionalData"]["Contents"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255),true);
		this.bookEntryBox.setDefaultFineFlag(true);
		this.bookEntryBox.setDontClear(true);
		this.updateCurrentLayer(this.data["itemType"]);
		
		if(this.data["subType"]!=""){
			this.selectSubType(this.data["subType"]);
		}

		this.panels["main_panel"]["tab2"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["tab2"]["stackbtn"]["text"].setString("NOT STACKABLE");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["tab2"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab2"]["stackbtn"]["text"].setString("IS STACKABLE");
		}

		this.setTab(1);
		this.updateMapOffset();
	},

	setTextureFromStart:function(){

	},
	
	willTerminate:function(ignoreTerminate){
		this._super();
		if(this.delegate){
			var self= this.delegate;
			if(ignoreTerminate==true){
				return;
			}
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
		}
	},
	
	onMouseMoved:function(pos){
		if(this.currentTab==1){
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
			var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+64;
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
			this.panels["main_panel"]["tab2"]["name_entry"].setPositionX(this.panels["main_panel"]["tab2"]["name_entry"].getPositionX()-1000);
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false)
			this.panels["main_panel"]["tab3"].setVisible(false);
			this.panels["main_panel"]["tab1Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab2Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab3Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab"+value].setVisible(true);
			this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
			if(value==2){
				this.panels["main_panel"]["tab2"]["name_entry"].setPositionX(4);
				if(this.data["itemType"]=="book"){this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].setPositionX(150); this.panels["main_panel"]["tab2"]["booktab"]["book_text"].setVisible(true);} else{this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].setPositionX(-1000000000); this.panels["main_panel"]["tab2"]["booktab"]["book_text"].setVisible(false);}
			}
			this.panels["control_panel"]["exitBtn"].setPositionX(this.tabWidths[value]-29);
		}
	},
	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["main_panel"]["tab1"]["tiles"].getTexture() && this.panels["main_panel"]["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["main_panel"]["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(32*this.mapOffset.x),Math.floor(32*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<320?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:320,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<256?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:256));
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
			this.setTab(1);	return true;
		}		
		
		if(isTouching(this.panels["main_panel"]["tab2Clickable"],truePos)){
			this.setTab(2); return true;
		}	

		if(isTouching(this.panels["main_panel"]["tab3Clickable"],truePos)){
			this.setTab(3); return true;
		}	
		
		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["name"]=this.nameBox.getText();
			switch(this.data["itemType"]){
				case "book": this.data["additionalData"] = {"Contents":this.bookEntryBox.getText()};
			}
			this.delegate.endedEdit(this.data);
			return true;
		}
			
		if(isTouching(this.panels["main_panel"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true; var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

		if(this.currentTab==1){
			if(isTouching(this.panels["main_panel"]["tab1"]["leftbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>264 && this.mapOffset.x>0){
					this.mapOffset.x--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["rightbtn"],truePos)){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>320 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-320)/32)){
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
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/32)){
					this.mapOffset.y++; this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["texturerightbtn"],truePos)){
				this.useNextTexture();
				return true;
			}
			if(isTouching(this.panels["main_panel"]["tab1"]["textureleftbtn"],truePos)){
				this.usePrevTexture();
				return true;
			}
			
			truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(isTouching(this.panels["main_panel"]["tab1"]["tiles"],truePos)){
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+64;
				
				this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
				if(this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["tab1"]["selectednode"].setPosition(truePos);
				}

				var pos = cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,((8-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-64)/32))+this.mapOffset.y)-1);
				this.panels["main_panel"]["tab2"]["tile"].setTextureRect(cc.rect(pos.x*32,pos.y*32,32,32));
				this.data["sprite"]["position"]=pos;

				return true;
			} 

		}
		if(this.currentTab==2){	
			if(isTouching(this.panels["main_panel"]["tab2"]["stackbtn"],truePos)){
				this.swapStackable(); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["resourcebtn"],truePos)){
				this.updateCurrentLayer("resource"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["consumablebtn"],truePos)){
				this.updateCurrentLayer("consumable"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["bookbtn"],truePos)){
				this.updateCurrentLayer("book"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearablebtn"],truePos)){
				this.updateCurrentLayer("wearable"); this.selectSubType("body"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["body"],truePos)){
				this.selectSubType("body"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["head"],truePos)){
				this.selectSubType("head"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["legs"],truePos)){
				this.selectSubType("legs"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["feet"],truePos)){
				this.selectSubType("feet"); return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["larm"],truePos)){
				this.selectSubType("larm");	return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["rarm"],truePos)){
				this.selectSubType("rarm");	return true;
			}
			if(isTouching(this.panels["main_panel"]["tab2"]["wearabletab"]["mod"],truePos)){
				this.selectSubType("mod");	return true;
			}
		}	
		return false;
	},	

	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["main_panel"]["tab2"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["tab2"]["stackbtn"]["text"].setString("NOT STACKABLE");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["tab2"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab2"]["stackbtn"]["text"].setString("IS STACKABLE");
		}
	},
	
	updateCurrentLayer:function(layerName){
		this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].setPositionX(-10000000);
		this.panels["main_panel"]["tab2"]["booktab"]["book_text"].setVisible(false);
		this.panels["main_panel"]["tab2"]["resourcebtn"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["consumablebtn"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["bookbtn"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearablebtn"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["resourcetab"].setVisible(false);
		this.panels["main_panel"]["tab2"]["consumabletab"].setVisible(false);		
		this.panels["main_panel"]["tab2"]["booktab"].setVisible(false);
		this.panels["main_panel"]["tab2"]["wearabletab"].setVisible(false);

		switch(layerName){
			case "resource": break;
			case "consumable": break;
			case "book": this.panels["main_panel"]["tab2"]["booktab"]["book_entry"].setPositionX(150);
						 this.panels["main_panel"]["tab2"]["booktab"]["book_text"].setVisible(true);
						 break;
			case "wearable": break;
		}
		this.data["itemType"]=layerName;
		this.panels["main_panel"]["tab2"][layerName+"btn"].setColor(GREEN);
		this.panels["main_panel"]["tab2"][layerName+"tab"].setVisible(true);
	},

	selectSubType:function(type){
		this.panels["main_panel"]["tab2"]["wearabletab"]["head"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["body"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["legs"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["feet"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["rarm"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["larm"].setColor(WHITE);
		this.panels["main_panel"]["tab2"]["wearabletab"]["mod"].setColor(WHITE);

		if(this.data["itemType"]=="wearable" && this.panels["main_panel"]["tab2"]["wearabletab"][type]){
			this.panels["main_panel"]["tab2"]["wearabletab"][type].setColor(RED);
		}

		this.data["subType"]=type;
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.data["sprite"]["texture"]=this.currentTexture;
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=tileTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.panels["main_panel"]["tab2"]["tile"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
});