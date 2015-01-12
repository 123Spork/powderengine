Login = Scene.extend({
serverActive:false,
waitingOnServer:false,

onOrientationChanged:function(){
	resetLayoutsFromObject(this.getLayoutObject(),this.panels);
},
	
musicStop:function(){
	var musicPlaying=true;
	for(var i in soundList){
		if(isAudioLoading(soundList[i])){
			musicPlaying=false;
		}
	}
	if(musicPlaying){
		stopBackgroundMusic();
		this.unschedule(this.musicStop);	
		playBackgroundMusic("menu");		
	}
},

init:function(withData){
	var waitingforMusic=false;
	for(var i in soundList){
		if(isAudioLoading(soundList[i])){
			this.schedule(this.musicStop);
			waitingforMusic=true;
			break;		
		}
	}
	if(waitingforMusic==false && soundList.indexOf("menu")>-1){
		stopBackgroundMusic();
		playBackgroundMusic("menu");
	}
	settingsData = mergeSettings(settingsData,LocalStorage.getSettingsData());
	this._super();
	SceneManager.setActiveScene(this);
	this.isRegisterMode=false;
	this.isRegistering=false;

	this.namebox = new EntryBox(this.panels["name_entry"],cc.size(this.panels["name_entry"].getContentSize().width,this.panels["name_entry"].getContentSize().height), cc.p(0,this.panels["name_entry"].getContentSize().height), "Username", cc.c4b(100,100,100), cc.c3b(255,255,255));
	this.passbox = new EntryBox(this.panels["password_entry"],cc.size(this.panels["password_entry"].getContentSize().width,this.panels["password_entry"].getContentSize().height), cc.p(0,this.panels["password_entry"].getContentSize().height), "Password", cc.c4b(100,100,100), cc.c3b(255,255,255));
	this.passbox.setInputFlag(0)
	this.register_namebox = new EntryBox(this.panels["new_user_name"],cc.size(this.panels["new_user_name"].getContentSize().width,this.panels["new_user_name"].getContentSize().height), cc.p(0,this.panels["new_user_name"].getContentSize().height), "Username", cc.c4b(100,100,100), cc.c3b(255,255,255));
	this.register_passbox = new EntryBox(this.panels["new_user_pass"],cc.size(this.panels["new_user_pass"].getContentSize().width,this.panels["new_user_pass"].getContentSize().height), cc.p(0,this.panels["new_user_pass"].getContentSize().height), "Password", cc.c4b(100,100,100), cc.c3b(255,255,255));
	this.register_passbox.setInputFlag(0)
	this.register_emailbox = new EntryBox(this.panels["new_user_email"],cc.size(this.panels["new_user_email"].getContentSize().width,this.panels["new_user_email"].getContentSize().height), cc.p(0,this.panels["new_user_email"].getContentSize().height), "Email Address", cc.c4b(100,100,100), cc.c3b(255,255,255));
	this.autoLogin=false;
	if(withData){
		if(withData.logout){
			storedClientMessages=[];
			sendMessageToServer({"logout":true});
		}else{
			this.autoLogin=true;
		}
		this.setServerConnected(withData.serverConnected);
	}
	this.schedule(this.checkAuto);
	this.alreadyChangedCreds=false;
	this.schedule(this.storedMessages);
	this.hideRegister();
	this.panels["rem_login_text"].setDimensions(cc.size(80,0));
	this.panels["auto_login_text"].setDimensions(cc.size(80,0));
	this.panels["server_message"].setDimensions(cc.size(300,0));
	this.panels["server_message2"].setDimensions(cc.size(150,0));
},

onKeyUp:function(key){
		switch(key){
			case "ENTER":
				if(this.isRegisterMode){
					var regName = this.register_namebox.getText();
						var regPass = this.register_passbox.getText();
						var regEmail =  this.register_emailbox.getText();

						if(regName!="" && regName!=null && regPass!="" && regPass!=null && regEmail!="" && regEmail!=null){
							if(validateEmail(regEmail)==false){
								this.setInfoMessage(settingsData["Incorrect Email Format"])
							}else{
								this.isRegistering=true;
								this.setInfoMessage(settingsData["Registering Message"]);
								this.registerPlayer({"name":regName,"password":regPass,"email":regEmail});
							}
						}else{
							this.setInfoMessage(settingsData["Register Empty Fields"]);
						}
				}else{
					if(this.waitingOnServer==false && this.serverActive){
						var logName = this.namebox.getText();
						var logPass = this.passbox.getText();
						if(logName!="" && logName!=null && logPass!="" && logPass!=null){
							this.waitingOnServer=true;
							this.setInfoMessage(settingsData["Logging In Message"]);
							sendMessageToServer({"login":true,"username":this.namebox.getText(),"password":this.passbox.getText()});
						}else{
							this.setInfoMessage(settingsData["User Pass Empty"]);
						}
					} else{
						this.onLoginFailed(settingsData["Server Offline Message"]);
					}
				}
			break;
		}
},

setServerConnected:function(active){
	this.serverActive=active;
	if(active==true){
		this.panels["server_activity"].setString(settingsData["Online Server"]);
		this.panels["server_activity"].setColor(cc.c3b(0,255,0));
	} else{
		this.panels["server_activity"].setString(settingsData["Offline Server"]);
		this.panels["server_activity"].setColor(cc.c3b(255,0,0));
	}
},

checkAuto:function(){
	var credentials = LocalStorage.getStoredCredentials();
	if(credentials && this.alreadyChangedCreds==false){
		this.namebox.setText(credentials["user"]);
		this.alreadyChangedCreds=true;
		this.passbox.setText(credentials["pass"]);
	} 

	if(this.autoLogin==true && autoLoginNextTime && this.waitingOnServer==false && this.serverActive){
		if(this.waitingOnServer==false && this.serverActive){
			this.waitingOnServer=true;
			this.setInfoMessage("Logging In");
			sendMessageToServer({"login":true,"username":this.namebox.getText(),"password":this.passbox.getText()});
		} else{
			this.onLoginFailed(settingsData["Offline Server Message"]);
		}
	}
},

storedMessages:function(){
	if(storedClientMessages.length>0){
		for(var i=storedClientMessages.length-1;i>=0;i--){
			reactToSocketMessage(storedClientMessages[i]);
			storedClientMessages.splice(i,1);
		}
	}
	if(!autoLoginNextTime){
			LocalStorage.setAutoLoginNextTime(false);
		this.panels["auto_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_uncheck.png"));
	}else{
			LocalStorage.setAutoLoginNextTime(true);
		this.panels["auto_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_checked.png"));
	}
	if(!rememberLoginNextTime){
		this.panels["remember_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_uncheck.png"));
	}else{
		this.panels["remember_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_checked.png"));
	}
},

