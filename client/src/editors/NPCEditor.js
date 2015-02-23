NPCEditor = Scene.extend({
	currentTexture:characterTextureList[0]["name"],
	currentTextureNumber:0,
	currentTab:null,
	
	getTabOptions:function(){
		return ["Sprite","Script"];
	},


	getCloseOptions:function(clicknum){
		return ["Cancel","Don't Save","Save"];
	},

	willExitEditor:function(clicknum){
		switch(clicknum){
			case 1:
				this.ignoreTerminate=true; var self= this.delegate;
				this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			break;
			case 2:
				this.ignoreTerminate=true;
				this.data["name"]=this.nameBox.getText();
				this.data["sprite"]["number"]=this.mapOffset.y;
				this.data["script"]=this.typeData;
				this.delegate.endedEdit(this.data);
			break;
		}
	},

	getLayoutObject:function(){
		return { "panels":{
				children:{	
					"tab1":{
						children:{
							"menu_bar":{
								size:cc.size(466,20),
								position:cc.p(0,screenSize.height-40),
								color:cc.c3b(127,127,127),
								children:{
									"textureDropDown": {
										position:cc.p(0,0),
										size:cc.size(80,20),
										color: cc.c3b(127,127,127),
										anchorPoint:cc.p(0,0),
										children:{
											"lbl":{
												label:(characterTextureList[0]["name"].substring(0,12)),
												fontSize:12,
												anchorPoint:cc.p(0.5,0),
												position:cc.p(40,3),
											}
										}
									},
								},	
							},				
							"namelbl":{
								label:"Name:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position: cc.p(4,screenSize.height-70),
							},
							"name_entry":{
								position:cc.p(74,screenSize.height-70),
								size:cc.size(290,16),
								anchorPoint:cc.p(0,0),
								color:cc.c3b(180,180,180)
							},	
							"spritelbl":{
								label:"Sprite:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position: cc.p(4,screenSize.height-100),
							},

							"tiles" : {
								anchorPoint:cc.p(0,1),
								position:cc.p(74,screenSize.height-100),
								texture:characterTextureList[0]["name"],
							},
							
							"upbtn" : {
								position:cc.p(74,screenSize.height-100),
								size:cc.size(96,16),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"^",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(48,8),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"downbtn" : {
								position:cc.p(74,screenSize.height-116-(charactersize*4)),
								size:cc.size(96,16),
								color: cc.c4b(0,0,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"v",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(48,8),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"walklbl" : {
								label:"Walks?:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(7,screenSize.height-144-(charactersize*4)),
							},
							"walkbtn" : {
								position:cc.p(74,screenSize.height-154-(charactersize*4)),
								size:cc.size(64,26),
								color: RED,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"No",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(32,13),
										color:cc.c3b(0,0,0),
									}
								}
							},
						}
					},
					"tab2":{
						children:{
							"scriptList":{
								position:cc.p(0,0),
								size:cc.size(328,screenSize.height-20),
								anchorPoint:cc.p(0,0),
							}
						}
					}
				}
			}
		};
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
			if(list[i]["specifier"]=="NPC"){
				listnodes[i]=cc.Sprite.create();
				listnodes[i].setColor(cc.c3b(80,80,80));
				listnodes[i].setAnchorPoint(cc.p(0,0));
				var text = cc.LabelTTF.create(list[i]["name"],"Arial",12);
				text.setAnchorPoint(cc.p(0,0));
				var bottomLine= cc.LayerColor.create(cc.c4b(0,0,0,127),328,1);
				bottomLine.setPosition(cc.p(0,0))
				text.setPosition(cc.p(2,2));
				text.setDimensions(cc.size(328,0));
				listnodes[i].setTextureRect(cc.rect(0,0,328,text.getContentSize().height+4));
				listnodes[i].setContentSize(328,text.getContentSize().height+4);
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
			return cc.size(328,height);
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
			self.typeData=listelement;
			self.updateScriptList();
		};
		this.panels["tab2"]["scriptList"].listView = ListView.create(this.panels["tab2"]["scriptList"]);
		
		if(this.panels["tab2"]["scriptList"].listView.scrollBar){
			this.panels["tab2"]["scriptList"].listView.scrollBar.setPositionX(328);
			this.panels["tab2"]["scriptList"].listView.scrollBar.setContentSize(20,60);
			this.panels["tab2"]["scriptList"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["tab2"]["scriptList"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["tab2"]["scriptList"].listView.setCallBackList(callBackList);
		this.panels["tab2"]["scriptList"].addChild(this.panels["tab2"]["scriptList"].listView);
	},

	setTab:function(value){
		this.panels["tab1"].setVisible(false);
		this.panels["tab2"].setVisible(false);
		if(value==2){
			this.updateScriptList();
		}
		this.panels["tab"+value].setVisible(true);
		this.currentTab=value;
	},

	getIdentifier:function(){
		return "npcEditor";
	},
	nameBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.setTouchPriority(-100);
		
		this.data={"name":"","sprite":{"texture":null,"number":null},"script":null};;
		this.currentTexture=characterTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.delegate=null,
		this.mapOffset=cc.p(0,0);
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
			if(this.data["sprite"]["number"]){
				this.mapOffset.y=this.data["sprite"]["number"];
			}
			if(this.data["script"]){
				this.typeData=this.data["script"];
			}
		}
	},
	
	runSaveNewData:function(num){
		sendToServer("saveNewNPCMessage",{"savenpcs":num+"","npcsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendToServer("deleteNPCMessage",{"savenpcswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();
		this.setTab(1);
		for(var i in characterTextureList){
			if(characterTextureList[i]["name"]==this.data["sprite"]["texture"]){
				this.currentTextureNumber=i;
				this.currentTexture=characterTextureList[i]["name"];
			}
		}
		this.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(this.currentTexture);
		this.panels["tab1"]["tiles"].setTexture(characterTextureList[this.currentTextureNumber]["texture"]);
		
		if(this.data["script"]!=null){
			this.typeData=this.data["script"];
		}
		this.nameBox = new EntryBox(this.panels["tab1"]["name_entry"],cc.size(this.panels["tab1"]["name_entry"].getContentSize().width,this.panels["tab1"]["name_entry"].getContentSize().height+4), cc.p(0,this.panels["tab1"]["name_entry"].getContentSize().height+4), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.nameBox.setBackgroundInvisible();
		this.updateMapOffset();

		this.panels["tab1"]["walkbtn"].setColor(RED);
		this.panels["tab1"]["walkbtn"]["text"].setString("No");
		if(this.data["walkable"]==true){
			this.panels["tab1"]["walkbtn"].setColor(GREEN);
			this.panels["tab1"]["walkbtn"]["text"].setString("Yes");
		}
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
	
	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["tab1"]["tiles"].getTexture() && this.panels["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(96*this.mapOffset.x),Math.floor(128*this.mapOffset.y),characterTextureList[this.currentTextureNumber]["texture"].getContentSize().width<96?characterTextureList[this.currentTextureNumber]["texture"].getContentSize().width:96,characterTextureList[this.currentTextureNumber]["texture"].getContentSize().height<128?characterTextureList[this.currentTextureNumber]["texture"].getContentSize().height:128));
		}
	},
	
	useTexture:function(number){
		this.delegate.currentTextureNumber=number;
		this.delegate.panels["tiles"].setTexture(characterTextureList[this.delegate.currentTextureNumber]["texture"]);
		this.delegate.currentTexture = characterTextureList[this.delegate.currentTextureNumber]["name"];
		this.delegate.panels["menu_bar"]["textureDropDown"]["lbl"].setString(this.delegate.currentTexture);
		this.delegate.mapOffset=cc.p(0,0);
		this.delegate.updateMapOffset();
		this.delegate.panels["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["menu_bar"]["textureDropDown"]["lbl"].setString(characterTextureList[this.delegate.currentTextureNumber]["name"].substring(0,12));
	},

	onTouchBegan:function(touch){
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["tab1"].convertToNodeSpace(pos);
		if(this.currentTab==1){
			this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
			if(isTouching(this.panels["tab1"]["menu_bar"]["textureDropDown"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				for(var i in characterTextureList){
					nameList.push(characterTextureList[i]["name"].substring(0,12));
				}
				this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.useTexture,nameList,cc.p(0,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}	

			if(isTouching(this.panels["tab1"]["upbtn"],truePos)){
				if(characterTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["tab1"]["downbtn"],truePos)){
				if(characterTextureList[this.currentTextureNumber]["texture"].getContentSize().height>320 && this.mapOffset.y<((characterTextureList[this.currentTextureNumber]["texture"].getContentSize().height-320)/32)){
					this.mapOffset.y++; this.updateMapOffset();
				}
				return true;
			}
			if(isTouching(this.panels["tab1"]["walkbtn"],truePos)){
				this.swapWalkable(); return true;
			}

		}
		
		return false;
	},	


	swapWalkable:function(){
		this.data["walkable"]=!this.data["walkable"];
		this.panels["tab1"]["walkbtn"].setColor(RED);
		this.panels["tab1"]["walkbtn"]["text"].setString("No");
		if(this.data["walkable"]==true){
			this.panels["tab1"]["walkbtn"].setColor(GREEN);
			this.panels["tab1"]["walkbtn"]["text"].setString("Yes");
		}
	},
	
	

	
	useNextTexture:function(){
		if(this.currentTextureNumber>=characterTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["tab1"]["tiles"].setTexture(characterTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = characterTextureList[this.currentTextureNumber]["name"];
		this.panels["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.data["sprite"]["texture"]=this.currentTexture;
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
	
	usePrevTexture:function(){
		if(this.currentTextureNumber<=0){
			this.currentTextureNumber=characterTextureList.length;
		}
		this.currentTextureNumber--;
		this.panels["tab1"]["tiles"].setTexture(characterTextureList[this.currentTextureNumber]["texture"]);
		this.currentTexture = characterTextureList[this.currentTextureNumber]["name"];
		this.panels["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
});