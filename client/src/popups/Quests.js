Quests=null;
QuestsPanel = Popup.extend({

	listPanel:null,
	sublistPanel:null,
	selectedQuest:null,

	getIdentifier:function(){
		return "Quests";
	},



	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var character_level=0;
		for(var j=0;j<this.data.length;j++){
			if(PlayersController.getYou().getQuestData(j)==null || PlayersController.getYou().getQuestData(j)==='undefined' && PlayersController.getYou().getQuestData(j)<1){
				continue;
			}
			character_level+=(this.data[j]["level"]+1)
			listnodes[j]=cc.LayerColor.create(cc.c4b(0,0,0,0),420,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),212,1);
			element.setPosition(cc.p(4,0));						
			
			var questname = cc.LabelTTF.create(this.data[j]["name"],"Arial",15);
			questname.setColor(cc.c3b(0,0,0));
			questname.setAnchorPoint(cc.p(0,0));
			questname.setPosition(cc.p(4,4));
			questname.setDimensions(cc.size(216,0));
			listnodes[j].setContentSize(216,questname.getContentSize().height+8);

			if(this.selectedQuest!=null && this.selectedQuest==j){
				listnodes[j]=cc.LayerColor.create(cc.c4b(100,0,0,255),216,questname.getContentSize().height+8);
				var selectedElement=cc.Sprite.createWithTexture(tc.addImage("GUI/selected.png"));
				selectedElement.setPosition(cc.p(192,((questname.getContentSize().height+8)-20)/2));
				selectedElement.setAnchorPoint(cc.p(0,0));
				listnodes[j].addChild(selectedElement);
				questname.setColor(cc.c3b(255,255,255));
			}
			listnodes[j].addChild(element);
			listnodes[j].addChild(questname);
			listnodes[j].callBack="Use";
			callBackList.push([listnodes[j]]);
		}
		if(listnodes.length<1){
			listnodes[0]=cc.LayerColor.create(cc.c4b(0,0,0,0),420,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),212,1);
			element.setPosition(cc.p(4,0));						
			var questname = cc.LabelTTF.create("THERES NO QUESTS!","Arial",15);
			questname.setColor(cc.c3b(0,0,0));
			questname.setAnchorPoint(cc.p(0,0));
			questname.setPosition(cc.p(4,4));
			questname.setDimensions(cc.size(216,0));
			listnodes[0].setContentSize(216,questname.getContentSize().height+8);
			listnodes[0].addChild(questname);
			callBackList.push([]);
		}

		this.listPanel = this.panels["main_panel"]["list"];
		var self=this;
		this.listPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(216,height);
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
			if(name=="Use"){
				self.selectedQuest=listelement;
				self.prepareObjectiveList(listelement);
				self.prepareList();
			}
		};
		this.listPanel.listView = ListView.create(this.listPanel);
		this.listPanel.listView.setCallBackList(callBackList);
		this.listPanel.addChild(this.listPanel.listView);
	},

	prepareObjectiveList:function(index){
		if(this.sublistPanel){
			this.sublistPanel.removeAllChildren();
		}
		var data=this.data[index]["objectiveList"]
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var character_level=0;
		if(PlayersController.getYou().getQuestData(index)>0){
			for(var j=0;j<data.length;j++){
				if(PlayersController.getYou().getQuestData(index)<j){
					continue;
				}
				if(j==0){
					listnodes[j]=cc.LayerColor.create(cc.c4b(0,0,0,0),1,1);
				}
				else if(j==data.length){
					listnodes[j]=cc.LayerColor.create(cc.c4b(0,0,0,0),1,1);
				} else{
					character_level+=(data[j]["level"]+1)
					listnodes[j]=cc.LayerColor.create(cc.c4b(0,0,0,0),208,32);
					var element= cc.LayerColor.create(cc.c4b(0,0,0,127),208,1);
					element.setPosition(cc.p(4,0));						
					
					var questname = cc.LabelTTF.create(data[j],"Arial",15);
					questname.setColor(cc.c3b(0,0,0));
					questname.setAnchorPoint(cc.p(0,0));
					questname.setPosition(cc.p(4,4));
					questname.setDimensions(cc.size(208,0));
					listnodes[j].setContentSize(208,questname.getContentSize().height+8);
					if(PlayersController.getYou().getQuestData(index)>j){
						questname.setOpacity(200);
					}
					listnodes[j].addChild(element);
					listnodes[j].addChild(questname);
				}
				callBackList.push([]);
			}
		}

		this.sublistPanel = this.panels["main_panel"]["sublist"];
		var self=this;
		this.sublistPanel.getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(212,height);
		};
		this.sublistPanel.getListElementAmount=function(){
			return listnodes.length;
		};
		this.sublistPanel.getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.sublistPanel.getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.sublistPanel.runListCallBack=function(name,listelement,touch){
		};
		this.sublistPanel.listView = ListView.create(this.sublistPanel);
		this.sublistPanel.listView.setCallBackList(callBackList);
		this.sublistPanel.addChild(this.sublistPanel.listView);
	},


	
	getLayoutObject:function(){
			return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"background_image":{
						texture:"GUI/quest_panel.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(512,328),
						children: {
							"list":{
								size:cc.size(216,328),
								color:cc.c4b(0,200,200,0),
								position:cc.p(0,0),
								anchorPoint:cc.p(0,0),
							},
							"sublist":{
								size:cc.size(212,328),
								color:cc.c4b(0,200,200,0),
								position:cc.p(258,0),
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
								label:"Quest Log",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(484,6),
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

	updateTileGrid:function(){
	/*	console.log("Updating tile grid");
		var skillsList = ObjectLists.getSkillsList();
		for(var i=0;i<skillsList.length;i++){
			this.panels["main_panel"][i+""]["icon"].setTexture(null);	
		}
		for(var i=0;i<skillsList.length;i++){
			if(skillsList[i]){
				for(var j in tileTextureList){
					if(tileTextureList[j]["name"]==skillsList[i]["sprite"]["texture"]){
						var texture=tileTextureList[j]["texture"];
					}
				}
				this.panels["main_panel"][i+""]["icon"].setTexture(texture);
				this.panels["main_panel"][i+""]["icon"].setTextureRect(cc.rect(skillsList[i]["sprite"]["position"].x*32, (skillsList[i]["sprite"]["position"].y*32),32,32));
			}
		}*/
	},

	didBecomeActive:function(){
		this._super();
		this.updateTileGrid();
		this.data = ObjectLists.getQuestList();
		this.prepareList();
	},

});