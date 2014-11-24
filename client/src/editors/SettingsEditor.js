Settingseditor=null,
SettingsEditor = Popup.extend({
	data:null,
	listPanel:null,
	elementContext:null,

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

	runSaveNewData:function(num){
		sendMessageToServer({"savequests":num+"","questdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savequestswhole":list});
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
				header.setColor(cc.c3b(100,0,0));
				listnodes[i].addChild(header);
				listnodes[i].setContentSize(324,header.getContentSize().height+4);
				var touchableNodes=[];
				callBackList.push(touchableNodes);
				i++;
			}

			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(324,32);
			
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
			element.setPosition(cc.p(4,0));			

			if(this.data[j]!="ISSECTION" && this.data[j]!="ISYESNO"){
				var editElement=cc.Sprite.createWithTexture(tc.addImage("GUI/edit.png"));
				editElement.setPosition(cc.p(300,0));
				editElement.setAnchorPoint(cc.p(0,0));
			}
	
			if(this.data[j]=="ISSECTION"){
				var text = cc.LabelTTF.create(j,"Arial",22);
				text.setColor(cc.c3b(255,0,0));
			}else{
				var text = cc.LabelTTF.create(this.data[j],"Arial",15);
				text.setColor(cc.c3b(0,0,0));
			}
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(4,4));
			text.setDimensions(cc.size(246,0));
			var touchableNodes =[];
 			if(this.data[j]!="ISSECTION" && this.data[j]!="ISYESNO"){
				editElement.callBack = "Edit";
				var touchableNodes =[];
				touchableNodes.push(editElement);
			}
			callBackList.push(touchableNodes);
			listnodes[i].addChild(element);
			if(this.data[j]!="ISSECTION"  && this.data[j]!="ISYESNO"){
				listnodes[i].addChild(editElement);
			}
			listnodes[i].addChild(text);
			if(this.data[j]=="ISSECTION"){
				listnodes[i].setContentSize(324,text.getContentSize().height+12);
			}else{
				listnodes[i].setContentSize(324,text.getContentSize().height+8);
			}
			if(this.data[j]!="ISSECTION" && this.data[j]!="ISYESNO"){
				editElement.setPositionY(((text.getContentSize().height+8)/2)-10);
			}
			i++;
		}

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
				case "Edit":
				var i=0; var k="";
				for(var j in self.data){
					if(i==listelement){
						k=j; break;
					}
					i++;
					if(self.data[j]=="ISSECTION"){
						continue;
					}

					if(i==listelement){
						k=j; break;
					}
					i++;
				}
				self.elementContext =k;
				self.editElement(k);
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
							"savebtn":{
								size:cc.size(64,32),
								color:cc.c4b(0,255,0,255),
								position:cc.p(241,292),
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

							"list":{
								size:cc.size(324,284),
								color:cc.c4b(0,200,200,200),
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
								label:"Settings Editor",
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
		this.entryBox = new EntryBox(this.editBox,cc.size(190,150), cc.p(0,this.editBox.getContentSize().height), this.data[elementNum], cc.c4b(100,100,100), cc.c3b(255,255,255),true);
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
				this.data[this.elementContext] = newString;
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
				settingsData=cloneObj(this.data);
				console.log(settingsData);
				console.log(this.data);
				sendMessageToServer({"savesettings":this.data});
				LocalStorage.updateSettingsData(this.data,Date.now());
				return true;
			}
			if(isTouching(this.panels["main_panel"],truePos)){
				return true;
			}
		}
		return false;
	},

	
});