var EntryBox = InputBox.extend({
	hasEntry:false,
	nullAllowed:false,
	dontClear:false,
	
    editBoxEditingDidBegin: function (editBox) {
    	if(this.dontClear==false){
			editBox.setText("");
		}
    },

    editBoxEditingDidEnd: function (editBox) {
		if(editBox.getText()==null || editBox.getText().length == "" && this.nullAllowed){
			this.hasEntry=true;
			return;
		}
		if(!editBox.getText().length>0){
			editBox.setText(this.inputBox.defaultText);
			this.hasEntry=false;
			return;
		}
		this.hasEntry=true;
    },
	
    editBoxTextChanged: function (editBox, text) {
		editBox.setText(text);
		this.hasEntry=true;
    },
	
	_getEditBoxName:function(){
		return "name_entry";
	},
	
	getText:function(){
		if(this.hasEntry==true || this.defaultFine==true){
			return this.inputBox.getText();
		}
		return null;
	},
	
	setDefaultFineFlag:function(value){
		this.defaultFine=value;
	},
	
	setNullAllowed:function(value){
		this.nullAllowed=value;
	},

	setDontClear:function(value){
		this.dontClear=value;
	},
	

	init:function(){
    },
});