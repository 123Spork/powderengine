var newsreq = new XMLHttpRequest();
newsreq.open("GET", "news.txt", false);
newsreq.send(null);
var newsValue = newsreq.responseText;

Login = Scene.extend({
serverActive:false,
waitingOnServer:false,

init:function(withData){
	this._super();	
	SceneManager.setActiveScene(this);
	this.namebox = new EntryBox(this.panels["name_entry"],cc.size(this.panels["name_entry"].getContentSize().width,this.panels["name_entry"].getContentSize().height), cc.p(0,this.panels["name_entry"].getContentSize().height), "Enter Name", cc.c4b(100,100,100), cc.c3b(255,255,255));
	if(withData){
		if(withData.logout){
			storedClientMessages=[];
			sendMessageToServer({"logout":true});
		}
		this.setServerConnected(withData.serverConnected);
	}
	this.schedule(this.storedMessages);
},

onKeyUp:function(key){
		switch(key){
			case "ENTER":
				if(this.waitingOnServer==false && this.serverActive){
					this.waitingOnServer=true;
					sendMessageToServer({"login":true,"username":this.namebox.getText()});
				} else{
					this.onLoginFailed("Server is offline!");
				}
			break;
		}
},

setServerConnected:function(active){
	this.serverActive=active;
	if(active==true){
		this.panels["server_activity"]["label"].setString("Server: Online");
		this.panels["server_activity"]["label"].setColor(cc.c3b(0,255,0));
	} else{
		this.panels["server_activity"]["label"].setString("Server: Offline");
		this.panels["server_activity"]["label"].setColor(cc.c3b(255,0,0));
	}
},

storedMessages:function(){
	if(storedClientMessages.length>0){
		for(var i=storedClientMessages.length-1;i>=0;i--){
			reactToSocketMessage(storedClientMessages[i]);
			storedClientMessages.splice(i,1);
		}
	}
},

getLayoutObject:function(){
				return { "panels":{
				children:{	
					"name_entry":{
						size: cc.size(300,30),
						position: cc.p(325,300),
					},
					"go_button":{
						position: cc.p(420,220),
						size: cc.size(120,40),
						bg: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:"Play",
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},
					"news_message":{
						label:newsValue,
						fontSize:14,
						color:cc.c3b(0,0,0),
						anchorPoint:cc.p(0,1),
						position:cc.p(30,610),
					},
					"server_message":{
						label:"",
						fontSize:16,
						color:cc.c3b(127,0,0),
						anchorPoint:cc.p(0,0),
						position:cc.p(327,325),
					},
					"server_activity":{
						position:cc.p(860,620),
						size:cc.size(100,20),
						bg:cc.c4b(255,255,0,127),
						children:{
							"label":{
								label:"Server: Offline",
								color:cc.c3b(255,0,0),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(50,10),
							}
						}
					}
				}
				}
			};
},

onTouchBegan:function(touch){
	if(this.namebox.getText()!=null){
		if(cc.rectContainsPoint(cc.rect(this.panels["go_button"].getPositionX(),this.panels["go_button"].getPositionY(),this.panels["go_button"].getContentSize().width,this.panels["go_button"].getContentSize().height),touch._point)){
			if(this.waitingOnServer==false && this.serverActive){
				this.waitingOnServer=true;
				sendMessageToServer({"login":true,"username":this.namebox.getText()});
				return true;
			} else{
				this.onLoginFailed("Server is offline!");
				return true;
			}
		}
	}
},

onLoginSuccess:function(){	
	SceneManager.getInstance().goToScene("Game",{username:this.namebox.getText(), map:1});
},

onLoginFailed:function(message){	
	this.panels["server_message"].setString(message);
	this.waitingOnServer=false;
},


onTouchMoved:function(touch){

},

onTouchEnded:function(touch){
},

logInWithData:function(data){
	SceneManager.getInstance().goToScene("Game",{username:this.namebox.getText()});
},

});
