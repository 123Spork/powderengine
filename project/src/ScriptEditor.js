Scripteditor=null,
ScriptEditor = Popup.extend({
	data:null,
	listPanel:null,
	elementContext:null,
	listContext:null,
	requirementsLists:null,
	responseLists:null,
	currentEditor:null,
	delegate:null,
	nameBox:null,
	specifierContext:null,
	defaultContext:null,

	runSaveNewData:function(num){
		sendMessageToServer({"savescripts":num+"","scriptsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savescriptswhole":list});
	},

	getIdentifier:function(){
		return "Scripts";
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

	init:function(withData){
		this._super();
		this.data={"data":[],"name":null};
		this.nameBox=null;
		if(withData.data){
			this.data=withData.data;
		}
		this.delegate=withData.delegate;
	},

	didBecomeActive:function(){
		this._super();
		this.nameBox = new EntryBox(this.panels["main_panel"]["nameEntry"],cc.size(this.panels["main_panel"]["nameEntry"].getContentSize().width,this.panels["main_panel"]["nameEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["nameEntry"].getContentSize().height), this.data["name"], cc.c4b(255,255,255), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.prepareList();
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		for (var i in this.requirementsLists){
			this.requirementsLists[i].removeAllChildren();
			this.requirementsLists[i].removeFromParent();
		}
		for (var i in this.responseLists){
			this.responseLists[i].removeAllChildren();
			this.responseLists[i].removeFromParent();
		}
		var listnodes = [];
		var responsesNodes=[];
		var requirementsNodes=[];

		var mainCallBackList=[];
		var responseCallBackList=[];
		var requirementCallBackList=[];
		var tc = cc.TextureCache.getInstance();
		this.requirementsLists=[];
		this.responseLists=[];

		for(var i=0;i<this.data["data"].length;i++){
			responseCallBackList[i]=[];
			requirementCallBackList[i]=[];
			responsesNodes[i]=[];
			requirementsNodes[i]=[];


			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(758,100);				
			var bottomLine= cc.LayerColor.create(cc.c4b(0,0,0,127),750,1);
			bottomLine.setPosition(cc.p(4,0));	
			var responseLine= cc.LayerColor.create(cc.c4b(0,0,0,127),1,92);
			responseLine.setPosition(cc.p(152,4));
			var requirementsLine= cc.LayerColor.create(cc.c4b(0,0,0,127),1,92);
			requirementsLine.setPosition(cc.p(451,4));	

			var eventString = this.data["data"][i]["type"];
			if(eventString=="On Event End"){
				eventString+= (" (" +this.data["data"][i]["data"]["attachedEvent"]+":"+this.data["data"][this.data["data"][i]["data"]["attachedEvent"]]["type"]+")");
			}

			var eventName = cc.LabelTTF.create(i+": "+eventString,"Arial",15);
			eventName.setColor(cc.c3b(0,0,0));
			eventName.setAnchorPoint(cc.p(0,1));
			eventName.setPosition(cc.p(4,96));
			eventName.setDimensions(cc.size(100,0));

			var reqNode = cc.LayerColor.create(cc.c4b(0,255,0,60),259,100);
			reqNode.setContentSize(cc.size(259,100));
			reqNode.setPositionX(451);
			reqNode.setAnchorPoint(cc.p(0,0));
			listnodes[i].addChild(reqNode);

			var resNode = cc.LayerColor.create(cc.c4b(0,255,0,60),259,100);
			resNode.setContentSize(cc.size(259,100));
			resNode.setPositionX(152);
			resNode.setAnchorPoint(cc.p(0,0));
			listnodes[i].addChild(resNode);


			var dElement = cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
			dElement.setPosition(cc.p(120,4));
			dElement.setAnchorPoint(cc.p(0,0));
			dElement.callBack = "Delete";		
			listnodes[i].addChild(dElement);

			var eElement = cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
			eElement.setPosition(cc.p(96,4));
			eElement.setAnchorPoint(cc.p(0,0));
			eElement.callBack = "Edit";		
			listnodes[i].addChild(eElement);

			mainCallBackList.push([dElement,eElement]);




								//////RESPONSESNODE SUBLIST
								for(var j=0;j<this.data["data"][i]["responses"].length;j++){
									responsesNodes[i].push(cc.Node.create());
									responsesNodes[i][j].setContentSize(259,32);

									var responseName = cc.LabelTTF.create((j+1)+": " + this.data["data"][i]["responses"][j]["type"],"Arial",15);
									responseName.setColor(cc.c3b(0,0,0));
									responseName.setAnchorPoint(cc.p(0,0));
									responseName.setPosition(cc.p(4,4));
									responseName.setDimensions(cc.size(180,0));
									responsesNodes[i][j].setContentSize(259,responseName.getContentSize().height+8);
									responsesNodes[i][j].addChild(responseName);
									
									var delElement = cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
									delElement.setPosition(cc.p(229,0));
									delElement.setAnchorPoint(cc.p(0,0));
									delElement.callBack = "Delete";		
									responsesNodes[i][j].addChild(delElement);

									var editElement = cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
									editElement.setPosition(cc.p(205,0));
									editElement.setAnchorPoint(cc.p(0,0));
									editElement.callBack = "Edit";		
									responsesNodes[i][j].addChild(editElement);

									responseCallBackList[i].push([delElement,editElement]);
								}

						
								var addButton1 = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
								var plus1 = cc.LabelTTF.create("+","Arial",20);
								plus1.setPosition(45,13);
								plus1.setAnchorPoint(cc.p(0.5,0.5));
								addButton1.setPosition(cc.p((259/2)-45,0));
								addButton1.callBack="Add";
								addButton1.addChild(plus1);
								responseCallBackList[i].push([addButton1]);
								responsesNodes[i].push(addButton1);


								this.responseLists[i] = resNode;
								this.responseLists[i].identifier = i;
								var self=this;
								this.responseLists[i].getListSize = function(){
									var height =0;
									for(var j=0;j<responsesNodes[this.identifier].length;j++){
										height+=responsesNodes[this.identifier][j].getContentSize().height;
									}
									return cc.size(259,height);
								};
								this.responseLists[i].getListElementAmount=function(){
									return responsesNodes[this.identifier].length
								};
								this.responseLists[i].getSizeForElement=function(elementID){
									return responsesNodes[this.identifier][elementID].getContentSize();
								};
								this.responseLists[i].getListNodeForIndex=function(elementID){
									return responsesNodes[this.identifier][elementID];
								};
								this.responseLists[i].runListCallBack=function(name,listelement,touch){
									var pos = touch._point;
									var truePos = self.convertToNodeSpace(pos);
									switch(name){
										case "Delete":
											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteResponseClicked,["Cancel","Delete"],touch._point));
											self.elementContext =listelement;
											self.listContext=this.identifier;
										break;
										case "Edit":
										
										break;
										case "Add":
											var resArray = ["Talk","Give Talk Options","Destroy","Give/ Take Item","Set Quest Point", "Warp Player", "Wait", "Open/Close Panel", "Modify Player Stats"];
		
											switch(self.data["specifier"]){
												case "NPC": 
													resArray.push("Attack","Run Away","Defend","Modify NPC Stats");
												case "Item": 
													resArray.push("Equip Item","Consume Item","Read Item");
												break;
												case "Tile":
													resArray.push("Block Entry","Add Layer Graphic");
												break;
											}

											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.addResponseListElement,resArray,touch._point));;
											self.listContext=this.identifier;
										
										break;
										case "Use":
											self.delegate.setTypeData(listelement,self.editList[listelement]);
										break;
									}
								};
								this.responseLists[i].listView = ListView.create(this.responseLists[i]);
								this.responseLists[i].listView.setCallBackList(responseCallBackList[i]);
								this.responseLists[i].addChild(this.responseLists[i].listView);
								/////END OF RESPONSE NODES


								//////REQUIREMENTSNODE SUBLIST
								for(var j=0;j<this.data["data"][i]["requirements"].length;j++){
									requirementsNodes[i].push(cc.Node.create());
									requirementsNodes[i][j].setContentSize(259,32);

									var requireName = cc.LabelTTF.create((j+1)+": " + this.data["data"][i]["requirements"][j]["type"],"Arial",15);
									requireName.setColor(cc.c3b(0,0,0));
									requireName.setAnchorPoint(cc.p(0,0));
									requireName.setPosition(cc.p(4,4));
									requireName.setDimensions(cc.size(180,0));
									requirementsNodes[i][j].setContentSize(259,requireName.getContentSize().height+8);
									requirementsNodes[i][j].addChild(requireName);

									var delElement = cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
									delElement.setPosition(cc.p(229,0));
									delElement.setAnchorPoint(cc.p(0,0));
									delElement.callBack = "Delete";		
									requirementsNodes[i][j].addChild(delElement);

									var editElement = cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
									editElement.setPosition(cc.p(205,0));
									editElement.setAnchorPoint(cc.p(0,0));
									editElement.callBack = "Edit";		
									requirementsNodes[i][j].addChild(editElement);

									requirementCallBackList[i].push([delElement,editElement]);
								}

					
								var addButton2 = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
								var plus2 = cc.LabelTTF.create("+","Arial",20);
								plus2.setPosition(45,13);
								plus2.setAnchorPoint(cc.p(0.5,0.5));
								addButton2.setPosition(cc.p((259/2)-45,0));
								addButton2.callBack="Add";
								addButton2.addChild(plus2);
								requirementCallBackList[i].push([addButton2]);
								requirementsNodes[i].push(addButton2);


								this.requirementsLists[i] = reqNode;
								this.requirementsLists[i].identifier = i;
								var self=this;
								this.requirementsLists[i].getListSize = function(){
									var height =0;
									for(var j=0;j<requirementsNodes[this.identifier].length;j++){
										height+=requirementsNodes[this.identifier][j].getContentSize().height;
									}
									return cc.size(259,height);
								};
								this.requirementsLists[i].getListElementAmount=function(){
									return requirementsNodes[this.identifier].length
								};
								this.requirementsLists[i].getSizeForElement=function(elementID){
									return requirementsNodes[this.identifier][elementID].getContentSize();
								};
								this.requirementsLists[i].getListNodeForIndex=function(elementID){
									return requirementsNodes[this.identifier][elementID];
								};
								this.requirementsLists[i].runListCallBack=function(name,listelement,touch){
									var pos = touch._point;
									var truePos = self.convertToNodeSpace(pos);
									switch(name){
										case "Delete":
											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteRequireClicked,["Cancel","Delete"],touch._point));
											self.elementContext =listelement;
											self.listContext=this.identifier;
										break;
										case "Edit":
											
										break;
										case "Add":
											var reqArr = ["Has Player Items","Is Player Statistics","Is Quest Point","Is Player Position","Is Panel Visibility","Is Player Inventory Space","Is NPC Statistics","Is NPC Attacking","Is NPC Actioning"];						
																			
											switch(self.data["specifier"]){
												case "Tile": 
													reqArr.push("Is Object Type"); 
												break;
											}

											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.addRequireListElement,reqArr,touch._point));
											self.listContext=this.identifier;
										break;
										case "Use":
											self.delegate.setTypeData(listelement,self.editList[listelement]);
										break;
									}
								};
								this.requirementsLists[i].listView = ListView.create(this.requirementsLists[i]);
								this.requirementsLists[i].listView.setCallBackList(requirementCallBackList[i]);
								this.requirementsLists[i].addChild(this.requirementsLists[i].listView);
								/////END OF REQ NODES

			//var touchableNodes =[];
			//callBackList.push(touchableNodes);
			
			listnodes[i].addChild(eventName);
			listnodes[i].addChild(bottomLine);
			listnodes[i].addChild(responseLine);
			listnodes[i].addChild(requirementsLine);

		}

		var addButton = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
		var plus = cc.LabelTTF.create("+","Arial",20);
		plus.setPosition(45,13);
		plus.setAnchorPoint(cc.p(0.5,0.5));
		addButton.setPosition(cc.p((758/2)-45,0));
		addButton.callBack="Add";
		addButton.addChild(plus);
		mainCallBackList.push([addButton]);
		listnodes.push(addButton);

		this.listPanel = this.panels["main_panel"]["list"];
		var self=this;
		this.listPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(758,height);
		};
		this.listPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.listPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.listPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.listPanel.runListCallBack=function(name,listelement,touch){
			var pos = touch._point;
			var truePos = self.convertToNodeSpace(pos);
			switch(name){
				case "Delete":
					var deleteText = "Delete";
					if(self.hasChildrenOf(listelement)){
						deleteText = "Delete (Will destroy all child events)"
					}

					self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteEventClicked,["Cancel",deleteText],touch._point));
					self.elementContext =listelement;
				break;
				case "Edit":

				break;
				case "Add":
					var eventArray = ["Default Interaction","On Event End","On Examine","On Talk Option Selected"];
					var setupOptions = [{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":false}];
					if(self.data["data"].length==0){
						setupOptions[1]["enabled"]=false;
					}
					if(self.eventsHaveChatOptions()){
						setupOptions[3]["enabled"]=true;
					}



					switch(self.data["specifier"]){
						case "Item": 
							eventArray.push("On Pickup","On Drop","On Dequip","On Trade")
							setupOptions.push({"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true})
						break;
						case "Tile":
							eventArray.push("Will Enter","On Enter","Will Leave","On Leave","On Come Near");
							setupOptions.push({"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true});
						break;
					}

				
					self._parent.addChild(DropDownList.createWithListAndPosition(self,self.addListElement,eventArray,touch._point,setupOptions));
					self.elementContext =listelement;
				break;
				case "Use":
					self.delegate.setTypeData(listelement,self.editList[listelement]);
				break;
			}
		};
		this.listPanel.listView = ListView.create(this.listPanel);
		this.listPanel.listView.setCallBackList(mainCallBackList);
		this.listPanel.addChild(this.listPanel.listView);
	},

	deleteChildrenOf:function(eventNumber){
		for(var i=0;i<this.data["data"].length;i++){
			if(this.data["data"][i]["type"]=="On Event End"){
				if(this.data["data"][i]["data"]["attachedEvent"]==eventNumber){
					this.deleteChildrenOf(i);
					this.data["data"].splice(i,1);
				}
			}
		}
	},

	hasChildrenOf:function(eventNumber){
		for(var i=0;i<this.data["data"].length;i++){
			if(this.data["data"][i]["type"]=="On Event End"){
				if(this.data["data"][i]["data"]["attachedEvent"]==eventNumber){
					return true;
				}
			}
		}
		return false;
	},

	eventsHaveChatOptions:function(){
		for(var i=0;i<this.data["data"].length;i++){
			for(var j=0;j<this.data["data"][i]["responses"].length;j++){
				if(this.data["data"][i]["responses"][j]["type"]=="Give Talk Options"){
					return true;
				}
			}
		}
		return false;
	},


	deleteEventClicked:function(clicknum){
		switch(clicknum){
			case 1:
				if(this.delegate.elementContext!=null){
					this.delegate.deleteChildrenOf(this.delegate.elementContext);
					this.delegate.data["data"].splice(this.delegate.elementContext,1);
					this.delegate.prepareList();
					this.delegate.elementContext=null;
				}

			break;
		}
	},

	deleteResponseClicked:function(clicknum){
		switch(clicknum){
			case 1:
				if(this.delegate.elementContext!=null){
					this.delegate.data["data"][this.delegate.listContext]["responses"].splice(this.delegate.elementContext,1);
					this.delegate.prepareList();
					this.delegate.elementContext=null;
					this.delegate.listContext=null;
				}
			break;
		}
	},


	deleteRequireClicked:function(clicknum){
		switch(clicknum){
			case 1:
				if(this.delegate.elementContext!=null){
					this.delegate.data["data"][this.delegate.listContext]["requirements"].splice(this.delegate.elementContext,1);
					this.delegate.prepareList();
					this.delegate.elementContext=null;
					this.delegate.listContext=null;
				}
			break;
		}
	},

	addEventEnd:function(clicknum){
		this.delegate.data["data"].push({"type":"On Event End","responses":[],"requirements":[],"data":{"attachedEvent":clicknum}});
		this.delegate.prepareList();
	},

	addListElement:function(clicknum,touch){
			var eventString="";
			switch(clicknum){
				case 0: eventString="Default Event"; break;
				case 1: var eventArray=[];
				for(var i=0;i<this.delegate.data["data"].length;i++){
					eventArray.push(i+": " +this.delegate.data["data"][i]["type"])
				}
				this._parent.addChild(DropDownList.createWithListAndPosition(this.delegate,this.delegate.addEventEnd,eventArray,touch._point)); return;
				case 2: eventString="On Examine"; break;
				case 3: eventString="On Talk Option Selected"; break;
			}
			if(eventString==""){
				switch(this.delegate.data["specifier"]){
					case "Item": 
						switch(clicknum){
							case 4: eventString = "On Pickup"; break;
							case 5: eventString = "On Drop"; break;
							case 6: eventString = "On Dequip"; break;
							case 7: eventString = "On Trade"; break;
						}
					break;
					case "Tile":
						switch(clicknum){
							case 4: eventString = "Will Enter"; break;
							case 5: eventString = "On Enter"; break;
							case 6: eventString = "Will Leave"; break;
							case 7: eventString = "On Leave"; break;
							case 8: eventString = "On Come Near"; break;
						}
					break;
				}
			}
			this.delegate.data["data"].push({"type":eventString,"responses":[],"requirements":[],"data":{}});
			this.delegate.prepareList();
	},

	addResponseListElement:function(clicknum){
		var responseText=""
		switch(clicknum){
			case 0: responseText ="Talk"; break;
			case 1: responseText ="Give Talk Options"; break;
			case 2: responseText ="Destroy"; break;
			case 3: responseText ="Give /Take Item"; break;
			case 4: responseText ="Set Quest Point"; break;
			case 5: responseText ="Warp Player"; break;
			case 6: responseText ="Wait"; break;
			case 7: responseText ="Open/Close Panel"; break;
			case 8: responseText ="Modify Player Stats"; break
		}
		if(responseText==""){
			switch(this.delegate.data["specifier"]){
				case "NPC": 
					switch(clicknum){
						case 9: responseText = "Attack"; break;
						case 10: responseText = "Run Away"; break;
						case 11: responseText = "Defend"; break;
						case 12: responseText = "Modify NPC Stats"
					}
				break;
				case "Item": 
					switch(clicknum){
						case 9: responseText = "Equip Item"; break;
						case 10: responseText = "Consume Item"; break;
						case 11: responseText = "Read Item"; break;
					}
				break;
				case "Tile":
					switch(clicknum){
						case 9: responseText = "Block Entry"; break;
						case 10: responseText = "Add Layer Graphic"; break;
					}
				break;
			}
		}


		this.delegate.data["data"][this.delegate.listContext]["responses"].push({"type":responseText, data:{}});
		this.delegate.prepareList();
	},


	addRequireListElement:function(clicknum){
		var requireText="";
		switch(clicknum){
			case 0: requireText = "Is Player Items"; break;
			case 1: requireText = "Is Player Statistics"; break;
			case 2: requireText = "Is Quest Point"; break;
			case 3: requireText = "Is Player Position"; break;
			case 4: requireText = "Is Panel Visbility";break;
			case 5: requireText = "Is Player Inventory Space";break;
			case 6: requireText = "Is NPC Statistics"; break;
			case 7: requireText = "Is NPC Actioning"; break;
		}
		if(requireText==""){
			switch(this.delegate.data["specifier"]){
				case "Tile":
					switch(clicknum){
						case 8: requireText = "Is Object Type"; break;
					}
				break;
			}
		}

		this.delegate.data["data"][this.delegate.listContext]["requirements"].push({"type":requireText, data:{}});
		this.delegate.prepareList();
	},


	getLayoutObject:function(){
			return { 
			"panels":{
				position:cc.p(0,60),
				children:{	
					"background_image":{
						texture:"GUI/event_panel.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(800,400),
						children: {
							"list":{
								size:cc.size(758,360),
								bg:cc.c4b(0,200,200,200),
								position:cc.p(0,0),
								anchorPoint:cc.p(0,0),
							},
							"okbtn" : {
								position:cc.p(4,364),
								size:cc.size(32,32),
								texture:"GUI/tick_icon.png",
								anchorPoint:cc.p(0,0),
							},
							"cancelbtn" : {
								position:cc.p(46,364),
								size:cc.size(32,32),
								texture:"GUI/cross_icon.png",
								anchorPoint:cc.p(0,0),
							},
							"defaultsbtn" : {
								position:cc.p(542,364),
								size:cc.size(64,32),
								bg:cc.c4b(0,255,0,255),
								anchorPoint:cc.p(0,0),
								children:{
									"contents":{
										label:"Defaults",
										position:cc.p(32,16),
										anchorPoint:cc.p(0.5,0.5),
										color:cc.c3b(0,0,0),
									}
								}
							},

							"specifier" : {
								position:cc.p(620,364),
								size:cc.size(128,32),
								bg:cc.c4b(0,255,0,255),
								anchorPoint:cc.p(0,0),
								children:{
									"contents":{
										label:"Includes: None",
										position:cc.p(64,16),
										anchorPoint:cc.p(0.5,0.5),
										color:cc.c3b(0,0,0),
									}
								}
							},


							"namelbl" : {
								label:"Name:",
								fontSize:20,
								anchorPoint:cc.p(0,0),
								position:cc.p(110,368),
								color:cc.c3b(0,0,0),
							},
							"nameEntry":{
								position:cc.p(180,364),
								size:cc.size(340,32),
								bg:cc.c4b(255,255,255,255),
							},
						},
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,400),
						size: cc.size(800,32),
						children:{	
							"header":{
								label:"Script Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(776,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture: "GUI/close.png",	
							}
						}
					},
				}	
			}
		};
	},

	defaultSelected:function(clicknum,touch){
		if(this.delegate.data["data"].length>0){
			this.delegate.defaultContext=clicknum;
			this._parent.addChild(DropDownList.createWithListAndPosition(this.delegate,this.delegate.destroyForDefault,["Cancel","Clear Script (Required)"],touch._point));
			return;
		}
		this.delegate.setDefault(clicknum)		
	},

	setDefault:function(val){
		switch(val){
			case 0: this.setSpecifier(1,true); this.data["data"] = [{"type":"Will Enter","responses":[{"type":"Block Entry",data:{}}],"requirements":[],"data":{}}]; break;
			case 1: this.setSpecifier(1,true); this.data["data"] = [{"type":"On Enter","responses":[{"type":"Warp Player",data:{}}],"requirements":[],"data":{}}]; break;
			case 2: this.setSpecifier(1,true); this.data["data"] = [{"type":"Default Event","responses":[{"type":"Show Sign",data:{}}],"requirements":[],"data":{}}]; break;
			case 3: this.setSpecifier(1,true); this.data["data"] = [{"type":"Will Enter","responses":[{"type":"Block Entry",data:{}}],"requirements":[{"objectType":"NPC"}],"data":{}}]; break;
			case 4: this.setSpecifier(1,true); this.data["data"] = [{"type":"On Enter","responses":[{"type":"Allow PVP",data:{}}],"requirements":[],"data":{}}]; break;
		}
		this.prepareList();
	},

	setSpecifier:function(val,ignoreReset){
		switch(val){
			case 0: this.data["specifier"]="Item"; this.panels["main_panel"]["specifier"]["contents"].setString("Includes: Item"); break;
			case 1: this.data["specifier"]="Tile"; this.panels["main_panel"]["specifier"]["contents"].setString("Includes: Tile"); break;
			case 2: this.data["specifier"]="NPC"; this.panels["main_panel"]["specifier"]["contents"].setString("Includes: NPC"); break;
			case 3: this.data["specifier"]="None"; this.panels["main_panel"]["specifier"]["contents"].setString("Includes: None"); break;
		}
		this.data["data"]=[];
		if(!ignoreReset){
			this.prepareList();
		}
	},

	destroyForSpecifier:function(clicknum){
		if(clicknum==1){
			this.delegate.setSpecifier(this.delegate.specifierContext);	
		}
	},

	destroyForDefault:function(clicknum){
		if(clicknum==1){
			this.delegate.setDefault(this.delegate.defaultContext)
		}
	},


	specifierSelected:function(clicknum,touch){
		if(this.delegate.data["data"].length>0){
			this.delegate.specifierContext = clicknum;
			this._parent.addChild(DropDownList.createWithListAndPosition(this.delegate,this.delegate.destroyForSpecifier,["Cancel","Clear Script (Required)"],touch._point));
			return false;
		}
		this.delegate.setSpecifier(clicknum);
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
	
		this.prevMovPos=null;
		var pos = touch._point;
		
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		if(isTouching(this.panels["main_panel"]["defaultsbtn"],truePos)){
			this._parent.addChild(DropDownList.createWithListAndPosition(this,this.defaultSelected,["Block Player","Warp Player","Show Sign","Spawn NPC","Spawn Item","Block NPC","PVP Area"],touch._point));
			return true;
		}

		if(isTouching(this.panels["main_panel"]["specifier"],truePos)){
			this._parent.addChild(DropDownList.createWithListAndPosition(this,this.specifierSelected,["Item","Tile","NPC","None"],touch._point));
			return true;
		}

		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()==""){
				return true;
			}
			this.data["name"]=this.nameBox.getText();
			this.ignoreTerminate=true;
			this.delegate.endedEdit(this.data);
			return true;
		}
		if(isTouching(this.panels["main_panel"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true;
			var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}

		if(isTouching(this.panels["main_panel"],truePos)){
			return true;
		}
		return false;
	},

	
});