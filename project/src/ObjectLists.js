ObjectLists=cc.Class.extend({
	warplist:null,
	itemlist:null
});

ObjectLists.getInstance=function(){
	if(!this.instance){
		this.instance = new ObjectLists();
		this.instance.warplist=LocalStorage.getWarpData();
		this.instance.itemlist=LocalStorage.getItemData();
	} 
	return this.instance;
};

ObjectLists.getWarpList=function(){
	return this.instance.warplist;
};

ObjectLists.setWarpList=function(data){
	this.instance.warplist=data;
};

ObjectLists.getItemList=function(){
	return this.instance.itemlist;
};

ObjectLists.setItemList=function(data){
	this.instance.itemlist=data;
};