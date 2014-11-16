Skillseditor=null,
SkillsEditor = Popup.extend({
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
									"name_text":{
										label:"Skill Name",
										fontSize:10,
										anchorPoint:cc.p(0,0),
										position: cc.p(8,344),
									},
									"name_entry":{
										size: cc.size(136,32),
										position: cc.p(4,312),
									},
									"healthcolor_text":{
										label:"Healthbar Color",
										fontSize:10,
										anchorPoint:cc.p(0,0),
										position: cc.p(8,250),
									},
									"healthcolor_entry":{
										size: cc.size(136,32),
										position: cc.p(4,210),
									},
									"tile" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(55,150),
										texture:tileTextureList[0]["name"],
									},
									"healthbtn" : {
										position:cc.p(8,265),
										size:cc.size(128,26),
										bg: RED,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"NOT HEALTHBAR",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
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
										label:"Icon",
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
								label:"Skill Editor",
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
		return "SkillsEditor";
	},
	nameBox:null,
	healthBox:null,
	tabWidths:null,
	currentTab:0,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.data={"sprite":{"texture":tileTextureList[0]["name"],"position":{x:0,y:0}},"additionalData":{},"healthbar":null, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.tabWidths=null,
		this.currentTab=0,
		this.delegate=null,
		this.mapOffset=cc.p(0,0);
		this.tabWidths=[null,352,142];
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
		}
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"saveskills":num+"","skillsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"saveskillswhole":list});
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
		this.healthBox = new EntryBox(this.panels["main_panel"]["tab2"]["healthcolor_entry"],cc.size(this.panels["main_panel"]["tab2"]["healthcolor_entry"].getContentSize().width,this.panels["main_panel"]["tab2"]["healthcolor_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab2"]["healthcolor_entry"].getContentSize().height), this.data["healthbar"]?this.data["healthbar"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.healthBox.setDefaultFineFlag(true);
		
		this.panels["main_panel"]["tab2"]["healthbtn"].setColor(RED);
		this.panels["main_panel"]["tab2"]["healthbtn"]["text"].setString("NOT HEALTHBAR");

		if(this.data["healthbar"]!=null && this.data["healthbar"]!=""){
			this.panels["main_panel"]["tab2"]["healthbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab2"]["healthbtn"]["text"].setString("IS HEALTHBAR");
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
	
	onMouseMoved:function(event){
		var pos = event.getLocation();
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
			this.panels["main_panel"]["tab2"]["healthcolor_entry"].setPositionX(this.panels["main_panel"]["tab2"]["healthcolor_entry"].getPositionX()-1000);	
			this.panels["main_panel"]["tab2"]["healthcolor_text"].setVisible(false);		
			this.currentTab=value;
			this.panels["main_panel"]["tab1"].setVisible(false);
			this.panels["main_panel"]["tab2"].setVisible(false)
			this.panels["main_panel"]["tab1Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab2Clickable"].setColor(WHITE);
			this.panels["main_panel"]["tab"+value].setVisible(true);
			this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
			this.panels["control_panel"]["exitBtn"].setPositionX(this.tabWidths[value]-29);
		}
		if(value==2){
			this.panels["main_panel"]["tab2"]["name_entry"].setPositionX(4);
			if(this.data["healthbar"]!=null && this.data["healthbar"]!=""){
				this.panels["main_panel"]["tab2"]["healthcolor_entry"].setPositionX(4);	
				this.panels["main_panel"]["tab2"]["healthcolor_text"].setVisible(true);	
			}
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


		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["name"]=this.nameBox.getText();
			if(this.healthBox.getText()!=null || this.healthBox.getText()!=""){
				this.data["healthbar"]=this.healthBox.getText();
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
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
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

				console.log("TOUCHED");
				return true;
			} 

		}
		if(this.currentTab==2){	
			if(isTouching(this.panels["main_panel"]["tab2"]["healthbtn"],truePos)){
				this.swapHealthbar(); return true;
			}
		}	
		return false;
	},	

	swapHealthbar:function(){
		this.panels["main_panel"]["tab2"]["healthcolor_entry"].setPositionX(this.panels["main_panel"]["tab2"]["healthcolor_entry"].getPositionX()-1000);	
		this.panels["main_panel"]["tab2"]["healthcolor_text"].setVisible(false);		
			
		if(this.data["healthbar"]!=null && this.data["healthbar"]!=""){
			this.data["healthbar"]="";
			this.healthBox.setText("");
		} else{
			this.data["healthbar"]="FF0000";
			this.panels["main_panel"]["tab2"]["healthcolor_entry"].setPositionX(4);	
			this.panels["main_panel"]["tab2"]["healthcolor_text"].setVisible(true);		
		}
		this.panels["main_panel"]["tab2"]["healthbtn"].setColor(RED);
		this.panels["main_panel"]["tab2"]["healthbtn"]["text"].setString("NOT HEALTHBAR");
		if(this.data["healthbar"]!=null && this.data["healthbar"]!=""){
			this.panels["main_panel"]["tab2"]["healthbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab2"]["healthbtn"]["text"].setString("IS HEALTHBAR");
		}
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