ObjectLists=cc.Class.extend({
	warplist:null


});

ObjectLists.getInstance=function(){
	if(!this.instance){
		this.instance = new ObjectLists();
		this.instance.warplist=LocalStorage.getWarpData();
	} 
	return this.instance;
};

ObjectLists.getWarpList=function(){
	return this.instance.warplist;
};

ObjectLists.setWarpList=function(data){
	this.instance.warplist=data;
};