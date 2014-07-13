ObjectLists=cc.Class.extend({
	warplist:null,
	itemlist:null,
	skillslist:null
});
var ObjectListInstance

ObjectLists.getInstance=function(){
	if(!ObjectListInstance){
		ObjectListInstance = new ObjectLists();
		ObjectListInstance.warplist=LocalStorage.getWarpData();
		ObjectListInstance.itemlist=LocalStorage.getItemData();
		ObjectListInstance.skillslist = LocalStorage.getSkillsData();
	} 
	return ObjectListInstance;
};

ObjectLists.getWarpList=function(){
	return ObjectListInstance.warplist;
};

ObjectLists.setWarpList=function(data){
	ObjectListInstance.warplist=data;
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