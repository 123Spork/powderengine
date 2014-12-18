Itemeditor=null,
Itemeditor2=null,
ItemEditor = Popup.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	currentTab:1,
	amountBtn:null,
	contextItem:null,
	contextStore:null,
	addingSell:false,



	setTypeData:function(value,data){
		if(Scripteditor){
			Scripteditor.willTerminate();
			Scripteditor.removeFromParent();
			this.typeData=value;
			this.setTouchEnabled(true);
			this.panels["main_panel"]["tab1"]["scriptbtn"]["text"].setString(data["name"]);
			this.panels["main_panel"]["tab1"]["scriptbtn"].setColor(cc.c4b(0,255,0,255));
		}
		if(Shopeditor){
			Shopeditor.willTerminate();
			Shopeditor.removeFromParent();
			Shopeditor=null;
			this.addNewStoreFromId(value);
		}
		if(Itemeditor2 && this.addingSell==true){
			Itemeditor2.willTerminate();
			Itemeditor2.removeFromParent();
			Itemeditor2=null;
			this.addNewSellFromIdandData(this.contextStore,value,data);
			this.contextStore=null;
		}
		if(Itemeditor2 && this.addingSell==false){
			Itemeditor2.willTerminate();
			Itemeditor2.removeFromParent();
			Itemeditor2=null;
			this.addNewBuyFromIdandData(this.contextStore,value,data);
			this.contextStore=null;
		}
	},

	setNoType:function(){
		this.panels["main_panel"]["tab1"]["scriptbtn"]["text"].setString("None");
		this.panels["main_panel"]["tab1"]["scriptbtn"].setColor(cc.c4b(255,0,0,255));
	},

	getLayoutObject:function(){
		return { "panels":{
				position:cc.p(300,10),
				children:{	
					"background":{
						texture:"GUI/itemeditor_bg.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(500,368),
						children: {
							"tab1":{
								children:{
									"namelbl" : {
										label:"Name:",
										fontSize:20,
										anchorPoint:cc.p(0,0),
										position:cc.p(4,292),
										color:cc.c3b(0,0,0),
									},
									"name_entry":{
										position:cc.p(74,292),
										size:cc.size(266,32),
										color:cc.c4b(255,255,255,255),
									},
								
									"tiles" : {
										anchorPoint:cc.p(0,1),
										position:cc.p(16,272),
										texture:tileTextureList[0]["name"],
									},
									
									"textureleftbtn" : {
										position:cc.p(362,292),
										size:cc.size(16,32),
										texture:"GUI/texture_change_left.png",
										anchorPoint:cc.p(0,0),
									},
									"texturerightbtn" : {
										position:cc.p(471,292),
										size:cc.size(16,32),
										texture:"GUI/texture_change_right.png",
										anchorPoint:cc.p(0,0),
									},
									"textureName" : {
										position:cc.p(375,292),
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
									"leftbtn" : {
										position:cc.p(0,16),
										size:cc.size(16,256),
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
										size:cc.size(16,256),
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
										position:cc.p(16,272),
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

									"stacklbl" : {
										label:"Stackable:",
										fontSize:12,
										anchorPoint:cc.p(0,0),
										position:cc.p(360,206),
										color:cc.c3b(0,0,0),
									},
									"stackbtn" : {
										position:cc.p(360,176),
										size:cc.size(128,26),
										color: RED,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"No",
												fontSize:12,
												anchorPoint:cc.p(0.5,0.5),
												position:cc.p(64,13),
												color:cc.c3b(0,0,0),
											}
										}
									},

									"scriptlbl" : {
										label:"Script:",
										fontSize:12,
										anchorPoint:cc.p(0,0),
										position:cc.p(360,262),
										color:cc.c3b(0,0,0),
									},
									"scriptbtn" : {
										position:cc.p(360,232),
										size:cc.size(128,26),
										color: RED,
										anchorPoint:cc.p(0,0),
										children:{
											"text":{
												label:"None",
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
										size:cc.size(32,32),
										color:cc.c4b(255,100,100,255),
									},
									"selectednode" : {
										anchorPoint:cc.p(0,0),
										position:cc.p(0,0),
										size:cc.size(32,32),
										color:cc.c4b(100,255,100,255),
									},
										
									
									"okbtn" : {
										position:cc.p(434,16),
										size:cc.size(32,32),
										texture:"GUI/tick_icon.png",
										anchorPoint:cc.p(0,0),
									},
									"cancelbtn" : {
										position:cc.p(384,16),
										size:cc.size(32,32),
										texture:"GUI/cross_icon.png",
										anchorPoint:cc.p(0,0),
									},
									"descriptionLbl":{
										label:"Description",
										fontSize:12,
										anchorPoint:cc.p(0,0),
										position:cc.p(360,154),
										color:cc.c3b(0,0,0),
									},
									"descriptionBox":{
										size:cc.size(128,96),
										position:cc.p(360,55),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"tab2":{
								children:{
									"list":{
										size:cc.size(466,320),
										position:cc.p(2,2),
										anchorPoint:cc.p(0,0),
									},
									"shopName_label":{
										label:"Store Name",
										position:cc.p(4,328),
										color:cc.c3b(255,255,255),
										fontSize:15,
										anchorPoint:cc.p(0,0),
									},
									"shopSell_label":{
										label:"Sell Price",
										position:cc.p(130,328),
										color:cc.c3b(255,255,255),
										fontSize:15,
										anchorPoint:cc.p(0,0),
									},
									"shopBuy_label":{
										label:"Buy Price",
										position:cc.p(315,328),
										color:cc.c3b(255,255,255),
										fontSize:15,
										anchorPoint:cc.p(0,0),
									}
								}
							},
							"tab3":{
								size:cc.size(200,100),
								color:cc.c3b(100,100,100),
								children:{
									"okbtn" : {
										position:cc.p(20,32),
										size:cc.size(32,32),
										texture:"GUI/tick_icon.png",
										anchorPoint:cc.p(0,0),
									},
									"cancelbtn" : {
										position:cc.p(60,32),
										size:cc.size(32,32),
										texture:"GUI/cross_icon.png",
										anchorPoint:cc.p(0,0),
									},
									"textBox":{
										size:cc.size(100,20),
										position:cc.p(20,72),
										color:cc.c3b(255,255,255),
									}
								}
							},
							"tab1Clickable":{
								position:cc.p(8,348),
								size:cc.size(60,20),
								color: WHITE,
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
							"tab2Clickable":{
								position:cc.p(70,348),
								size:cc.size(60,20),
								color: WHITE,
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Value",
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
						position: cc.p(0,368),
						size: cc.size(500,32),
						children:{	
							"header":{
								label:"Item Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(476,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
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
	descriptionBox:null,
	delegate:null,
	data:null,
	typeData:null,
	
	init:function(withData){
		this._super();	
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
		
		if(this.data["script"]!=null){
			this.panels["main_panel"]["tab1"]["scriptbtn"].setColor(cc.c4b(0,255,0,255));
			this.panels["main_panel"]["tab1"]["scriptbtn"]["text"].setString(ObjectLists.getScriptList()[this.data["script"]]["name"]);
			this.typeData=this.data["script"];
		}

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
		this.panels["main_panel"]["tab1"]["selectednode"].setPosition(this.panels["main_panel"]["tab1"]["tiles"].getPosition().x+tilePos.x,this.panels["main_panel"]["tab1"]["tiles"].getPosition().y-(tilePos.y+32)) 
		this.nameBox = new EntryBox(this.panels["main_panel"]["tab1"]["name_entry"],cc.size(this.panels["main_panel"]["tab1"]["name_entry"].getContentSize().width,this.panels["main_panel"]["tab1"]["name_entry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab1"]["name_entry"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);

		this.amountBox = new EntryBox(this.panels["main_panel"]["tab3"]["textBox"],cc.size(this.panels["main_panel"]["tab3"]["textBox"].getContentSize().width,this.panels["main_panel"]["tab3"]["textBox"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab3"]["textBox"].getContentSize().height), "1", cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.amountBox.setDefaultFineFlag(true);

		this.descriptionBox = new EntryBox(this.panels["main_panel"]["tab1"]["descriptionBox"],cc.size(this.panels["main_panel"]["tab1"]["descriptionBox"].getContentSize().width,this.panels["main_panel"]["tab1"]["descriptionBox"].getContentSize().height), cc.p(0,this.panels["main_panel"]["tab1"]["descriptionBox"].getContentSize().height), "", cc.c4b(255,255,255), cc.c3b(0,0,0),true);
		this.descriptionBox.setDefaultFineFlag(true);

		this.panels["main_panel"]["tab1"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["tab1"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["tab1"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab1"]["stackbtn"]["text"].setString("Yes");
		}
		this.updateValueList();
		this.setTab(1);
		this.updateMapOffset();
	},

	setTab:function(value){
		if(value==2){
			this.panels["main_panel"]["tab1"]["name_entry"].setPositionX(-10000);
			this.panels["main_panel"]["tab3"]["textBox"].setPositionX(-10000);
			this.panels["main_panel"]["tab1"]["descriptionBox"].setPositionX(-10000);
		}
		if(value==1){
			this.panels["main_panel"]["tab1"]["name_entry"].setPositionX(74);
			this.panels["main_panel"]["tab3"]["textBox"].setPositionX(-10000);
			this.panels["main_panel"]["tab1"]["descriptionBox"].setPositionX(360);
		}
		if(value==3){
			this.panels["main_panel"]["tab1"]["descriptionBox"].setPositionX(-10000);
			this.panels["main_panel"]["tab2"].setVisible(true);
			this.panels["main_panel"]["tab3"]["textBox"].setPositionX(20);
			this.panels["main_panel"]["tab3"].setVisible(true);
			this.currentTab=value;
			return;
		}
		this.currentTab=value;
		this.panels["main_panel"]["tab1"].setVisible(false);
		this.panels["main_panel"]["tab2"].setVisible(false);
		this.panels["main_panel"]["tab3"].setVisible(false);
		this.panels["main_panel"]["tab1Clickable"].setColor(WHITE);
		this.panels["main_panel"]["tab2Clickable"].setColor(WHITE);
		this.panels["main_panel"]["tab"+value].setVisible(true);
		this.panels["main_panel"]["tab"+value+"Clickable"].setColor(cc.c4b(255,255,0,255));
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
		this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(0);
		var truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
		if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
			truePos.x = truePos.x-(truePos.x%32)+16;
			truePos.y = truePos.y-(truePos.y%32)+16;
			this.panels["main_panel"]["tab1"]["highlightnode"].setOpacity(127);
			this.panels["main_panel"]["tab1"]["highlightnode"].setPosition(truePos);
			return true;
		}		
	},

	updateValueList:function(){
		if(this.panels["main_panel"]["tab2"]["list"].listView){
			this.panels["main_panel"]["tab2"]["list"].listView.removeFromParent();
			this.panels["main_panel"]["tab2"]["list"].listView=null;
		}
		var listnodes = [];
		var callBackList=[];
		var panelList = this.data["value"];
		var self=this;
		for(var i=0;i<panelList.length;i++){
			listnodes[i]=cc.Node.create();
			var element= cc.LayerColor.create(cc.c4b(255,0,0,127),456,1);		
			var shopname = ObjectLists.getShopList()[panelList[i]["shopid"]]["name"];
			var text = cc.LabelTTF.create(shopname,"Arial",12);
			text.setColor(cc.c3b(0,0,0));
			text.setAnchorPoint(cc.p(0,0.5));
			text.setPosition(cc.p(4,30));
			text.setDimensions(cc.size(40,0));
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
			sublist1.runListCallBack=function(name,listelement,touch){
				if(self.currentTab!=2){
					return;
				}
				switch(name){
					case "Add":
						self.contextStore=this.listView.index;
						self.addingSell=true;
						if(Itemeditor2 && !Itemeditor2._parent) Itemeditor2=null;
						if(Itemeditor2){
							Itemeditor2.willTerminate();
							Itemeditor2.removeFromParent();
							Itemeditor2r=null;
						} else{
							Itemeditor2 = new PopupList();
							Itemeditor2.init({delegate:self,editor:new ShopEditor(),list:ObjectLists.getItemList(),name:"Item List"},{del:false,edit:false,add:false});
							Itemeditor2.didBecomeActive();
							self.addChild(Itemeditor2);
							Itemeditor2.setPosition(self.getPosition());
						}
					break;
					case "Edit":
						self.addingSell=true;
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.setTab(3);
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
			sublist2.runListCallBack=function(name,listelement,touch){
				if(self.currentTab!=2){
					return;
				}
				switch(name){
					case "Add":
						self.contextStore=this.listView.index;
						self.addingSell=false;
						if(Itemeditor2 && !Itemeditor2._parent) Itemeditor2=null;
						if(Itemeditor2){
							Itemeditor2.willTerminate();
							Itemeditor2.removeFromParent();
							Itemeditor2r=null;
						} else{
							Itemeditor2 = new PopupList();
							Itemeditor2.init({delegate:self,editor:new ShopEditor(),list:ObjectLists.getItemList(),name:"Item List"},{del:false,edit:false,add:false});
							Itemeditor2.didBecomeActive();
							self.addChild(Itemeditor2);
						}
					break;
					case "Edit":
						self.addingSell=false;
						self.contextStore=this.listView.index;
						self.contextItem=listelement;
						self.setTab(3);
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
		this.panels["main_panel"]["tab2"]["list"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(468,height);
		};
		this.panels["main_panel"]["tab2"]["list"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["main_panel"]["tab2"]["list"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["main_panel"]["tab2"]["list"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["main_panel"]["tab2"]["list"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["main_panel"]["tab2"]["list"].runListCallBack=function(name,listelement,touch){
			if(self.currentTab!=2){
				return;
			}
			switch(name){
				case "Add":
					if(Shopeditor){
						Shopeditor.willTerminate();
						Shopeditor.removeFromParent();
						Shopeditor=null;
					} else{
						Shopeditor = new PopupList();
						var shoplist = ObjectLists.getShopList();
						var delegatelist = [];
						for(var i in shoplist){
							delegatelist.push({"name":shoplist[i]["name"]});
						}

						for(var i=0;i<self.data["value"].length;i++){
							delegatelist[self.data["value"][i]["shopid"]]={};
						}
						if(delegatelist.length>0){
							Shopeditor.init({delegate:self,editor:new ShopEditor(),list:delegatelist,name:"Shop List"});
							Shopeditor.didBecomeActive();
							self.addChild(Shopeditor);
						}
					}
				break;
				case "Delete":
					self.contextStore=listelement;
					self.deleteStore(touch);
				break;
			}
		};
		this.panels["main_panel"]["tab2"]["list"].listView = ListView.create(this.panels["main_panel"]["tab2"]["list"]);
		this.panels["main_panel"]["tab2"]["list"].listView.setCallBackList(callBackList);
		this.panels["main_panel"]["tab2"]["list"].addChild(this.panels["main_panel"]["tab2"]["list"].listView);
	},
	

	addNewStoreFromId:function(id){
		var shop = ObjectLists.getShopList()[id];
		this.data["value"].push({"shopid":id,"sell":[],"buy":[]});
		this.updateValueList();
	},

	deleteSell:function(touch){
		this._parent.addChild(DropDownList.createWithListAndPosition(this,this.deleteSellClicked,["Delete","Cancel"],touch._point));
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
		this._parent.addChild(DropDownList.createWithListAndPosition(this,this.deleteStoreClicked,["Delete","Cancel"],touch._point));
	},

	deleteStoreClicked:function(index){
		if(index==0){
			this.delegate.data["value"].splice(this.delegate.contextStore,1);
			this.delegate.updateValueList();
		}
		this.delegate.contextStore=null;
	},

	deleteBuy:function(touch){
		this._parent.addChild(DropDownList.createWithListAndPosition(this,this.deleteBuyClicked,["Delete","Cancel"],touch._point));
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


		var truePos = this.panels["main_panel"].convertToNodeSpace(cc.p(pos.x,pos.y));


		if(isTouching(this.panels["main_panel"]["tab1Clickable"],truePos)){
			this.setTab(1);
			return true;
		}		
	
		if(isTouching(this.panels["main_panel"]["tab2Clickable"],truePos)){
			this.setTab(2);
			return true;
		}	

		if(this.currentTab==3){
			if(isTouching(this.panels["main_panel"]["tab3"]["okbtn"],truePos)){
				if(this.amountBox.getText()==null || this.amountBox.getText()=="" || this.amountBox.getText()<=0){
					return true;
				}
				if(this.addingSell==true){
					this.data["value"][this.contextStore]["sell"][this.contextItem]["amount"]=this.amountBox.getText();
				}else{
					this.data["value"][this.contextStore]["buy"][this.contextItem]["amount"]=this.amountBox.getText();
				}
				this.setTab(2);
				this.updateValueList();
				return true;
			}
			
			if(isTouching(this.panels["main_panel"]["tab3"]["cancelbtn"],truePos)){
				this.setTab(2);
				return true;
			}
		}

		if(this.currentTab==1){
		
		if(isTouching(this.panels["main_panel"]["tab1"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["description"]=this.descriptionBox.getText();
			this.data["name"]=this.nameBox.getText();
			this.data["script"]=this.typeData;
			this.delegate.endedEdit(this.data);
			return true;
		}
		
		if(isTouching(this.panels["main_panel"]["tab1"]["scriptbtn"],truePos)){
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

		if(isTouching(this.panels["main_panel"]["tab1"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true; var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

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
		
			if(isTouching(this.panels["main_panel"]["tab1"]["stackbtn"],truePos)){
				this.swapStackable(); return true;
			}

			truePos = this.panels["main_panel"]["tab1"]["tiles"].convertToNodeSpace(pos);
			if(truePos.x>=0 && truePos.y>=0 && truePos.x<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().width && truePos.y<=this.panels["main_panel"]["tab1"]["tiles"].getContentSize().height){
				
				truePos.x = truePos.x-(truePos.x%32)+16;
				truePos.y = truePos.y-(truePos.y%32)+16;
				
				this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(0);
				if(this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()!=truePos.x || this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()!=truePos.y){
					this.panels["main_panel"]["tab1"]["selectednode"].setOpacity(127);
					this.panels["main_panel"]["tab1"]["selectednode"].setPosition(truePos);
				}

				var pos = cc.p(((this.panels["main_panel"]["tab1"]["selectednode"].getPositionX()-16)/32)+this.mapOffset.x,((8-((this.panels["main_panel"]["tab1"]["selectednode"].getPositionY()-16)/32))+this.mapOffset.y)-1);
				this.data["sprite"]["position"]=pos;

				return true;
			} 
		}	
		return false;
	},	

	swapStackable:function(){
		this.data["stackable"]=!this.data["stackable"];
		this.panels["main_panel"]["tab1"]["stackbtn"].setColor(RED);
		this.panels["main_panel"]["tab1"]["stackbtn"]["text"].setString("No");
		if(this.data["stackable"]==true){
			this.panels["main_panel"]["tab1"]["stackbtn"].setColor(GREEN);
			this.panels["main_panel"]["tab1"]["stackbtn"]["text"].setString("Yes");
		}
	},
	
	useNextTexture:function(){
		if(this.currentTextureNumber>=tileTextureList.length-1){
			this.currentTextureNumber=-1;
		}
		this.currentTextureNumber++;
		this.panels["main_panel"]["tab1"]["tiles"].setTexture(tileTextureList[this.currentTextureNumber]["texture"]);
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
		this.currentTexture = tileTextureList[this.currentTextureNumber]["name"];
		this.panels["main_panel"]["tab1"]["textureName"]["text"].setString(this.currentTexture);
		this.mapOffset=cc.p(0,0);
		this.updateMapOffset();
	},
});