getLayoutObject:function(){
				return { "panels":{
				children:{	
					"background":{
						texture:"GUI/splash.png",
						size:cc.size(960,640),
						anchorPoint:cc.p(0,0),
						position:cc.p(0,0),
					},
					"name_entry":{
						size: cc.size(300,30),
						position: cc.p(325,325),
					},
					"password_entry":{
						size: cc.size(300,30),
						position: cc.p(325,290),
					},
					"new_user_name":{
						size: cc.size(300,30),
						position: cc.p(325,360),
					},
					"new_user_pass":{
						size: cc.size(300,30),
						position: cc.p(325,325),
					},
					"new_user_email":{
						size: cc.size(300,30),
						position: cc.p(325,290),
					},

					"remember_login":{
						size: cc.size(20,20),
						position:cc.p(630,295),
						texture:"GUI/checkbox_uncheck.png",
						anchorPoint:cc.p(0,0),
					},
					"rem_login_text":{
						label:settingsData["Save Login Cred"],
						fontSize:16,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,1),
						position:cc.p(665,315),
					},

					"auto_login":{
						size: cc.size(20,20),
						position:cc.p(630,330),
						texture:"GUI/checkbox_uncheck.png",
						anchorPoint:cc.p(0,0),
					},
					"auto_login_text":{
						label:settingsData["Auto Login Next"],
						fontSize:16,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,0.0),
						position:cc.p(665,330),
					},

					"go_button":{
						position: cc.p(325,240),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:settingsData["Play Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},
					"register_button":{
						position: cc.p(505,240),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:settingsData["Register Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},


					"new_user_back":{
						position: cc.p(325,240),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:settingsData["Back From Reg Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},
					"new_user_confirm":{
						position: cc.p(505,240),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:settingsData["Reg Confirm Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},

					"sysMessage":{
						label:settingsData["System Message"],
						position:cc.p(4,4),
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,0),
					},


					"credits_button":{
						position: cc.p(30,400),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						children:{
							"label":{
								label:settingsData["Credit Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},

					"news_button":{
						position: cc.p(30,340),
						size: cc.size(120,40),
						color: cc.c4b(0,0,0,255),
						anchorPoint:cc.p(0,1),
						children:{
							"label":{
								label:settingsData["News Button Text"],
								fontSize:20,
								color:cc.c3b(255,255,255),
								anchorPoint:cc.p(0.5,0.5),
								position:cc.p(60,20),
							}
						}
					},
					"server_message":{
						label:"",
						fontSize:16,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,1),
						position:cc.p(325,220),
					},
					"server_message2":{
						label:settingsData["Login Message"],
						fontSize:16,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(0,1),
						position:cc.p(175,355),
					},
					"version_number":{
						label:settingsData["Version Number"],
						fontSize:34,
						color:cc.c3b(255,255,255),
						anchorPoint:cc.p(1,1),
						position:cc.p(710,55),
					},
					"server_activity":{
						position:cc.p(910,630),
						size:cc.size(100,20),
						anchorPoint:cc.p(0.5,0.5),
						label:settingsData["Offline Server"],
						color:cc.c3b(255,0,0),
					}
				}
			}
			};
},

switchAutoLogin:function(){
	if(autoLoginNextTime){
		autoLoginNextTime=false;
		this.panels["auto_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_uncheck.png"));
	}else{
		autoLoginNextTime=true;
		this.panels["auto_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_checked.png"));
		rememberLoginNextTime=true;
		this.panels["remember_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_checked.png"));
	}
},

switchRememberLogin:function(){
	if(rememberLoginNextTime){
		rememberLoginNextTime=false;
		this.panels["remember_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_uncheck.png"));
		autoLoginNextTime=false;
		this.panels["auto_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_uncheck.png"));
	}else{
		rememberLoginNextTime=true;
		this.panels["remember_login"].setTexture(cc.TextureCache.getInstance().addImage("GUI/checkbox_checked.png"));
	}
},

onTouchBegan:function(touch){
	if(this.namebox.getText()!=null){
		if(this.panels["go_button"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["go_button"].getPositionX(),this.panels["go_button"].getPositionY(),this.panels["go_button"].getContentSize().width,this.panels["go_button"].getContentSize().height),touch._point)){
			if(this.waitingOnServer==false && this.serverActive){
				var logName = this.namebox.getText();
				var logPass = this.passbox.getText();
				if(logName!="" && logName!=null && logPass!="" && logPass!=null){
					this.waitingOnServer=true;
					this.setInfoMessage(settingsData["Logging In Message"]);
					sendMessageToServer({"login":true,"username":this.namebox.getText(),"password":this.passbox.getText()});
				}else{
					this.setInfoMessage(settingsData["User Pass Empty"]);
				}
				return true;
			} else{
				this.onLoginFailed(settingsData["Offline Server Message"]);
				return true;
			}
		}
	}
	if(this.panels["credits_button"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["credits_button"].getPositionX(),this.panels["credits_button"].getPositionY(),this.panels["credits_button"].getContentSize().width,this.panels["credits_button"].getContentSize().height),touch._point)){
		this.runCommand("/openCredits");
	}
	if(this.panels["news_button"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["news_button"].getPositionX(),this.panels["news_button"].getPositionY(),this.panels["news_button"].getContentSize().width,this.panels["news_button"].getContentSize().height),touch._point)){
		this.runCommand("/openNews");
	}
	if(this.panels["register_button"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["register_button"].getPositionX(),this.panels["register_button"].getPositionY(),this.panels["register_button"].getContentSize().width,this.panels["register_button"].getContentSize().height),touch._point)){
		this.showRegister();
		return false;
	}

	if(this.panels["auto_login"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["auto_login"].getPositionX(),this.panels["auto_login"].getPositionY(),this.panels["auto_login"].getContentSize().width,this.panels["auto_login"].getContentSize().height),touch._point)){
		this.switchAutoLogin();
		return false;
	}

	if(this.panels["remember_login"].isVisible() && cc.rectContainsPoint(cc.rect(this.panels["remember_login"].getPositionX(),this.panels["remember_login"].getPositionY(),this.panels["remember_login"].getContentSize().width,this.panels["remember_login"].getContentSize().height),touch._point)){
		this.switchRememberLogin();
		return false;
	}

	if(this.panels["new_user_back"].isVisible() && this.isRegistering==false && cc.rectContainsPoint(cc.rect(this.panels["new_user_back"].getPositionX(),this.panels["new_user_back"].getPositionY(),this.panels["new_user_back"].getContentSize().width,this.panels["new_user_back"].getContentSize().height),touch._point)){
		this.hideRegister();
		this.setInfoMessage("");
		return false;	
	}

	if(this.panels["new_user_confirm"].isVisible() && this.isRegistering==false && cc.rectContainsPoint(cc.rect(this.panels["new_user_confirm"].getPositionX(),this.panels["new_user_confirm"].getPositionY(),this.panels["new_user_confirm"].getContentSize().width,this.panels["new_user_confirm"].getContentSize().height),touch._point)){
		var regName = this.register_namebox.getText();
		var regPass = this.register_passbox.getText();
		var regEmail =  this.register_emailbox.getText();

		if(regName!="" && regName!=null && regPass!="" && regPass!=null && regEmail!="" && regEmail!=null){
			if(validateEmail(regEmail)==false){
				this.setInfoMessage(settingsData["Incorrect Email Format"])
			}else{
				this.isRegistering=true;
				this.setInfoMessage(settingsData["Registering Message"]);
				this.registerPlayer({"name":regName,"password":regPass,"email":regEmail});
			}
		}else{
			this.setInfoMessage(settingsData["Register Empty Fields"]);
		}
		return false;
	}
},

