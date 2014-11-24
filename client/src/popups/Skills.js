Skills=null;
SkillsPanel = Popup.extend({

	listPanel:null,

	getIdentifier:function(){
		return "Skills";
	},



	prepareList:function(){
		if(this.listPanel){
			this.listPanel.removeAllChildren();
		}
		var listnodes = [];
		var callBackList=[];
		var tc = cc.TextureCache.getInstance();
		var i=0;
		var character_level=0;
		for(var j in this.data){
			character_level+=(this.data[j]["level"]+1)
			listnodes[i]=cc.Node.create();
			listnodes[i].setContentSize(420,32);
			var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
			element.setPosition(cc.p(4,0));						
			
			var skilllevel = cc.LabelTTF.create("Lvl " + ((this.data[j]["level"]+1)+this.data[j]["modifier"])+"/" + (this.data[j]["level"]+1),"Arial",15);
			skilllevel.setColor(cc.c3b(0,0,0));
			skilllevel.setAnchorPoint(cc.p(0,0));
			skilllevel.setPosition(cc.p(4,4));

			var skillname = cc.LabelTTF.create(j,"Arial",15);
			skillname.setColor(cc.c3b(0,0,0));
			skillname.setAnchorPoint(cc.p(0.5,0));
			skillname.setPosition(cc.p((skilllevel.getContentSize().width+65),4));


			var experienceBar = cc.LayerColor.create(cc.c4b(255,255,255,255),144,skillname.getContentSize().height);
			var experience = cc.LayerColor.create(cc.c4b(100,120,200,255),144*(this.data[j]["experience"]/this.data[j]["requirement"]),skillname.getContentSize().height);
			experienceBar.addChild(experience);
			experience.setAnchorPoint(cc.p(0,0));
			var exptext = cc.LabelTTF.create(this.data[j]["experience"]+"/"+this.data[j]["requirement"],"Arial",14);
			exptext.setAnchorPoint(cc.p(0,0));
			exptext.setColor(cc.c3b(0,0,0));
			experienceBar.addChild(exptext);
			exptext.setPositionY(1);



		//	cc.LabelTTF.create(this.data[j]["level"]+"/"+"400","Arial",15);
			experienceBar.setAnchorPoint(cc.p(0,0));
			experienceBar.setPosition(cc.p(172,4));
			//experienceBar.setDimensions(cc.size(150,0));


			var touchableNodes =[];
			callBackList.push(touchableNodes);
			listnodes[i].addChild(element);
			listnodes[i].addChild(skillname);
			listnodes[i].addChild(skilllevel);
			listnodes[i].addChild(experienceBar);
			listnodes[i].setContentSize(324,skillname.getContentSize().height+8);
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



		this.panels["main_panel"]["character_level"].setString("LEVEL: " + character_level)
		this.panels["main_panel"]["character_level"].setPositionX(306);
		this.panels["main_panel"]["character_level"].setAnchorPoint(cc.p(1,0));
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
							"character_level":{
								label:"",
								position:cc.p(2,310),
								anchorPoint:cc.p(0,0),
								color:cc.c3b(0,0,0),

							},
							"list":{
								size:cc.size(324,308),
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
								label:"Skills",
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
		this.data = SkillBars.getSkillData();
		this.prepareList();
	},

});

var SkillBars=cc.Layer.extend({

	bars:[],
	skillsData:null,

	updateLayoutFromSkills:function(){
		var skillslist = ObjectLists.getSkillsList();
		for(var i in this.bars){
			this.bars[i].removeFromParent();
		}
		this.bars=[];
		var j=0;
		for(var i=skillslist.length-1;i>=0;i--){
			if(skillslist[i]["healthbar"]!=null&&skillslist[i]["healthbar"]!=""){
				var skillBar = this.createSkillBar(skillslist[i]["name"],skillslist[i]["healthbar"],j)
				this.addChild(skillBar);
				this.bars.push(skillBar);
				j++;
			}
		}
		this.setPosition(cc.p(0,screenSize.height-(32*j)));
	},

	createSkillBar:function(name,color,i){
		var newCol = hex2rgba(color);
		var bar = cc.LayerColor.create(cc.c4b(newCol.r,newCol.g,newCol.b,newCol.a),this.skillsData[name]["currenthealth"]>0 ? 300*(this.skillsData[name]["currenthealth"]/this.skillsData[name]["maxhealth"]) : 1,23);
		bar.bar = cc.Sprite.createWithTexture(cc.TextureCache.getInstance().addImage("GUI/healthbar.png"));
		bar.setPosition(10,(i*32)-(i*-5)-10);
		bar.setAnchorPoint(cc.p(0,0));
		bar.bar.setPosition(-5,-4);
		bar.bar.setAnchorPoint(cc.p(0,0));
		bar.addChild(bar.bar);
		var textnode = cc.LabelTTF.create(name,"Arial",16);
		textnode.setPosition(10,11.5);
		textnode.setAnchorPoint(cc.p(0,0.5));
		bar.addChild(textnode);
		return bar;
	},


});
SkillBarsInstance=null;
SkillBars.create=function(skillData){
	if(SkillBarsInstance==null){
		SkillBarsInstance=new SkillBars();
		SkillBarsInstance.skillsData=skillData;
		SkillBarsInstance.updateLayoutFromSkills();
	}
	return SkillBarsInstance;
};

SkillBars.modifyHealth=function(name,value){
	SkillBarsInstance.skillsData[name]["currenthealth"]+=value;
	if(SkillBarsInstance.skillsData[name]["currenthealth"]<0){
		SkillBarsInstance.skillsData[name]["currenthealth"]=0;
	}
	if(SkillBarsInstance.skillsData[name]["currenthealth"]>SkillBarsInstance.skillsData[name]["maxhealth"]){
		SkillBarsInstance.skillsData[name]["currenthealth"]=SkillBarsInstance.skillsData[name]["maxhealth"];
	}
	SkillBarsInstance.updateLayoutFromSkills();
	if(Skills){
		Skills.prepareList();
	}
};

SkillBars.modifyXP=function(name,value){
	SkillBarsInstance.skillsData[name]["experience"]+=value;
	if(SkillBarsInstance.skillsData[name]["experience"]<0){
		SkillBarsInstance.skillsData[name]["experience"]=0;
	}
	/*if(SkillBarsInstance.skillsData[name]["experience"]>SkillBarsInstance.skillsData[name]["maxhealth"]){
		SkillBarsInstance.skillsData[name]["experience"]=SkillBarsInstance.skillsData[name]["maxhealth"];
	}*/
	SkillBarsInstance.updateLayoutFromSkills();
	if(Skills){
		Skills.prepareList();
	}
};


SkillBars.modifyModifier=function(name,value){
	SkillBarsInstance.skillsData[name]["modifier"]+=value;
	if(SkillBarsInstance.skillsData[name]["modifier"]<0){
		SkillBarsInstance.skillsData[name]["modifier"]=0;
	}
	SkillBarsInstance.updateLayoutFromSkills();
	if(Skills){
		Skills.prepareList();
	}
};


SkillBars.getSkillData=function(){
	return SkillBarsInstance.skillsData;
};

SkillBars.update=function(){
	SkillBarsInstance.updateLayoutFromSkills();
};