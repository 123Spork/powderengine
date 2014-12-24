ListView = cc.ScrollView.extend({
	
listNodes:null,
delegate:null,
callbacklist:null,
noScroll:false,
scrollBar:null,
scrollBarBack:null,
storedPosition:null,

reloadData:function(){
	if(!this.delegate){
		return;
	}
	if(this.scrollBarBack){
		this.scrollBarBack.removeFromParent();
		this.scrollBar.removeFromParent();
	}
	var listSize = this.delegate.getListSize();
	if(listSize.height<this.delegate.getContentSize().height){
		listSize=this.delegate.getContentSize();
		this.noScroll=true;
	}
    this.listNodes = [];
	var elementSize=0;
	for(var i=0;i<this.delegate.getListElementAmount();i++){
		var ilistElementSize = this.delegate.getSizeForElement(i);	
		elementSize+=ilistElementSize.height;
		this.listNodes[i]=cc.Node.create();
		this.listNodes[i].setContentSize(ilistElementSize);
		this.listNodes[i].setPosition(cc.p(0,listSize.height-elementSize));
		this.listNodes[i].setAnchorPoint(cc.p(0,1));	
		this.addChild(this.listNodes[i]);
		this.listNodes[i].addChild(this.delegate.getListNodeForIndex(i));
	}
	this.setTouchPriority(-300);
	this.setTouchMode(0);

	if(this.noScroll==false){
		this.scrollBarBack = cc.Sprite.create();
		this.scrollBarBack.setTextureRect(cc.rect(0,0,1,this.delegate.getContentSize().height));
		this.scrollBarBack.setColor(cc.c4b(0,0,0,255));
		this.scrollBarBack.setAnchorPoint(cc.p(0,0));
		this.scrollBarBack.setPosition(cc.p(this.delegate.getContentSize().width+20,0))
		this.scrollBar = cc.Sprite.create();
		this.scrollBar.setAnchorPoint(cc.p(0,0));
		this.scrollBar.setTextureRect(cc.rect(0,0,20,this.delegate.getContentSize().height/5));
		this.scrollBar.setColor(cc.c4b(90,90,255,255));
		this.scrollBar.setPosition(cc.p(this.delegate.getContentSize().width+10,0));
		this.delegate.addChild(this.scrollBarBack);
		this.delegate.addChild(this.scrollBar);
		this.setContentOffset(cc.p(0,this.maxContainerOffset().y),false);
	}
	this.delegate.setPosition(this.storedPosition);
},


init:function(delegate){
	this.delegate = delegate;
	this.setAnchorPoint(cc.p(0,0));
	this.storedPosition=cc.p(delegate.getPositionX(),delegate.getPositionY());
	this.initWithViewSize(this.delegate.getContentSize(),this.delegate)
    this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
    this.setBounceable(false);
   	var listSize = this.delegate.getListSize();
    var nodey = cc.Node.create();
    nodey.setContentSize(listSize);
    this.setContainer(nodey);
},

setCallBackList:function(_in){
	this.callbacklist = _in;
},

returningFromDelTouch:false,
scrollBarStartPos:null,

highlightNode:function(listelement){
	if(!this.delegate.getHighlightNode){
		return false;
	}
	for(var i=0;i<this.delegate.getListElementAmount();i++){
		this.delegate.getHighlightNode(i).setColor(cc.c4b(255,255,255,255));
	}
	this.delegate.getHighlightNode(listelement).setColor(cc.c4b(255,0,0,255));
},

onTouchBegan:function(touch){
	var pos = touch._point;
	for(var i=0;i<this.delegate.getListElementAmount();i++){
		for(var j in this.callbacklist[i]){
			var truePos = this.listNodes[i].convertToNodeSpace(pos);
			var nodePos = this.delegate.convertToNodeSpace(pos);
			nodePos.x+=this.delegate.getPositionX();
			var isInScene = isTouching(this.delegate,nodePos)
			if(isTouching(this.callbacklist[i][j],truePos)){ //&& isInScene==true){
				var self=this;
				(function(index){
					self.delegate.runListCallBack(self.callbacklist[index][j].callBack,index,touch,self.callbacklist[index][j]);
					self.returningFromDelTouch=true;
				})(i)
				return true;
			}
		}
	}

	if(this.noScroll==false){
		var scrollPos = this.delegate.convertToNodeSpace(pos);
		if(isTouching(this.scrollBar,scrollPos)){
			this.scrollBarStartPos = scrollPos.y-this.scrollBar.getPositionY();
			return true;
		} else{
			this.scrollBarStartPos=null;
		}

	//	return this._super(touch);
	}
},

onTouchMoved:function(touch){
	if(this.returningFromDelTouch==true){
		this.returningFromDelTouch=false;
		return false;
	}

	if(this.noScroll==false){
		var pos = touch._point;
		if(this.scrollBarStartPos!=null){
			var scrollPos = this.delegate.convertToNodeSpace(pos);	
			scrollPos.y-=this.scrollBarStartPos;
			if(scrollPos.y>=0 && (scrollPos.y+this.scrollBar.getContentSize().height)<=this.delegate.getContentSize().height){
				
				var scale = scrollPos.y/(this.scrollBarBack.getContentSize().height-this.scrollBar.getContentSize().height);
				this.setContentOffset(cc.p(0,this.minContainerOffset().y*scale),false);

				this.scrollBar.setPositionY(scrollPos.y);
				return true;
			}
		}

		var mov = this._super(touch);
		var offset = this.getContentOffset();
		var scale = offset.y/this.minContainerOffset().y;
		this.scrollBar.setPositionY((this.scrollBarBack.getContentSize().height-this.scrollBar.getContentSize().height)*scale);
		return mov;
	}
},

});
ListView.create = function(delegate){
	var listview = new ListView();
	listview.init(delegate);
	listview.reloadData();
	return listview;
};