QuestEditor = Scene.extend({
	data:null,
	listPanel:null,
	delegate:null,
	elementContext:null,

	getIdentifier:function(){
		return "Quest Editor";
	},
	
	getTabOptions:function(){
		return ["Objectives"];
	},

	setTab:function(){

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
				this.delegate.endedEdit(this.data);
			break;
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

	addNewElement:function(){
		this.data["objectiveList"].splice(this.data["objectiveList"].length-1,0,"Blank Objective");
		this.prepareList();
	},

	init:function(withData){
		this._super();
		this.data={"name":"", "objectiveList":["Unstarted","Initial Objective. Click edit to change this first objective. Click the '+' to add another object. You cannot delete every objective (you need at least one)","Finished"]};
		this.delegate=withData.delegate;
		if(withData && withData.data){
			this.data=withData.data;
		}
	},

	runSaveNewData:function(num){
		sendToServer("saveNewQuestMessage",{"savequests":num+"","questdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendToServer("deleteQuestMessage",{"savequestswhole":list});
	},

	didBecomeActive:function(){
		this._super();
		this.prepareList();
		this.nameBox = new EntryBox(this.panels["name_entry"],cc.size(this.panels["name_entry"].getContentSize().width,this.panels["name_entry"].getContentSize().height+4), cc.p(0,this.panels["name_entry"].getContentSize().height+4), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.nameBox.setBackgroundInvisible();
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.listView.removeFromParent();
			this.listPanel.listView=null;
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		this.defaultPositions={};
		var i;
		for(i=0;i<this.data["objectiveList"].length-1;i++){
			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(324,32);
			if(this.data["objectiveList"][i]==null){
				this.data["objectiveList"].splice(i,1);
				continue;
			}
			var element= cc.Sprite.create();
			element.setTextureRect(cc.rect(0,0,316,1));
			element.setColor(cc.c4b(0,0,0,127));
			element.setAnchorPoint(cc.p(0,0));
			element.setPosition(cc.p(4,0));			
		
			var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
			delElement.setPosition(cc.p(300,0));
			delElement.setAnchorPoint(cc.p(0,0));		

			var text = cc.LabelTTF.create(this.data["objectiveList"][i],"Arial",15);
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(246,0));
			text.setColor(cc.c3b(0,0,0));

			if(i>0){
				var extraBg = cc.LayerColor.create(cc.c4b(255,255,255,255),text.getContentSize().width,text.getContentSize().height);
				extraBg.setPosition(text.getPosition());
				listnodes[i].addChild(extraBg);

				text.callBack = "Edit";
				var touchableNodes =[];
				touchableNodes.push(text);
			}
			if(i>1){
				delElement.callBack = "Delete";
				touchableNodes.push(delElement);
			}
			callBackList.push(touchableNodes);


			listnodes[i].addChild(element);
			if(i>1){
				listnodes[i].addChild(delElement);	
			}
			listnodes[i].addChild(text);
			listnodes[i].setContentSize(324,text.getContentSize().height+8);
			delElement.setPositionY(((text.getContentSize().height+8)/2)-10);
		}

		var addButton = cc.Sprite.create();
		addButton.setTextureRect(cc.rect(0,0,90,26));
		addButton.setColor(cc.c4b(70,200,70,255));
		addButton.setAnchorPoint(cc.p(0,0));
		var plus = cc.LabelTTF.create("+","Arial",20);
		plus.setPosition(45,13);
		plus.setAnchorPoint(cc.p(0.5,0.5));
		addButton.setPosition(cc.p(120,0));
		addButton.callBack="Add";
		addButton.addChild(plus);
		callBackList.push([addButton]);
		listnodes.push(addButton);

		listnodes[i+1]=cc.Node.create();
		listnodes[i+1].setContentSize(324,32);
		var element= cc.Sprite.create();
		element.setTextureRect(cc.rect(0,0,316,1));
		element.setColor(cc.c4b(0,0,0,127));
		element.setAnchorPoint(cc.p(0,0));
		element.setPosition(cc.p(4,0));		;
		var text = cc.LabelTTF.create(this.data["objectiveList"][i],"Arial",15);
		text.setAnchorPoint(cc.p(0,0));
		text.setPosition(cc.p(4,4));
		text.setDimensions(cc.size(246,0));
		text.setColor(cc.c3b(0,0,0));
		callBackList.push([]);
		listnodes[i+1].addChild(element);
		listnodes[i+1].addChild(text);
		listnodes[i+1].setContentSize(324,text.getContentSize().height+8);
		delElement.setPositionY(((text.getContentSize().height+8)/2)-10);

		delete i;

		this.listPanel = this.panels["list"];
		var self=this;
		this.listPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(showingEditor-20,height);
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
		this.listPanel.runListCallBack=function(name,listelement,touch,object){
			console.log(name);
			switch(name){
				case "Delete":
					MainScene.addChild(DropDownList.createWithListAndPosition(self,self.deleteClicked,["Cancel","Delete"],touch._point));
					self.elementContext =listelement;
				break;
				case "Edit":
					self.elementContext =listelement;
					self.resetValueBoxWithObject(object);
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


	resetValueBoxWithObject:function(object){
		if(this.editBox){
			this.confirmEditBox();
		}
		this.editBox = new EntryBox(object,cc.size(object.getContentSize().width,object.getContentSize().height+4), cc.p(-4,object.getContentSize().height+4),this.data["objectiveList"][this.elementContext], cc.c4b(255,255,255), cc.c3b(0,0,0),true,null,this);
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
		this.data["objectiveList"][this.elementContext]=this.editBox.getText();
		this.editBox.setFocused(false);
		this.editBox.removeFromParent();
		this.editBox=null;
		this.prepareList();
	},
	
	getLayoutObject:function(){
			return { 
			"panels":{
				children:{	
					"name_lbl":{
						label:"Name:",
						fontSize:12,
						anchorPoint:cc.p(0,0),
						position: cc.p(4,screenSize.height-44),
					},
					"name_entry":{
						position:cc.p(74,screenSize.height-44),
						size:cc.size(290,16),
						anchorPoint:cc.p(0,0),
						color:cc.c3b(180,180,180)
					},	
					"objectivesLabel":{
						label:"Objectives:",
						position:cc.p(4,screenSize.height-70),
						anchorPoint:cc.p(0,0),
					},
					"list":{
						size:cc.size(showingEditor-20,screenSize.height-74),
						color:cc.c3b(180,180,180),
						position:cc.p(2,0),
						anchorPoint:cc.p(0,0),
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
});