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

LocalStorage.Create = function(){
	if(!this.instance){
		this.instance = new LocalStorage();
	}
	return this.instance;
};

LocalStorage.getInstance=function(){
	return this.instance;
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
	if(this.instance.getLastUpdate("maps")){
		if(mapNumber){
			var data = JSON.parse(sys.localStorage.getItem("map_data"));
			return data[mapNumber] ? data[mapNumber] :null;
		}
	} else{
		return [];
	}
};

LocalStorage.updateMapData=function(data,updatetime){
	this.instance.setLastUpdate("maps",updatetime);
	sys.localStorage.setItem("map_data",JSON.stringify(data));
};
LocalStorage.changeMap=function(mapNumber,data,updatetime){
	if(!this.instance.getLastUpdate("maps")){
		var maparray = [];
	} else{
		var maparray = JSON.parse(sys.localStorage.getItem("map_data"));
	}
	maparray[mapNumber]=data;
	LocalStorage.updateMapData(maparray,updatetime);
};


LocalStorage.getWarpData=function(){
	if(this.instance.getLastUpdate("warps")){
		if(sys.localStorage.getItem("warps_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("warps_data"));
		}
		return data? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateWarpData=function(data,updatetime){
	this.instance.setLastUpdate("warps",updatetime);
	sys.localStorage.setItem("warps_data",JSON.stringify(data));
};

LocalStorage.changeWarp=function(warpNumber,data,updatetime){
	if(!this.instance.getLastUpdate("warps")){
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
	if(this.instance.getLastUpdate("items")){
		if(sys.localStorage.getItem("items_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("items_data"));
		}
		return data? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateItemData=function(data,updatetime){
	this.instance.setLastUpdate("items",updatetime);
	sys.localStorage.setItem("items_data",JSON.stringify(data));
};

LocalStorage.changeItems=function(itemNumber,data,updatetime){
	if(!this.instance.getLastUpdate("items")){
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
	if(this.instance.getLastUpdate("skills")){
		if(sys.localStorage.getItem("skills_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("skills_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateSkillsData=function(data,updatetime){
	this.instance.setLastUpdate("skills",updatetime);
	sys.localStorage.setItem("skills_data",JSON.stringify(data));
};

LocalStorage.changeSkills=function(skillNumber,data,updatetime){
	if(!this.instance.getLastUpdate("skills")){
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
	if(this.instance.getLastUpdate("signs")){
		if(sys.localStorage.getItem("signs_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("signs_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateSignsData=function(data,updatetime){
	this.instance.setLastUpdate("signs",updatetime);
	sys.localStorage.setItem("signs_data",JSON.stringify(data));
};

LocalStorage.changeSigns=function(signNumber,data,updatetime){
	if(!this.instance.getLastUpdate("signs")){
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
	if(this.instance.getLastUpdate("npcs")){
		if(sys.localStorage.getItem("npcs_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("npcs_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateNPCData=function(data,updatetime){
	this.instance.setLastUpdate("npcs",updatetime);
	sys.localStorage.setItem("npcs_data",JSON.stringify(data));
};

LocalStorage.changeNPC=function(npcNumber,data,updatetime){
	if(!this.instance.getLastUpdate("npcs")){
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
	if(this.instance.getLastUpdate("quests")){
		if(sys.localStorage.getItem("quests_data")!=""){
			var data = JSON.parse(sys.localStorage.getItem("quests_data"));
		}
		return data ? data :[];
	} else{
		return [];
	}
};

LocalStorage.updateQuestData=function(data,updatetime){
	this.instance.setLastUpdate("quests",updatetime);
	sys.localStorage.setItem("quests_data",JSON.stringify(data));
};

LocalStorage.changeQuest=function(questNumber,data,updatetime){
	if(!this.instance.getLastUpdate("quests")){
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
	sys.localStorage.setItem("panelStore",null);
};

LocalStorage.Sync=function(){
	sendMessageToServer({"sync":true, "mapupdate":(this.instance.getLastUpdate("maps")!=null ? this.instance.getLastUpdate("maps"):2),"warpupdate":(this.instance.getLastUpdate("warps")!=null ? this.instance.getLastUpdate("warps"):2),"itemupdate":(this.instance.getLastUpdate("items")!=null ? this.instance.getLastUpdate("items"):2),"skillsupdate":(this.instance.getLastUpdate("skills")!=null ? this.instance.getLastUpdate("skills"):2),"signsupdate":(this.instance.getLastUpdate("signs")!=null ? this.instance.getLastUpdate("signs"):2),"npcsupdate":(this.instance.getLastUpdate("npcs")!=null ? this.instance.getLastUpdate("npcs"):2),"questsupdate":(this.instance.getLastUpdate("quests")!=null ? this.instance.getLastUpdate("quests"):2)});
};

LocalStorage.setMapSaveOnExit=function(value){
	if(value==true || value==false){
		sys.localStorage.setItem("mapedit_saveonexit",value);
	}
};

LocalStorage.getMapSaveOnExit=function(){
	return sys.localStorage.getItem("mapedit_saveonexit")==null?false:sys.localStorage.getItem("mapedit_saveonexit");
};

