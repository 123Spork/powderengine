var InputBox = cc.Class.extend({
	inputBox:null,
	focused:false,
	
	setFocused:function(_isFocused){
		if(_isFocused){
			this.inputBox._edTxt.focus();
		} else{
			this.inputBox._edTxt.blur();
		}
	},
	
	isFocused:function(){
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
		this.inputBox = cc.EditBox.create(cc.size(size.width, size.height),cc.Scale9Sprite.create(),type);
		this.inputBox.setText(defaultText);
		this.inputBox.defaultText=defaultText;
		this.inputBox.setFontColor(cc.c3b(fontColor.r,fontColor.g,fontColor.b));
		this.inputBox.setBackgroundColor(cc.c3b(bgColor.r,bgColor.g,bgColor.b));
		this.inputBox.setPosition(cc.p(position.x,position.y));
		this.inputBox.setAnchorPoint(0,1);
		this.inputBox.setDelegate(this);
		parent.addChild(this.inputBox);
		this.init();
	},
});

