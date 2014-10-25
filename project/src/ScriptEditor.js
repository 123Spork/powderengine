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
	dataContext:null,
	subEditor:null,
	subEditorType:null,

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
									var allowResponseEdit=true;
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

									switch(this.data["data"][i]["responses"][j]["type"]){
										case "Destroy": case "Attack": case "Run Away":
										 allowResponseEdit=false; break;
									}


									if(allowResponseEdit){
										var editElement = cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
										editElement.setPosition(cc.p(205,0));
										editElement.setAnchorPoint(cc.p(0,0));
										editElement.callBack = "Edit";		
										responsesNodes[i][j].addChild(editElement);

										responseCallBackList[i].push([delElement,editElement]);
									}else{
										responseCallBackList[i].push([delElement]);
									}
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
										if(self.subEditor!=null){
										return;
									}
									switch(name){
										case "Delete":
											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteResponseClicked,["Cancel","Delete"],touch._point));
											self.elementContext =listelement;
											self.listContext=this.identifier;
										break;
										case "Edit":
											self.editPressed(this.identifier,"responses",listelement);
										break;
										case "Add":
											var resArray = ["Talk","Give Talk Options","Destroy","Give/ Take Item","Set Quest Point", "Warp Player", "Wait", "Repeat Responses", "Open/Close Panel", "Modify Player Stats"];
											var resSetup = [{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true}]
											for( var i=0;i<self.data["data"][this.identifier]["responses"].length;i++){
												if(self.data["data"][this.identifier]["responses"][i]["type"]=="Repeat Responses"){
													resSetup[7]["enabled"]=false;
												}
											}

											switch(self.data["specifier"]){
												case "NPC": 
													resArray.push("Attack","Run Away","Defend","Modify NPC Stats");
													resSetup.push({"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true});
												break;
												case "Item": 
													resArray.push("Equip Item","Read Item");
													resSetup.push({"enabled":true},{"enabled":true});
												break;
												case "Tile":
													resArray.push("Block Entry","Add Layer Graphic");
													resSetup.push({"enabled":true},{"enabled":true});
												break;
											}

											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.addResponseListElement,resArray,touch._point,resSetup));
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
									var allowRequireEdit=true;
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

									if(allowRequireEdit){
										var editElement = cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
										editElement.setPosition(cc.p(205,0));
										editElement.setAnchorPoint(cc.p(0,0));
										editElement.callBack = "Edit";		
										requirementsNodes[i][j].addChild(editElement);

										requirementCallBackList[i].push([delElement,editElement]);
									} else{
										requirementCallBackList[i].push([delElement]);
									}
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
										if(self.subEditor!=null){
										return;
									}
									switch(name){
										case "Delete":
											self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteRequireClicked,["Cancel","Delete"],touch._point));
											self.elementContext =listelement;
											self.listContext=this.identifier;
										break;
										case "Edit":
											self.editPressed(this.identifier,"requirements",listelement);
										break;
										case "Add":
											var reqArr = ["Has Player Item","Is Player Statistics","Is Quest Point","Is Panel Visibility","Is Player Inventory Space"];						
																			
											switch(self.data["specifier"]){
												case "Tile": 
													reqArr.push("Is Event Fired By"); 
												break;
												case "NPC":
													reqArr.push("Is NPC Statistics","Is NPC Actioning");
												break;											}

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
			if(self.subEditor!=null){
				return;
			}
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
							eventArray.push("Interact On","Interact Facing","Will Enter","On Enter","Will Leave","On Leave","On Come Near");
							setupOptions.push({"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true},{"enabled":true});
							setupOptions[0]["enabled"]=false;
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
							case 4:  eventString = "Interact On"; break;
							case 5:  eventString = "Interact Facing"; break;
							case 6: eventString = "Will Enter"; break;
							case 7: eventString = "On Enter"; break;
							case 8: eventString = "Will Leave"; break;
							case 9: eventString = "On Leave"; break;
							case 10: eventString = "On Come Near"; break;
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
			case 7: responseText = "Repeat Responses"; break;
			case 8: responseText ="Open/Close Panel"; break;
			case 9: responseText ="Modify Player Stats"; break
		}
		if(responseText==""){
			switch(this.delegate.data["specifier"]){
				case "NPC": 
					switch(clicknum){
						case 10: responseText = "Attack"; break;
						case 11: responseText = "Run Away"; break;
						case 12: responseText = "Defend"; break;
						case 13: responseText = "Modify NPC Stats"
					}
				break;
				case "Item": 
					switch(clicknum){
						case 10: responseText = "Equip Item"; break;
						case 11: responseText = "Read Item"; break;
					}
				break;
				case "Tile":
					switch(clicknum){
						case 10: responseText = "Block Entry"; break;
						case 11: responseText = "Add Layer Graphic"; break;
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
			case 0: requireText = "Has Player Item"; break;
			case 1: requireText = "Is Player Statistics"; break;
			case 2: requireText = "Is Quest Point"; break;
			case 3: requireText = "Is Panel Visbility";break;
			case 4: requireText = "Is Player Inventory Space";break;
		}
		if(requireText==""){
			switch(this.delegate.data["specifier"]){
				case "Tile":
					switch(clicknum){
						case 5: requireText = "Is Event Fired By"; break;
					}
				break;
				case "NPC":
					switch(clicknum){
						case 5: requireText = "Is NPC Statistics"; break;
						case 6: requireText = "Is NPC Actioning"; break;
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
						size: cc.size(1000,400),
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
						size: cc.size(1000,32),
						children:{	
							"header":{
								label:"Script Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(976,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture: "GUI/close.png",	
							}
						}
					},
					"subEditorOver":{
						visible:false,
						bg:cc.c4b(0,0,0,127),
						position:cc.p(0,0),
						size:cc.size(800,400),
					},
					"mainEditorOver":{
						bg:cc.c4b(0,0,0,127),
						position:cc.p(800,0),
						size:cc.size(200,400),
					},
				}	
			}
		};
	},

	editPressed:function(event,listtype,id){
		this.disallowTouchForMain(true);
		this.dataContext = {"event":event,"listtype":listtype,"id":id};
		this.subEditorType = this.data["data"][event][listtype][id]["type"];
		this.showSubEditor();
	},

	returnFromEditOkPressed:function(dataToSave){
		this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = cloneObj(dataToSave);
		this.disallowTouchForMain(false);
		this.hideSubEditor();
		this.dataContext=null;
		this.prepareList();
	},

	returnFromEditCancelPressed:function(){
		this.hideSubEditor();
		this.disallowTouchForMain(false);
		this.dataContext=null;
	},

	defaultSelected:function(clicknum,touch){
		if(this.delegate.data["data"].length>0){
			this.delegate.defaultContext=clicknum;
			this._parent.addChild(DropDownList.createWithListAndPosition(this.delegate,this.delegate.destroyForDefault,["Cancel","Clear Script (Required)"],touch._point));
			return;
		}
		this.delegate.setDefault(clicknum)		
	},

	disallowTouchForMain:function(value){

	},

	warpMapBox:null,
	warpXBox:null,
	warpYBox:null,

	sayBox:null,

	questContext:null,
	objectiveContext:null,

	itemAmountBox:null,
	itemContext:null,

	skillContext:null,
	skillLevelBox:null,
	skillXPBox:null,
	skillHealthBox:null,
	skillLevelBoxUpper:null,
	skillXPBoxUpper:null,
	skillHealthBoxUpper:null,

	panelContext:null,
	visibleContext:0,

	objectContext:null,

	actionContext:null,

	inventorySpaceBox:null,

	equipContext:null,

	timeBox:null,

	showSubEditor:function(){
		this.panels["subEditorOver"].setVisible(true);
		this.panels["mainEditorOver"].setVisible(false);
		var panels = {
			"panels":{
				position:cc.p(802,0),
				children:{}
			}
		};
		var data = this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"];
		switch(this.subEditorType){
			case "Warp Player":
				panels["panels"].children={
					"mapNumberLabel":{
						label:"Map ID",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"mapNumberText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,340),
						size:cc.size(100,32),
					},
					"mapXLabel":{
						label:"Map X",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,310),
					},
					"mapXText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,276),
						size:cc.size(80,32),
					},
					"mapYLabel":{
						label:"Map Y",
						anchorPoint:cc.p(0,0),
						position:cc.p(100,310),
					},
					"mapYText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(100,276),
						size:cc.size(80,32),
					},
				}
			break;
			case "Talk": case "Read Item":
				panels["panels"].children={
					"sayLabel":{
						label:"Say:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"sayText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,50),
						size:cc.size(174,322),
					},
				}
			break;
			case "Is Quest Point": case "Set Quest Point":
				panels["panels"].children={
					"questLabel":{
						label:"Quest:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"questList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
					"objectiveLabel":{
						label:"Objective:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,189),
					},
					"objectiveList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,50),
						size:cc.size(154,135),
					},
				}
			break;
			case "Give /Take Item": case "Has Player Item":
			panels["panels"].children={
					"itemsLabel":{
						label:"Item:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"itemList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
					"amountLabel":{
						label:"Amount:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,189),
					},
					"amountText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,153),
						size:cc.size(154,32),
					},
					"amountNote":{
						label:this.subEditorType=="Has Player Item"?"":"Use negative item amounts to take away. Use positive amounts to give.",
						anchorPoint:cc.p(0,1),
						position:cc.p(12,145),
					},
				};
			break;
			case "Modify Player Stats": case "Modify NPC Stats":
				panels["panels"].children={
					"skillsLabel":{
						label:"Skill:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"skillList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
					"levelLabel":{
						label:"Level Modify",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,205),
					},
					"levelText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,169),
						size:cc.size(154,32),
					},
					"expLabel":{
						label:"XP Modify: (% allowed)",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,145),
					},
					"expText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,109),
						size:cc.size(154,32),
					},
					"healthLabel":{
						label:"Health Modify: (% allowed)",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,85),
					},
					"healthText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,49),
						size:cc.size(154,32),
					},
				};
			break;
			case "Is Panel Visbility": case "Open/Close Panel":
				panels["panels"].children={
					"panelsLabel":{
						label:"Panel:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"panelList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
					"visibleLabel":{
						label:"Visibility:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,205),
					},
					"visibleButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,169),
						size:cc.size(154,32),
						children:{
							"content":{
								position:cc.p(77,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Invisible",
								color:cc.c3b(0,0,0),
							}
						}
					},
				};
			break;
			case "Is Event Fired By":
				panels["panels"].children={
					"objectLabel":{
						label:"Possible Types:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"objectList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
				};
			break;
			case "Is NPC Actioning":
				panels["panels"].children={
					"actionLabel":{
						label:"Actions:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"actionList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
				};
			break;
			case "Is Player Inventory Space":
				panels["panels"].children={
					"spaceLabel":{
						label:"Inventory Space",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"spaceText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,340),
						size:cc.size(100,32),
					},
				};
			break;
			case "Wait":
				panels["panels"].children={
					"timeLabel":{
						label:"Time (Seconds)",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"timeText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,340),
						size:cc.size(100,32),
					},
				};
			break;
			case "Repeat Responses":
				panels["panels"].children={
					"amountLabel":{
						label:"Repeat Amount",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"amountText":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,340),
						size:cc.size(100,32),
					},
					"amountNote":{
						label:"Use 0 for infinite amount of repeats.",
						anchorPoint:cc.p(0,1),
						position:cc.p(12,300),
					},
				};
			break;
			case "Is Player Statistics": case "Is NPC Statistics":
				panels["panels"].children={
					"skillsLabel":{
						label:"Skill:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"skillList":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,230),
						size:cc.size(154,135),
					},
					"levelLabel":{
						label:"Level Range",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,205),
					},
					"levelDash":{
						label:"-",
						anchorPoint:cc.p(0,0),
						position:cc.p(91,174),
					},
					"levelTextLower":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,169),
						size:cc.size(75,32),
					},
					"levelTextUpper":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(100,169),
						size:cc.size(75,32),
					},
					"expLabel":{
						label:"XP Range: (% allowed)",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,145),
					},
					"expDash":{
						label:"-",
						anchorPoint:cc.p(0,0),
						position:cc.p(91,114),
					},
					"expTextLower":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,109),
						size:cc.size(75,32),
					},
					"expTextUpper":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(100,109),
						size:cc.size(75,32),
					},

					"healthLabel":{
						label:"Health Range: (% allowed)",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,85),
					},
					"healthDash":{
						label:"-",
						anchorPoint:cc.p(0,0),
						position:cc.p(91,54),
					},
					"healthTextLower":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(12,49),
						size:cc.size(75,32),
					},
					"healthTextUpper":{
						bg:cc.c4b(255,255,255,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(100,49),
						size:cc.size(75,32),
					},
				};
			break;
			case "Equip Item":
				panels["panels"].children={
					"equipLabel":{
						label:"Equips To:",
						anchorPoint:cc.p(0,0),
						position:cc.p(12,374),
					},
					"headButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(69,320),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Head",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"bodyButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(69,280),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Body",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"legButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(69,240),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Legs",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"feetButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(69,200),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Feet",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"lArmButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(10,280),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "L Arm",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"rArmButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(128,280),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "R Arm",
								color:cc.c3b(0,0,0),
							}
						}
					},
					"modButton":{
						bg:cc.c4b(255,0,0,255),
						anchorPoint:cc.p(0,0),
						position:cc.p(10,160),
						size:cc.size(55,32),
						children:{
							"content":{
								position:cc.p(28,16),
								anchorPoint:cc.p(0.5,0.5),
								label: "Mod",
								color:cc.c3b(0,0,0),
							}
						}
					},
				};
			break;
		}

		panels["panels"].children["okbtn"]={
			position:cc.p(62,8),
			size:cc.size(32,32),
			texture:"GUI/tick_icon.png",
			anchorPoint:cc.p(0,0),
		};
		panels["panels"].children["cancelbtn"]={
			position:cc.p(106,8),
			size:cc.size(32,32),
			texture:"GUI/cross_icon.png",
			anchorPoint:cc.p(0,0),
		};
		this.subEditor = requestLayout(panels,true);
		this.panels.addChild(this.subEditor);
		

		switch(this.subEditorType){
			case "Warp Player":
				var x=1, y=1;
				if(data["index"]){
					x=data["index"] % gridWidth;
					y=(Math.floor(data["index"]/gridWidth));
				} 
				this.warpMapBox = new EntryBox(this.subEditor["mapNumberText"],cc.size(this.subEditor["mapNumberText"].getContentSize().width,this.subEditor["mapNumberText"].getContentSize().height), cc.p(0,this.subEditor["mapNumberText"].getContentSize().height), data["mapnum"]!=null && data["mapnum"]!=='undefined' ?  data["mapnum"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.warpMapBox.setDefaultFineFlag(true);
				this.warpXBox = new EntryBox(this.subEditor["mapXText"],cc.size(this.subEditor["mapXText"].getContentSize().width,this.subEditor["mapXText"].getContentSize().height), cc.p(0,this.subEditor["mapXText"].getContentSize().height), x, cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.warpXBox.setDefaultFineFlag(true);
				this.warpYBox = new EntryBox(this.subEditor["mapYText"],cc.size(this.subEditor["mapYText"].getContentSize().width,this.subEditor["mapYText"].getContentSize().height), cc.p(0,this.subEditor["mapYText"].getContentSize().height), y, cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.warpYBox.setDefaultFineFlag(true);
			break;
			case "Talk": case "Read Item":
				this.sayBox = new EntryBox(this.subEditor["sayText"],cc.size(this.subEditor["sayText"].getContentSize().width,this.subEditor["sayText"].getContentSize().height), cc.p(0,this.subEditor["sayText"].getContentSize().height), data["say"] ?  data["say"] : "<Enter text>", cc.c4b(255,255,255), cc.c3b(0,0,0),true);
				this.sayBox.setDefaultFineFlag(true);
				this.sayBox.setNullAllowed(false);
			break;
			case "Is Quest Point": case "Set Quest Point":
				var listnodes = [];
				var callBackList=[];
				var questList = ObjectLists.getQuestList();
				for(var i=0;i<questList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(questList[i]["name"],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["questList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["questList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["questList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["questList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["questList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["questList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						if(self.subEditor["objectiveList"].listView){
							self.subEditor["objectiveList"].listView.removeFromParent();
						}
						this.listView.highlightNode(listelement);
						self.questContext=listelement;
						var sublistnodes = [];
						var subcallBackList=[];
						var tc = cc.TextureCache.getInstance();
						var objectiveList = ObjectLists.getQuestList()[listelement]["objectiveList"];
						for(var i=0;i<objectiveList.length;i++){
							sublistnodes[i]=cc.Node.create();
							var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);
							element.setPosition(cc.p(0,0));						
							var text = cc.LabelTTF.create(objectiveList[i],"Arial",15);
							text.setColor(cc.c3b(0,0,0));
							text.setAnchorPoint(cc.p(0,0));
							text.setPosition(cc.p(4,4));
							text.setDimensions(cc.size(126,0));
							var useElement=cc.Sprite.createWithTexture(tc.addImage("GUI/use.png"));
							useElement.setPosition(cc.p(130,0));
							useElement.setAnchorPoint(cc.p(0,0));
							useElement.callBack="Use";
							subcallBackList.push([useElement]);
							sublistnodes[i].setContentSize(126,text.getContentSize().height+8);
							useElement.setPositionY(((text.getContentSize().height+8)/2)-10);

							var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
							sublistnodes[i].addChild(highlightNode);
							sublistnodes[i].highlightNode=highlightNode;
							sublistnodes[i].addChild(element);
							sublistnodes[i].addChild(text);
							sublistnodes[i].addChild(useElement);

						}
						self.subEditor["objectiveList"].getListSize = function(){
							var height =0;
							for(var i=0;i<sublistnodes.length;i++){
								height+=sublistnodes[i].getContentSize().height;
							}
							return cc.size(154,height);
						};
						self.subEditor["objectiveList"].getListElementAmount=function(){
							return sublistnodes.length;
						};
						self.subEditor["objectiveList"].getHighlightNode = function(elementID){
							return sublistnodes[elementID].highlightNode;
						};
						self.subEditor["objectiveList"].getSizeForElement=function(elementID){
							return sublistnodes[elementID].getContentSize();
						};
						self.subEditor["objectiveList"].getListNodeForIndex=function(elementID){
							return sublistnodes[elementID];
						};
						self.subEditor["objectiveList"].runListCallBack=function(name,listelement,touch){
							this.listView.highlightNode(listelement);
							self.objectiveContext=listelement;
						};
						self.subEditor["objectiveList"].listView = ListView.create(self.subEditor["objectiveList"]);
						self.subEditor["objectiveList"].listView.setCallBackList(subcallBackList);
						self.subEditor["objectiveList"].addChild(self.subEditor["objectiveList"].listView);
					}
				};
				this.subEditor["questList"].listView = ListView.create(this.subEditor["questList"]);
				this.subEditor["questList"].listView.setCallBackList(callBackList);
				this.subEditor["questList"].addChild(this.subEditor["questList"].listView);

				if(data["quest"]!=null && data["quest"]!=='undefined'){
					this.subEditor["questList"].runListCallBack("Use",data["quest"]);
					if(data["objective"]!=null && data["objective"]!=='undefined'){
						this.subEditor["objectiveList"].runListCallBack("Use",data["objective"]);
					}
				}
			break;
			case "Give /Take Item": case "Has Player Item":
				this.subEditor["amountNote"].setDimensions(cc.size(180,0));
				var listnodes = [];
				var callBackList=[];
				var itemList = ObjectLists.getItemList();
				for(var i=0;i<itemList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(itemList[i]["name"],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["itemList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["itemList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["itemList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["itemList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["itemList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["itemList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						this.listView.highlightNode(listelement);
						self.itemContext=listelement;
					}
				};
				this.subEditor["itemList"].listView = ListView.create(this.subEditor["itemList"]);
				this.subEditor["itemList"].listView.setCallBackList(callBackList);
				this.subEditor["itemList"].addChild(this.subEditor["itemList"].listView);
				if(data["item"]!=null && data["item"]!=='undefined'){
					this.subEditor["itemList"].runListCallBack("Use",data["item"]);
				}
				this.itemAmountBox = new EntryBox(this.subEditor["amountText"],cc.size(this.subEditor["amountText"].getContentSize().width,this.subEditor["amountText"].getContentSize().height), cc.p(0,this.subEditor["amountText"].getContentSize().height), data["amount"] ?  data["amount"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.itemAmountBox.setDefaultFineFlag(true);
				this.itemAmountBox.setNullAllowed(false);
			break;
			case "Modify Player Stats": case "Modify NPC Stats":
				var listnodes = [];
				var callBackList=[];
				var skillList = ObjectLists.getSkillsList();
				for(var i=0;i<skillList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(skillList[i]["name"],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["skillList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["skillList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["skillList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["skillList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["skillList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["skillList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						this.listView.highlightNode(listelement);
						self.skillContext=listelement;
					}
				};
				this.subEditor["skillList"].listView = ListView.create(this.subEditor["skillList"]);
				this.subEditor["skillList"].listView.setCallBackList(callBackList);
				this.subEditor["skillList"].addChild(this.subEditor["skillList"].listView);
				if(data["skill"]!=null && data["skill"]!=='undefined'){
					this.subEditor["skillList"].runListCallBack("Use",data["skill"]);
				}
				this.skillLevelBox = new EntryBox(this.subEditor["levelText"],cc.size(this.subEditor["levelText"].getContentSize().width,this.subEditor["levelText"].getContentSize().height), cc.p(0,this.subEditor["levelText"].getContentSize().height), data["level"] ?  data["level"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillLevelBox.setDefaultFineFlag(true);
				this.skillLevelBox.setNullAllowed(false);

				this.skillXPBox = new EntryBox(this.subEditor["expText"],cc.size(this.subEditor["expText"].getContentSize().width,this.subEditor["expText"].getContentSize().height), cc.p(0,this.subEditor["expText"].getContentSize().height), data["xp"] ?  data["xp"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillXPBox.setDefaultFineFlag(true);
				this.skillXPBox.setNullAllowed(false);

				this.skillHealthBox = new EntryBox(this.subEditor["healthText"],cc.size(this.subEditor["healthText"].getContentSize().width,this.subEditor["healthText"].getContentSize().height), cc.p(0,this.subEditor["healthText"].getContentSize().height), data["health"] ?  data["health"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillHealthBox.setDefaultFineFlag(true);
				this.skillHealthBox.setNullAllowed(false);
			break;
			case "Is Panel Visbility": case "Open/Close Panel":
					var listnodes = [];
					var callBackList=[];
					var panelList = ["Inventory","Equipment","Skills","QuestLog"]
					for(var i=0;i<panelList.length;i++){
						listnodes[i]=cc.Node.create();
						var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
						var text = cc.LabelTTF.create(panelList[i],"Arial",15);
						text.setColor(cc.c3b(0,0,0));
						text.setAnchorPoint(cc.p(0,0));
						text.setPosition(cc.p(4,4));
						text.setDimensions(cc.size(126,0));
						var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
						useElement.setPosition(cc.p(130,0));
						useElement.setAnchorPoint(cc.p(0,0));
						useElement.callBack="Use";
						listnodes[i].setContentSize(154,text.getContentSize().height+8);
						useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
						callBackList.push([useElement]);

						var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
						listnodes[i].addChild(highlightNode);
						listnodes[i].highlightNode=highlightNode;
						listnodes[i].addChild(element);
						listnodes[i].addChild(text);
						listnodes[i].addChild(useElement);
					}
					var self=this;
					this.subEditor["panelList"].getListSize = function(){
						var height =0;
						for(var i=0;i<listnodes.length;i++){
							height+=listnodes[i].getContentSize().height;
						}
						return cc.size(154,height);
					};
					this.subEditor["panelList"].getListElementAmount=function(){
						return listnodes.length;
					};
					this.subEditor["panelList"].getSizeForElement=function(elementID){
						return listnodes[elementID].getContentSize();
					};
					this.subEditor["panelList"].getListNodeForIndex=function(elementID){
						return listnodes[elementID];
					};
					this.subEditor["panelList"].getHighlightNode = function(elementID){
						return listnodes[elementID].highlightNode;
					};
					this.subEditor["panelList"].runListCallBack=function(name,listelement){
						if(name== "Use"){
							this.listView.highlightNode(listelement);
							self.panelContext=listelement;
						}
					};
					this.subEditor["panelList"].listView = ListView.create(this.subEditor["panelList"]);
					this.subEditor["panelList"].listView.setCallBackList(callBackList);
					this.subEditor["panelList"].addChild(this.subEditor["panelList"].listView);
					if(data["panel"]!=null && data["panel"]!=='undefined'){
						this.subEditor["panelList"].runListCallBack("Use",data["panel"]);
					}
					this.visibleContext = data["visible"]==1?1:0;
					if(this.visibleContext==1){
						this.subEditor["visibleButton"].setColor(cc.c4b(0,255,0,255));
						this.subEditor["visibleButton"]["content"].setString("Visible");
					}
			break;
			case "Is Event Fired By":
				var listnodes = [];
				var callBackList=[];
				var objectList = ["Player","NPC"]
				for(var i=0;i<objectList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(objectList[i],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["objectList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["objectList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["objectList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["objectList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["objectList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["objectList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						this.listView.highlightNode(listelement);
						self.objectContext=listelement;
					}
				};
				this.subEditor["objectList"].listView = ListView.create(this.subEditor["objectList"]);
				this.subEditor["objectList"].listView.setCallBackList(callBackList);
				this.subEditor["objectList"].addChild(this.subEditor["objectList"].listView);
				if(data["object"]!=null && data["object"]!=='undefined'){
					this.subEditor["objectList"].runListCallBack("Use",data["object"]);
				}
			break;
			case "Is NPC Actioning":
				var listnodes = [];
				var callBackList=[];
				var actionList = ["Attacking","Defending","Fleeing"]
				for(var i=0;i<actionList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(actionList[i],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["actionList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["actionList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["actionList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["actionList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["actionList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["actionList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						this.listView.highlightNode(listelement);
						self.actionContext=listelement;
					}
				};
				this.subEditor["actionList"].listView = ListView.create(this.subEditor["actionList"]);
				this.subEditor["actionList"].listView.setCallBackList(callBackList);
				this.subEditor["actionList"].addChild(this.subEditor["actionList"].listView);
				if(data["action"]!=null && data["action"]!=='undefined'){
					this.subEditor["actionList"].runListCallBack("Use",data["action"]);
				}
			break;
			case "Is Player Inventory Space":
				this.inventorySpaceBox = new EntryBox(this.subEditor["spaceText"],cc.size(this.subEditor["spaceText"].getContentSize().width,this.subEditor["spaceText"].getContentSize().height), cc.p(0,this.subEditor["spaceText"].getContentSize().height), data["space"]!=null&&data["space"]!=='undefined' ?  data["space"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.inventorySpaceBox.setDefaultFineFlag(true);
				this.inventorySpaceBox.setNullAllowed(false);
			break;
			case "Wait":
				this.timeBox = new EntryBox(this.subEditor["timeText"],cc.size(this.subEditor["timeText"].getContentSize().width,this.subEditor["timeText"].getContentSize().height), cc.p(0,this.subEditor["timeText"].getContentSize().height), data["time"]!=null&&data["time"]!=='undefined' ?  data["time"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.timeBox.setDefaultFineFlag(true);
				this.timeBox.setNullAllowed(false);
			break;
			case "Repeat Responses":
				this.subEditor["amountNote"].setDimensions(cc.size(180,0));
				this.repeatBox = new EntryBox(this.subEditor["amountText"],cc.size(this.subEditor["amountText"].getContentSize().width,this.subEditor["amountText"].getContentSize().height), cc.p(0,this.subEditor["amountText"].getContentSize().height), data["amount"]!=null&&data["amount"]!=='undefined' ?  data["amount"] : "1", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.repeatBox.setDefaultFineFlag(true);
				this.repeatBox.setNullAllowed(false);
			break;
			case "Is Player Statistics": case "Is NPC Statistics":
				var listnodes = [];
				var callBackList=[];
				var skillList = ObjectLists.getSkillsList();
				for(var i=0;i<skillList.length;i++){
					listnodes[i]=cc.Node.create();
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),154,1);			
					var text = cc.LabelTTF.create(skillList[i]["name"],"Arial",15);
					text.setColor(cc.c3b(0,0,0));
					text.setAnchorPoint(cc.p(0,0));
					text.setPosition(cc.p(4,4));
					text.setDimensions(cc.size(126,0));
					var useElement=cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/use.png"));
					useElement.setPosition(cc.p(130,0));
					useElement.setAnchorPoint(cc.p(0,0));
					useElement.callBack="Use";
					listnodes[i].setContentSize(154,text.getContentSize().height+8);
					useElement.setPositionY(((text.getContentSize().height+8)/2)-10);
					callBackList.push([useElement]);

					var highlightNode = cc.LayerColor.create(cc.c4b(255,255,255,255,255),154,text.getContentSize().height+8);
					listnodes[i].addChild(highlightNode);
					listnodes[i].highlightNode=highlightNode;
					listnodes[i].addChild(element);
					listnodes[i].addChild(text);
					listnodes[i].addChild(useElement);
				}
				var self=this;
				this.subEditor["skillList"].getListSize = function(){
					var height =0;
					for(var i=0;i<listnodes.length;i++){
						height+=listnodes[i].getContentSize().height;
					}
					return cc.size(154,height);
				};
				this.subEditor["skillList"].getListElementAmount=function(){
					return listnodes.length;
				};
				this.subEditor["skillList"].getSizeForElement=function(elementID){
					return listnodes[elementID].getContentSize();
				};
				this.subEditor["skillList"].getListNodeForIndex=function(elementID){
					return listnodes[elementID];
				};
				this.subEditor["skillList"].getHighlightNode = function(elementID){
					return listnodes[elementID].highlightNode;
				};
				this.subEditor["skillList"].runListCallBack=function(name,listelement){
					if(name== "Use"){
						this.listView.highlightNode(listelement);
						self.skillContext=listelement;
					}
				};
				this.subEditor["skillList"].listView = ListView.create(this.subEditor["skillList"]);
				this.subEditor["skillList"].listView.setCallBackList(callBackList);
				this.subEditor["skillList"].addChild(this.subEditor["skillList"].listView);
				if(data["skill"]!=null && data["skill"]!=='undefined'){
					this.subEditor["skillList"].runListCallBack("Use",data["skill"]);
				}
				this.skillLevelBox = new EntryBox(this.subEditor["levelTextLower"],cc.size(this.subEditor["levelTextLower"].getContentSize().width,this.subEditor["levelTextLower"].getContentSize().height), cc.p(0,this.subEditor["levelTextLower"].getContentSize().height), data["levelLower"]!=null && data["levelLower"]!=='undefined' && data["levelLower"]!="" ?  data["levelLower"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillLevelBox.setDefaultFineFlag(true);
				this.skillLevelBox.setNullAllowed(false);

				this.skillXPBox = new EntryBox(this.subEditor["expTextLower"],cc.size(this.subEditor["expTextLower"].getContentSize().width,this.subEditor["expTextLower"].getContentSize().height), cc.p(0,this.subEditor["expTextLower"].getContentSize().height), data["xpLower"]!=null && data["xpLower"]!=='undefined' && data["xpLower"]!="" ?  data["xpLower"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillXPBox.setDefaultFineFlag(true);
				this.skillXPBox.setNullAllowed(false);

				this.skillHealthBox = new EntryBox(this.subEditor["healthTextLower"],cc.size(this.subEditor["healthTextLower"].getContentSize().width,this.subEditor["healthTextLower"].getContentSize().height), cc.p(0,this.subEditor["healthTextLower"].getContentSize().height), data["healthLower"]!=null && data["healthLower"]!=='undefined' && data["healthLower"]!="" ?  data["healthLower"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillHealthBox.setDefaultFineFlag(true);
				this.skillHealthBox.setNullAllowed(false);

				this.skillLevelBoxUpper = new EntryBox(this.subEditor["levelTextUpper"],cc.size(this.subEditor["levelTextUpper"].getContentSize().width,this.subEditor["levelTextUpper"].getContentSize().height), cc.p(0,this.subEditor["levelTextUpper"].getContentSize().height), data["levelUpper"]!=null && data["levelUpper"]!=='undefined' && data["levelUpper"]!="" ?  data["levelUpper"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillLevelBoxUpper.setDefaultFineFlag(true);
				this.skillLevelBoxUpper.setNullAllowed(false);

				this.skillXPBoxUpper = new EntryBox(this.subEditor["expTextUpper"],cc.size(this.subEditor["expTextUpper"].getContentSize().width,this.subEditor["expTextUpper"].getContentSize().height), cc.p(0,this.subEditor["expTextUpper"].getContentSize().height), data["xpUpper"]!=null && data["xpUpper"]!=='undefined' && data["xpUpper"]!="" ? data["xpUpper"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillXPBoxUpper.setDefaultFineFlag(true);
				this.skillXPBoxUpper.setNullAllowed(false);

				this.skillHealthBoxUpper = new EntryBox(this.subEditor["healthTextUpper"],cc.size(this.subEditor["healthTextUpper"].getContentSize().width,this.subEditor["healthTextUpper"].getContentSize().height), cc.p(0,this.subEditor["healthTextUpper"].getContentSize().height), data["healthUpper"]!=null && data["healthUpper"]!=='undefined' && data["healthUpper"]!="" ?  data["healthUpper"] : "0", cc.c4b(255,255,255), cc.c3b(0,0,0));
				this.skillHealthBoxUpper.setDefaultFineFlag(true);
				this.skillHealthBoxUpper.setNullAllowed(false);
			break;
			case "Equip Item":
				if(data["equip"]!=null && data["equip"]!=='undefined'){
					this.equipContext="head";
					this.setEquippableTo(data["equip"]);
				}else{
					this.setEquippableTo("head");
				}
			break;
		}
	},

	hideSubEditor:function(type){
		this.panels["subEditorOver"].setVisible(false);
		this.panels["mainEditorOver"].setVisible(true);
		this.subEditorType=null;
		this.subEditor.removeFromParent();
		this.subEditor=null;
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

	setEquippableTo:function(type){
		this.subEditor["headButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["bodyButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["legButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["feetButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["lArmButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["rArmButton"].setColor(cc.c4b(255,255,255,255));
		this.subEditor["modButton"].setColor(cc.c4b(255,255,255,255));

		switch(type){
			case "head": this.equipContext=type; this.subEditor["headButton"].setColor(cc.c4b(255,0,0,255)); return;
			case "body": this.equipContext=type; this.subEditor["bodyButton"].setColor(cc.c4b(255,0,0,255)); return;
			case "legs": this.equipContext=type; this.subEditor["legButton"].setColor(cc.c4b(255,0,0,255)); return;
			case "feet": this.equipContext=type; this.subEditor["feetButton"].setColor(cc.c4b(255,0,0,255)); return;
			case "mod": this.equipContext=type; this.subEditor["modButton"].setColor(cc.c4b(255,0,0,255)); return;
			case "bothArms": this.equipContext=type; this.subEditor["lArmButton"].setColor(cc.c4b(255,0,0,255));
			this.subEditor["rArmButton"].setColor(cc.c4b(255,0,0,255)); return;
		}
		if(this.equipContext!="bothArms" && this.equipContext!="lArm" && this.equipContext!="rArm" && type=="lArm"){
			this.subEditor["lArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="lArm";
		}
		else if(this.equipContext!="bothArms" && this.equipContext!="lArm" && this.equipContext!="rArm" && type=="rArm"){
			this.subEditor["rArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="rArm";
		}
		else if(this.equipContext=="rArm" && type=="lArm"){
			this.subEditor["lArmButton"].setColor(cc.c4b(255,0,0,255));
			this.subEditor["rArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="bothArms";
		}
		else if(this.equipContext=="lArm" && type=="rArm"){
			this.subEditor["lArmButton"].setColor(cc.c4b(255,0,0,255));
			this.subEditor["rArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="bothArms";
		}
		else if(this.equipContext=="bothArms" && type=="rArm"){
			this.subEditor["lArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="lArm";
		}
		else if(this.equipContext=="bothArms" && type=="lArm"){
			this.subEditor["rArmButton"].setColor(cc.c4b(255,0,0,255));
			this.equipContext="rArm";
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
		
		
	

		if(this.subEditor){
			var truePos = this.subEditor.convertToNodeSpace(pos);
			if(isTouching(this.subEditor["okbtn"],truePos)){

				switch(this.subEditorType){
					case "Warp Player":
						var index = indexFromPos(parseInt(this.warpXBox.getText()),(gridHeight)-parseInt(this.warpYBox.getText()));
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"mapnum":parseInt(this.warpMapBox.getText()),
							"index":index,
						}
					break
					case "Talk": case "Read Item":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"say":this.sayBox.getText(),
						}
					break;
					case "Is Quest Point": case "Set Quest Point":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"quest":this.questContext,
							"objective":this.objectiveContext,
						}
					break;
					case "Give /Take Item": case "Has Player Item":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"item":this.itemContext,
							"amount":parseInt(this.itemAmountBox.getText()),
						}
					break;
					case "Modify Player Stats": case "Modify NPC Stats":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"skill":this.skillContext,
							"level":parseInt(this.skillLevelBox.getText()),
							"xp":parseInt(this.skillXPBox.getText()),
							"health":parseInt(this.skillHealthBox.getText()),
						}
					break;
					case "Is Panel Visbility": case "Open/Close Panel":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"panel":this.panelContext,
							"visible":this.visibleContext,
						}
					break;
					case "Is Event Fired By":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"object":this.objectContext,
						}
					break;
					case "Is NPC Actioning":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"action":this.actionContext,
						}
					break;
					case "Is Player Inventory Space":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"space":parseInt(this.inventorySpaceBox.getText()),
						}
					break;
					case "Wait":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"time":parseInt(this.timeBox.getText()),
						}
					break;
					case "Repeat Responses":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"amount":parseInt(this.repeatBox.getText()),
						}
					break;
					case "Is Player Statistics": case "Is NPC Statistics":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"skill":this.skillContext,
							"levelLower":parseInt(this.skillLevelBox.getText()),
							"xpLower":parseInt(this.skillXPBox.getText()),
							"healthLower":parseInt(this.skillHealthBox.getText()),
							"levelUpper":parseInt(this.skillLevelBoxUpper.getText()),
							"xpUpper":parseInt(this.skillXPBoxUpper.getText()),
							"healthUpper":parseInt(this.skillHealthBoxUpper.getText()),
						}
					break;
					case "Equip Item":
						this.data["data"][this.dataContext["event"]][this.dataContext["listtype"]][this.dataContext["id"]]["data"] = {
							"equip":this.equipContext,
						}
					break;
				}
				this.hideSubEditor();
				return true;

			}


			if (this.subEditor["headButton"] && isTouching(this.subEditor["headButton"],truePos)) {
				this.setEquippableTo("head");
				return true;
			}
			if (this.subEditor["bodyButton"] && isTouching(this.subEditor["bodyButton"],truePos)) {
				this.setEquippableTo("body");
				return true;
			}
			if (this.subEditor["legButton"] && isTouching(this.subEditor["legButton"],truePos)) {
				this.setEquippableTo("legs");
				return true;
			}
			if (this.subEditor["feetButton"] && isTouching(this.subEditor["feetButton"],truePos)) {
				this.setEquippableTo("feet");
				return true;
			}
			if (this.subEditor["lArmButton"] && isTouching(this.subEditor["lArmButton"],truePos)) {
				this.setEquippableTo("lArm");
				return true;
			}
			if (this.subEditor["rArmButton"] && isTouching(this.subEditor["rArmButton"],truePos)) {
				this.setEquippableTo("rArm");
				return true;
			}
			if (this.subEditor["modButton"] && isTouching(this.subEditor["modButton"],truePos)) {
				this.setEquippableTo("mod");
				return true;
			}

			if (this.subEditor["visibleButton"] && isTouching(this.subEditor["visibleButton"],truePos)) {
				this.visibleContext = this.visibleContext==0?1:0;
				this.subEditor["visibleButton"].setColor(this.visibleContext==0?cc.c4b(255,0,0,255):cc.c4b(0,255,0,255));
				this.subEditor["visibleButton"]["content"].setString(this.visibleContext==0?"Invisible":"Visible");
				return true;
			}

			if (isTouching(this.subEditor["cancelbtn"],truePos)) {
				this.hideSubEditor();
				return true;
			}

		} else{
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
		}
	},

	
});