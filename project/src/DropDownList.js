DropDownList = Scene.extend({
	list:null,
	currentContext:null,
	selected:null,
	panels:null,
	delegate:null,
	delegateFunc:null,
	previousScene:null,

	ctor:function(){
		this._super()
		this.list=[];
		this.currentContext=0;
	},

	init:function(delegate,delegateFunc,list,position){
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
		this.previousScene = SceneManager.getActiveScene();
		SceneManager.setActiveScene(this);
		this.setTouchPriority(-1001);
		this.setMouseEnabled(true);
	},

	onTouchBegan:function(touch){
		var menuPos = this.panels["control_menu"].convertToNodeSpace(touch._point);
		for(var i =0;i<this.list.length;i++){
			if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"][i+""].getPositionX(),this.panels["control_menu"][i+""].getPositionY(),this.panels["control_menu"][i+""].getContentSize().width,this.panels["control_menu"][i+""].getContentSize().height),menuPos)){
				this.delegateFunc(i);
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
			this.panels["control_menu"][i+""].changeWidth(biggest+8)
		}
		this.panels["control_menu"].changeWidth(biggest+8);
	},

	getLayoutObject:function(){
		var listOptions={};
		for(var i=0; i<this.list.length;i++){
			listOptions[i+""]={
				position: cc.p(0,((this.list.length-1)*24)-(i*24)),
				size: cc.size(96,24),
				anchorPoint:cc.p(0,0),
				bg: cc.c4b(200,200,200,200),
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
						bg:cc.c4b(200,200,200,0),
						size:cc.size(96,48),
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
			if(cc.rectContainsPoint(cc.rect(this.panels["control_menu"][i+""].getPositionX(),this.panels["control_menu"][i+""].getPositionY(),this.panels["control_menu"][i+""].getContentSize().width,this.panels["control_menu"][i+""].getContentSize().height),menuPos)){
				this.panels["control_menu"][i+""].setColor(cc.c4b(255,0,0,255));
			}
		}
	}

});


DropDownList.createWithListAndPosition=function(delegate,delegateFunc,list,position){
	var dropDown = new DropDownList();
	dropDown.init(delegate,delegateFunc,list,position);
	dropDown.panels = requestLayout(dropDown.getLayoutObject(),true);
	dropDown.addChild(dropDown.panels);
	dropDown.reprepFromSizes();
	return dropDown;
};	
	