registerPlayer:function(playerDetails){
	playerDetails["newUser"]=1;
	sendMessageToServer(playerDetails);
},

completedRegistration:function(){
	this.setInfoMessage(settingsData["Registration Success"]);
	this.register_namebox.setText(settingsData["Username Label"]);
	this.register_passbox.setText(settingsData["Password Label"]);
	this.register_emailbox.setText(settingsData["Email Label"]);
	this.isRegistering=false;
	this.hideRegister();
},

failedRegistration:function(reason){
	this.isRegistering=false;
	switch(reason){
		case "UserTaken": this.setInfoMessage(settingsData["Register User Taken"]); break;
	}

},

showRegister:function(){
	this.panels["new_user_name"].setVisible(true);
	this.panels["new_user_pass"].setVisible(true);
	this.panels["new_user_email"].setVisible(true);
	this.panels["new_user_confirm"].setVisible(true);
	this.panels["new_user_back"].setVisible(true);
	this.panels["register_button"].setVisible(false);
	this.panels["go_button"].setVisible(false);
	this.panels["name_entry"].setPositionX(-100000);
	this.panels["password_entry"].setPositionX(-100000);
	this.panels["new_user_name"].setPositionX(325);
	this.panels["new_user_pass"].setPositionX(325);
	this.panels["new_user_email"].setPositionX(325);
	this.panels["rem_login_text"].setVisible(false);
	this.panels["auto_login_text"].setVisible(false);
	this.panels["auto_login"].setVisible(false);
	this.panels["remember_login"].setVisible(false);
	this.isRegisterMode=true;
},

