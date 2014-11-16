PopupList = Popup.extend({
	childEditor:null,
	editList:[],
	listName:null,
	showingEditor:false,
	saveNewDataID:-1,
	itemOffsets:0,
	defaultPositions:null,
	listPanel:null,
	hasChosen:false,
	
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
		this.defaultPositions={};
		for(var i in this.editList){
			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(324,32);
			if(this.editList[i]==null){
				this.editList.splice(i,1);
				continue;
			}
			if(this.delegate!=null){
				var useElement=cc.Sprite.createWithTexture(tc.addImage("GUI/use.png"));
				useElement.setPosition(cc.p(244,6));
				useElement.setAnchorPoint(cc.p(0,0));
			}
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
			element.setPosition(cc.p(4,0));			

			var text = cc.LabelTTF.create(this.editList[i].name,"Arial",20);
			text.setAnchorPoint(cc.p(0,0.5));
			text.setPosition(cc.p(0,16));

			var editElement=cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
			editElement.setPosition(cc.p(272,6));
			editElement.setAnchorPoint(cc.p(0,0));
			
			var delElement=cc.Sprite.createWithTexture(tc.addImage("GUI/trash.png"));
			delElement.setPosition(cc.p(300,6));
			delElement.setAnchorPoint(cc.p(0,0));		


			editElement.callBack = "Edit";
			var touchableNodes =[];
			touchableNodes.push(editElement);
			delElement.callBack = "Delete";
			touchableNodes.push(delElement);
			if(this.delegate!=null){
				useElement.callBack="Use";
				touchableNodes.push(useElement);
			}
			callBackList.push(touchableNodes);

			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].addChild(editElement);
			listnodes[i].addChild(delElement);	
			if(this.delegate!=null){
				listnodes[i].addChild(useElement);
			}


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
			return cc.size(324,32*listnodes.length);
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
					self.childEditor.init({delegate:self, data:null});
					self.setTouchEnabled(false);
					self._parent.addChild(self.childEditor);
					self.childEditor.didBecomeActive();
				break;
				case "Use":
					self.delegate.setTypeData(listelement,self.editList[listelement]);
					self.hasChosen=true;
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
							"list":{
								size:cc.size(324,328),
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
								label:this.listName,
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

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		if(isTouching(this.panels["main_panel"],truePos)){
			return true;
		}
		return false;
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
		this.showingEditor=false;
		var self=this;
		this.scheduleOnce(function(){
		self.childEditor.willTerminate(true);
		self.childEditor.removeFromParent();
		})
	},
	
	deleteElement:function(number){
		this.editList.splice(number,1);
		this.childEditor.deleteSave(number,this.editList);
		this.prepareList();
	},
	
});