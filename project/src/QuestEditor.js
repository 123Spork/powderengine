Questeditor=null,
QuestEditor = Popup.extend({
	data:null,
	listPanel:null,
	delegate:null,
	elementContext:null,

	getIdentifier:function(){
		return "Quest Editor";
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
		this.data={"name":"", "objectiveList":["Initial Objective. Click edit to change this first objective. Click the '+' to add another object. You cannot delete every objective (you need at least one)"]};
		this.delegate=withData.delegate;
		if(withData && withData.data){
			this.data=withData.data;
		}
	},

	runSaveNewData:function(num){
		sendMessageToServer({"savequests":num+"","questdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savequestswhole":list});
	},

	didBecomeActive:function(){
		this._super();
		this.prepareList();
		this.nameBox = new EntryBox(this.panels["main_panel"]["nameBox"],cc.size(this.panels["main_panel"]["nameBox"].getContentSize().width,this.panels["main_panel"]["nameBox"].getContentSize().height), cc.p(0,this.panels["main_panel"]["nameBox"].getContentSize().height), this.data["name"]?this.data["name"]:"", cc.c4b(255,255,255,255), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		this.defaultPositions={};
		for(var i in this.data["objectiveList"]){
			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(324,32);
			if(this.data["objectiveList"][i]==null){
				this.data["objectiveList"].splice(i,1);
				continue;
			}
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
			element.setPosition(cc.p(4,0));			

			var editElement=cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
			editElement.setPosition(cc.p(272,0));
			editElement.setAnchorPoint(cc.p(0,0));
		
			var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
			delElement.setPosition(cc.p(300,0));
			delElement.setAnchorPoint(cc.p(0,0));		

			var text = cc.LabelTTF.create(this.data["objectiveList"][i],"Arial",15);
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(246,0));
			text.setColor(cc.c3b(0,0,0));


			editElement.callBack = "Edit";
			var touchableNodes =[];
			touchableNodes.push(editElement);
			if(i!=0){
				delElement.callBack = "Delete";
				touchableNodes.push(delElement);
			}
			callBackList.push(touchableNodes);


			listnodes[i].addChild(element);
			listnodes[i].addChild(editElement);
			if(i!=0){
				listnodes[i].addChild(delElement);	
			}
			listnodes[i].addChild(text);
			listnodes[i].setContentSize(324,text.getContentSize().height+8);
			editElement.setPositionY(((text.getContentSize().height+8)/2)-10);
			delElement.setPositionY(((text.getContentSize().height+8)/2)-10);
		}

		var addButton = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
		var plus = cc.LabelTTF.create("+","Arial",20);
		plus.setPosition(45,13);
		plus.setAnchorPoint(cc.p(0.5,0.5));
		addButton.setPosition(cc.p(120,0));
		addButton.callBack="Add";
		addButton.addChild(plus);
		callBackList.push([addButton]);
		listnodes.push(addButton);

		this.listPanel = this.panels["main_panel"]["list"];
		var self=this;
		this.listPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(324,height);
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
			if(self.showingEditor==true){
				return;
			}
			switch(name){
				case "Delete":
					if(self.editBox!=null){
						self.editBox.removeAllChildren();
						self.entryBox=null;
						self.editBox.removeFromParent();
						self.editBox=null;
						self.elementContext =null;
					}
					self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteClicked,["Cancel","Delete"],touch._point));
					self.elementContext =listelement;
				break;
				case "Edit":
					self.elementContext =listelement;
					self.editElement(listelement);
				break;
				case "Add":
					self.addNewElement()
				break;
			}
		};
		this.listPanel.listView = ListView.create(this.listPanel);
		this.listPanel.listView.setCallBackList(callBackList);
		this.listPanel.addChild(this.listPanel.listView);
	},

	
	getLayoutObject:function(){
			return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"background_image":{
						texture:"GUI/list_panel.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(365,328),
						children: {
							"nameLabel":{
								label:"Quest Name",
								color:cc.c3b(0,0,0),
								position:cc.p(8,312),
								anchorPoint:cc.p(0,0),
							},
							"nameBox":{
								size:cc.size(150,32),
								bg:cc.c4b(255,255,255,255),
								position:cc.p(8,277),
								anchorPoint:cc.p(0,0),
							},
							"savebtn":{
								size:cc.size(64,32),
								bg:cc.c4b(0,255,0,255),
								position:cc.p(175,277),
								anchorPoint:cc.p(0,0),
								children:{
									"content":{
										label:"Save",
										color:cc.c3b(0,0,0),
										position:cc.p(32,16),
										anchorPoint:cc.p(0.5,0.5),
									}
								}
							},

							"exitbtn":{
								size:cc.size(64,32),
								bg:cc.c4b(255,0,0,255),
								position:cc.p(253,277),
								anchorPoint:cc.p(0,0),
								children:{
									"content":{
										label:"Exit",
										color:cc.c3b(0,0,0),
										position:cc.p(32,16),
										anchorPoint:cc.p(0.5,0.5),
									}
								}
							},

							"objectivesLabel":{
								label:"Objectives",
								color:cc.c3b(0,0,0),
								position:cc.p(8,254),
								anchorPoint:cc.p(0,0),
							},
							"list":{
								size:cc.size(324,250),
								bg:cc.c4b(0,200,200,200),
								position:cc.p(0,0),
								anchorPoint:cc.p(0,0),
							},
						},
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,328),
						size: cc.size(365,32),
						children:{	
							"header":{
								label:"Quest Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(337,6),
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

	deleteClicked:function(clicknum){

		switch(clicknum){
			case 1:
				if(this.delegate.elementContext){
					this.delegate.data["objectiveList"].splice(this.delegate.elementContext,1);
					this.delegate.prepareList();
					this.delegate.elementContext=null;
				}
			break;
		}
	},

	addNewElement:function(){
		this.data["objectiveList"].push("Blank Objective");
		this.prepareList();
	},

	entryBox:null,
	editBox:null,

	editElement:function(elementNum){
		if(this.editBox!=null){
			this.editBox.removeAllChildren();
			this.entryBox=null;
			this.editBox.removeFromParent();
			this.editBox=null;
			this.elementContext =null;
		}
		this.editBox = cc.LayerColor.create(cc.c4b(255,255,255,200),200,200);
		this.editBox.setPosition(cc.p((this.panels["main_panel"].getContentSize().width-200)/2,((this.panels["main_panel"].getContentSize().height-200)/2)));
		this.entryBox = new EntryBox(this.editBox,cc.size(190,150), cc.p(0,this.editBox.getContentSize().height), this.data["objectiveList"][elementNum], cc.c4b(100,100,100), cc.c3b(255,255,255),true);
		this.entryBox.setDefaultFineFlag(true);
		this.entryBox.setDontClear(true);
		var okButton = cc.LayerColor.create(cc.c4b(0,200,255,255),64,32);
		okButton.setPosition(cc.p(14,9))
		var okLabel = cc.LabelTTF.create("OK","Arial",16);
		okLabel.setColor(cc.c3b(0,0,0));
		okLabel.setPosition(32,16);
		okLabel.setAnchorPoint(cc.p(0.5,0.5));
		okButton.addChild(okLabel);
		var cancelButton = cc.LayerColor.create(cc.c4b(200,0,0,255),64,32);
		cancelButton.setPosition(cc.p(120,9))
		var cancelLabel = cc.LabelTTF.create("Cancel","Arial",16);
		cancelLabel.setColor(cc.c3b(0,0,0));
		cancelLabel.setPosition(32,16);
		cancelLabel.setAnchorPoint(cc.p(0.5,0.5));
		cancelButton.addChild(cancelLabel);
		this.panels["main_panel"].addChild(this.editBox);
		this.editBox.addChild(okButton);
		this.editBox.ok = okButton;
		this.editBox.addChild(cancelButton);
		this.editBox.cancel = cancelButton;
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
	
		this.prevMovPos=null;
		var pos = touch._point;
		if(this.editBox!=null){
			var truePos = this.editBox.convertToNodeSpace(pos);
			if(isTouching(this.editBox.ok,truePos)){
				var newString = this.entryBox.getText();
				this.data["objectiveList"][this.elementContext] = newString;
				this.editBox.removeAllChildren();
				this.entryBox=null;
				this.editBox.removeFromParent();
				this.editBox=null;
				this.elementContext =null;
				this.prepareList();
				return true;
			}
			if(isTouching(this.editBox.cancel,truePos)){
				this.editBox.removeAllChildren();
				this.entryBox=null;
				this.editBox.removeFromParent();
				this.editBox=null;
				this.elementContext =null;
				return true;
			}
			return true;
		} else{
			var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
			if(isTouching(this.panels["main_panel"]["savebtn"],truePos)){
				if(this.nameBox.getText()==null || this.nameBox.getText()==""){
					return true;
				}
				this.ignoreTerminate=true;
				this.data["name"]=this.nameBox.getText();
				this.delegate.endedEdit(this.data);
				return true;
			}
			
			if(isTouching(this.panels["main_panel"]["exitbtn"],truePos)){
				this.ignoreTerminate=true; var self= this.delegate;
				this.delegate.scheduleOnce(function(){self.endedEdit(null)});
				return true;
			}

			if(isTouching(this.panels["main_panel"],truePos)){
				return true;
			}
		}
		return false;
	},

	
});