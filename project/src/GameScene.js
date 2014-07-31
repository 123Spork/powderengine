//Editing character.js to provide map number to server so can save npc positions.




MainScene=null;
MapMaster=false;
var GameScene = Scene.extend({
	
	ctor:function(){
		this._super();
	},
	
	getLayoutObject:function(){
		 return {
		 "panels":{
			 children:{	
				"logout_button":{
					position:cc.p(screenSize.width-52,screenSize.height-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/logout.png",
				},
				"quicknav_button":{
					position:cc.p(screenSize.width-15,Math.floor(screenSize.height/2)-24),
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
					position:cc.p(screenSize.width-70,Math.floor(screenSize.height/2)+4),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/equipment_icon.png",
				},
				"skill_button":{
					position:cc.p(screenSize.width-70,Math.floor(screenSize.height/2)-52),
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

			}
			}
		}
	},
	

	
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
		if(cc.rectContainsPoint(this.panels["quicknav_button"].getBoundingBox(),touch._point) && this.panels["quicknav_button"].isVisible()){
			this.showQuickControls(!this.isQuickVis);
			return true;
		}
			
	},
	
	showSign:function(data){
		if(Sign!=null && !Sign._parent) Sign=null;
		if(Sign){
			Sign.willTerminate();
			Sign.removeFromParent();
			Sign=null;
		} else{
			Sign = new SignPanel();
			Sign.init(data);
			Sign.didBecomeActive();
			this.addChild(Sign);
		}
	},
	
	showBook:function(data){
		if(Book!=null && !Book._parent) Book=null;
		if(Book){
			Book.willTerminate();
			Book.removeFromParent();
			Book=null;
		} else{
			Book = new BookPanel();
			Book.init(data);
			Book.didBecomeActive();
			this.addChild(Book);
		}
	},
	

	onTouchEnded:function(touch){
		
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
				if(!GameChat.isFocused()) GameChat.setFocused(true);
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
	
	runCommand:function(command){
	if(!command){
		return;
	}
	cc.log(command);
		switch(command){
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
			case "/editwarp": 
				if(Warpeditor!=null && !Warpeditor._parent) Warpeditor=null;
				if(Warpeditor){
					Warpeditor.willTerminate();
					Warpeditor.removeFromParent();
					Warpeditor=null;
				} else{
					Warpeditor = new PopupList();
					Warpeditor.init({delegate:null,editor:new WarpEditor(),list:ObjectLists.getWarpList(),name:"Warp List"});
					Warpeditor.didBecomeActive();
					this.addChild(Warpeditor);
				}
			break;
			case "/editsigns": 
				if(Signeditor!=null && !Signeditor._parent) Signeditor=null;
				if(Signeditor){
					Signeditor.willTerminate();
					Signeditor.removeFromParent();
					Signeditor=null;
				} else{
					Signeditor = new PopupList();
					Signeditor.init({delegate:null,editor:new SignEditor(),list:ObjectLists.getSignsList(),name:"Sign List"});
					Signeditor.didBecomeActive();
					this.addChild(Signeditor);
				}
			break;
			case "/editskills": 
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
			case "/edititems": 
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
			case "/editnpcs": 
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
			case "/help":
			    GameChat.showHelp();

			break;		
			case "/commands":
				GameChat.showCommands();
			break;
			case "/diceroll":
				var number = Math.floor( (Math.random() * 6) + 1);
				number = PlayersController.getYou().getName()+" threw a dice and got "+number+"."
				GameChat.addMessage(number);
				sendMessageToServer({"diceroll":number});
			break;
			case "/coinflip":
				var coin = Math.floor( (Math.random() * 3) + 1) == 1 ? "Heads" : "Tails";
				coin = PlayersController.getYou().getName()+" flipped a coin and got "+coin+"."
				GameChat.addMessage(coin);
				sendMessageToServer({"coinflip":coin});
			break;
			case "/dance":
				var dance = PlayersController.getYou().getName()+" dances the dance of his people.";
				GameChat.addMessage(dance);
				sendMessageToServer({"dance":dance});
			break;
			case "/afk":
				PlayersController.getYou().updateStatus("AFK");
				sendMessageToServer({"afk":true});
			break;
		}
	},
	
	init:function(withData){
		this._super();
		this.addChild(GameMap.create());
		ObjectLists.getInstance();
		
		
		var withData ={
			name: withData.username,
			isPlayer:true,
			stats: {
				"health":{level:1,value:100,maxval:200,maxlvl:900},
				"mana":{level:1,value:100,maxval:200,maxlvl:99},
			},
			map:1,
			textureName: "sprites1.png",
			spriteId: 1,
		};
		PlayersController.create(withData);
		GameMap.addPlayersController(PlayersController.getInstance());
		
		
		this.panels.removeFromParent();
		this.setTouchPriority(-20);
		this.scheduleOnce(function(){GameMap.getInstance().setup(withData.map)});

		sendMessageToServer({"moveTo":((PlayersController.getYou().getGridPosition().x) + ((PlayersController.getYou().getGridPosition().y) * gridWidth))});
		
		this.addChild(GameChat.create());
		
		this.addChild(SkillBars.create());

		this.showQuickControls(false);
		this.addChild(this.panels);		
		this.schedule(this.storedMessages);	
		this.schedule(this.serverProcess);
		MainScene=this;	

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
