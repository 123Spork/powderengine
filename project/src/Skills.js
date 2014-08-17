Skills=null;
SkillsPanel = Popup.extend({
	getIdentifier:function(){
		return "Skills";
	},
	getLayoutObject:function(){
		var equipment_panel={};
		var skillslist = ObjectLists.getSkillsList();

		for(var i=0;i<skillslist.length;i++){
			equipment_panel[i+""]={
				anchorPoint:cc.p(0,0),
				position:cc.p(0,((skillslist.length*40))-((i+1)*40)+2),
				children:{
					"icon":{
						position: cc.p(4,2),
						isSprite:true,
						anchorPoint:cc.p(0,0),
					},
					"name":{
						position: cc.p(46,18),
						size: cc.size(120,32),
						label:skillslist[i]["name"],
						fontSize:16,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,0.5),
					},
					"level":{
						position: cc.p(210,18),
						size: cc.size(86,32),
						anchorPoint:cc.p(0.5,0.5),
						label:"Level",
						fontSize:16,
						color:cc.c3b(255,255,255),
					},
					//"experience":{
					//}
				},
			};
		}
		
		return {
			"panels":{
				position:cc.p(100,300),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(256,skillslist.length*40),
						texture:"GUI/skills.png",
						children: equipment_panel,
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,skillslist.length*40),
						size: cc.size(256,32),
						children:{
							"header":{
								label:settingsData["Skills Header"],
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(232,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture:"GUI/close.png"
							}
						}
					},
					"item_name":{
						position:cc.p(0,0),
						bg:cc.c4b(200,200,200,200),
						size:cc.size(64,16),
						visible:false,
						children:{
							"content":{
								label:"",
								fontSize:14,
								color:cc.c3b(0,0,0),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(32,8),
							}
						}
					},
					"control_menu":{
						position:cc.p(0,0),
						bg:cc.c4b(200,200,200,200),
						size:cc.size(96,48),
						visible:false,
						children:{
							"dropbtn":{
								position: cc.p(0,0),
								size: cc.size(96,24),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(200,200,200,200),
								children:{	
								"content":{
									label:"Drop",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0,0.5),
									position:cc.p(4,12),
									}
								}
							},
							"unequipbtn":{
								position: cc.p(0,24),
								size: cc.size(96,24),
								anchorPoint:cc.p(0,0),
								bg: cc.c4b(200,200,200,200),
								children:{	
								"content":{
									label:"Unequip",
									fontSize:20,
									color:cc.c3b(0,0,0),
									anchorPoint:cc.p(0,0.5),
									position:cc.p(4,12),
									}
								}
							},

						}
					}	
				}	
			}
		};
	},

	updateTileGrid:function(){
		console.log("Updating tile grid");
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
		}
	},

	didBecomeActive:function(){
		this._super();
		this.updateTileGrid();
	},

});

var SkillBars=cc.Layer.extend({

	bars:[],

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
		var bar = cc.LayerColor.create(cc.c4b(newCol.r,newCol.g,newCol.b,newCol.a),300,23);
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
SkillBars.create=function(){
	if(SkillBarsInstance==null){
		SkillBarsInstance=new SkillBars();
		SkillBarsInstance.updateLayoutFromSkills();
	}
	return SkillBarsInstance;
};
SkillBars.update=function(){
	SkillBarsInstance.updateLayoutFromSkills();
};