hideRegister:function(){
	this.panels["new_user_name"].setVisible(false);
	this.panels["new_user_pass"].setVisible(false);
	this.panels["new_user_email"].setVisible(false);
	this.panels["new_user_confirm"].setVisible(false);
	this.panels["new_user_back"].setVisible(false);
	this.panels["register_button"].setVisible(true);
	this.panels["go_button"].setVisible(true);
	this.panels["name_entry"].setPositionX(325);
	this.panels["password_entry"].setPositionX(325);
	this.panels["new_user_name"].setPositionX(-100000);
	this.panels["new_user_pass"].setPositionX(100000);
	this.panels["new_user_email"].setPositionX(100000);
	this.panels["rem_login_text"].setVisible(true);
	this.panels["auto_login_text"].setVisible(true);
	this.panels["auto_login"].setVisible(true);
	this.panels["remember_login"].setVisible(true);
	this.isRegisterMode=false;
},

runCommand:function(command){
	switch(command){
		case "/openCredits":
				if(CreditsPanel!=null && !CreditsPanel._parent) CreditsPanel=null;
				if(CreditsPanel){
					CreditsPanel.willTerminate();
					CreditsPanel.removeFromParent();
					CreditsPanel=null;
				} else{
					CreditsPanel = new Credits();
					CreditsPanel.init();
					CreditsPanel.didBecomeActive();
					this.addChild(CreditsPanel);
				}
		break;
		case "/openNews":
				if(NewsPanel!=null && !NewsPanel._parent) NewsPanel=null;
				if(NewsPanel){
					NewsPanel.willTerminate();
					NewsPanel.removeFromParent();
					NewsPanel=null;
				} else{
					NewsPanel = new News();
					NewsPanel.init();
					NewsPanel.didBecomeActive();
					this.addChild(NewsPanel);
				}
		break;
	}
},

onLoginSuccess:function(playerData){	
	if(rememberLoginNextTime){
		LocalStorage.setSaveLogin(this.namebox.getText(),this.passbox.getText());
	}

	this.unschedule(this.checkAuto);

	SceneManager.getInstance().goToScene("Game",{playerData:playerData, map:1});
},

onLoginFailed:function(message){	
	this.unschedule(this.checkAuto);

	this.panels["server_message"].setString(message);
	this.waitingOnServer=false;
},

setInfoMessage:function(message){
	this.panels["server_message"].setString(message);
},

logInWithData:function(data){
	SceneManager.getInstance().goToScene("Game",{username:this.namebox.getText()});
},

});
