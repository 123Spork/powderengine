PopupList = Popup.extend({
	childEditor:null,
	editList:[],
	listName:null,
	showingEditor:false,
	saveNewDataID:-1,
	itemOffsets:0,
	defaultPositions:null,
	
	willTerminate:function(){
		this._super();
		if(this.delegate){
			this.delegate.setTouchEnabled(true);
		}
	},

	init:function(withData){
		this._super();
		this.childEditor=null;
		this.editList=[],
		this.listName=null;
		this.showingEditor=false;
		this.saveNewDataID=-1;
		this.childEditor=withData.editor;
		if(withData.list){
			this.editList=withData.list;
		}
		this.listName=withData.name;
		this.delegate=withData.delegate;
	},

	didBecomeActive:function(){
		this._super();
		this.updateItemOffsets();
	},
	
	getLayoutObject:function(){
		var listPanel = {};
		this.defaultPositions={};
		for(var i in this.editList){
			if(this.editList[i]==null){
				this.editList.splice(i,1);
				continue;
			}
			if(this.delegate!=null){
				listPanel["useElement"+i]={
					size: cc.size(20,20),
					texture:"GUI/use.png",
					position: cc.p(244,305-(i*30)),
					anchorPoint:cc.p(0,0),
				};
			}
			this.defaultPositions["element"+i] = cc.p(32,302-(i*30));		
			

			listPanel["element"+i]={
				size: cc.size(300,1),
				bg: cc.c4b(0,0,0,127),
				position: cc.p(4,302-(i*30)),
				children:{	
					"content":{
						label:this.editList[i].name,
						fontSize:20,
						anchorPoint:cc.p(0,0.5),
						position:cc.p(0,13),
					}
				}
			};

			listPanel["editElement"+i]={
				size: cc.size(20,20),
				texture:"GUI/edit.png",
				anchorPoint:cc.p(0,0),
				position: cc.p(272,305-(i*30)),
			};
			
			listPanel["delElement"+i]={
				size: cc.size(20,20),
				texture:"GUI/trash.png",
				anchorPoint:cc.p(0,0),
				position: cc.p(300,305-(i*30)),
			}

		
			
		}
		
		return { 
			"panels":{
				position:cc.p(300,200),
				children:{	
					"main_panel":{
						anchorPoint:cc.p(0,0),
						size: cc.size(365,328),
						texture:"GUI/list_panel.png",
						children: {
							"list": {
								children: listPanel
							},
							"addButton":{
								size: cc.size(90,26),
								bg: cc.c4b(70,200,70,255),
								position: cc.p(120,302-(this.editList.length*30)),
								children:{	
									"content":{
										label:"+",
										fontSize:20,
										anchorPoint:cc.p(0.5,0.5),
										position:cc.p(45,13),
										color:cc.c3b(0,0,0),
									}
								}
							},
							"upButton":{
								size: cc.size(48,48),
								texture: "GUI/btnUp.png",
								position: cc.p(328,200),
								anchorPoint:cc.p(0,0),
							},
							"downButton":{
								size: cc.size(48,48),
								texture: "GUI/btnDown.png",
								position: cc.p(328,100),
								anchorPoint:cc.p(0,0),
							}

						},
					},
					"control_panel":{
						anchorPoint:cc.p(0,0),
						position: cc.p(0,328),
						size: cc.size(365,32),
						children:{	
							"header":{
								label:this.listName,
								fontSize:20,
								anchorPoint:cc.p(0,0.5),
								position:cc.p(8,16),
							},
							"exitBtn":{
								position: cc.p(337,6),
								size: cc.size(20,20),
								anchorPoint:cc.p(0,0),
								texture: "GUI/close.png",	
							}
						}
					},
				}	
			}
		};
	},

	updateItemOffsets:function(){
		this.panels["main_panel"]["upButton"].setVisible(false);
		this.panels["main_panel"]["downButton"].setVisible(false);
		if(this.editList.length>10){
			if(this.itemOffsets>0){
				this.panels["main_panel"]["upButton"].setVisible(true);
			}
			if(this.itemOffsets<this.editList.length-10){
				this.panels["main_panel"]["downButton"].setVisible(true);
			}

			for(var i=0;i<this.editList.length;i++){
				this.panels["main_panel"]["list"]["element"+i].setPositionY(this.defaultPositions["element"+i].y+(this.itemOffsets*30));
				this.panels["main_panel"]["list"]["delElement"+i].setPositionY(this.defaultPositions["element"+i].y+3+(this.itemOffsets*30));
				this.panels["main_panel"]["list"]["editElement"+i].setPositionY(this.defaultPositions["element"+i].y+3+(this.itemOffsets*30));
				if(this.delegate!=null){
					this.panels["main_panel"]["list"]["useElement"+i].setPositionY(this.defaultPositions["element"+i].y+3+(this.itemOffsets*30));
				}
				this.panels["main_panel"]["addButton"].setPositionY(this.defaultPositions["element"+i].y+((this.itemOffsets-1)*30));
			}
			for(var i=0;i<this.editList.length;i++){
				this.panels["main_panel"]["list"]["element"+i].setVisible(true);
				this.panels["main_panel"]["list"]["delElement"+i].setVisible(true);
				this.panels["main_panel"]["list"]["editElement"+i].setVisible(true);
				if(this.delegate!=null){
					this.panels["main_panel"]["list"]["useElement"+i].setVisible(true);
				}
				this.panels["main_panel"]["addButton"].setVisible(true);
				if(i<this.itemOffsets){
					this.panels["main_panel"]["list"]["element"+i].setVisible(false);
					this.panels["main_panel"]["list"]["delElement"+i].setVisible(false);
					this.panels["main_panel"]["list"]["editElement"+i].setVisible(false);
					if(this.delegate!=null){
						this.panels["main_panel"]["list"]["useElement"+i].setVisible(false);
					}
					this.panels["main_panel"]["addButton"].setVisible(false);
				}
				if(i-this.itemOffsets>10){
					this.panels["main_panel"]["list"]["element"+i].setVisible(false);
					this.panels["main_panel"]["list"]["delElement"+i].setVisible(false);
					this.panels["main_panel"]["list"]["editElement"+i].setVisible(false);
					if(this.delegate!=null){
						this.panels["main_panel"]["list"]["useElement"+i].setVisible(false);
					}
					this.panels["main_panel"]["addButton"].setVisible(false);
				}
				if(i-this.itemOffsets>9){
					this.panels["main_panel"]["addButton"].setVisible(false);
				}
			}
		}
	},

	elementContext:null,

	deleteClicked:function(clicknum){
		switch(clicknum){
			case 1:
				if(this.delegate.elementContext){
					this.delegate.deleteElement(this.delegate.elementContext);
					this.delegate.elementContext=null;
				}
			break;
		}
	},

	onTouchBegan:function(touch){
		if(this._super(touch)){
			return true;
		}
		this.prevMovPos=null;
		var pos = touch._point;
		var truePos = this.panels["main_panel"].convertToNodeSpace(pos);
		
		if(this.showingEditor==false){
			for(var i in this.editList){
				if(isTouching(this.panels["main_panel"]["list"]["editElement"+i],truePos)){
					this.showingEditor=true;
					this.childEditor.init({delegate:this, data:this.editList[i]});
					this._parent.addChild(this.childEditor);
					this.setTouchEnabled(false);
					this.childEditor.didBecomeActive();
					this.saveNewDataID=i+"";
					return true;
				}
				
				if(isTouching(this.panels["main_panel"]["list"]["delElement"+i],truePos)){
					this._parent.addChild(DropDownList.createWithListAndPosition(this,this.deleteClicked,["Cancel","Delete"],touch._point));
					this.elementContext =i;
					return true;
				}
				
				if(this.delegate && isTouching(this.panels["main_panel"]["list"]["useElement"+i],truePos)){
					this.delegate.setTypeData(i,this.editList[i]);
					return true;
				}
			}
			if(isTouching(this.panels["main_panel"]["addButton"],truePos)){
				this.addingNew=true;
				this.showingEditor=true;
				this.saveNewDataID=this.editList.length;
				this.childEditor.init({delegate:this, data:null});
				this.setTouchEnabled(false);
				this._parent.addChild(this.childEditor);
				this.childEditor.didBecomeActive();
				return true;
			}
			if(isTouching(this.panels["main_panel"]["downButton"],truePos)){
				if(this.itemOffsets<this.editList.length-10){
					this.itemOffsets++;
					this.updateItemOffsets();
				}
				return true;
			}
			if(isTouching(this.panels["main_panel"]["upButton"],truePos)){
				if(this.itemOffsets>0){
					this.itemOffsets--;
					this.updateItemOffsets();
				}
				return true;
			}
		}
	},

	endedEdit:function(addData){
		if(addData){
			this.childEditor.runSaveNewData(this.saveNewDataID);
			if(this.addingNew){
				this.editList.push(addData);
				this.panels.removeFromParent();
				this.panels=requestLayout(this);
				this.addChild(this.panels);
			}
		}
		this.setTouchEnabled(true);
		this.addingNew=false;
		this.showingEditor=false;
		var self=this;
		this.scheduleOnce(function(){
		self.childEditor.willTerminate(true);
		self.childEditor.removeFromParent();
		this.updateItemOffsets();
		})
	},
	
	deleteElement:function(number){
		this.editList.splice(number,1);
		this.childEditor.deleteSave(number,this.editList);
		this.panels.removeFromParent();
		this.panels=requestLayout(this);
		this.addChild(this.panels);
		this.updateItemOffsets();
	},
	
});