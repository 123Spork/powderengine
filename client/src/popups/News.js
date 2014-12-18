NewsPanel=null,
News = Popup.extend({
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
				"18th December 2014: (v0.79)":[
					"Added initial setup value tab into item editor to add trade values to defined items. You simply add a shop in list and then the price to buy it.",
					"The above system will eventually include a sale price area as well.",
				],
				"17th December 2014: (v0.78)":[
					"Added /wherami and /warpmeto user commands."
				],
				"17th December 2014: (v0.78)":[
					"Added banking panel and implemented banking storage into player profile data.",
					"Added map width and height specifiers to map editor for custom map sizes.",
					"Added shop editor for custom shop type generation.",
					"Compressed script logic into single straightforward functions with a type specifier.",
					"Fixed a couple of bugs",
				],
				"14th December 2014: (v0.75)":[
					"Fixed multiplayer login movement crash."
				],
				"24th November 2014: (v0.75)":[
					"Re-introduced dependancies so that I can added orientation change logic to the project. Clicking and dragging a client window now correctly resizes the game."
				],
				"16th November 2014: (v0.75)":[
					"Cleaned up project dependancies, removed dependancy on socket.io and cocos-utils changes."
				],
				"11th November 2014: (v0.74)":[
					"Added quest log (hotkey Q).",
					"Implemented quest response logic. Added 2 additional 'quest unstarted' and 'quest finished' parameters"
				],
				"10th November 2014: (v0.735)":[
					"Added user extradata content for subscripting. Allows for developers to code in specific scripting logic if needed.",
					"Extradata updates with user login data and is purposefully not localstorage based."
				],
				"9th November 2014: (v0.733)":[
					"Added talking and talk with option callback to the npc scripts contexts."
				],
				"8th November 2014: (v0.731)":[
					"Fixed NPC editor.",
					"Added talk graphic and basic logic for npc interaction",
					"Abstracted Item script logic to a utils function...wiped a lot of duplicate code."
				],
				"25th October 2014: (v0.729)":[
					"Added scripting response logic for giving/taking items.",
					"Added scripting requirements logic for if a panel is visible and inventory has a certain amount of slots."
				],	
				"25th October 2014: (v0.727)":[
					"Fixed a bunch of persistant bugs. Game is now much much more stable than it was.",
					"Added scripts for on pickup and on drop. Added some additional response logic for warping the player. Added requirement logic for check if player has items and if player stats are within certain ranges.",
				],	
				"24th October 2014: (v0.724)":[
					"Added functionality to more scripts. Items can now use the destroy and open/close panel scripts.",
					"Fixed equip script to use the equip position defined within the scripting system instead of previously defined sub-item types from previous versions.",
				],
				"23rd October 2014: (v0.722)":[
					"Added functionality to some item scripts. Game now modifies inventory drop down behaviour based on responses type (read/equip).",
					"Items can now influence player stats on equip, dequip, swapped and on read.",
				],

				"30th September 2014: (v0.72)":[
					"Added user saving and loading for player position, items and equipment. Picked up and equipped items are now stored and saved regardless of session.",
					"Edited the skills panel to utilise the list view logic. Skills menu now shows level and experience progression and uses data from the user account",
					"Added health manipulation functionality utilising new skill logic as noted in the previous point."
				],


				"27th September 2014: (v0.72)":[
					"Added registration and logging in system. Users can now have automatic login setup for their accounts and player data is starting to be saved from an actual account.",
					"Server now has a new folder where user data is stored.",
					"Added the beginnings of a user ranking system, game editors can now only be accessed if the player rank is above 1. Rank 1 is now the default registration rank.",
				],


				"25th August 2014: (v0.718)":[
					"Added 90% of subeditors needed for the scripting system. Go into the script editor and press the pencil icon on the responses and requirements to edit their core data.",
					"Updated script panel texture to utilize inpanel submenu editors.",
					"Abstracted out the script editor so that its not dependant on certain types.",
					"Added/removed requirements responses based on logical conclusions on what is actually needed. Consume as an item response, for example, is unecessary because it would work identically to destroy."
				],

				"17th August 2014: (v0.714)":[
					"Added basic template logic of new scripting editor system. Scripts can be saved and loaded like other list systems. This editor currently does not allow you to apply scripts to anything (it is simply the GUI interface template logic that's in there). The item editor has been changed to utilize the new saved scripts list.",
					"Fixed localstorage issue caused by settings implementation. Game now does not now load until the game is fully in sync. The issue was causing an error on some game-loads because the localstorage was not yet available (requiring a refresh).",
				],

				"11th August 2014: (v0.708)":[
					"Added settings menu for various game controls. Settings menu only currently controls a load of in game string settings. Also added the additional required admin panel graphic for settings access. The new chatbox command is /editsettings.",
					"Added scrolling credits button to login page and populated it.",
					"Added this scrolling news feed to login page and obviously populated it as well.",
				],
				"11th August 2014 (v0.7)":[
					"Added some additional custom gui for some of the editors.",
					"Fixed a lot of bugs (and I mean a lot).",
					"Added 0.7 download to site."
				],
				"10th August 2014 (v0.695)":[
					"Added quest objective editor. New button now made usable in menu.",
					"Objective editor utilizes abstract scrolling list from 0.69.",
				],
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
			for(var k in this.data[j]){
				listnodes[i]=cc.Node.create();
				listnodes[i].setContentSize(324,32);
				
				var element= cc.LayerColor.create(cc.c4b(0,0,0,127),316,1);
				element.setPosition(cc.p(4,0));			
		
			
				var text = cc.LabelTTF.create(this.data[j][k],"Arial",15);
				text.setColor(cc.c3b(0,0,0));
				text.setAnchorPoint(cc.p(0,0));
				text.setPosition(cc.p(4,4));
				text.setDimensions(cc.size(246,0));
				var touchableNodes =[];
				callBackList.push(touchableNodes);
				listnodes[i].addChild(element);
				listnodes[i].addChild(text);
				listnodes[i].setContentSize(324,text.getContentSize().height+8);
				i++;
			}
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
								label:"News",
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