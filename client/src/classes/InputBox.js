var InputBox = cc.Class.extend({
	inputBox:null,
	focused:false,
	
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
	
	ctor:function(parent, size, position, defaultText, bgColor, fontColor, type){
		if(!type || type==false){
			this.inputBox = SingleLineBox.create(cc.size(size.width, size.height),cc.Scale9Sprite.create());
			var hex = rgbToHex(bgColor.r,bgColor.g,bgColor.b);
			this.inputBox._edTxt.style.background=hex;
		}else{
			this.inputBox = MultiLineBox.create(cc.size(size.width, size.height),cc.Scale9Sprite.create());
			this.inputBox.setBackgroundColor(cc.c3b(bgColor.r,bgColor.g,bgColor.b));
		}
		this.inputBox.setText(defaultText);
		this.inputBox.defaultText=defaultText;
		this.inputBox.setFontColor(cc.c3b(fontColor.r,fontColor.g,fontColor.b));
		this.inputBox.setPosition(cc.p(position.x,position.y));
		this.inputBox.setAnchorPoint(0,0);
		this.inputBox.setDelegate(this);
		parent.addChild(this.inputBox);
		this.init();
	},
});

