
NpcChat=null;
NpcChatPanel = Popup.extend({

	name:null,
	content:null,
	chatoptions:null,
	script:null,
	eventnumber:null,
	npccontext:null,
	listPanel:null,

	getIdentifier:function(){
		return "Book";
	},
	
	getLayoutObject:function(){
		
		return {
			"panels":{
				position:cc.p(100,20),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,0),
						size: cc.size(512,138),
						texture: "GUI/npctalk.png",
						children:{
							"chatText":{
								label:this.content,
								anchorPoint:cc.p(0,1),
								position:cc.p(138,134),
								color:cc.c3b(0,0,0),
							},
							"list":{
								size:cc.size(320,80),
								position:cc.p(154,4),
								anchorPoint:cc.p(0,0),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,138),
						size: cc.size(512,32),
						children:{
							"header":{
								label:this.name,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(488,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
							}
						}
					},
				}	
			}
		};
	},

	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var i=0;
		for(var j in this.chatoptions){
			listnodes[j]=cc.Node.create();
			listnodes[j].setContentSize(324,32);
			var selectionArea = cc.LayerColor.create(cc.c4b(200,200,200,200),300,10);
			selectionArea.setPosition(cc.p(12,1));
			var header = cc.LabelTTF.create(">"+this.chatoptions[j],"Arial",14);
			header.setAnchorPoint(cc.p(0,0));
			header.setPosition(cc.p(4,2));
			header.setDimensions(cc.size(300,0));
			header.setColor(cc.c3b(100,0,0));
			listnodes[j].addChild(selectionArea);
			selectionArea.addChild(header);
			listnodes[j].setContentSize(324,header.getContentSize().height+8);
			selectionArea.setContentSize(300,header.getContentSize().height+4);
			selectionArea.callBack="Use";
			var touchableNodes=[selectionArea];
			callBackList.push(touchableNodes);
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
			switch(name){
				case "Use":
					for(var i in self.script){
						if(self.script[i]["type"]=="On Talk Option Selected for event:"+self.eventnumber + ", option:"+listelement){
							handleNPCScript("On Talk Option Selected for event:"+self.eventnumber + ", option:"+listelement,self.npccontext);
						}
					}
					MainScene.showNPCTalk();
				break;
			}

		};
		this.listPanel.listView = ListView.create(this.listPanel);
		this.listPanel.listView.setCallBackList(callBackList);
		this.listPanel.addChild(this.listPanel.listView);
	},

	init:function(npccontext,script,eventnumber,name,content,chatoptions){
		this._super();
		this.name=name;
		this.content=content;
		this.script=script;
		this.eventnumber=eventnumber;
		this.npccontext=npccontext
		if(chatoptions){
			this.chatoptions=chatoptions;
		}
	},

	didBecomeActive:function(){
		this._super();
		this.panels["main_panel"]["chatText"].setDimensions(cc.size(350,0));
		if(this.chatoptions){
			this.prepareList();
		}
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		/*this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);

		if(isTouching(this.panels["main_panel"]["pageForwardbtn"],truePos)){
			this.gotoNextPage();
			return true;
		}		
		if(isTouching(this.panels["main_panel"]["pageBackbtn"],truePos)){
			this.gotoPreviousPage();
			return true;
		}	*/	
	},


});