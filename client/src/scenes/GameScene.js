//Editing character.js to provide map number to server so can save npc positions.

MainScene=null;
Editor=null;
var sizeReducer=0;
var showingEditor=0;
var GameScene = Scene.extend({
	
	isSaving:false,
	editSprite:null,
	ctor:function(){
		this._super();
	},

	onOrientationChanged:function(){
		var pos = PlayersController.getYou().getGridPosition();
		GameMap.goToOffsetFromPosition(pos.x*cellsize,pos.y*cellsize);
		resetLayoutsFromObject(this.getLayoutObject(),this.panels);
		SkillBarsInstance.updateLayoutFromSkills();
	},
	
	getLayoutObject:function(){
		 return {
		 "panels":{
			 children:{	
			 	"editorbg":{
			 		visible:(showingEditor>0),
			 		color:cc.c3b(80,80,80),
			 		size:cc.size(showingEditor,screenSize.height),
			 		position:cc.p(screenSize.width-showingEditor,0),
			 		anchorPoint:cc.p(0,0),
			 	},
 				"game_menu":{
	 				size:cc.size(80,20),
	 				color:cc.c4b(60,60,60),
	 				position:cc.p((screenSize.width-showingEditor)-80,0),
	 				children:{
	 					"lbl":{
	 						label:"Menu",
	 						fontSize:12,
	 						position:cc.p(40,3),
	 						anchorPoint:cc.p(0.5,0),
	 						color:cc.c3b(255,255,255),
	 					},
	 				}
			 	},
			 	"menu_bar":{
			 		color:cc.c4b(60,60,60),
			 		size:cc.size(screenSize.width,20),
			 		position:cc.p(0,screenSize.height-20),
			 		anchorPoint:cc.p(0,0),
			 		children:{
			 			"settings_editorBtn":{
			 				visible:showingEditor>0,
			 				size:cc.size(80,20),
			 				position:cc.p((screenSize.width-showingEditor),0),
			 				anchorPoint:cc.p(0,0),
			 				color:cc.c4b(60,60,60),
			 				children:{
			 					"lbl":{
			 						label:"Editor",
			 						fontSize:12,
			 						anchorPoint:cc.p(0.5,0),
			 						position:cc.p(40,3),
			 					}
			 				}
			 			},
			 			"close_editorBtn":{
			 				visible:showingEditor>0,
			 				size:cc.size(80,20),
			 				position:cc.p((screenSize.width-showingEditor)+80,0),
			 				anchorPoint:cc.p(0,0),
			 				color:cc.c4b(60,60,60),
			 				children:{
			 					"lbl":{
			 						label:"Close Editor",
			 						fontSize:12,
			 						anchorPoint:cc.p(0.5,0),
			 						position:cc.p(40,3),
			 					}
			 				}
			 			},
			 			"game_list":{
			 				visible:showingEditor==0,
			 				size:cc.size(60,20),
			 				position:cc.p(0,0),
			 				color:cc.c3b(60,60,60),
			 				children:{
			 					"lbl":{
							 		label:"Game",
							 		anchorPoint:cc.p(0.5,0),
							 		fontSize:12,
							 		color:cc.c3b(255,255,255),
							 		position:cc.p(30,3),
							 	}
			 				}
			 			},
			 			"script_list":{
			 				visible:showingEditor==0,
			 				size:cc.size(80,20),
			 				position:cc.p(60,0),
			 				color:cc.c3b(60,60,60),
			 				children:{
			 					"lbl":{
							 		label:"Scripts",
							 		anchorPoint:cc.p(0.5,0),
							 		fontSize:12,
							 		color:cc.c3b(255,255,255),
							 		position:cc.p(40,3),
							 	}
			 				}
			 			},
			 			"editor_list":{
			 				visible:showingEditor==0,
			 				size:cc.size(80,20),
			 				position:cc.p(140,0),
			 				color:cc.c3b(60,60,60),
			 				children:{
			 					"lbl":{
							 		label:"Editors",
							 		anchorPoint:cc.p(0.5,0),
							 		fontSize:12,
							 		color:cc.c3b(255,255,255),
							 		position:cc.p(40,3),
							 	}
			 				}
			 			},
			 			"location":{
			 				size:cc.size(150,20),
			 				position:cc.p((screenSize.width-showingEditor)-150,0),
			 				children:{
			 					"maplbl":{
			 						label:"Map: ",
			 						fontSize:12,
			 						position:cc.p(0,3),
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},
			 					"mapnum":{
			 						label:"0",
			 						position:cc.p(32,3),
			 						fontSize:12,
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},
			 					"xlbl":{
			 						label:"x: ",
			 						position:cc.p(70,3),
			 						fontSize:12,
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},
			 					"xnum":{
			 						label:"0",
			 						position:cc.p(81,3),
			 						fontSize:12,
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},
			 					"ylbl":{
			 						label:"y: ",
			 						position:cc.p(110,3),
			 						fontSize:12,
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},
			 					"ynum":{
			 						label:"0",
			 						position:cc.p(121,3),
			 						fontSize:12,
			 						anchorPoint:cc.p(0,0),
			 						color:cc.c3b(255,255,255),
			 					},

			 				}

			 			}
			 		}
			 	},
			 	
			 	"saving_icon":{
			 		visible:false,
			 		position:cc.p((screenSize.width-showingEditor)-52,4),
			 		anchorPoint:cc.p(0,0),
			 		size:cc.size(48,48),
			 		texture:"GUI/save_icon.png",
			 	},
			}
			}
		}
	},
	
	isQuickVis:false,
	isEditVis:false,
	
	updateEditorMap:function(){
		this.panels["menu_bar"]["location"]["mapnum"].setString(GameMap.getMapNumber()+"");	
	},

	updateEditorPos:function(){
		var you = PlayersController.getYou();
		var pos = you.getGridPosition();
		this.panels["menu_bar"]["location"]["xnum"].setString(Math.floor((pos.x))+"");
		this.panels["menu_bar"]["location"]["ynum"].setString(Math.floor((pos.y-1))+"");
	},

	setServerConnected:function(active){
		if(active==false){
			this.destroyGame();
			SceneManager.getInstance().goToScene("Login",{serverConnected:false});
		}
	},
	
	destroyGame:function(){
		GameMap.destroy();
		this.unschedule(this.updateEditorPos);
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
		if(Bank!=null){
			Bank.willTerminate();
			Bank.FromParent();
			Bank=null;
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

	gameClicked:function(clicknum){
		this.delegate.panels["menu_bar"]["game_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["script_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["editor_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(60,60,60));
		switch(clicknum){
			//settingsbtn
			case 0: 
				this.delegate.runCommand("/editsettings");
			break;
		}
	},

	scriptClicked:function(clicknum){
		this.delegate.panels["menu_bar"]["game_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["script_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["editor_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(60,60,60));
		switch(clicknum){
			//defaults
			case 0: 
			break;
			//items
			case 1:
			break;
			//npcs
			case 2:
			break;
			//tiles:
			case 3:
			break;
		}
	},

	editorClicked:function(clicknum){
		this.delegate.panels["menu_bar"]["game_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["script_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["editor_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(60,60,60));
		switch(clicknum){
			//mapeditor
			case 0:
				this.delegate.runCommand("/editmap"); 
			break;
			//itemeditor
			case 1:
				this.delegate.runCommand("/edititem");
			break;
			//npceditor
			case 2:
				this.delegate.runCommand("/editnpc");
			break;
			//shopeditor
			case 3:
				this.delegate.runCommand("/editshop");
			break;
			//questeditor
			case 4:
				this.delegate.runCommand("/editquest");
			break;
			//skilleditor
			case 5:
				this.delegate.runCommand("/editskill");
			break;
		}

	},

	menuClicked:function(clicknum){
		switch(clicknum){
			//logoutbtn
			case 0:
				this.delegate.destroyGame();
				SceneManager.getInstance().goToScene("Login",{logout:true, serverConnected:true});
			break;
		}
	},

	noSelectedMenu:function(touch){
		this.delegate.onTouchBegan(touch);
	},

	closeEditorClicked:function(clicknum){
		this.delegate.panels["menu_bar"]["game_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["script_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["editor_list"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(60,60,60));
		this.delegate.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(60,60,60));
		if(Editor.willExitEditor(clicknum)){
			Editor.willTerminate();
			Editor.removeFromParent();
			Editor=null;
			GameMap.setInteractionDelegate(null);
			this.delegate.hideEditor();
		}
	},

	changeEditorTab:function(clicknum){
		Editor.setTab(clicknum+1);
	},

	onTouchBegan:function(touch){
		this.panels["menu_bar"]["game_list"].setColor(cc.c3b(60,60,60));
		this.panels["menu_bar"]["script_list"].setColor(cc.c3b(60,60,60));
		this.panels["menu_bar"]["editor_list"].setColor(cc.c3b(60,60,60));
		this.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(60,60,60));
		this.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(60,60,60));
		var pos = touch._point;
		var truePos = this.panels["menu_bar"].convertToNodeSpace(pos);
		if(cc.rectContainsPoint(cc.rect(this.panels["menu_bar"]["game_list"].getPositionX(),this.panels["menu_bar"]["game_list"].getPositionY(),this.panels["menu_bar"]["game_list"].getContentSize().width,this.panels["menu_bar"]["game_list"].getContentSize().height),truePos)){
			this.panels["menu_bar"]["game_list"].setColor(cc.c3b(127,127,127));
			var ddown = DropDownList.createWithListAndPosition(this,this.gameClicked,["Settings"],cc.p(0,(screenSize.height)-20));
			ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
			ddown.setMinimumWidth(60);
			this.addChild(ddown);
			return true;
		}
		if(cc.rectContainsPoint(cc.rect(this.panels["menu_bar"]["script_list"].getPositionX(),this.panels["menu_bar"]["script_list"].getPositionY(),this.panels["menu_bar"]["script_list"].getContentSize().width,this.panels["menu_bar"]["script_list"].getContentSize().height),truePos)){
		//	this.panels["menu_bar"]["script_list"].setColor(cc.c3b(127,127,127));
			this.runCommand("/editscript");
		//	this.addChild(DropDownList.createWithListAndPosition(this,this.scriptClicked,["Defaults","Items","NPCs","Tiles"],cc.p(60,(screenSize.height)-20)));
			return true;
		}
		if(cc.rectContainsPoint(cc.rect(this.panels["menu_bar"]["editor_list"].getPositionX(),this.panels["menu_bar"]["editor_list"].getPositionY(),this.panels["menu_bar"]["editor_list"].getContentSize().width,this.panels["menu_bar"]["editor_list"].getContentSize().height),truePos)){
			this.panels["menu_bar"]["editor_list"].setColor(cc.c3b(127,127,127));
			var ddown = DropDownList.createWithListAndPosition(this,this.editorClicked,["Map Editor","Item Editor","NPC Editor","Shop Editor","Quest Editor","Skill Editor"],cc.p(140,(screenSize.height)-20));
			ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
			ddown.setMinimumWidth(80);
			this.addChild(ddown);
			return true;
		}

		if(cc.rectContainsPoint(cc.rect(this.panels["menu_bar"]["close_editorBtn"].getPositionX(),this.panels["menu_bar"]["close_editorBtn"].getPositionY(),this.panels["menu_bar"]["close_editorBtn"].getContentSize().width,this.panels["menu_bar"]["close_editorBtn"].getContentSize().height),truePos)){
			this.panels["menu_bar"]["close_editorBtn"].setColor(cc.c3b(127,127,127));
			var ddown = DropDownList.createWithListAndPosition(this,this.closeEditorClicked,Editor.getCloseOptions(),cc.p((screenSize.width-showingEditor)+80,(screenSize.height)-20));
			ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
			ddown.setMinimumWidth(80);
			this.addChild(ddown);
			return true;
		}

		if(cc.rectContainsPoint(cc.rect(this.panels["menu_bar"]["settings_editorBtn"].getPositionX(),this.panels["menu_bar"]["settings_editorBtn"].getPositionY(),this.panels["menu_bar"]["settings_editorBtn"].getContentSize().width,this.panels["menu_bar"]["settings_editorBtn"].getContentSize().height),truePos)){
			this.panels["menu_bar"]["settings_editorBtn"].setColor(cc.c3b(127,127,127));
			var ddown = DropDownList.createWithListAndPosition(this,this.changeEditorTab,Editor.getTabOptions(),cc.p((screenSize.width-showingEditor),(screenSize.height)-20));
			ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
			ddown.setMinimumWidth(80);
			this.addChild(ddown);
			return true;
		}



		if(cc.rectContainsPoint(cc.rect(this.panels["game_menu"].getPositionX(),this.panels["game_menu"].getPositionY(),this.panels["game_menu"].getContentSize().width,this.panels["game_menu"].getContentSize().height),pos)){
			this.panels["game_menu"].setColor(cc.c3b(127,127,127));
			var ddown = DropDownList.createWithListAndPosition(this,this.menuClicked,["Logout"],cc.p((screenSize.width-showingEditor)-80,44))
			ddown.setNoSelectedTouchCallback(this.noSelectedMenu);
			ddown.setMinimumWidth(80);
			this.addChild(ddown);
			return true;
		}





	
		SceneManager.setActiveScene(this);
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

	showEditor:function(value){
		if(!value){
			var value=352;
		}
		showingEditor=value;
		this.onOrientationChanged();
	},

	hideEditor:function(){
		showingEditor=0;
		this.onOrientationChanged();
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
			/*case "B":
				if(Inventory!=null && !Inventory._parent) Inventory=null;
				if(Inventory){
					Inventory.willTerminate();
					Inventory.removeFromParent();
					Inventory=null;
				}
				if(Bank!=null && !Bank._parent) Bank=null;
				if(Bank){
					Bank.willTerminate();
					Bank.removeFromParent();
					Bank=null;
				} else{
					Bank = new BankPanel();
					Bank.init();
					Bank.didBecomeActive();
					this.addChild(Bank);
				}
			break;*/
			case "I":
				if(Inventory!=null && !Inventory._parent) Inventory=null;
				if(Inventory){
					Inventory.willTerminate();
					Inventory.removeFromParent();
					Inventory=null;
				} else{
					if(Bank!=null && !Bank._parent) Bank=null;
					if(!Bank){
						Inventory = new InventoryPanel();
						Inventory.init();
						Inventory.didBecomeActive();
						this.addChild(Inventory);
					}
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

		if((Shop && Shop._parent) || (Bank && Bank._parent)){
			return;
		}

		if(gp.x%1==0 && gp.y%1==0){
			switch(keys){
				case "RIGHTARROW": 	sendToServer('movePlayerMessage',indexFromPos(gp.x+1,gp.y)); break;
				case "LEFTARROW":  sendToServer('movePlayerMessage',indexFromPos(gp.x-1,gp.y));   break;
				case "UPARROW": sendToServer('movePlayerMessage',indexFromPos(gp.x,gp.y+1));  break;
				case "DOWNARROW":  sendToServer('movePlayerMessage',indexFromPos(gp.x,gp.y-1)); break;
			}
		}
	},

	runCommand:function(command){
	if(!command){
		return;
	}
		switch(command){
			case "/whereami":
				var you = PlayersController.getYou();
				var pos = you.getGridPosition();
				GameChat.addMessage("Map: "+GameMap.getMapNumber()+", XY: ("+pos.x+","+(pos.y-1)+")");
			break;
		}

		if(PlayersController.getYou().access>1){
			if(command.substring(0,9)=="/warpmeto" && command.split(' ').length==4){
				var operands=command.substring(10).split(' ');
				var mapSize = GameMap.getMapSizeForIndex(parseInt(operands[0]));
			
				var position = indexFromPosAndGridSize(parseInt(operands[1]),parseInt(operands[2]),mapSize.width,mapSize.height);
				sendToServer("warpPlayerMessage",{"warpTo":position,"mapnumber":operands[0]});
				GameMap.goToMap(operands[0]);
				var you = PlayersController.getYou();
				you.setPosition(operands[1]*cellsize,(parseInt(operands[2])+1)*cellsize);
				you.isWalking=false;
				GameMap.goToOffsetFromPosition(operands[1]*cellsize,(parseInt(operands[2]))*cellsize);
				return;
			}

			switch(command){
				case "/editscript":
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						this.hideEditor();
						Scripteditor=null;
					} else{
						this.showEditor(1000);
						Editor = new ScriptingList();
						Editor.init({delegate:null,editor:new ScriptEditor(),list:ObjectLists.getScriptList(),name:"Script List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;
				case "/editshop":
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						this.hideEditor();
						Editor=null;
					} else{
						this.showEditor();
						Editor = new PopupList();
						Editor.init({delegate:null,editor:new ShopEditor(),list:ObjectLists.getShopList(),name:"Shop List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;
				case "/editmap":
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						this.hideEditor();
						GameMap.setInteractionDelegate(null);
					} else{
						this.showEditor();
						Editor = new MapEditor();
						Editor.init();
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
						GameMap.setInteractionDelegate(Editor);
					}
				break;
				case "/editsettings":
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						this.hideEditor();
					} else{
						this.showEditor();
						Editor = new SettingsEditor();
						Editor.init();
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;
				case "/editskill": 
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						this.hideEditor();
					} else{
						this.showEditor();
						Editor = new PopupList();
						Editor.init({delegate:null,editor:new SkillsEditor(),list:ObjectLists.getSkillsList(),name:"Skills List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;		
				case "/edititem": 
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						this.hideEditor();
						GameMap.setInteractionDelegate(null);
					} else{
						this.showEditor(466);
						Editor = new PopupList();
						Editor.init({delegate:null,editor:new ItemEditor(),list:ObjectLists.getItemList(),name:"Item List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;
				case "/editnpc": 
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						GameMap.setInteractionDelegate(null);
						this.hideEditor();
					} else{
						this.showEditor();
						Editor = new PopupList();
						Editor.init({delegate:null,editor:new NPCEditor(),list:ObjectLists.getNPCList(),name:"NPC List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
					}
				break;
				case "/editquest": 
					if(Editor!=null && !Editor._parent) Editor=null;
					if(Editor){
						Editor.willTerminate();
						Editor.removeFromParent();
						Editor=null;
						GameMap.setInteractionDelegate(null);
						this.hideEditor();
					} else{
						this.showEditor();
						Editor = new PopupList();
						Editor.init({delegate:null,editor:new QuestEditor(),list:ObjectLists.getQuestList(),name:"Quest List"});
						Editor.didBecomeActive();
						this.editSprite.addChild(Editor);
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
				sendToServer("diceRollMessage",dicerollString);
			break;
			case "/coinflip":
				var coin = Math.floor( (Math.random() * 3) + 1) == 1 ? "Heads" : "Tails";
				var coinflipString = settingsData["/coinflip"];
				coinflipString = coinflipString.replace("<PLAYER>",PlayersController.getYou().getName());
				coinflipString = coinflipString.replace("<VALUE>",coin);
				GameChat.addMessage(coinflipString);
				sendToServer("coinFlipMessage",coinflipString);
			break;
			case "/dance":
				var danceString = settingsData["/dance"];
				danceString = danceString.replace("<PLAYER>",PlayersController.getYou().getName());
				GameChat.addMessage(danceString);
				sendToServer("danceMessage",danceString);
			break;
			case "/afk":
				PlayersController.getYou().updateStatus("AFK");
				sendToServer("afkMessage",null);
			break;
		}


	},
	
	init:function(withData){
		this._super();
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
			map:withData.playerData["location"]["mapnumber"]?withData.playerData["location"]["mapnumber"]:1,
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
		
		this.addChild(GameChat.create());
		this.addChild(SkillBars.create(withData.playerData["skills"]));
		this.schedule(this.updateEditorPos);
		this.setupEditAccess();

		this.addChild(this.panels);		
		this.schedule(this.storedMessages);	
		this.schedule(this.saveSchedule,120);
		if(PlayersController.getYou().access>1){
			this.updateEditorPos();
			this.updateEditorMap();
			sizeReducer=20;
			this.editSprite=this.panels["editorbg"];
		}else{
			this.panels["menu_bar"].setVisible(false);
		}



		SkillBars.update();
	},

	saveSchedule:function(){
		var saveData = {
			"name":PlayersController.getYou().getName(),
			"location":{"mapnumber":GameMap.getMapNumber(),"position":((PlayersController.getYou().getGridPosition().x) + ((PlayersController.getYou().getGridPosition().y) * gridWidth))},
			"inventory":PlayersController.getYou().getInventory(),
			"equipment":PlayersController.getYou().getEquipment(),
			"skills":[],
			"clan":"",
			"guilds":[],
			"quests":PlayersController.getYou().quests,
			"friends":[],
			"bank":PlayersController.getYou().getBank(),
			"pets":[],
			"pmessages":[],
			"lastchats":[],
			"health":100,
			"extraData":PlayersController.getYou().extraData,
		};
		this.panels["saving_icon"].setVisible(true);
		this.isSaving=true;
		sendToServer("saveGameMessage",saveData)
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
});
