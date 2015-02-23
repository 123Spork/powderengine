ScriptingList = Scene.extend({
	childEditor:null,
	editList:[],
	listName:null,
	inEditor:false,
	saveNewDataID:-1,
	selectorlistPanel:null,
	scriptlistPanel:null,
	hasChosen:false,
	selectedScriptType:null,

	getTabOptions:function(clicknum){
		if(this.inEditor){
			return this.childEditor.getTabOptions(clicknum);
		}
		return ["List"];
	},

	willExitEditor:function(clicknum){
		if(this.inEditor){
			this.childEditor.willExitEditor(clicknum);
			return false;
		}
		return clicknum==1?true:false;
	},

	getCloseOptions:function(clicknum){
		if(this.inEditor){
			return this.childEditor.getCloseOptions(clicknum);
		}
		return ["Cancel","Exit"];
	},

	init:function(withData){
		this._super();
		this.childEditor=null;
		this.editList=[],
		this.listName=null;
		this.inEditor=false;
		this.saveNewDataID=-1;
		this.childEditor=withData.editor;
		if(withData.list){
			this.editList=withData.list;
		}
		this.listName=withData.name;
	},



	didBecomeActive:function(){
		this._super();
		//this.panels.setVisible(false);
		this.selectedScriptType=0;
		this.prepareDefaultList();
		this.prepareSubList(0);
	},


	prepareDefaultList:function(){
		if(this.defaultlistPanel){
			this.defaultlistPanel.listView.removeFromParent();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var list = ["Default Scripts","NPC Scripts","Item Scripts","Tile Scripts"]
		for(var i in list){
			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(100,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),100,1);
			element.setPosition(cc.p(0,0));			

			var text = cc.LabelTTF.create(list[i],"Arial",12);
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(100,0));
			listnodes[i].setContentSize(100,text.getContentSize().height+8);
			if(this.selectedScriptType!=null && this.selectedScriptType==i){
				listnodes[i]=cc.LayerColor.create(cc.c4b(100,0,0,255),100,text.getContentSize().height+8);
				text.setColor(cc.c3b(255,255,255));
			}
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
		}
		this.defaultlistPanel = this.panels["mainlist"];
		var self=this;
		this.defaultlistPanel.getListSize = function(){
			return cc.size(100,32*listnodes.length);
		};
		this.defaultlistPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.defaultlistPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.defaultlistPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.defaultlistPanel.runListCallBack=function(name,listelement,touch){
			if(self.inEditor==true){
				return;
			}
			switch(name){
				case "Use":
					self.selectedScriptType=listelement;
					self.prepareSubList(listelement);
					self.prepareDefaultList();
				break;
			}
		};
		this.defaultlistPanel.listView = ListView.create(this.defaultlistPanel);
		this.defaultlistPanel.listView.setCallBackList(callBackList);
		this.defaultlistPanel.addChild(this.defaultlistPanel.listView);
	},

	prepareSubList:function(index){
		var currentSpecifier="";
		switch(index){
			case 0:currentSpecifier="Default"; break;
			case 1:currentSpecifier="NPC"; break;
			case 2:currentSpecifier="Item"; break;
			case 3:currentSpecifier="Tile"; break;
		}

		if(this.scriptlistPanel){
			this.scriptlistPanel.listView.removeFromParent();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		for(var i=0,j=0;i<this.editList.length;i++){
			listnodes[i]=cc.Node.create();
			if(this.editList[i]!={} &&this.editList[i]["specifier"]==currentSpecifier){			
				listnodes[i].setContentSize(showingEditor-120,32);
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),showingEditor-120,1);
				element.setPosition(cc.p(0,0));			
				var text = cc.LabelTTF.create(this.editList[i].name,"Arial",12);
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,4));

				text.setDimensions(cc.size(208,0));
				listnodes[i].setContentSize(showingEditor-120,text.getContentSize().height+8);
				var touchableNodes =[];
				if(currentSpecifier!="Default"){
					var editElement=cc.Node.create();
					editElement.setContentSize(text.getContentSize());
					editElement.setPosition(text.getPosition());					
					editElement.callBack="Edit";
					listnodes[i].addChild(editElement);
					touchableNodes.push(editElement);			
					var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
					delElement.setPosition(cc.p(showingEditor-172,(listnodes[i].getContentSize().height-20)/2));
					delElement.setAnchorPoint(cc.p(0,0));		
					delElement.callBack = "Delete";

					touchableNodes.push(delElement);
					listnodes[i].addChild(delElement);	
				}
				var copyElement=cc.Sprite.createWithTexture(tc.addImage("GUI/copy.png"));
				copyElement.setPosition(cc.p(showingEditor-144,(listnodes[i].getContentSize().height-20)/2));
				copyElement.setAnchorPoint(cc.p(0,0));
				copyElement.callBack="Copy";
				touchableNodes.push(copyElement);
				listnodes[i].addChild(copyElement);

				callBackList.push(touchableNodes);

				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
			} else{
				listnodes[i].setContentSize(cc.size(0,0));
				callBackList.push([]);
			}
		}
		if(currentSpecifier!="Default"){
			var addButton = cc.LayerColor.create(cc.c4b(70,200,70,255),90,26);
			var plus = cc.LabelTTF.create("+","Arial",20);
			plus.setPosition(45,13);
			plus.setAnchorPoint(cc.p(0.5,0.5));
			addButton.setPosition(cc.p(Math.floor((showingEditor-90)/2),0));
			addButton.callBack="Add";
			addButton.addChild(plus);
			callBackList.push([addButton]);
			listnodes.push(addButton);
		}

		this.scriptlistPanel = this.panels["sublist"];
		var self=this;
		this.scriptlistPanel.getListSize = function(){
			var height=0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(showingEditor-120,height);
		};
		this.scriptlistPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.scriptlistPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.scriptlistPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.scriptlistPanel.runListCallBack=function(name,listelement,touch){
			var pos = touch._point;
			var truePos = self.convertToNodeSpace(pos);
			if(self.inEditor==true){
				return;
			}
			switch(name){
				case "Delete":
					MainScene.addChild(DropDownList.createWithListAndPosition(self,self.deleteClicked,["Cancel","Delete"],touch._point));
					self.elementContext =listelement;
				break;
				case "Edit":
					if(self.childEditor._parent){
						self.childEditor.removeFromParent();
					}
					self.inEditor=true;
					self.childEditor.init({delegate:self, data:self.editList[listelement]});
					self.panels["child"].addChild(self.childEditor);
					self.panels["child"].setVisible(true);
					self.setTouchEnabled(false);
					self.childEditor.didBecomeActive();
					self.saveNewDataID=listelement+"";
				break;
				case "Add":
					self.addingNew=true;
					self.inEditor=true;
					self.saveNewDataID=self.editList.length+"";
					self.childEditor.init({delegate:self, data:null, scriptDelegate:currentSpecifier});
					self.setTouchEnabled(false);
					self.panels["child"].addChild(self.childEditor);
					self.panels["child"].setVisible(true);
					self.childEditor.didBecomeActive();
				break;
				case "Use":
					self.delegate.setTypeData(listelement,self.editList[listelement]);
					self.hasChosen=true;
				break;
				case "Copy":
					self.copyScript(listelement);
				break;
			}
		};
		this.scriptlistPanel.listView = ListView.create(this.scriptlistPanel);
		this.scriptlistPanel.listView.setCallBackList(callBackList);
		this.scriptlistPanel.addChild(this.scriptlistPanel.listView);
	},

	getLayoutObject:function(){
			return { 
			"panels":{
				children:{	
					"line":{
						size:cc.size(1,screenSize.height-20),
						color:cc.c3b(255,255,255),
						position:cc.p(102,0),
					},
					"mainlist":{
						size:cc.size(100,screenSize.height-20),
						position:cc.p(2,0),
						color:cc.c3b(100,100,100),
						anchorPoint:cc.p(0,0),
					},
					"sublist":{
						size:cc.size(showingEditor-120,screenSize.height-20),
						position:cc.p(103,0),
						anchorPoint:cc.p(0,0),
					},
					"child":{
						visible:false,
						position:cc.p(0,0),
						size:cc.size(showingEditor-20,screenSize.height-20),
						anchorPoint:cc.p(0,0),
						color:cc.c3b(80,80,80),
					}
				},
			}
		};
	},

	elementContext:null,

	deleteClicked:function(clicknum){
		switch(clicknum){
			case 1:
				if(this.delegate.elementContext!=null){
					this.delegate.deleteElement(this.delegate.elementContext);
					this.delegate.elementContext=null;
				}
			break;
		}
	},

	endedEdit:function(addData){
		if(addData){
			this.childEditor.runSaveNewData(this.saveNewDataID);
			if(this.addingNew){
				this.editList.push(addData);
				this.prepareDefaultList();
				if(this.selectedScriptType){
					this.prepareSubList(this.selectedScriptType);
				}
			}
		}
		this.setTouchEnabled(true);
		this.addingNew=false;
		this.inEditor=false;
		var self=this;
		this.scheduleOnce(function(){
		self.childEditor.willTerminate(true);
		self.childEditor.removeFromParent();
		self.panels["child"].setVisible(false);
		})
	},
	
	deleteElement:function(number){
		this.editList[number]={}
		this.childEditor.deleteSave(number,this.editList);
		this.prepareDefaultList();
		if(this.selectedScriptType){
			this.prepareSubList(this.selectedScriptType);
		}
	},

	copyScript:function(number){
		this.addingNew=true;
		this.inEditor=true;
		this.saveNewDataID=this.editList.length+"";
		var clonedData = cloneObj(this.editList[number]);
		if(clonedData["implementsAs"]){
			clonedData["specifier"]=clonedData["implementsAs"];
			clonedData["implementsAs"]=null;
		}
		if(clonedData["isTemplate"]){
			clonedData["isTemplate"]=null;
		}
		var currentSpecifier=clonedData["specifier"];
		this.childEditor.init({delegate:this, data:clonedData, scriptDelegate:currentSpecifier});
		this.setTouchEnabled(false);
		self.panels["child"].addChild(self.childEditor);
		self.panels["child"].setVisible(true);
		this.childEditor.didBecomeActive();
	},
	
});