ObjectLists=cc.Class.extend({
	itemlist:null,
	skillslist:null,
	npclist:null,
	questlist:null,
	scriptlist:null,
	shoplist:null,
});
var ObjectListInstance

ObjectLists.getInstance=function(){
	if(!ObjectListInstance){
		ObjectListInstance = new ObjectLists();
		ObjectListInstance.itemlist=LocalStorage.getItemData();
		ObjectListInstance.skillslist = LocalStorage.getSkillsData();
		ObjectListInstance.npclist=LocalStorage.getNPCData();
		ObjectListInstance.questlist=LocalStorage.getQuestData();
		ObjectListInstance.scriptlist=LocalStorage.getScriptData();
		ObjectListInstance.shoplist=LocalStorage.getShopData();
	} 
	return ObjectListInstance;
};

ObjectLists.getItemList=function(){
	return ObjectListInstance.itemlist;
};

ObjectLists.setItemList=function(data){
	ObjectListInstance.itemlist=data;
};

ObjectLists.getSkillsList=function(){
	return ObjectListInstance.skillslist;
};

ObjectLists.setSkillsList=function(data){
	ObjectListInstance.skillslist=data;
};

ObjectLists.getNPCList=function(){
	return ObjectListInstance.npclist;
};

ObjectLists.setNPCList=function(data){
	ObjectListInstance.npclist=data;
};

ObjectLists.getQuestList=function(){
	return ObjectListInstance.questlist;
};

ObjectLists.setQuestList=function(data){
	ObjectListInstance.questlist=data;
};

ObjectLists.getScriptList=function(){
	return ObjectListInstance.scriptlist;
};

ObjectLists.setScriptList=function(data){
	ObjectListInstance.scriptlist=data;
};

ObjectLists.getShopList=function(){
	return ObjectListInstance.shoplist;
};

ObjectLists.setShopList=function(data){
	ObjectListInstance.shoplist=data;
};


