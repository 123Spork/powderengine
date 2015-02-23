Itemeditor2=null,
ItemEditor = Scene.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	currentTab:1,
	amountBtn:null,
	contextItem:null,
	contextStore:null,
	addingSell:false,
	mapSize:null,

	getTabOptions:function(){
		return ["Sprite","Value","Script"];
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
				this.data["description"]=this.descriptionBox.getText();
				this.data["name"]=this.nameBox.getText();
				this.data["script"]=this.typeData;
				this.delegate.endedEdit(this.data);
			break;
		}
	},

	setNoType:function(){
		this.panels["tab1"]["scriptbtn"]["text"].setString("None");
		this.panels["tab1"]["scriptbtn"].setColor(cc.c4b(255,0,0,255));
	},

	getLayoutObject:function(){
		this.mapSize = (screenSize.height-140)-(((screenSize.height-140))%cellsize);
		return { "panels":{
				children:{	
					"tab1":{
						children:{
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
						
							"tiles" : {
								anchorPoint:cc.p(0,1),
								position:cc.p(0,screenSize.height-140),
								texture:tileTextureList[0]["name"],
							},

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
												label:(tileTextureList[0]["name"].substring(0,12)),
												fontSize:12,
												anchorPoint:cc.p(0.5,0),
												position:cc.p(40,3),
											}
										}
									},
								},	
							},				

							"stacklbl" : {
								label:"Stackable:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(390,screenSize.height-70),
							},
							"stackbtn" : {
								position:cc.p(390,screenSize.height-100),
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
							
							"highlightnode" : {
								anchorPoint:cc.p(0,0),
								position:cc.p(0,0),
								size:cc.size(32,32),
								color:cc.c4b(255,100,100,255),
							},
							"selectednode" : {
								anchorPoint:cc.p(0,0),
								position:cc.p(0,0),
								size:cc.size(32,32),
								color:cc.c4b(100,255,100,255),
							},
								
							"descriptionLbl":{
								label:"Description:",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(4,screenSize.height-93),
							},
							"descriptionBox":{
								size:cc.size(290,40),
								position:cc.p(74,screenSize.height-120),
								color:cc.c3b(180,180,180),
								anchorPoint:cc.p(0,0),
							}
						}
					},
					"tab2":{
						children:{
							"list":{
								size:cc.size(466,screenSize.height-50),
								position:cc.p(2,2),
								anchorPoint:cc.p(0,0),
								color:cc.c3b(180,180,180),
							},
							"shopName_label":{
								label:"Store Name",
								position:cc.p(4,screenSize.height-40),
								color:cc.c3b(255,255,255),
								fontSize:12,
								anchorPoint:cc.p(0,0),
							},
							"shopSell_label":{
								label:"Sell Price",
								position:cc.p(90,screenSize.height-40),
								color:cc.c3b(255,255,255),
								fontSize:12,
								anchorPoint:cc.p(0,0),
							},
							"shopBuy_label":{
								label:"Buy Price",
								position:cc.p(275,screenSize.height-40),
								color:cc.c3b(255,255,255),
								fontSize:12,
								anchorPoint:cc.p(0,0),
							}
						}
					},
					"tab3":{
						children:{
							"scriptList":{
								position:cc.p(0,0),
								size:cc.size(352,screenSize.height-20),
								anchorPoint:cc.p(0,0),
							}
						}
					}
				}
			}
		};
	},
	
	getIdentifier:function(){
		return "itemEditor";
	},
	nameBox:null,
	descriptionBox:null,
	delegate:null,
	data:null,
	typeData:null,
	
	init:function(withData){
		this._super();	
		this.setTouchPriority(-100);
		this.data={"value":[],"sprite":{"texture":tileTextureList[0]["name"],"position":{x:0,y:0}},"script":null,"stackable":false, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.descriptionBox=null,
		this.delegate=null,
		this.typeData=null,
		this.mapOffset=cc.p(0,0);
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
			if(this.data["script"]){
				this.typeData=this.data["script"];
			}
			if(!withData.data.value){
				this.data["value"]=[];
			}
		}
	},
	
	runSaveNewData:function(num){
		sendToServer("saveNewItemMessage",{"saveitems":num+"","itemdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendToServer("deleteItemMessage",{"saveitemswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();
		this.panels["tab1"]["highlightnode"].setOpacity(0);
		this.panels["tab1"]["selectednode"].setOpacity(127);

		for(var i in tileTextureList){
			if(tileTextureList[i]["name"]==this.data["sprite"]["texture"]){
				this.currentTextureNumber=i;
				this.currentTexture=tileTextureList[i]["name"];
			}
		}
		this.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(this.currentTexture);
		this.panels["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
		
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
		this.panels["tab1"]["selectednode"].setPosition(this.panels["tab1"]["tiles"].getPosition().x+tilePos.x,this.panels["tab1"]["tiles"].getPosition().y-(tilePos.y+32)) 
		this.nameBox = new EntryBox(this.panels["tab1"]["name_entry"],cc.size(this.panels["tab1"]["name_entry"].getContentSize().width,this.panels["tab1"]["name_entry"].getContentSize().height+4), cc.p(0,this.panels["tab1"]["name_entry"].getContentSize().height+4), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.nameBox.setBackgroundInvisible();

		/*this.amountBox = new EntryBox(this.panels["tab3"]["textBox"],cc.size(this.panels["tab3"]["textBox"].getContentSize().width,this.panels["tab3"]["textBox"].getContentSize().height), cc.p(0,this.panels["tab3"]["textBox"].getContentSize().height), "1", cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.amountBox.setDefaultFineFlag(true);
		this.amountBox.setBackgroundInvisible();
*/
		this.descriptionBox = new EntryBox(this.panels["tab1"]["descriptionBox"],cc.size(this.panels["tab1"]["descriptionBox"].getContentSize().width,this.panels["tab1"]["descriptionBox"].getContentSize().height+4), cc.p(0,this.panels["tab1"]["descriptionBox"].getContentSize().height+4), "", cc.c4b(255,255,255), cc.c3b(0,0,0),true);
		this.descriptionBox.setDefaultFineFlag(true);
		this.descriptionBox.setBackgroundInvisible();

		this.panels["tab1"]["stackbtn"].setColor(RED);
		this.panels["tab1"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["tab1"]["stackbtn"].setColor(GREEN);
			this.panels["tab1"]["stackbtn"]["text"].setString("Yes");
		}
		this.updateValueList();
		this.setTab(1);
		this.updateMapOffset();
	},

	setTab:function(value){
		if(value==2){
			this.panels["tab1"]["name_entry"].setPositionX(-10000);
			//this.panels["tab3"]["textBox"].setPositionX(-10000);
			this.panels["tab1"]["descriptionBox"].setPositionX(-10000);
		}
		if(value==1){
			this.panels["tab1"]["name_entry"].setPositionX(74);
			//this.panels["tab3"]["textBox"].setPositionX(-10000);
			this.panels["tab1"]["descriptionBox"].setPositionX(74);
		}
		if(value==3){
			this.updateScriptList();
		}
		if(value==4){
			this.panels["tab1"]["descriptionBox"].setPositionX(-10000);
			this.panels["tab2"].setVisible(true);
		//	this.panels["tab3"]["textBox"].setPositionX(20);
		//	this.panels["tab3"].setVisible(true);
			this.currentTab=value;
			return;
		}
		this.currentTab=value;
		this.panels["tab1"].setVisible(false);
		this.panels["tab2"].setVisible(false);
		this.panels["tab3"].setVisible(false);
		this.panels["tab"+value].setVisible(true);
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
		this.panels["tab1"]["highlightnode"].setOpacity(0);
		var truePos = this.panels["tab1"]["tiles"].convertToNodeSpace(pos);
		if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["tab1"]["tiles"].getContentSize().height){
			truePos.x = truePos.x-(truePos.x%32);
			truePos.y = truePos.y-(truePos.y%32)+((screenSize.height-140)-this.panels["tab1"]["tiles"].getContentSize().height);;
			this.panels["tab1"]["highlightnode"].setOpacity(127);
			this.panels["tab1"]["highlightnode"].setPosition(truePos);
			return true;
		}		
	},

	updateValueList:function(){
		if(this.panels["tab2"]["list"].listView){
			this.panels["tab2"]["list"].listView.removeFromParent();
			this.panels["tab2"]["list"].listView=null;
		}
		var listnodes = [];
		var callBackList=[];
		var panelList = this.data["value"];
		var self=this;
		for(var i=0;i<panelList.length;i++){
			listnodes[i]=cc.Node.create();
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),456,1);		
			var shopname = ObjectLists.getShopList()[panelList[i]["shopid"]]["name"];
			var text = cc.LabelTTF.create(shopname,"Arial",12);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0.5));
			text.setPosition(cc.p(4,30));
			text.setDimensions(cc.size(50,0));
			var delElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/trash.png"));
			delElement.setPosition(cc.p(64,((60)/2)-12));
			delElement.setAnchorPoint(cc.p(0,0));
			delElement.callBack="Delete";
			listnodes[i].setContentSize(468,60);
			callBackList.push([delElement]);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].addChild(delElement);

			var newi = (function(index) {return index;})(i);

			var sublist1 = cc.LayerColor.create(cc.c4b(255,255,255,100),148,59);
			sublist1.setPosition(88,1);
			listnodes[i].addChild(sublist1);
			var sublist1nodes = [];
			var sub1callBackList=[];
			for(var j=0;j<panelList[i]["sell"].length;j++){
				var itemname = ObjectLists.getItemList()[panelList[i]["sell"][j]["id"]]["name"];	
				sublist1nodes[j]=cc.Node.create();
				sublist1nodes[j].setContentSize(148,20);
				var t = cc.LabelTTF.create(itemname,"Arial",15);
				t.setColor(cc.c3b(0,0,0));
				t.setAnchorPoint(cc.p(0,0));
				t.setPosition(cc.p(4,4));
				t.setDimensions(cc.size(65,0));
				var d=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/trash.png"));
				d.setPosition(cc.p(124,((t.getContentSize().height+8)/2)-10));
				d.setAnchorPoint(cc.p(0,0));
				d.callBack="Delete";
				listnodes[i].setContentSize(148,60);
				var amountBtn = cc.LayerColor.create(cc.c4b(255,255,255,255),50,20);
				amountBtn.setPosition(cc.p(69,((t.getContentSize().height+8)/2)-10));
				amountBtn.setAnchorPoint(cc.p(0,0));
				amountBtn.callBack="Edit";
				var t2 = cc.LabelTTF.create("x " + panelList[i]["sell"][j]["amount"],"Arial",12);
				t2.setPosition(2,(20-t2.getContentSize().height)/2);
				t2.setColor(cc.c3b(0,0,0));
				t2.setAnchorPoint(cc.p(0,0));
				amountBtn.addChild(t2);

				var e= cc.LayerColor.create(cc.c4b(0,0,0,127),148,1);		
				sublist1nodes[j].addChild(e);

				sublist1nodes[j].addChild(t);
				sublist1nodes[j].addChild(d);
				sublist1nodes[j].addChild(amountBtn);
				sublist1nodes[j].setContentSize(148,t.getContentSize().height+8);
				sub1callBackList.push([d,amountBtn]);
			}
			var a = cc.LayerColor.create(cc.c4b(70,200,70,255),40,20);
			var p = cc.LabelTTF.create("+","Arial",15);
			p.setPosition(20,10);
			p.setAnchorPoint(cc.p(0.5,0.5));
			a.setPosition(cc.p((148/2)-20,0));
			a.callBack="Add";
			a.addChild(p);
			sub1callBackList.push([a]);
			sublist1nodes.push(a);

			sublist1.getListSize = function(){
				var height =0;
				for(var i=0;i<sublist1nodes.length;i++){
					height+=sublist1nodes[i].getContentSize().height;
				}
				return cc.size(180,height);
			};
			sublist1.getListElementAmount=function(){
				return sublist1nodes.length;
			};
			sublist1.getSizeForElement=function(elementID){
				return sublist1nodes[elementID].getContentSize();
			};
			sublist1.getListNodeForIndex=function(elementID){
				return sublist1nodes[elementID];
			};
			sublist1.getHighlightNode = function(elementID){
				return sublist1nodes[elementID].highlightNode;
			};
			sublist1.runListCallBack=function(name,listelement,touch,object){
				if(self.currentTab!=2){
					return;
				}
				switch(name){
					case "Add":
						self.contextStore=this.listView.index;
						var itmlist=ObjectLists.getItemList();
						var list=[];
						for(var i in itmlist){
							if(itmlist[i] && itmlist[i]["name"]!=""){
								list[i]=itmlist[i]["name"];
							}else{
								list[i]=null;
							}
						}
						self.createitemlist(list,true)
					break;
					case "Edit":
						self.addingSell=true;
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.resetValueBoxWithObject(object);
					break;
					case "Delete":
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.deleteSell(touch)
					break;
				}
			};
			sublist1.listView = ListView.create(sublist1);
			sublist1.listView.setCallBackList(sub1callBackList);
			sublist1.listView.index=newi;
			sublist1.addChild(sublist1.listView);


			var sublist2 = cc.LayerColor.create(cc.c4b(255,255,255,180),148,59);
			sublist2.setPosition(274,1);
			listnodes[i].addChild(sublist2);

			var sublist2nodes = [];
			var sub2callBackList=[];
			for(var j=0;j<panelList[i]["buy"].length;j++){
				var itemname = ObjectLists.getItemList()[panelList[i]["buy"][j]["id"]]["name"];	
				sublist2nodes[j]=cc.Node.create();
				sublist2nodes[j].setContentSize(148,20);
				var t = cc.LabelTTF.create(itemname,"Arial",15);
				t.setColor(cc.c3b(0,0,0));
				t.setAnchorPoint(cc.p(0,0));
				t.setPosition(cc.p(4,4));
				t.setDimensions(cc.size(65,0));

				var d=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/trash.png"));
				d.setPosition(cc.p(124,((t.getContentSize().height+8)/2)-10));
				d.setAnchorPoint(cc.p(0,0));
				d.callBack="Delete";
				listnodes[i].setContentSize(148,60);

				var amountBtn = cc.LayerColor.create(cc.c4b(255,255,255,255),50,20);
				amountBtn.setPosition(cc.p(69,((t.getContentSize().height+8)/2)-10));
				amountBtn.setAnchorPoint(cc.p(0,0));
				amountBtn.callBack="Edit";
				var t2 = cc.LabelTTF.create("x " + panelList[i]["buy"][j]["amount"],"Arial",12);
				t2.setPosition(2,(20-t2.getContentSize().height)/2);
				t2.setColor(cc.c3b(0,0,0));
				t2.setAnchorPoint(cc.p(0,0));
				amountBtn.addChild(t2);

				var e= cc.LayerColor.create(cc.c4b(0,0,0,127),148,1);		
				sublist2nodes[j].addChild(e);

				sublist2nodes[j].addChild(t);
				sublist2nodes[j].addChild(d);
				sublist2nodes[j].addChild(amountBtn);
				sublist2nodes[j].setContentSize(148,t.getContentSize().height+8);
				sub2callBackList.push([d,amountBtn]);
			}
			var a = cc.LayerColor.create(cc.c4b(70,200,70,255),40,20);
			var p = cc.LabelTTF.create("+","Arial",15);
			p.setPosition(20,10);
			p.setAnchorPoint(cc.p(0.5,0.5));
			a.setPosition(cc.p((148/2)-20,0));
			a.callBack="Add";
			a.addChild(p);
			sub2callBackList.push([a]);
			sublist2nodes.push(a);
			sublist2.getListSize = function(){
				var height =0;
				for(var i=0;i<sublist2nodes.length;i++){
					height+=sublist2nodes[i].getContentSize().height;
				}
				return cc.size(180,height);
			};
			sublist2.getListElementAmount=function(){
				return sublist2nodes.length;
			};
			sublist2.getSizeForElement=function(elementID){
				return sublist2nodes[elementID].getContentSize();
			};
			sublist2.getListNodeForIndex=function(elementID){
				return sublist2nodes[elementID];
			};
			sublist2.getHighlightNode = function(elementID){
				return sublist2nodes[elementID].highlightNode;
			};
			sublist2.runListCallBack=function(name,listelement,touch,object){
				if(self.currentTab!=2){
					return;
				}
				switch(name){
					case "Add":
						self.contextStore=this.listView.index;
						var itmlist=ObjectLists.getItemList();
						var list=[];
						for(var i in itmlist){
							if(itmlist[i] && itmlist[i]["name"]!=""){
								list[i]=itmlist[i]["name"];
							}else{
								list[i]=null;
							}
						}
						self.createitemlist(list,false)
					break;
					case "Edit":
						self.addingSell=false;
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.resetValueBoxWithObject(object);
					break;
					case "Delete":
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.deleteBuy(touch)
					break;
				}
			};
			sublist2.listView = ListView.create(sublist2);
			sublist2.listView.index=newi;
			sublist2.listView.setCallBackList(sub2callBackList);
			sublist2.addChild(sublist2.listView);
		}
		var addButton = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
		var plus = cc.LabelTTF.create("+","Arial",20);
		plus.setPosition(45,13);
		plus.setAnchorPoint(cc.p(0.5,0.5));
		addButton.setPosition(cc.p((460/2)-45,0));
		addButton.callBack="Add";
		addButton.addChild(plus);
		callBackList.push([addButton]);
		listnodes.push(addButton);
		this.panels["tab2"]["list"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(468,height);
		};
		this.panels["tab2"]["list"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab2"]["list"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab2"]["list"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab2"]["list"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab2"]["list"].runListCallBack=function(name,listelement,touch){
			if(self.currentTab!=2){
				return;
			}
			switch(name){
				case "Add":
					var shoplist = ObjectLists.getShopList();
					var delegatelist = [];
					for(var i in shoplist){
						delegatelist.push(shoplist[i]["name"]);
					}

					for(var i=0;i<self.data["value"].length;i++){
						delegatelist[self.data["value"][i]["shopid"]]=null;
					}

					self.createshoplist(delegatelist);
				break;
				case "Delete":
					self.contextStore=listelement;
					self.deleteStore(touch);
				break;
			}
		};
		this.panels["tab2"]["list"].listView = ListView.create(this.panels["tab2"]["list"]);
		this.panels["tab2"]["list"].listView.setCallBackList(callBackList);
		this.panels["tab2"]["list"].addChild(this.panels["tab2"]["list"].listView);
	},

	createshoplist:function(list){
		if(this.panels["tab2"]["list"].listView){
			this.panels["tab2"]["list"].listView.removeFromParent();
			this.panels["tab2"]["list"].listView=null;
		}
		var listnodes = [];
		var callBackList=[];
		var self=this;
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.Node.create();
			if(list[i]==null){
				listnodes[i].setContentSize(cc.size(0,0));
				callBackList.push([]);
			}else{
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),456,1);		
				var text = cc.LabelTTF.create(list[i],"Arial",12);
				text.setColor(cc.c3b(0,0,0));
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,4));
				text.setDimensions(cc.size(456,0));
				listnodes[i].setContentSize(468,text.getContentSize().height+8);
				listnodes[i].callBack="Use";
				callBackList.push([listnodes[i]]);
				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
			}
		}
		this.panels["tab2"]["list"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(468,height);
		};
		this.panels["tab2"]["list"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab2"]["list"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab2"]["list"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab2"]["list"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab2"]["list"].runListCallBack=function(name,listelement,touch){
			self.addNewStoreFromId(listelement);
			self.updateValueList();
		};
		this.panels["tab2"]["list"].listView = ListView.create(this.panels["tab2"]["list"]);
		this.panels["tab2"]["list"].listView.setCallBackList(callBackList);
		this.panels["tab2"]["list"].addChild(this.panels["tab2"]["list"].listView);
	},
	

	createitemlist:function(list,isSell){
		console.log(list);
		if(this.panels["tab2"]["list"].listView){
			this.panels["tab2"]["list"].listView.removeFromParent();
			this.panels["tab2"]["list"].listView=null;
		}
		var listnodes = [];
		var callBackList=[];
		var self=this;
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.Node.create();
			if(list[i]==null){
				listnodes[i].setContentSize(cc.size(0,0));
				callBackList.push([]);
			}else{
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),456,1);		
				var text = cc.LabelTTF.create(list[i],"Arial",12);
				text.setColor(cc.c3b(0,0,0));
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,4));
				text.setDimensions(cc.size(456,0));
				listnodes[i].setContentSize(468,text.getContentSize().height+8);
				listnodes[i].callBack="Use";
				callBackList.push([listnodes[i]]);
				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
			}
		}
		this.panels["tab2"]["list"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(468,height);
		};
		this.panels["tab2"]["list"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab2"]["list"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab2"]["list"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab2"]["list"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab2"]["list"].runListCallBack=function(name,listelement,touch){
			if(isSell){
				self.addNewSellFromIdandData(self.contextStore,listelement)
			}else{
				self.addNewBuyFromIdandData(self.contextStore,listelement);
			}
			self.updateValueList();
		};
		this.panels["tab2"]["list"].listView = ListView.create(this.panels["tab2"]["list"]);
		this.panels["tab2"]["list"].listView.setCallBackList(callBackList);
		this.panels["tab2"]["list"].addChild(this.panels["tab2"]["list"].listView);
	},

		resetValueBoxWithObject:function(object){
			if(this.editBox){
				this.confirmEditBox();
			}
			this.editBox = new EntryBox(object,cc.size(object.getContentSize().width,object.getContentSize().height+4), cc.p(0,object.getContentSize().height+4),this.addingSell==true?this.data["value"][this.contextStore]["sell"][this.contextItem]["amount"]:this.data["value"][this.contextStore]["buy"][this.contextItem]["amount"], cc.c4b(255,255,255), cc.c3b(0,0,0),false,null,this);
			this.editBox.setDefaultFineFlag(true);
			this.schedule(this.checkMouseDown);
		},

		checkMouseDown:function(){
			if(!mouseDown && this.editBox){
				this.editBox.setFocused(true)
				this.unschedule(this.checkMouseDown);
			}
		},

		hasActiveEditBox:function(){
			if(this.editBox){
				return true;
			}
			return false;
		},

		updateFromEnd:function(){
			this.confirmEditBox();
		},

		confirmEditBox:function(){
			if(parseInt(this.editBox.getText())>0){
				if(this.addingSell==true){
					this.data["value"][this.contextStore]["sell"][this.contextItem]["amount"]=this.editBox.getText();
				}else{
					this.data["value"][this.contextStore]["buy"][this.contextItem]["amount"]=this.editBox.getText();
				}
			}
			this.editBox.setFocused(false);
			this.editBox.removeFromParent();
			this.editBox=null;
			this.updateValueList();
		},



	addNewStoreFromId:function(id){
		var shop = ObjectLists.getShopList()[id];
		this.data["value"].push({"shopid":id,"sell":[],"buy":[]});
		this.updateValueList();
	},

	deleteSell:function(touch){
		MainScene.addChild(DropDownList.createWithListAndPosition(this,this.deleteSellClicked,["Delete","Cancel"],touch._point));
	},

	deleteSellClicked:function(index){
		if(index==0){
			this.delegate.data["value"][this.delegate.contextStore]["sell"].splice(this.delegate.contextItem,1);
			this.delegate.updateValueList();
		}
		this.delegate.contextStore=null;
		this.delegate.contextItem=null;
	},


	deleteStore:function(touch){
		MainScene.addChild(DropDownList.createWithListAndPosition(this,this.deleteStoreClicked,["Delete","Cancel"],touch._point));
	},

	deleteStoreClicked:function(index){
		if(index==0){
			this.delegate.data["value"].splice(this.delegate.contextStore,1);
			this.delegate.updateValueList();
		}
		this.delegate.contextStore=null;
	},

	deleteBuy:function(touch){
		MainScene.addChild(DropDownList.createWithListAndPosition(this,this.deleteBuyClicked,["Delete","Cancel"],touch._point));
	},

	deleteBuyClicked:function(index){
		if(index==0){
			this.delegate.data["value"][this.delegate.contextStore]["buy"].splice(this.delegate.contextItem,1);
			this.delegate.updateValueList();
		}
		this.delegate.contextStore=null;
		this.delegate.contextItem=null;
	},


	addNewSellFromIdandData:function(id,value,data){
		this.data["value"][id]["sell"].push({"id":value,"amount":1});
		this.updateValueList();
	},

	addNewBuyFromIdandData:function(id,value,data){
		this.data["value"][id]["buy"].push({"id":value,"amount":1});
		this.updateValueList();
	},

	updateMapOffset:function(){
		this.schedule(this.updateMapOffset);
		if(this.panels["tab1"]["tiles"].getTexture() && this.panels["tab1"]["tiles"].getTexture()._isLoaded==true){
			this.unschedule(this.updateMapOffset);
			this.panels["tab1"]["tiles"].setTextureRect(cc.rect(Math.floor(cellsize*this.mapOffset.x),Math.floor(cellsize*this.mapOffset.y),tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width<466?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width:466,tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height<this.mapSize?tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height:this.mapSize));
		}
	},
	
	useTexture:function(number){
		this.delegate.currentTextureNumber=number;
		this.delegate.panels["tab1"]["tiles"].setTexture(tileTextureList[this.delegate.currentTextureNumber]["texture"]);
		this.delegate.currentTexture = tileTextureList[this.delegate.currentTextureNumber]["name"];
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(this.delegate.currentTexture);
		this.delegate.mapOffset=cc.p(0,0);
		this.delegate.updateMapOffset();
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));
		this.delegate.panels["tab1"]["menu_bar"]["textureDropDown"]["lbl"].setString(tileTextureList[this.delegate.currentTextureNumber]["name"].substring(0,12));
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
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>466 && this.mapOffset.x<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width-466)/cellsize)){
					this.mapOffset.x++;	this.updateMapOffset();
					this.movePosition.x=truePos.x;
				}
			}
			else if(dist.x<-32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().width>466 && this.mapOffset.x>0){
					this.mapOffset.x--; this.updateMapOffset();
					this.movePosition.x=truePos.x;
				}
			}
			else if(dist.y>32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>466 && this.mapOffset.y>0){
					this.mapOffset.y--;	this.updateMapOffset();
					this.movePosition.y=truePos.y;
				}
			}
			else if(dist.y<-32){
				if(tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height>466 && this.mapOffset.y<((tileTextureList[this.currentTextureNumber]["texture"].getContentSize().height-this.mapSize)/cellsize)){
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

		this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(127,127,127));


		var truePos = this.panels.convertToNodeSpace(pos);

		if(this.currentTab==1){
		

			if(isTouching(this.panels["tab1"]["menu_bar"]["textureDropDown"],this.panels["tab1"]["menu_bar"].convertToNodeSpace(pos))){
				var nameList = [];
				for(var i in tileTextureList){
					nameList.push(tileTextureList[i]["name"].substring(0,12));
				}
				this.panels["tab1"]["menu_bar"]["textureDropDown"].setColor(cc.c3b(60,60,60));
				var ddown = DropDownList.createWithListAndPosition(this,this.useTexture,nameList,cc.p(0,screenSize.height-40));
				ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
				ddown.setMinimumWidth(80);
				this.addChild(ddown);
				return true;
			}
		

		
		
		if(isTouching(this.panels["tab1"]["scriptbtn"],truePos)){
			if(Scripteditor){
				Scripteditor.willTerminate();
				Scripteditor.removeFromParent();
				Scripteditor=null;
			} else{
				Scripteditor = new PopupList();
				Scripteditor.init({delegate:this,editor:new ScriptEditor(),list:ObjectLists.getScriptList(),name:"Script List"});
				Scripteditor.didBecomeActive();
				this.addChild(Scripteditor);
			}
		}

		if(isTouching(this.panels["tab1"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true; var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

		
			if(isTouching(this.panels["tab1"]["stackbtn"],truePos)){
				this.swapStackable(); return true;
			}

			truePos = this.panels["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["tab1"]["tiles"].getContentSize().height){
				this.movePosition=cc.p(truePos.x,truePos.y);
				truePos.x = truePos.x-(truePos.x%cellsize);
				truePos.y = truePos.y-(truePos.y%cellsize)+((screenSize.height-140)-this.panels["tab1"]["tiles"].getContentSize().height);
					
				this.panels["tab1"]["selectednode"].setOpacity(0);
				if(this.panels["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["tab1"]["selectednode"].setOpacity(127);
					this.panels["tab1"]["selectednode"].setPosition(truePos);
				}
				var ySize = Math.floor(this.mapSize/cellsize)-1;
				var pos =cc.p(((this.panels["tab1"]["selectednode"].getPositionX())/cellsize)+this.mapOffset.x,(ySize-((this.panels["tab1"]["selectednode"].getPositionY()-(((screenSize.height-140)-this.panels["tab1"]["tiles"].getContentSize().height)))/cellsize))+this.mapOffset.y)
				this.data["sprite"]["position"]=pos;

				return true;
			} 


		}	
		return false;
	},	

	updateScriptList:function(){
		var list = ObjectLists.getScriptList();
		if(this.panels["tab3"]["scriptList"].listView!=null){
			this.panels["tab3"]["scriptList"].listView.removeFromParent();
			this.panels["tab3"]["scriptList"].listView=null;
		}

		var listnodes = [];
		var callBackList=[];
		for(var i=0;i<list.length;i++){
			listnodes[i]=cc.Node.create();	
			if(list[i]["specifier"]=="Item"){
				listnodes[i]=cc.Sprite.create();
				listnodes[i].setColor(cc.c3b(80,80,80));
				listnodes[i].setAnchorPoint(cc.p(0,0));
				var text = cc.LabelTTF.create(list[i]["name"],"Arial",12);
				text.setAnchorPoint(cc.p(0,0));
				var bottomLine= cc.LayerColor.create(cc.c4b(0,0,0,127),440,1);
				bottomLine.setPosition(cc.p(0,0))
				text.setPosition(cc.p(2,2));
				text.setDimensions(cc.size(440,0));
				listnodes[i].setTextureRect(cc.rect(0,0,440,text.getContentSize().height+4));
				listnodes[i].setContentSize(440,text.getContentSize().height+4);
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
		this.panels["tab3"]["scriptList"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(444,height);
		};
		this.panels["tab3"]["scriptList"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["tab3"]["scriptList"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["tab3"]["scriptList"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["tab3"]["scriptList"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["tab3"]["scriptList"].runListCallBack=function(name,listelement){
			self.typeData=listelement;
			self.updateScriptList();
		};
		this.panels["tab3"]["scriptList"].listView = ListView.create(this.panels["tab3"]["scriptList"]);
		
		if(this.panels["tab3"]["scriptList"].listView.scrollBar){
			this.panels["tab3"]["scriptList"].listView.scrollBar.setPositionX(444);
			this.panels["tab3"]["scriptList"].listView.scrollBar.setContentSize(20,60);
			this.panels["tab3"]["scriptList"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["tab3"]["scriptList"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["tab3"]["scriptList"].listView.setCallBackList(callBackList);
		this.panels["tab3"]["scriptList"].addChild(this.panels["tab3"]["scriptList"].listView);
	},



	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["tab1"]["stackbtn"].setColor(RED);
		this.panels["tab1"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["tab1"]["stackbtn"].setColor(GREEN);
			this.panels["tab1"]["stackbtn"]["text"].setString("Yes");
		}
	},
});