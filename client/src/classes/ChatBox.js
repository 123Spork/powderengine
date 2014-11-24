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
	
	addChatMessage:function(message){
		var currText =[];
		for(var i =0;i<7;i++){
			currText.push(this.panels["chat_panel"]["label"+i].getString());
		}
		this.panels["chat_panel"]["label"+0].setString(message);
		for(var i=1;i<8;i++){
			this.panels["chat_panel"]["label"+i].setString(currText[i-1]);
		}
	},
	
	getLayoutObject:function(){
		return {
		"panels":{
			children:{
				"chat_panel":{
					size: cc.size(400,150),
					texture:"GUI/chat.png",
					anchorPoint:cc.p(0,0),
					opacity: 200,
					position: cc.p(0,0),
					children:{
						"chatbar":{
							size:cc.size(390,22),
							position:cc.p(5,124),
							color:cc.c4b(255,255,255,255),
						},
						"label7":{
							label:"",
							position:cc.p(5,0),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
						"label6":{
							label:"",
							position:cc.p(5,15),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
						"label5":{
							label:"",
							position:cc.p(5,30),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
						"label4":{
							label:"",
							position:cc.p(5,45),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
						"label3":{
							label:"",
							position:cc.p(5,60),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},				
						"label2":{
							label:"",
							position:cc.p(5,75),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},				
						"label1":{
							label:"",
							position:cc.p(5,90),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
						"label0":{
							label:"",
							position:cc.p(5,105),
							anchorPoint:cc.p(0,0),
							color:cc.c3b(0,0,0),
						},
					}
				}
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
		gameChatInstance.chatbox = new ChatBox(gameChatInstance.panels["chat_panel"]["chatbar"],cc.size(gameChatInstance.panels["chat_panel"]["chatbar"].getContentSize().width-4,gameChatInstance.panels["chat_panel"]["chatbar"].getContentSize().height),cc.p(2,gameChatInstance.panels["chat_panel"]["chatbar"].getContentSize().height), settingsData["Default ChatBar Message"], cc.c3b(255,255,255), cc.c3b(0,0,0));
		GameChat.hide();
		GameChat.showWelcome();
	}
	return gameChatInstance
};

GameChat.getInstance=function(){
	return gameChatInstance;
};

GameChat.addMessage=function(message,isPlayer){
	if(message.length>50){
		message=message.substring(0,50)+"...";
	}
	if(isPlayer){
		sendMessageToServer({"chatMessage":message});
		gameChatInstance.addChatMessage(PlayersController.getYou().getName()+": "+message);
	} else{
		gameChatInstance.addChatMessage(message);
	}
};

GameChat.show=function(){
	gameChatInstance.panels.setPositionY(0);
};

GameChat.hide=function(){
	gameChatInstance.panels.setPositionY(-76);
};

GameChat.isShowing=function(){
	if(gameChatInstance.panels.getPositionY()!=0){
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
	GameChat.addMessage(strings.gameChat.helpText0);
	GameChat.addMessage(strings.gameChat.helpText1);
	GameChat.addMessage(strings.gameChat.helpText2);
	GameChat.addMessage(strings.gameChat.helpText3);
	GameChat.addMessage(strings.gameChat.helpText4);
};


GameChat.showCommands=function(){
	GameChat.addMessage(strings.gameChat.commandText0);
	GameChat.addMessage(strings.gameChat.commandText1);
	GameChat.addMessage(strings.gameChat.commandText2);
	GameChat.addMessage(strings.gameChat.commandText3);
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

