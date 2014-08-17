NewsPanel=null,
News = Popup.extend({
	data:null,
	listPanel:null,
	elementContext:null,

	getIdentifier:function(){
		return "Credits";
	},
	
	willTerminate:function(ignoreTerminate){
		this._super();
	},
	init:function(){
		this._super();
			this.data={
				"17th August 2014: (v0.714)":[
					"Added basic template logic of new scripting editor system. Scripts can be saved and loaded like other list systems. This editor currently does not allow you to apply scripts to anything (it is simply the GUI interface template logic that's in there). The item editor has been changed to utilize the new saved scripts list.",
					"Fixed localstorage issue caused by settings implementation. Game now does not now load until the game is fully in sync. The issue was causing an error on some game-loads because the localstorage was not yet available (requiring a refresh).",
				],

				"11th August 2014: (v0.708)":[
					"Added settings menu for various game controls. Settings menu only currently controls a load of in game string settings. Also added the additional required admin panel graphic for settings access. The new chatbox command is /editsettings.",
					"Added scrolling credits button to login page and populated it.",
					"Added this scrolling news feed to login page and obviously populated it as well.",
				],
				"11th August 2014 (v0.7)":[
					"Added some additional custom gui for some of the editors.",
					"Fixed a lot of bugs (and I mean a lot).",
					"Added 0.7 download to site."
				],
				"10th August 2014 (v0.695)":[
					"Added quest objective editor. New button now made usable in menu.",
					"Objective editor utilizes abstract scrolling list from 0.69.",
				],
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
			for(var k in this.data[j]){
				listnodes[i]=cc.Node.create();
				listnodes[i].setContentSize(324,32);
				
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
				element.setPosition(cc.p(4,0));			
		
			
				var text = cc.LabelTTF.create(this.data[j][k],"Arial",15);
				text.setColor(cc.c3b(0,0,0));
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,4));
				text.setDimensions(cc.size(246,0));
				var touchableNodes =[];
				callBackList.push(touchableNodes);
				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
				listnodes[i].setContentSize(324,text.getContentSize().height+8);
				i++;
			}
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
								label:"News",
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

	
});