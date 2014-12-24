var InputBox = cc.Class.extend({
	inputBox:null,
	focused:false,
	delegate:null,
	
	setFocused:function(_isFocused){
		console.log("setting focused: " + _isFocused)
		if(_isFocused && _isFocused==true){
			this.inputBox._edTxt.focus();
		} else{
			console.log("blurrin");
			this.inputBox._edTxt.blur();
		}
	},
	
	isFocused:function(){
		console.log("isfocused="+document.activeElement == this.inputBox._edTxt);
		return document.activeElement == this.inputBox._edTxt;
	},
	
	setString:function(_in){
		this.inputBox.setText(_in);
	},
	
	getString:function(){
		return this.inputBox.getText();
	},
	
	init:function(){
		cc.log("Ovveride inputbox init call if necessary");
	},

	removeFromParent:function(){
		this.inputBox.removeFromParent();
	},
	
	ctor:function(parent, size, position, defaultText, bgColor, fontColor, type,filename,delegate){
		if(!type || type==false){
			this.inputBox = SingleLineBox.create(cc.size(size.width, size.height),filename? cc.Scale9Sprite.create(filename) : cc.Scale9Sprite.create());
			var hex = rgbToHex(bgColor.r,bgColor.g,bgColor.b);
			this.inputBox._edTxt.style.background=hex;
		}else{
			this.inputBox = MultiLineBox.create(cc.size(size.width, size.height),filename? cc.Scale9Sprite.create(filename) : cc.Scale9Sprite.create());
			this.inputBox.setBackgroundColor(cc.c3b(bgColor.r,bgColor.g,bgColor.b));
		}
		this.inputBox.setText(defaultText);
		this.inputBox.defaultText=defaultText;
		this.inputBox.setFontColor(cc.c3b(fontColor.r,fontColor.g,fontColor.b));
		this.inputBox.setPosition(position.x,position.y);
		this.inputBox.setAnchorPoint(cc.p(0,1));
		this.inputBox.setDelegate(this);
		this.delegate=delegate;
		parent.addChild(this.inputBox);
		this.init();
	},
});

