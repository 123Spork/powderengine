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

LocalStorage.getMapData=function(mapNumber){
	if(this.instance.getLastUpdate("maps")){
		if(mapNumber){
			var data = JSON.parse(sys.localStorage.getItem("map_data"));
			return data[mapNumber] ? data[mapNumber] :null;
		}
	} else{
		sendMessageToServer({"requestmaps":true});
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
		var data = JSON.parse(sys.localStorage.getItem("warps_data"));
		return data? data :[];
	} else{
		sendMessageToServer({"requestwarps":true});
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
		var warparray = JSON.parse(sys.localStorage.getItem("warps_data"));
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
		var data = JSON.parse(sys.localStorage.getItem("items_data"));
		return data? data :[];
	} else{
		sendMessageToServer({"requestitems":true});
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
		var itemarray = JSON.parse(sys.localStorage.getItem("items_data"));
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
		var data = JSON.parse(sys.localStorage.getItem("skills_data"));
		return data? data :[];
	} else{
		sendMessageToServer({"requestskills":true});
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
		var skillarray = JSON.parse(sys.localStorage.getItem("skills_data"));
	}
	skillarray[skillNumber]=data;
	LocalStorage.updateSkillsData(skillarray,updatetime);
};

LocalStorage.refreshSkills=function(data,updatetime){
	skillarray=data;
	LocalStorage.updateSkillsData(skillarray,updatetime);
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
};

LocalStorage.Sync=function(){
	sendMessageToServer({"sync":true, "mapupdate":(this.instance.getLastUpdate("maps")!=null ? this.instance.getLastUpdate("maps"):2),"warpupdate":(this.instance.getLastUpdate("warps")!=null ? this.instance.getLastUpdate("warps"):2),"itemupdate":(this.instance.getLastUpdate("items")!=null ? this.instance.getLastUpdate("items"):2),"skillsupdate":(this.instance.getLastUpdate("skills")!=null ? this.instance.getLastUpdate("skills"):2)});
};

LocalStorage.setMapSaveOnExit=function(value){
	if(value==true || value==false){
		sys.localStorage.setItem("mapedit_saveonexit",value);
	}
};

LocalStorage.getMapSaveOnExit=function(){
	return sys.localStorage.getItem("mapedit_saveonexit")==null?false:sys.localStorage.getItem("mapedit_saveonexit");
};

