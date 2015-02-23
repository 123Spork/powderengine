var ChatBox = InputBox.extend({
    editBoxEditingDidBegin: function (editBox) {
		editBox.setText("");
    },

    editBoxEditingDidEnd: function (editBox,ignore) {
		if(!ignore){
			if(editBox.getText().substring(0,1)=="/"){
				this.runChatCommand(editBox.getText());
			}
			else if(editBox.getText().length>0){
				GameChat.addMessage(editBox.getText(),true);
			}
		}
		editBox.setText(settingsData["Default ChatBar Message"]);
        //cc.log("chatBox " + this._getEditBoxName(editBox) + " DidEnd !");
    },
	
	runChatCommand:function(command){
		SceneManager.getInstance().currentScene.runCommand(command);
	},

    editBoxTextChanged: function (editBox, text) {
		editBox.setText(text);
        cc.log("chatBox " + this._getEditBoxName(editBox) + ", TextChanged, text: " + text);
    },

  //  editBoxReturn: function (editBox) {
      //  cc.log("chatBox " + this._getEditBoxName(editBox) + " was returned !");
    //},	
	
	_getEditBoxName:function(){
		return "chatbox";
	},
});

var gameChatInstance=null;
var GameChat=cc.Layer.extend({
	chatbox:null,
	chatList:null,
	listpanel:null,
	
	addChatMessage:function(message){
		if(!this.chatList){
			this.chatList=[];
		}
		if(message.length>300){
			message = message.substring(0,300);
		}
		this.chatList.push(message);
		if(this.chatList.length>100){
			this.chatList.splice(0,1);
		}
		this.updateChatList();
	},

	updateChatList:function(){
		if(this.panels["list"].listView!=null){
			this.panels["list"].listView.removeFromParent();
			this.panels["list"].listView=null;
		}

		var listnodes = [];
		var callBackList=[];
		for(var i=0;i<this.chatList.length;i++){
			listnodes[i]=cc.Node.create();		
			var text = cc.LabelTTF.create(this.chatList[i],"Arial",12);
			text.setAnchorPoint(cc.p(0,0));
			text.setPosition(cc.p(2,2));
			text.setDimensions(cc.size(326,0));
			listnodes[i].setContentSize(330,text.getContentSize().height+4);
			listnodes[i].addChild(text);
			callBackList.push([]);
		}
		var self=this;
		this.panels["list"].getListSize = function(){
			var height =0;
			for(var i=0;i<listnodes.length;i++){
				height+=listnodes[i].getContentSize().height;
			}
			return cc.size(330,height);
		};
		this.panels["list"].getListElementAmount=function(){
			return listnodes.length;
		};
		this.panels["list"].getSizeForElement=function(elementID){
			return listnodes[elementID].getContentSize();
		};
		this.panels["list"].getListNodeForIndex=function(elementID){
			return listnodes[elementID];
		};
		this.panels["list"].getHighlightNode = function(elementID){
			return listnodes[elementID].highlightNode;
		};
		this.panels["list"].runListCallBack=function(name,listelement){
		};
		this.panels["list"].listView = ListView.create(this.panels["list"]);
		if(this.panels["list"].listView.scrollBar){
			this.panels["list"].listView.scrollBar.setPositionX(330);
			this.panels["list"].listView.scrollBar.setContentSize(20,60);
			this.panels["list"].listView.scrollBar.setColor(cc.c4b(200,200,200,100));
			this.panels["list"].listView.scrollBarBack.setVisible(false);
		}
		this.panels["list"].listView.setCallBackList(callBackList);
		this.panels["list"].addChild(this.panels["list"].listView);
	},
	
	getLayoutObject:function(){
		return {
		"panels":{
			children:{
				"chatbar":{
					size:cc.size(350,22),
					position:cc.p(0,0),
					color:cc.c4b(0,0,0,180),
				},
				"lbg":{
					position:cc.p(0,24),
					anchorPoint:cc.p(0,0),
					size:cc.size(350,100),
					color:cc.c4b(0,0,0,180),
				},
				"list":{
					position:cc.p(0,24),
					anchorPoint:cc.p(0,0),
					size:cc.size(330,100),
				},
			}
		}
		};
	}
	
});

GameChat.create=function(){
	if(!gameChatInstance){
		gameChatInstance = new GameChat();
		gameChatInstance.panels = requestLayout(gameChatInstance);
		gameChatInstance.addChild(gameChatInstance.panels);
		gameChatInstance.chatbox = new ChatBox(gameChatInstance.panels["chatbar"],cc.size(gameChatInstance.panels["chatbar"].getContentSize().width-4,gameChatInstance.panels["chatbar"].getContentSize().height),cc.p(2,gameChatInstance.panels["chatbar"].getContentSize().height), settingsData["Default ChatBar Message"], cc.c4b(0,0,0,0), cc.c3b(255,255,255));
		gameChatInstance.chatbox.setBackgroundInvisible();
		GameChat.showWelcome();
	}
	return gameChatInstance
};

GameChat.getInstance=function(){
	return gameChatInstance;
};

GameChat.addMessage=function(message,isPlayer){
	if(isPlayer){
		sendToServer("chatMessage",message);
		gameChatInstance.addChatMessage(PlayersController.getYou().getName()+": "+message);
	} else{
		gameChatInstance.addChatMessage(message);
	}
};

GameChat.isShowing=function(){
	if(gameChatInstance.panels["list"].isVisible()==false){
		return false;
	} else{
		return true;
	}
};

GameChat.setFocused=function(value){
	gameChatInstance.chatbox.setFocused(value);
};

GameChat.isFocused=function(){
	return gameChatInstance.chatbox.isFocused();
};

GameChat.showHelp=function(){
	GameChat.addMessage(settingsData["Help Text"]);
};


GameChat.showCommands=function(){
	GameChat.addMessage(settingsData["Command Text"]);
};

GameChat.showWelcome=function(){
	GameChat.addMessage(settingsData["Welcome Message"]);
};

GameChat.destroy = function(){
	gameChatInstance.panels.removeFromParent();
	gameChatInstance.panels=null;
};

GameChat.setInstanceNull=function(){
	gameChatInstance.removeFromParent();
	gameChatInstance=null;
};

