Warpeditor=null;
WarpEditor = Popup.extend({
	getIdentifier:function(){
		return "WarpEditor";
	},
	
	runSaveNewData:function(num){
		sendMessageToServer({"savewarps":num+"","warpdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendMessageToServer({"savewarpswhole":list});
	},
	
	getLayoutObject:function(){
		var listPanel = {};
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(180,160),
						bg: cc.c4b(100,255,100,200),
						children:{
							"okbtn" : {
								position:cc.p(100,16),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"OK",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"cancelbtn" : {
								position:cc.p(20,16),
								size:cc.size(60,32),
								bg: cc.c4b(255,255,255,255),
								anchorPoint:cc.p(0,0),
								children:{
									"text":{
										label:"Cancel",
										fontSize:12,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(30,16),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"namelbl" : {
								label:"Name of warp.",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(20,140),
								color:cc.c3b(0,0,0),
							},
							"nameEntry":{
								position:cc.p(16,110),
								size:cc.size(120,30),
							},
							"mapnumlbl" : {
								label:"Map #",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(20,90),
								color:cc.c3b(0,0,0),
							},
							"mapNumEntry":{
								position:cc.p(16,60),
								size:cc.size(40,30),
							},
							"mapxlbl" : {
								label:"x",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(80,90),
								color:cc.c3b(0,0,0),
							},
							"mapXEntry":{
								position:cc.p(76,60),
								size:cc.size(36,30),
							},
							"mapylbl" : {
								label:"y",
								fontSize:12,
								anchorPoint:cc.p(0,0),
								position:cc.p(130,90),
								color:cc.c3b(0,0,0),
							},
							"mapYEntry":{
								position:cc.p(126,60),
								size:cc.size(36,30),
							},
						}
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,160),
						size: cc.size(180,32),
						bg: cc.c4b(255,0,0,200),
						children:{	
							"header":{
								label:"Warp Editor",
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(151,3),
								size: cc.size(26,26),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(255,255,255,200),
								children:{	
								"content":{
									label:"X",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0.5,0.5),
									position:cc.p(13,13),
									}
								}
							}
						}
					},
				}	
			}
		};
	},
	
	nameBox:null,
	mapNumBox:null,
	mapXBox:null,
	mapYBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.nameBox=null;
		this.mapNumBox=null;
		this.mapXBox=null;
		this.mapYBox=null;
		this.delegate=null;
		this.data={"mapTo":0,"position":0,"name":""};
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
		this.mapNumBox = new EntryBox(this.panels["main_panel"]["mapNumEntry"],cc.size(this.panels["main_panel"]["mapNumEntry"].getContentSize().width,this.panels["main_panel"]["mapNumEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapNumEntry"].getContentSize().height), ""+this.data["mapTo"], cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapNumBox.setDefaultFineFlag(true);
		this.mapXBox = new EntryBox(this.panels["main_panel"]["mapXEntry"],cc.size(this.panels["main_panel"]["mapXEntry"].getContentSize().width,this.panels["main_panel"]["mapXEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapXEntry"].getContentSize().height), ""+x, cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapXBox.setDefaultFineFlag(true);
		this.mapYBox = new EntryBox(this.panels["main_panel"]["mapYEntry"],cc.size(this.panels["main_panel"]["mapYEntry"].getContentSize().width,this.panels["main_panel"]["mapYEntry"].getContentSize().height), cc.p(0,this.panels["main_panel"]["mapYEntry"].getContentSize().height), ""+y, cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.mapYBox.setDefaultFineFlag(true);
		
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(isTouching(this.panels["main_panel"]["okbtn"],truePos)){
			if(this.nameBox.getText()==null || this.nameBox.getText()=="" || this.mapNumBox.getText()==null  || this.mapNumBox.getText()=="" || this.mapXBox.getText()==null || this.mapXBox.getText()=="" || this.mapYBox.getText()==null || this.mapYBox.getText()==""){
				return true;
			}
			this.ignoreTerminate=true;
			this.data["position"]=indexFromPos(parseInt(this.mapXBox.getText()),(gridHeight)-parseInt(this.mapYBox.getText()));
			this.data["mapTo"]=parseInt(this.mapNumBox.getText());
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