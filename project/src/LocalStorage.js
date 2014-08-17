var LocalStorage=cc.Class.extend({
	instance:null,
	
	getLastUpdate:function(objectType){
		var date = sys.localStorage.getItem("last_"+objectType);
		return date ? date : null;
	},

	setLastUpdate:function(objectType,date){
		var date = sys.localStorage.setItem("last_"+objectType,date);
		return date ? date : null;
	},
	
});

var LocalstorageInstance = null;

LocalStorage.Create = function(){
	if(!LocalstorageInstance){
		LocalstorageInstance = new LocalStorage();
	}
	return LocalstorageInstance;
};

LocalStorage.getInstance=function(){
	return LocalstorageInstance;
};

LocalStorage.setPanelPosition=function(panelName,position){
	var obj = sys.localStorage.getItem("panelStore");
	if(obj=="null" || obj==null){
		console.log("NEW PANEL STORE");
		obj={};
	} else{
		obj = JSON.parse(obj);
	}
	obj[panelName]={"x":position.x,"y":position.y};
	sys.localStorage.setItem("panelStore",JSON.stringify(obj));
};

LocalStorage.getPanelPosition=function(){
	return sys.localStorage.getItem("panelStore");
};

LocalStorage.getMapData=function(mapNumber){
	if(LocalstorageInstance.getLastUpdate("maps")){
		if(mapNumber){
			var data = JSON.parse(sys.localStorage.getItem("map_data"));
			return data[mapNumber] ? data[mapNumber] :null;
		}
	} else{
		return [];
	}
};

LocalStorage.updateMapData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("maps",updatetime);
	sys.localStorage.setItem("map_data",JSON.stringify(data));
};
LocalStorage.changeMap=function(mapNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("maps")){
		var maparray = [];
	} else{
		var maparray = JSON.parse(sys.localStorage.getItem("map_data"));
	}
	maparray[mapNumber]=data;
	LocalStorage.updateMapData(maparray,updatetime);
};

