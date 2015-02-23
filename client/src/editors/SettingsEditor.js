Settingseditor=null,
SettingsEditor = Scene.extend({
	data:null,
	listPanel:null,
	elementContext:null,

	getTabOptions:function(){
		return ["Game Strings"];
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
				settingsData=cloneObj(this.data);
				sendToServer({"savesettings":this.data});
				LocalStorage.updateSettingsData(this.data,Date.now());
			break;
		}
		return true;
	},






				



	getIdentifier:function(){
		return "Settings Editor";
	},
	
	willTerminate:function(ignoreTerminate){
		this._super();
	},


	init:function(){
		this._super();
		this.data=cloneObj(settingsData);
	},

	didBecomeActive:function(){
		this._super();
		this.prepareList();
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var i=0;
		for(var j in this.data){
			if(this.data[j]!="ISSECTION"){
				listnodes[i]=cc.Node.create();
				listnodes[i].setContentSize(324,32);
				var header = cc.LabelTTF.create(j,"Arial",18);
				header.setAnchorPoint(cc.p(0,0));
				header.setPosition(cc.p(4,0));
				header.setDimensions(cc.size(246,0));
				listnodes[i].addChild(header);
				listnodes[i].setContentSize(324,header.getContentSize().height+4);
				var touchableNodes=[];
				callBackList.push(touchableNodes);
				i++;
			}

			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(324,32);
			
			var element= cc.LayerColor.create(cc.c4b(255,255,255,255),316,1);
			element.setPosition(cc.p(4,0));			

			if(this.data[j]=="ISSECTION"){
				var text = cc.LabelTTF.create(j,"Arial",22);
				text.setColor(cc.c3b(255,255,0));
			}else{
				var text = cc.LabelTTF.create(this.data[j],"Arial",12);
			}
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(316,0));
			var touchableNodes =[];
			if(this.data[j]!="ISSECTION" && this.data[j]!="ISYESNO"){
				var editElement=cc.LayerColor.create(cc.c4b(60,60,60,255),text.getContentSize().width,text.getContentSize().height);
				editElement.setAnchorPoint(cc.p(0,0));
				editElement.setPosition(text.getPosition());
				editElement.callBack = "Edit";
				editElement.context=j+"";
				touchableNodes.push(editElement);
				listnodes[i].addChild(editElement);
			}

			callBackList.push(touchableNodes);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			listnodes[i].setContentSize(324,text.getContentSize().height+8);
			i++;
		}

		this.listPanel = this.panels["list"];
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
		this.listPanel.runListCallBack=function(name,listelement,touch,object){
			var pos = touch._point;
			var truePos = self.convertToNodeSpace(pos);
			if(self.showingEditor==true){
				return;
			}
			switch(name){
				case "Edit":
					self.elementContext =object.context;
					self.resetValueBoxWithObject(object);
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
		console.log(this.data);
		console.log(this.elementContext);
		console.log(this.data[this.elementContext]);
		this.editBox = new EntryBox(object,cc.size(object.getContentSize().width,object.getContentSize().height+4), cc.p(-4,object.getContentSize().height+4),this.data[this.elementContext], cc.c4b(255,255,255), cc.c3b(0,0,0),true,null,this);
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
		this.data[this.elementContext]=this.editBox.getText();
		this.editBox.setFocused(false);
		this.editBox.removeFromParent();
		this.editBox=null;
		this.prepareList();
	},


	
	getLayoutObject:function(){
			return { 
			"panels":{
				children:{	
					"list":{
						size:cc.size(324,screenSize.height-20),
						position:cc.p(0,0),
						anchorPoint:cc.p(0,0),
					},
				},
			}	
		};
	},	
});