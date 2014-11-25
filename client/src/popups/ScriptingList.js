ScriptingList = Popup.extend({
	childEditor:null,
	editList:[],
	listName:null,
	showingEditor:false,
	saveNewDataID:-1,
	selectorlistPanel:null,
	scriptlistPanel:null,
	hasChosen:false,
	selectedScriptType:null,

	
	willTerminate:function(){
		this._super();
		if(this.delegate){
			this.delegate.setTouchEnabled(true);
			if(!this.hasChosen && this.delegate.setNoType){
				this.delegate.setNoType(null,null);
			}
		}
	},

	init:function(withData){
		this._super();
		this.childEditor=null;
		this.editList=[],
		this.listName=null;
		this.showingEditor=false;
		this.saveNewDataID=-1;
		this.childEditor=withData.editor;
		if(withData.list){
			this.editList=withData.list;
		}
		this.listName=withData.name;
		this.delegate=withData.delegate;
	},



	didBecomeActive:function(){
		this._super();
		//this.panels.setVisible(false);
		this.prepareDefaultList();
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
			listnodes[i].setContentSize(220,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),220,1);
			element.setPosition(cc.p(0,0));			

			var text = cc.LabelTTF.create(list[i],"Arial",20);
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(192,0));
			listnodes[i].setContentSize(220,text.getContentSize().height+8);
			if(this.selectedScriptType!=null && this.selectedScriptType==i){
				listnodes[i]=cc.LayerColor.create(cc.c4b(100,0,0,255),220,text.getContentSize().height+8);
				var selectedElement=cc.Sprite.createWithTexture(tc.addImage("GUI/selected.png"));
				selectedElement.setPosition(cc.p(196,((text.getContentSize().height+8)-20)/2));
				selectedElement.setAnchorPoint(cc.p(0,0));
				listnodes[i].addChild(selectedElement);
				text.setColor(cc.c3b(255,255,255));
			}
			listnodes[i].callBack="Use";
			callBackList.push([listnodes[i]]);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
		}
		this.defaultlistPanel = this.panels["main_panel"]["mainlist"];
		var self=this;
		this.defaultlistPanel.getListSize = function(){
			return cc.size(324,32*listnodes.length);
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
			var pos = touch._point;
			var truePos = self.convertToNodeSpace(pos);
			if(self.showingEditor==true){
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
				listnodes[i].setContentSize(286,32);
				console.log(this.editList[i]);
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),286,1);
				element.setPosition(cc.p(0,0));			
				var text = cc.LabelTTF.create(this.editList[i].name,"Arial",20);
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(2,4));

				text.setDimensions(cc.size(208,0));
				listnodes[i].setContentSize(286,text.getContentSize().height+8);

				if(this.delegate!=null && !this.editList[i]["isTemplate"]){
					var useElement=cc.Sprite.createWithTexture(tc.addImage("GUI/use.png"));
					useElement.setPosition(cc.p(212,(listnodes[i].getContentSize().height-20)/2));
					useElement.setAnchorPoint(cc.p(0,0));
				}
				var touchableNodes =[];
				if(currentSpecifier!="Default"){
					var editElement=cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
					editElement.setPosition(cc.p(236,(listnodes[i].getContentSize().height-20)/2));
					editElement.setAnchorPoint(cc.p(0,0));
					
					var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
					delElement.setPosition(cc.p(260,(listnodes[i].getContentSize().height-20)/2));
					delElement.setAnchorPoint(cc.p(0,0));		
					
					touchableNodes.push(editElement);
					delElement.callBack = "Delete";
					editElement.callBack="Edit";
					touchableNodes.push(delElement);
					listnodes[i].addChild(editElement);
					listnodes[i].addChild(delElement);	
				}
				if(this.delegate!=null && !this.editList[i]["isTemplate"]){
					useElement.callBack="Use";
					touchableNodes.push(useElement);
				}

				var copyElement=cc.Sprite.createWithTexture(tc.addImage("GUI/copy.png"));
				copyElement.setPosition(cc.p(188,(listnodes[i].getContentSize().height-20)/2));
				copyElement.setAnchorPoint(cc.p(0,0));
				copyElement.callBack="Copy";
				touchableNodes.push(copyElement);
				listnodes[i].addChild(copyElement);

				callBackList.push(touchableNodes);

				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
				if(this.delegate!=null){
					listnodes[i].addChild(useElement);
				}
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
			addButton.setPosition(cc.p(100,0));
			addButton.callBack="Add";
			addButton.addChild(plus);
			callBackList.push([addButton]);
			listnodes.push(addButton);
		}

		this.scriptlistPanel = this.panels["main_panel"]["sublist"];
		var self=this;
		this.scriptlistPanel.getListSize = function(){
			return cc.size(324,32*listnodes.length);
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
			if(self.showingEditor==true){
				return;
			}
			switch(name){
				case "Delete":
					self._parent.addChild(DropDownList.createWithListAndPosition(self,self.deleteClicked,["Cancel","Delete"],touch._point));
					self.elementContext =listelement;
				break;
				case "Edit":
					if(self.childEditor._parent){
						self.childEditor.removeFromParent();
					}
					self.showingEditor=true;
					self.childEditor.init({delegate:self, data:self.editList[listelement]});
					self._parent.addChild(self.childEditor);
					self.setTouchEnabled(false);
					self.childEditor.didBecomeActive();
					self.saveNewDataID=listelement+"";
				break;
				case "Add":
					self.addingNew=true;
					self.showingEditor=true;
					self.saveNewDataID=self.editList.length;
					self.childEditor.init({delegate:self, data:null, scriptDelegate:currentSpecifier});
					self.setTouchEnabled(false);
					self._parent.addChild(self.childEditor);
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
				position:cc.p(20,20),
				children:{	
					"background_image":{
						texture:"GUI/scripting_list.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(584,408),
						children: {
							"mainlist":{
								size:cc.size(220,408),
								position:cc.p(0,0),
								anchorPoint:cc.p(0,0),
							},
							"sublist":{
								size:cc.size(280,408),
								position:cc.p(261,0),
								anchorPoint:cc.p(0,0),
							},
						},
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,408),
						size: cc.size(584,32),
						children:{	
							"header":{
								label:this.listName,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(560,6),
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
		this.showingEditor=false;
		var self=this;
		this.scheduleOnce(function(){
		self.childEditor.willTerminate(true);
		self.childEditor.removeFromParent();
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
		this.showingEditor=true;
		this.saveNewDataID=this.editList.length;
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
		this._parent.addChild(this.childEditor);
		this.childEditor.didBecomeActive();
	},
	
});