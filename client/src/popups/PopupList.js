PopupList = Scene.extend({
	childEditor:null,
	editList:[],
	inEditor:false,
	saveNewDataID:-1,
	listPanel:null,
	allowEdit:true,
	allowDel:true,
	allowAdd:true,
	
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

	setTab:function(number){
		if(this.inEditor){
			this.childEditor.setTab(number);
		}
	},

	init:function(withData,control){
		this._super();
		this.childEditor=null;
		this.editList=[];
		this.allowDel=true;
		this.allowEdit=true;
		this.allowAdd=true;
		if(control){
			if(control.edit==false || control.edit==true){
				this.allowEdit=control.edit;
			}
			if(control.del==false || control.del==true){
				this.allowDel=control.del;
			}
			if(control.add==false || control.add==true){
				this.allowAdd=control.add;
			}
		}
		this.inEditor=false;
		this.saveNewDataID=-1;
		this.childEditor=withData.editor;
		if(withData.list){
			this.editList=withData.list;
		}
	},	



	didBecomeActive:function(){
		this._super();
		//this.panels.setVisible(false);
		this.prepareList();
	},

	listPanel:null,

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.listView.removeFromParent();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		for(var i in this.editList){
			listnodes[i]=cc.Node.create();
			if(this.editList[i]["name"]){
				listnodes[i].setContentSize(324,32);
				if(this.editList[i]==null){
					this.editList.splice(i,1);
					continue;
				}
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),showingEditor-20,1);
				element.setPosition(cc.p(0,0));			

				var text = cc.LabelTTF.create(this.editList[i].name,"Arial",12);
				text.setDimensions(cc.size(showingEditor-44,0));
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,6));
				
				if(this.allowDel){
					var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
					delElement.setPosition(cc.p(showingEditor-48,4));
					delElement.setAnchorPoint(cc.p(0,0));		
				}
				var touchableNodes =[];
				if(this.allowEdit){
					listnodes[i].callBack = "Edit";
					touchableNodes.push(listnodes[i]);
				}				
				if(this.allowDel){
					delElement.callBack = "Delete";
					touchableNodes.push(delElement);
				}
				listnodes[i].setContentSize(cc.size(showingEditor-20,text.getContentSize().height+12));
				callBackList.push(touchableNodes);

				listnodes[i].addChild(element);
				listnodes[i].addChild(text);

				if(this.allowDel){
					listnodes[i].addChild(delElement);
				}
			}else{
				listnodes[i].setContentSize(cc.size(0,0));
				callBackList.push([]);
			}


		}
		if(this.allowAdd){
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

		this.listPanel = this.panels["list"];
		var self=this;
		this.listPanel.getListSize = function(){
			return cc.size(showingEditor-20,32*listnodes.length);
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
			if(self.inEditor==true){
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
					self.saveNewDataID=self.editList.length;
					self.childEditor.init({delegate:self, data:null});
					self.setTouchEnabled(false);
					self.panels["child"].addChild(self.childEditor);
					self.panels["child"].setVisible(true);
					self.childEditor.didBecomeActive();
				break;
				case "Use":
					self.delegate.setTypeData(listelement,self.editList[listelement]);
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
			children:{	
				"list":{
					size:cc.size(showingEditor-20,screenSize.height-20),
					position:cc.p(0,0),
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
				this.prepareList();
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
		self.prepareList();
		})
	},
	
	deleteElement:function(number){
		this.editList[number]={};
		this.childEditor.deleteSave(number,this.editList);
		this.prepareList();
	},
	
});