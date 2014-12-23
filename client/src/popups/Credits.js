CreditsPanel=null,
Credits = Popup.extend({
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
				"Project Leader":"Spork",
				"Localisation Contributors":"Vus, sn0w Beast",
				"Programmers":"Spork",
				"Community Management & Support": "Chief, Seb, Mad Hatter",
				"Special thanks":"All of you, who's positive response keep us motivated to deliver the best software we can make.",
				"Powder Engine is Copywritten":"Contact the developera in-site regarding questions.",
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
			callBackList.push(touchableNodes);
			listnodes[i].addChild(element);
			listnodes[i].addChild(text);
			if(this.data[j]=="ISSECTION"){
				listnodes[i].setContentSize(324,text.getContentSize().height+12);
			}else{
				listnodes[i].setContentSize(324,text.getContentSize().height+8);
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
								label:"Credits",
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