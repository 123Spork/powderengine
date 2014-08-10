Signeditor=null;
SignEditor = Popup.extend({
	getIdentifier:function(){
		return "SignEditor";
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"savesigns":num+"","signsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savesignswhole":list});
	},
	
	getLayoutObject:function(){
		var listPanel = {};
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"background":{
						texture:"GUI/signeditor_bg.png",
						anchorPoint:cc.p(0,0),
					},
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(142,256),
						children:{
							"okbtn" : {
								position:cc.p(88,16),
								size:cc.size(32,32),
								texture:"GUI/tick_icon.png",
								anchorPoint:cc.p(0,0),
							},
							"cancelbtn" : {
								position:cc.p(22,16),
								size:cc.size(32,32),
								texture:"GUI/cross_icon.png",
								anchorPoint:cc.p(0,0),
							},
							"namelbl" : {
								label:"Name of sign.",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(6,238),
								color:cc.c3b(0,0,0),
							},
							"nameEntry":{
								position:cc.p(4,206),
								size:cc.size(120,30),
							},
							"signlbl" : {
								label:"Contents",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(6,190),
								color:cc.c3b(0,0,0),
							},
							"signEntry":{
								position:cc.p(4,60),
								size:cc.size(120,128),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,256),
						size: cc.size(142,32),
						children:{	
							"header":{
								label:"Sign Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(118,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png",
							}
						}
					},
				}	
			}
		};
	},
	
	nameBox:null,
	signBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.nameBox=null;
		this.signBox=null;
		this.delegate=null;
		this.data={"label":"","name":""};
		if(withData.data){
			this.data=withData.data;
		}
		this.delegate=withData.delegate;
	},
	
	didBecomeActive:function(){
	this._super();
		var x=this.data["position"] % gridWidth;
		var y=(Math.floor(this.data["position"]/gridWidth)); 
		this.nameBox = new EntryBox(this.panels["main_panel"]["nameEntry"],cc.size(this.panels["main_panel"]["nameEntry"].getContentSize().width,this.panels["main_panel"]["nameEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["nameEntry"].getContentSize().height), this.data["name"], cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.nameBox.setDefaultFineFlag(true);
		this.signBox = new EntryBox(this.panels["main_panel"]["signEntry"],cc.size(this.panels["main_panel"]["signEntry"].getContentSize().width,this.panels["main_panel"]["signEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["signEntry"].getContentSize().height), ""+this.data["label"], cc.c4b(100,100,100), cc.c3b(255,255,255),true);
		this.signBox.setDefaultFineFlag(true);
		
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()=="" || this.signBox.getText()==null  || this.signBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["label"]=this.signBox.getText();
			this.data["name"]=this.nameBox.getText();
			this.delegate.endedEdit(this.data);
			return true;
		}
		if(isTouching(this.panels["main_panel"]["cancelbtn"],truePos)){
			this.ignoreTerminate=true;
			var self= this.delegate;
			this.delegate.scheduleOnce(function(){self.endedEdit(null)});
			return true;
		}
	},
	
	willTerminate:function(ignoreTerminate){
		this._super();
		var self= this.delegate;
		if(ignoreTerminate){
			return;
		}
		this.delegate.scheduleOnce(function(){self.endedEdit(null)});
	},
	
});