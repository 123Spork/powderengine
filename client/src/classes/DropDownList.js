DropDownList = Scene.extend({
	list:null,
	currentContext:null,
	selected:null,
	panels:null,
	delegate:null,
	delegateFunc:null,
	previousScene:null,
	setupOptions:null,

	ctor:function(){
		this._super()
		this.list=[];
		this.currentContext=0;
	},

	init:function(delegate,delegateFunc,list,position,extras){
		this._super();
		if(!delegate){
			return;
		}
		this.delegate=delegate;
		this.delegateFunc=delegateFunc
		if(list){
			this.list=list;
		}
		if(position){
			this.setPosition(position);
		}
		if(extras){
			this.extras=extras;
		}else{
			this.extras={};
		}
		this.previousScene = SceneManager.getActiveScene();
		SceneManager.setActiveScene(this);
		this.setTouchPriority(-1001);
		this.setMouseEnabled(true);
	},

	onTouchBegan:function(touch){
		var menuPos = this.panels["control_menu"].convertToNodeSpace(touch._point);
		for(var i =0;i<this.list.length;i++){
			if(!this.setupOptions || this.setupOptions[i]["enabled"]==true){
				if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"][i+""].getPositionX(),this.panels["control_menu"][i+""].getPositionY(),this.panels["control_menu"][i+""].getContentSize().width,this.panels["control_menu"][i+""].getContentSize().height),menuPos)){
					this.delegateFunc(i,touch,this.list,this.extras);
				}
			}
		}
		this.prepareExit();
		return true;
	},

	prepareExit:function(){
		SceneManager.setActiveScene(this.previousScene);
		this.removeFromParent();
		scheduleDestroy(this);
	},

	reprepFromSizes:function(){
		this.setPositionY(this.getPositionY()-(this.list.length*24));
		var biggest =0;
		for(var i =0;i<this.list.length;i++){
			if(this.panels["control_menu"][i+""]["content"].getContentSize().width>biggest){
				biggest = this.panels["control_menu"][i+""]["content"].getContentSize().width;
			}
		}
		for(var i =0;i<this.list.length;i++){
			this.panels["control_menu"][i+""].setContentSize(biggest+8,	this.panels["control_menu"][i+""].getContentSize().height);
		}
					this.panels["control_menu"].setContentSize(biggest+8,this.panels["control_menu"].getContentSize().height);
	},

	getLayoutObject:function(){
		var listOptions={};
		for(var i=0; i<this.list.length;i++){
			listOptions[i+""]={
				position: cc.p(0,((this.list.length-1)*24)-(i*24)),
				size: cc.size(96,24),
				anchorPoint:cc.p(0,0),
				color: cc.c4b(200,200,200,200),
				children:{	
					"content":{
						label:this.list[i],
						fontSize:20,
						color:cc.c3b(0,0,0),
						anchorPoint:cc.p(0,0.5),
						position:cc.p(4,12),
					}
				}
			};
		}


		return {
		 "panels":{
			 children:{	
					"control_menu":{
						position:cc.p(0,0),
						color:cc.c4b(200,200,200,0),
						size:cc.size(96,24),
						children:listOptions,
					}
				}
			}
		}
	},


	onMouseMoved:function(event){
		var pos = event.getLocation();
		var menuPos = this.panels["control_menu"].convertToNodeSpace(pos);
		for(var i =0;i<this.list.length;i++){
			this.panels["control_menu"][i+""].setColor(cc.c4b(200,200,200,200));
			if(!this.setupOptions || this.setupOptions[i]["enabled"]==true){
				if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"][i+""].getPositionX(),this.panels["control_menu"][i+""].getPositionY(),this.panels["control_menu"][i+""].getContentSize().width,this.panels["control_menu"][i+""].getContentSize().height),menuPos)){
					this.panels["control_menu"][i+""].setColor(cc.c4b(255,0,0,255));
				}
			}
		}
	}

});


DropDownList.createWithListAndPosition=function(delegate,delegateFunc,list,position,setupOptions,extras){
	var dropDown = new DropDownList();
	dropDown.init(delegate,delegateFunc,list,position,extras);
	dropDown.panels = requestLayout(dropDown.getLayoutObject(),true);
	if(setupOptions){
		for(var i =0;i<dropDown.list.length;i++){
			if(setupOptions[i]["enabled"]==false){
				dropDown.panels["control_menu"][i+""]["content"].setColor(cc.c4b(127,127,127,200));
			}
		}
		dropDown.setupOptions=setupOptions;
	}
	dropDown.addChild(dropDown.panels);
	dropDown.reprepFromSizes();
	return dropDown;
};	
	