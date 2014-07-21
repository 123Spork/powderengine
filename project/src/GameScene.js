MainScene=null;
var GameScene = Scene.extend({
	
	ctor:function(){
		this._super();
	},
	
	getLayoutObject:function(){
		 return {
		 "panels":{
			 children:{	
				"logout_button":{
					position:cc.p(960-52,640-52),
					anchorPoint:cc.p(0,0),
					size:cc.size(48,48),
					texture:"GUI/logout.png",
				}
			}
			}
		}
	},
	
	getMobileLayoutObject:function(){
		return {
			"panels":{
				children:{
					"chattoggle":{
						position:cc.p(410,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Chat",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"inventorytoggle":{
						position:cc.p(484,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Inventory",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"equipmenttoggle":{
						position:cc.p(558,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Equipment",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"upbutton":{
						position:cc.p(632,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Up",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"downbutton":{
						position:cc.p(706,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Down",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"leftbutton":{
						position:cc.p(780,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Left",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"rightbutton":{
						position:cc.p(854,0),
						size:cc.size(64,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"Right",
								color:cc.c3b(0,0,0),
								position:cc.p(32,32),
							}
						}
					},
					"hidebutton":{
						position:cc.p(928,0),
						size:cc.size(32,64),
						bg:cc.c4b(255,255,255,120),
						children:{
							"label":{
								label:"<<",
								color:cc.c3b(0,0,0),
								position:cc.p(16,32),
							}
						}
					},
				}
			}
		};
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
		if(this.mobileControls){
			if(cc.rectContainsPoint(this.mobileControls["upbutton"].getBoundingBox(),touch._point) && this.mobileControls["upbutton"].isVisible()){
				keyMap[38]=true
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["downbutton"].getBoundingBox(),touch._point) && this.mobileControls["downbutton"].isVisible()){
				keyMap[40]=true
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["leftbutton"].getBoundingBox(),touch._point) && this.mobileControls["leftbutton"].isVisible()){
				keyMap[37]=true
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["rightbutton"].getBoundingBox(),touch._point) && this.mobileControls["rightbutton"].isVisible()){
				keyMap[39]=true
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["chattoggle"].getBoundingBox(),touch._point) && this.mobileControls["chattoggle"].isVisible()){
				PlayersController.getYou().path=null;
				if(GameChat.isShowing()){
					GameChat.hide();
				}
				else{
					GameChat.show();
				}
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["inventorytoggle"].getBoundingBox(),touch._point) && this.mobileControls["inventorytoggle"].isVisible()){
				PlayersController.getYou().path=null;
				if(Inventory!=null && !Inventory._parent) Equipment=null;
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
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["equipmenttoggle"].getBoundingBox(),touch._point) && this.mobileControls["equipmenttoggle"].isVisible()){
				PlayersController.getYou().path=null;
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
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["hidebutton"].getBoundingBox(),touch._point) && this.mobileControls["hidebutton"].isVisible()){
				this.showMobileControls(this.mobileControls.isVis==true?false:true);
				keyMap[37]=false;
				keyMap[38]=false;
				keyMap[39]=false;
				keyMap[34]=false;
				return true;
			}
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
	
	onTouchEnded:function(touch){
		if(this.mobileControls){
			if(cc.rectContainsPoint(this.mobileControls["upbutton"].getBoundingBox(),touch._point) && this.mobileControls["upbutton"].isVisible()){
				keyMap[38]=false;
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["downbutton"].getBoundingBox(),touch._point) && this.mobileControls["downbutton"].isVisible()){
				keyMap[40]=false;
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["leftbutton"].getBoundingBox(),touch._point) && this.mobileControls["leftbutton"].isVisible()){
				keyMap[37]=false;
				return true;
			}
			if(cc.rectContainsPoint(this.mobileControls["rightbutton"].getBoundingBox(),touch._point) && this.mobileControls["rightbutton"].isVisible()){
				keyMap[39]=false;
				return true;
			}
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
	
	showMobileControls:function(visible){
		if(this.mobileControls){
			this.mobileControls.isVis = visible;
			this.mobileControls["upbutton"].setVisible(visible);
			this.mobileControls["downbutton"].setVisible(visible);
			this.mobileControls["leftbutton"].setVisible(visible);
			this.mobileControls["rightbutton"].setVisible(visible);
			this.mobileControls["chattoggle"].setVisible(visible);
			this.mobileControls["inventorytoggle"].setVisible(visible);
			this.mobileControls["equipmenttoggle"].setVisible(visible);
			this.mobileControls["hidebutton"]["label"].setString(visible==true?">>":"<<");
		}
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

		if(isMobile()){
			this.mobileControls = requestLayout(this.getMobileLayoutObject(),true);
			this.addChild(this.mobileControls);
			this.showMobileControls(false);
		}
		
		
		
		this.addChild(this.panels);		
		this.schedule(this.storedMessages);	
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

	
});
