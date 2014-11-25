//Editing character.js to provide map number to server so can save npc positions.

MainScene=null;
MapMaster=false;
var GameScene = Scene.extend({
	
	isSaving:false,
	ctor:function(){
		this._super();
	},

	onOrientationChanged:function(){
		var pos = PlayersController.getYou().getGridPosition();
		GameMap.goToOffsetFromPosition(pos.x*32,pos.y*32);
		resetLayoutsFromObject(this.getLayoutObject(),this.panels);
		SkillBarsInstance.updateLayoutFromSkills();
	},
	
	getLayoutObject:function(){
		 return {
		 "panels":{
			 children:{	
			 	"saving_icon":{
			 		visible:false,
			 		position:cc.p(screenSize.width-52,4),
			 		anchorPoint:cc.p(0,0),
			 		size:cc.size(48,48),
			 		texture:"GUI/save_icon.png",
			 	},
				"logout_button":{
					position:cc.p(screenSize.width-52,screenSize.height-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/logout.png",
				},
				"quicknav_button":{
					position:cc.p(screenSize.width-30,Math.floor(screenSize.height/2)-24),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/quickmenu_closed_icon.png",
				},
				"inventory_button":{
					position:cc.p(screenSize.width-52,Math.floor(screenSize.height/2)+60),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/inventory_icon.png",
				},
				"equipment_button":{
					position:cc.p(screenSize.width-82,Math.floor(screenSize.height/2)+4),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/equipment_icon.png",
				},
				"skill_button":{
					position:cc.p(screenSize.width-82,Math.floor(screenSize.height/2)-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/skills_icon.png",
				},
				"chat_button":{
					position:cc.p(screenSize.width-52,Math.floor(screenSize.height/2)-108),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/chat_icon.png",
				},

				"quickedit_button":{
					position:cc.p(0,Math.floor(screenSize.height/2)-24),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/quickedit_closed_icon.png",
				},
				"mapedit_button":{
					position:cc.p(4,Math.floor(screenSize.height/2)+116),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/mapeditor_icon.png",
				},
				"npcedit_button":{
					position:cc.p(34,Math.floor(screenSize.height/2)+60),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/npceditor_icon.png",
				},
				"itemedit_button":{
					position:cc.p(64,Math.floor(screenSize.height/2)+4),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/itemeditor_icon.png",
				},
				"skilledit_button":{
					position:cc.p(64,Math.floor(screenSize.height/2)-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/skilleditor_icon.png",
				},
				"scriptedit_button":{
					position:cc.p(90,Math.floor(screenSize.height/2)-108),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/scripteditor_icon.png",
				},
				"settings_button":{
					position:cc.p(4,Math.floor(screenSize.height/2)-220),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/settings_icon.png",
				},
				//Level 2
				"bankedit_button":{
					position:cc.p(90,Math.floor(screenSize.height/2)+60),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/bankeditor_icon.png",
				},
				"shopedit_button":{
					position:cc.p(120,Math.floor(screenSize.height/2)+4),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/shopeditor_icon.png",
				},
				"questedit_button":{
					position:cc.p(120,Math.floor(screenSize.height/2)-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/questeditor_icon.png",
				},

			}
			}
		}
	},
	
	isQuickVis:false,
	isEditVis:false,
	
	setServerConnected:function(active){
		if(active==false){
			this.destroyGame();
			SceneManager.getInstance().goToScene("Login",{serverConnected:false});
		}
	},
	
	destroyGame:function(){
		GameMap.destroy();
		GameMap.setInstanceNull();
		if(Equipment!=null){
			Equipment.willTerminate();
			Equipment.removeFromParent();
			Equipment=null;
		}
		if(Inventory!=null){
			Inventory.willTerminate();
			Inventory.removeFromParent();
			Inventory=null;
		}
		if(Skills!=null){
			Skills.willTerminate();
			Skills.removeFromParent();
			Skills=null;
		}
		if(Quests!=null){
			Quests.willTerminate();
			Quests.removeFromParent();
			Quests=null;
		}
		SkillBarsInstance.removeFromParent();
		PlayersController.destroy();
		PlayersController.setInstanceNull();
		GameChat.destroy();
		GameChat.setInstanceNull();
	},

	onTouchBegan:function(touch){
		if(cc.rectContainsPoint(cc.rect(this.panels["logout_button"].getPositionX(),this.panels["logout_button"].getPositionY(),this.panels["logout_button"].getContentSize().width,this.panels["logout_button"].getContentSize().height),touch._point)){
			this.destroyGame();
			SceneManager.getInstance().goToScene("Login",{logout:true, serverConnected:true});
			return true;
		}
		SceneManager.setActiveScene(this);
		if(cc.rectContainsPoint(this.panels["chat_button"].getBoundingBox(),touch._point) && this.panels["chat_button"].isVisible()){
			this.onKeyUp("C");
			return true;
		}
		if(cc.rectContainsPoint(this.panels["inventory_button"].getBoundingBox(),touch._point) && this.panels["inventory_button"].isVisible()){
			this.onKeyUp("I");
			return true;
		}
		if(cc.rectContainsPoint(this.panels["equipment_button"].getBoundingBox(),touch._point) &&  this.panels["equipment_button"].isVisible()){
			this.onKeyUp("E");
			return true;
		}
		if(cc.rectContainsPoint(this.panels["skill_button"].getBoundingBox(),touch._point) && this.panels["skill_button"].isVisible()){
			this.onKeyUp("S");
			return true;
		}
		if(this.panels["quickedit_button"].isVisible() && cc.rectContainsPoint(this.panels["quickedit_button"].getBoundingBox(),touch._point) && this.panels["quickedit_button"].isVisible()){
			this.showEditControls(!this.isEditVis);
			return true;
		}
		if(cc.rectContainsPoint(this.panels["quicknav_button"].getBoundingBox(),touch._point) && this.panels["quicknav_button"].isVisible()){
			this.showQuickControls(!this.isQuickVis);
			return true;
		}
		if(cc.rectContainsPoint(this.panels["mapedit_button"].getBoundingBox(),touch._point) && this.panels["mapedit_button"].isVisible()){
			this.runCommand("/editmap");
			return true;
		}
		if(cc.rectContainsPoint(this.panels["npcedit_button"].getBoundingBox(),touch._point) && this.panels["npcedit_button"].isVisible()){
			this.runCommand("/editnpc");
			return true;
		}	
		if(cc.rectContainsPoint(this.panels["itemedit_button"].getBoundingBox(),touch._point) && this.panels["itemedit_button"].isVisible()){
			this.runCommand("/edititem");
			return true;
		}	
		if(cc.rectContainsPoint(this.panels["skilledit_button"].getBoundingBox(),touch._point) && this.panels["skilledit_button"].isVisible()){
			this.runCommand("/editskill");
			return true;
		}
		if(cc.rectContainsPoint(this.panels["scriptedit_button"].getBoundingBox(),touch._point) && this.panels["scriptedit_button"].isVisible()){
			this.runCommand("/editscript");
			return true;
		}		
		if(cc.rectContainsPoint(this.panels["settings_button"].getBoundingBox(),touch._point) && this.panels["settings_button"].isVisible()){
			this.runCommand("/editsettings");
			return true;
		}	
		if(cc.rectContainsPoint(this.panels["shopedit_button"].getBoundingBox(),touch._point) && this.panels["shopedit_button"].isVisible()){
			this.runCommand("/editshop");
			return true;
		}	
		if(cc.rectContainsPoint(this.panels["questedit_button"].getBoundingBox(),touch._point) && this.panels["questedit_button"].isVisible()){
			this.runCommand("/editquest");
			return true;
		}	
		if(cc.rectContainsPoint(this.panels["bankedit_button"].getBoundingBox(),touch._point) && this.panels["bankedit_button"].isVisible()){
			this.runCommand("/editbank");
			return true;
		}	
	},
	
	showSign:function(name,content){
		if(Sign!=null && !Sign._parent) Sign=null;
		if(Sign){
			Sign.willTerminate();
			Sign.removeFromParent();
			Sign=null;
		} else{
			Sign = new SignPanel();
			Sign.init(name,content);
			Sign.didBecomeActive();
			this.addChild(Sign);
		}
	},
	
	showBook:function(name,content){
		if(Book!=null && !Book._parent) Book=null;
		if(Book){
			Book.willTerminate();
			Book.removeFromParent();
			Book=null;
		} else{
			Book = new BookPanel();
			Book.init(name,content);
			Book.didBecomeActive();
			this.addChild(Book);
		}
	},

	showNPCTalk:function(npc,script,eventnumber,name,content,options){
		if(NpcChat!=null && !NpcChat._parent) NpcChat=null;
		if(NpcChat){
			NpcChat.willTerminate();
			NpcChat.removeFromParent();
			NpcChat=null;
		}
		NpcChat = new NpcChatPanel();
		NpcChat.init(npc,script,eventnumber,name,content,options);
		NpcChat.didBecomeActive();
		this.addChild(NpcChat);
	},

	hideNPCTalk:function(){
		if(NpcChat!=null && !NpcChat._parent) NpcChat=null;
		if(NpcChat){
			NpcChat.willTerminate();
			NpcChat.removeFromParent();
			NpcChat=null;
		}
	},
	
	onKeyUp:function(key){
		switch(key){
			case "C":
				if(GameChat.isShowing()){
					GameChat.hide();
				}
				else{
					GameChat.show();
				}
			break;
			case "ENTER":
				GameChat.setFocused(!GameChat.isFocused());
			break;
			case "SPACE":
				PlayersController.getYou().interactWithTile();
				if(Inventory){
					Inventory.updateTileGrid();
				}
			break;
			case "CTRL":
				PlayersController.getYou().interactWithFacing();
			break;
			case "ESC": this.destroyGame(); SceneManager.getInstance().goToScene("Login",{logout:true,serverConnected:true}); break;
			case "I":
				if(Inventory!=null && !Inventory._parent) Inventory=null;
				if(Inventory){
					Inventory.willTerminate();
					Inventory.removeFromParent();
					Inventory=null;
				} else{
					Inventory = new InventoryPanel();
					Inventory.init();
					Inventory.didBecomeActive();
					this.addChild(Inventory);
				}
			break;
			case "E":
				if(Equipment!=null && !Equipment._parent) Equipment=null;
				if(Equipment){
					Equipment.willTerminate();
					Equipment.removeFromParent();
					Equipment=null;
				} else{
					Equipment = new EquipmentPanel();
					Equipment.init();
					Equipment.didBecomeActive();
					this.addChild(Equipment);
				}
			break;
			case "S":
				if(Skills!=null && !Skills._parent) Skills=null;
				if(Skills){
					Skills.willTerminate();
					Skills.removeFromParent();
					Skills=null;
				} else{
					Skills = new SkillsPanel();
					Skills.init();
					Skills.didBecomeActive();
					this.addChild(Skills);
				}
			break;
			case "Q":
				if(Quests!=null && !Quests._parent) Quests=null;
				if(Quests){
					Quests.willTerminate();
					Quests.removeFromParent();
					Quests=null;
				} else{
					Quests = new QuestsPanel();
					Quests.init();
					Quests.didBecomeActive();
					this.addChild(Quests);
				}
			break;
		}
	},
	
	onKeyDown:function(keys){
		var gp = PlayersController.getYou().getGridPosition();
		PlayersController.getYou().path=null;
		if(gp.x%1==0 && gp.y%1==0){
			switch(keys){
				case "RIGHTARROW": PlayersController.getYou().walkTo(gp.x+1,gp.y);  break;
				case "LEFTARROW":  PlayersController.getYou().walkTo(gp.x-1,gp.y);   break;
				case "UPARROW": PlayersController.getYou().walkTo(gp.x,gp.y+1);  break;
				case "DOWNARROW":  PlayersController.getYou().walkTo(gp.x,gp.y-1); break;
			}
		}
	},
	
	showQuickControls:function(visible){
		this.isQuickVis = visible;
		this.panels["chat_button"].setVisible(visible);
		this.panels["inventory_button"].setVisible(visible);
		this.panels["equipment_button"].setVisible(visible);
		this.panels["skill_button"].setVisible(visible);
		this.panels["quicknav_button"].setTexture(cc.TextureCache.getInstance().addImage(visible==true?"GUI/quickmenu_opened_icon.png":"GUI/quickmenu_closed_icon.png"));
	},
	
	showEditControls:function(visible){
		this.isEditVis = visible;
		this.panels["mapedit_button"].setVisible(visible);
		this.panels["npcedit_button"].setVisible(visible);
		this.panels["itemedit_button"].setVisible(visible);
		this.panels["skilledit_button"].setVisible(visible);
		this.panels["scriptedit_button"].setVisible(visible);
		this.panels["settings_button"].setVisible(visible);
		this.panels["shopedit_button"].setVisible(visible);
		this.panels["bankedit_button"].setVisible(visible);
		this.panels["questedit_button"].setVisible(visible);
		this.panels["quickedit_button"].setTexture(cc.TextureCache.getInstance().addImage(visible==true?"GUI/quickedit_opened_icon.png":"GUI/quickedit_closed_icon.png"));
	},

	runCommand:function(command){
	if(!command){
		return;
	}
		if(PlayersController.getYou().access>1){
			switch(command){
				case "/editscript":
					if(Scripteditor!=null && !Scripteditor._parent) Scripteditor=null;
					if(Scripteditor){
						Scripteditor.willTerminate();
						Scripteditor.removeFromParent();
						Scripteditor=null;
					} else{
						Scripteditor = new ScriptingList();
						Scripteditor.init({delegate:null,editor:new ScriptEditor(),list:ObjectLists.getScriptList(),name:"Script List"});
						Scripteditor.didBecomeActive();
						this.addChild(Scripteditor);
					}
				break;
				case "/editmap":
					if(Mapeditor!=null && !Mapeditor._parent) Mapeditor=null;
					if(Mapeditor){
						Mapeditor.willTerminate();
						Mapeditor.removeFromParent();
						Mapeditor=null;
						GameMap.setInteractionDelegate(null);
					} else{
						Mapeditor = new MapEditor();
						Mapeditor.init();
						Mapeditor.didBecomeActive();
						this.addChild(Mapeditor);
						GameMap.setInteractionDelegate(Mapeditor);
					}
				break;
				case "/editsettings":
					if(Settingseditor!=null && !Settingseditor._parent) Settingseditor=null;
					if(Settingseditor){
						Settingseditor.willTerminate();
						Settingseditor.removeFromParent();
						Settingseditor=null;
					} else{
						Settingseditor = new SettingsEditor();
						Settingseditor.init();
						Settingseditor.didBecomeActive();
						this.addChild(Settingseditor);
					}
				break;
				case "/editskill": 
					if(Skillseditor!=null && !Skillseditor._parent) Skillseditor=null;
					if(Skillseditor){
						Skillseditor.willTerminate();
						Skillseditor.removeFromParent();
						Skillseditor=null;
					} else{
						Skillseditor = new PopupList();
						Skillseditor.init({delegate:null,editor:new SkillsEditor(),list:ObjectLists.getSkillsList(),name:"Skills List"});
						Skillseditor.didBecomeActive();
						this.addChild(Skillseditor);
					}
				break;		
				case "/edititem": 
					if(Itemeditor!=null && !Itemeditor._parent) Itemeditor=null;
					if(Itemeditor){
						Itemeditor.willTerminate();
						Itemeditor.removeFromParent();
						Itemeditor=null;
						GameMap.setInteractionDelegate(null);
					} else{
						Itemeditor = new PopupList();
						Itemeditor.init({delegate:null,editor:new ItemEditor(),list:ObjectLists.getItemList(),name:"Item List"});
						Itemeditor.didBecomeActive();
						this.addChild(Itemeditor);
					}
				break;
				case "/editnpc": 
					if(NPCeditor!=null && !NPCeditor._parent) NPCeditor=null;
					if(NPCeditor){
						NPCeditor.willTerminate();
						NPCeditor.removeFromParent();
						NPCeditor=null;
						GameMap.setInteractionDelegate(null);
					} else{
						NPCeditor = new PopupList();
						NPCeditor.init({delegate:null,editor:new NPCEditor(),list:ObjectLists.getNPCList(),name:"NPC List"});
						NPCeditor.didBecomeActive();
						this.addChild(NPCeditor);
					}
				break;
				case "/editquest": 
					if(Questeditor!=null && !Questeditor._parent) Questeditor=null;
					if(Questeditor){
						Questeditor.willTerminate();
						Questeditor.removeFromParent();
						Questeditor=null;
						GameMap.setInteractionDelegate(null);
					} else{
						Questeditor = new PopupList();
						Questeditor.init({delegate:null,editor:new QuestEditor(),list:ObjectLists.getQuestList(),name:"Quest List"});
						Questeditor.didBecomeActive();
						this.addChild(Questeditor);
					}
				break;
			}
		}
		switch(command){
			case "/help":
			    GameChat.showHelp();

			break;		
			case "/commands":
				GameChat.showCommands();
			break;
			case "/diceroll":
				var number = Math.floor( (Math.random() * 6) + 1);
				var dicerollString = settingsData["/diceroll"];
				dicerollString = dicerollString.replace("<PLAYER>",PlayersController.getYou().getName());
				dicerollString = dicerollString.replace("<VALUE>",number);
				GameChat.addMessage(dicerollString);
				sendMessageToServer({"diceroll":dicerollString});
			break;
			case "/coinflip":
				var coin = Math.floor( (Math.random() * 3) + 1) == 1 ? "Heads" : "Tails";
				var coinflipString = settingsData["/coinflip"];
				coinflipString = coinflipString.replace("<PLAYER>",PlayersController.getYou().getName());
				coinflipString = coinflipString.replace("<VALUE>",coin);
				GameChat.addMessage(coinflipString);
				sendMessageToServer({"coinflip":coinflipString});
			break;
			case "/dance":
				var danceString = settingsData["/dance"];
				danceString = danceString.replace("<PLAYER>",PlayersController.getYou().getName());
				GameChat.addMessage(danceString);
				sendMessageToServer({"dance":danceString});
			break;
			case "/afk":
				PlayersController.getYou().updateStatus("AFK");
				sendMessageToServer({"afk":true});
			break;
		}


	},
	
	init:function(withData){
		this._super();
	//	var bgLayer = cc.LayerColor.create(cc.c3b(0,0,0),screenSize.width,screenSize.height);
	//	bgLayer.setAnchorPoint(cc.p(0,0));
	//	bgLayer.setPosition(cc.p(0,0));
	//	this.addChild(bgLayer);
		MainScene=this;	
		this.addChild(GameMap.create());
		ObjectLists.getInstance();
		
		
		var playerData ={
			name: withData.playerData["name"],
			isPlayer:true,
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:withData.playerData["location"]["mapnumber"],
			position:withData.playerData["location"]["position"],
			textureName: "sprites1.png",
			spriteId: 1,
			access:withData.playerData["rank"],
			inventory:withData.playerData["inventory"],
			equipment:withData.playerData["equipment"],
			quests:withData.playerData["quests"],
			extraData:withData.playerData["extraData"],
		};

		PlayersController.create(playerData);
		GameMap.addPlayersController(PlayersController.getInstance());
	


		this.panels.removeFromParent();
		this.setTouchPriority(-20);
		sendMessageToServer({"moveTo":((PlayersController.getYou().getGridPosition().x) + ((PlayersController.getYou().getGridPosition().y) * gridWidth))});
		
		this.addChild(GameChat.create());
		this.addChild(SkillBars.create(withData.playerData["skills"]));

		this.showQuickControls(false);
		this.showEditControls(false);

		this.setupEditAccess();

		this.addChild(this.panels);		
		this.schedule(this.storedMessages);	
		this.schedule(this.serverProcess);
		this.schedule(this.saveSchedule,120);

	},

	saveSchedule:function(){
		var saveData = {
			"saveUser":true,
			"name":PlayersController.getYou().getName(),
			"location":{"mapnumber":GameMap.getMapNumber(),"position":((PlayersController.getYou().getGridPosition().x) + ((PlayersController.getYou().getGridPosition().y) * gridWidth))},
			"inventory":PlayersController.getYou().getInventory(),
			"equipment":PlayersController.getYou().getEquipment(),
			"skills":[],
			"clan":"",
			"guilds":[],
			"quests":PlayersController.getYou().quests,
			"friends":[],
			"pets":[],
			"pmessages":[],
			"lastchats":[],
			"health":100,
			"extraData":PlayersController.getYou().extraData,
		};
		this.panels["saving_icon"].setVisible(true);
		this.isSaving=true;
		sendMessageToServer(saveData)
		console.log("SAVING NOW!");
	},

	gameSaved:function(){
		this.panels["saving_icon"].setVisible(false);
		this.isSaving=false;
	},

	setupEditAccess:function(){
		if(PlayersController.getYou().access==1){
			this.panels["quickedit_button"].setVisible(false);
		}
	},
	
	storedMessages:function(){
		if(storedClientMessages.length>0){
			for(var i=0;i<storedClientMessages.length;i++){
				var msg = JSON.parse(storedClientMessages[i]);
				if(msg["moveTo"] && (!PlayersController.getPlayer(msg["id"]) || (PlayersController.getPlayer(msg["id"]) && PlayersController.getPlayer(msg["id"]).isWalking==false) )) {
					reactToSocketMessage(JSON.stringify(msg));
					storedClientMessages.splice(i,1);
				} else if(!msg["moveTo"]) {
					reactToSocketMessage(JSON.stringify(msg));
					storedClientMessages.splice(i,1);
				}
			}
		}
	},

	serverProcess:function(){
		if(MapMaster==true){
			var NPCsInMap = PlayersController.NPCsInMap(GameMap.getMapNumber());
			for(var i in NPCsInMap){
				if(NPCsInMap[i].isPreparing()==false){
					var delay = Math.random()*10+1;
					var currentGridPos = NPCsInMap[i].getGridPosition();
					switch(Math.floor(Math.random() * 4) + 1){
						case 1: currentGridPos.x++; break;
						case 2: currentGridPos.y++; break;
						case 3: currentGridPos.x--; break;
						case 4: currentGridPos.y--; break;
					}
					NPCsInMap[i].setPreparing(currentGridPos,delay);
				}
			}
		}
	},

	
});