LocalStorage.getScriptData=function(){
	if(LocalstorageInstance.getLastUpdate("scripts")){
		if(sys.localStorage.getItem("scripts_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("scripts_data"));
		}
		return data? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateScriptData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("scripts",updatetime);
	sys.localStorage.setItem("scripts_data",JSON.stringify(data));
};

LocalStorage.changeScript=function(scriptNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("scripts")){
		var scriptarray = [];
	} else{
		if(sys.localStorage.getItem("scripts_data")!=""){
			var scriptarray = JSON.parse(sys.localStorage.getItem("scripts_data"));
		} else{
			var scriptarray=[];
		}
	}
	scriptarray[scriptNumber]=data;
	LocalStorage.updateScriptData(scriptarray,updatetime);
};

LocalStorage.refreshScript=function(data,updatetime){
	scriptarray=data;
	LocalStorage.updateWarpData(scriptarray,updatetime);
};



LocalStorage.getWarpData=function(){
	if(LocalstorageInstance.getLastUpdate("warps")){
		if(sys.localStorage.getItem("warps_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("warps_data"));
		}
		return data? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateWarpData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("warps",updatetime);
	sys.localStorage.setItem("warps_data",JSON.stringify(data));
};

LocalStorage.changeWarp=function(warpNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("warps")){
		var warparray = [];
	} else{
		if(sys.localStorage.getItem("warps_data")!=""){
			var warparray = JSON.parse(sys.localStorage.getItem("warps_data"));
		} else{
			var warparray=[];
		}
	}
	warparray[warpNumber]=data;
	LocalStorage.updateWarpData(warparray,updatetime);
};

LocalStorage.refreshWarp=function(data,updatetime){
	warparray=data;
	LocalStorage.updateWarpData(warparray,updatetime);
};

LocalStorage.getItemData=function(){
	if(LocalstorageInstance.getLastUpdate("items")){
		if(sys.localStorage.getItem("items_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("items_data"));
		}
		return data? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateItemData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("items",updatetime);
	sys.localStorage.setItem("items_data",JSON.stringify(data));
};

LocalStorage.changeItems=function(itemNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("items")){
		var itemarray = [];
	} else{
		if(sys.localStorage.getItem("items_data")!=""){
			var itemarray = JSON.parse(sys.localStorage.getItem("items_data"));
		} else{
			var itemarray=[];
		}
	}
	itemarray[itemNumber]=data;
	LocalStorage.updateItemData(itemarray,updatetime);
};

LocalStorage.refreshItems=function(data,updatetime){
	itemsarray=data;
	LocalStorage.updateItemData(itemsarray,updatetime);
};

LocalStorage.getSkillsData=function(){
	if(LocalstorageInstance.getLastUpdate("skills")){
		if(sys.localStorage.getItem("skills_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("skills_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateSkillsData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("skills",updatetime);
	sys.localStorage.setItem("skills_data",JSON.stringify(data));
};

LocalStorage.changeSkills=function(skillNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("skills")){
		var skillarray = [];
	} else{
		if(sys.localStorage.getItem("skills_data")!=""){
			var skillarray = JSON.parse(sys.localStorage.getItem("skills_data"));
		} else{
			var skillarray = [];
		}
	}
	skillarray[skillNumber]=data;
	LocalStorage.updateSkillsData(skillarray,updatetime);
};


LocalStorage.refreshSkills=function(data,updatetime){
	skillarray=data;
	LocalStorage.updateSkillsData(skillarray,updatetime);
};

LocalStorage.getSignsData=function(){
	if(LocalstorageInstance.getLastUpdate("signs")){
		if(sys.localStorage.getItem("signs_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("signs_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateSignsData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("signs",updatetime);
	sys.localStorage.setItem("signs_data",JSON.stringify(data));
};

LocalStorage.changeSigns=function(signNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("signs")){
		var signarray = [];
	} else{
		if(sys.localStorage.getItem("signs_data")!=""){
			var signarray = JSON.parse(sys.localStorage.getItem("signs_data"));
		} else{
			var signarray = [];
		}
	}
	signarray[signNumber]=data;
	LocalStorage.updateSignsData(signarray,updatetime);
};

LocalStorage.refreshSigns=function(data,updatetime){
	signarray=data;
	LocalStorage.updateSignsData(signarray,updatetime);
};


LocalStorage.getNPCData=function(){
	if(LocalstorageInstance.getLastUpdate("npcs")){
		if(sys.localStorage.getItem("npcs_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("npcs_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateNPCData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("npcs",updatetime);
	sys.localStorage.setItem("npcs_data",JSON.stringify(data));
};

LocalStorage.changeNPC=function(npcNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("npcs")){
		var npcsarray = [];
	} else{
		if(sys.localStorage.getItem("npcs_data")!=""){
			var npcsarray = JSON.parse(sys.localStorage.getItem("npcs_data"));
		} else{
			var npcsarray = [];
		}
	}
	npcsarray[npcNumber]=data;
	LocalStorage.updateNPCData(npcsarray,updatetime);
};

LocalStorage.refreshNPC=function(data,updatetime){
	npcsarray=data;
	LocalStorage.updateSignsData(npcsarray,updatetime);
};


LocalStorage.getQuestData=function(){
	if(LocalstorageInstance.getLastUpdate("quests")){
		if(sys.localStorage.getItem("quests_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("quests_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateQuestData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("quests",updatetime);
	sys.localStorage.setItem("quests_data",JSON.stringify(data));
};

LocalStorage.changeQuest=function(questNumber,data,updatetime){
	if(!LocalstorageInstance.getLastUpdate("quests")){
		var questsarray = [];
	} else{
		if(sys.localStorage.getItem("quests_data")!=""){
			var questsarray = JSON.parse(sys.localStorage.getItem("quests_data"));
		} else{
			var questsarray = [];
		}
	}
	questsarray[questNumber]=data;
	LocalStorage.updateQuestData(questsarray,updatetime);
};

LocalStorage.refreshQuest=function(data,updatetime){
	questsarray=data;
	LocalStorage.updateQuestData(questsarray,updatetime);
};

LocalStorage.getSettingsData=function(){
	if(LocalstorageInstance.getLastUpdate("settings")){
		if(sys.localStorage.getItem("settings_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("settings_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateSettingsData=function(data,updatetime){
	LocalstorageInstance.setLastUpdate("settings",updatetime);
	sys.localStorage.setItem("settings_data",JSON.stringify(data));
};

LocalStorage.Clear=function(){
	sys.localStorage.setItem("map_data",[]);
	sys.localStorage.setItem("last_maps",0);
	sys.localStorage.setItem("warps_data",[]);
	sys.localStorage.setItem("last_warps",0);	
	sys.localStorage.setItem("items_data",[]);
	sys.localStorage.setItem("last_items",0);	
	sys.localStorage.setItem("skills_data",[]);
	sys.localStorage.setItem("last_skills",0);	
	sys.localStorage.setItem("signs_data",[]);
	sys.localStorage.setItem("last_signs",0);	
	sys.localStorage.setItem("npcs_data",[]);
	sys.localStorage.setItem("last_npcs",0);	
	sys.localStorage.setItem("quests_data",[]);
	sys.localStorage.setItem("last_quests",0);	
	sys.localStorage.setItem("settings_data",[]);
	sys.localStorage.setItem("last_settings",0);	
	sys.localStorage.setItem("scripts_data",[]);
	sys.localStorage.setItem("last_scripts",0);	
	sys.localStorage.setItem("panelStore",null);
};

LocalStorage.Sync=function(){
	sendMessageToServer({"sync":true, "mapupdate":(LocalstorageInstance.getLastUpdate("maps")!=null ? LocalstorageInstance.getLastUpdate("maps"):2),"warpupdate":(LocalstorageInstance.getLastUpdate("warps")!=null ? LocalstorageInstance.getLastUpdate("warps"):2),"itemupdate":(LocalstorageInstance.getLastUpdate("items")!=null ? LocalstorageInstance.getLastUpdate("items"):2),"skillsupdate":(LocalstorageInstance.getLastUpdate("skills")!=null ? LocalstorageInstance.getLastUpdate("skills"):2),"signsupdate":(LocalstorageInstance.getLastUpdate("signs")!=null ? LocalstorageInstance.getLastUpdate("signs"):2),"npcsupdate":(LocalstorageInstance.getLastUpdate("npcs")!=null ? LocalstorageInstance.getLastUpdate("npcs"):2),"questsupdate":(LocalstorageInstance.getLastUpdate("quests")!=null ? LocalstorageInstance.getLastUpdate("quests"):2),"settingsupdate":(LocalstorageInstance.getLastUpdate("settings")!=null ? LocalstorageInstance.getLastUpdate("settings"):2),"scriptsupdate":(LocalstorageInstance.getLastUpdate("scripts")!=null ? LocalstorageInstance.getLastUpdate("scripts"):2)});
};

LocalStorage.setMapSaveOnExit=function(value){
	if(value==true || value==false){
		sys.localStorage.setItem("mapedit_saveonexit",value);
	}
};

LocalStorage.getMapSaveOnExit=function(){
	return sys.localStorage.getItem("mapedit_saveonexit")==null?false:sys.localStorage.getItem("mapedit_saveonexit");
};

