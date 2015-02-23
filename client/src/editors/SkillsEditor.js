SkillsEditor = Scene.extend({
	currentTexture:tileTextureList[0]["name"],
	currentTextureNumber:0,
	showingHealthBar:false,

	getTabOptions:function(){
		return ["Basic"];
	},

	setTab:function(){

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
				this.data["name"]=this.nameBox.getText();
				this.data["healthbar"]=this.healthBox.getText()!=""?this.healthBox.getText():"FFFFFF";
				this.delegate.endedEdit(this.data);
			break;
		}
	},
	
	getLayoutObject:function(){
		return { "panels":{
				children:{	
					"name_lbl":{
						label:"Name:",
						fontSize:12,
						anchorPoint:cc.p(0,0),
						position: cc.p(4,screenSize.height-44),
					},
					"name_entry":{
						position:cc.p(74,screenSize.height-44),
						size:cc.size(290,16),
						anchorPoint:cc.p(0,0),
						color:cc.c3b(180,180,180)
					},
					"healthcolor_text":{
						label:"Color:",
						fontSize:12,
						anchorPoint:cc.p(0,0),
						position: cc.p(150,screenSize.height-75),
					},
					"healthcolor_entry":{
						size: cc.size(65,32),
						position: cc.p(184,screenSize.height-84),
					},
					"healthbtn" : {
						position:cc.p(4,screenSize.height-80),
						size:cc.size(128,26),
						color: RED,
						anchorPoint:cc.p(0,0),
						children:{
							"text":{
								label:"NOT HEALTHBAR",
								fontSize:12,
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(64,13),
								color:cc.c3b(0,0,0),
							}
						}
					},
				}
			},
		};
	},
	
	getIdentifier:function(){
		return "SkillsEditor";
	},
	nameBox:null,
	healthBox:null,
	delegate:null,
	data:null,
	
	init:function(withData){
		this._super();	
		this.setTouchPriority(-100);
		this.data={"additionalData":{},"healthbar":null, "name":""};
		this.currentTexture=tileTextureList[0]["name"],
		this.currentTextureNumber=0,
		this.nameBox=null,
		this.delegate=null,
		this.delegate=withData.delegate;

		if(withData && withData.data){
			this.data=withData.data;
		}
	},
	
	runSaveNewData:function(num){
		sendToServer("saveNewSkillMessage",{"saveskills":num+"","skillsdata":this.data});
	},
	
	deleteSave:function(num,list){
		sendToServer("deleteSkillMessage",{"saveskillswhole":list});
	},
	
	
	didBecomeActive:function(){
		this._super();
		this.nameBox = new EntryBox(this.panels["name_entry"],cc.size(this.panels["name_entry"].getContentSize().width,this.panels["name_entry"].getContentSize().height+4), cc.p(0,this.panels["name_entry"].getContentSize().height+4), this.data["name"]?this.data["name"]:"", cc.c4b(100,100,100), cc.c3b(0,0,0));
		this.nameBox.setDefaultFineFlag(true);
		this.nameBox.setBackgroundInvisible();
		this.healthBox = new EntryBox(this.panels["healthcolor_entry"],cc.size(this.panels["healthcolor_entry"].getContentSize().width,this.panels["healthcolor_entry"].getContentSize().height), cc.p(0,this.panels["healthcolor_entry"].getContentSize().height), this.data["healthbar"]?this.data["healthbar"]:"", cc.c4b(100,100,100), cc.c3b(255,255,255));
		this.healthBox.setDefaultFineFlag(true);
		
		this.panels["healthbtn"].setColor(RED);
		this.showingHealthBar=false;
		this.panels["healthbtn"]["text"].setString("NOT HEALTHBAR");

		if(this.data["healthbar"]!=null && this.data["healthbar"]!=""){
			this.panels["healthbtn"].setColor(GREEN);
			this.showingHealthBar=true;
			this.panels["healthbtn"]["text"].setString("IS HEALTHBAR");
		}
	},

	setTab:function(value){
	},
	
	onTouchBegan:function(touch){
		var pos = touch._point;
		var truePos = this.panels.convertToNodeSpace(pos);
		if(isTouching(this.panels["healthbtn"],truePos)){
			this.swapHealthbar(); return true;
		}
		return false;
	},	

	swapHealthbar:function(){
		this.showingHealthBar=!this.showingHealthBar;

		if(this.showingHealthBar){
			this.panels["healthcolor_entry"].setPositionX(184);	
			this.panels["healthcolor_text"].setVisible(true);	
			this.panels["healthbtn"].setColor(GREEN);
			this.panels["healthbtn"]["text"].setString("IS HEALTHBAR");
		}else{
			this.panels["healthcolor_entry"].setPositionX(screenSize.width+100);	
			this.panels["healthcolor_text"].setVisible(false);		
			this.panels["healthbtn"].setColor(RED);
			this.panels["healthbtn"]["text"].setString("NOT HEALTHBAR");
		}
	},
	
});