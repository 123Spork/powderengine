/**
 * brief Class for edit box.
 *
 * You can use this widget to gather small amounts of text from the user.
 *
 */
SingleLineBox = cc.ControlButton.extend({
    _domInputSprite: null,

    _delegate: null,
    _editBoxInputMode: cc.EDITBOX_INPUT_MODE_ANY,
    _editBoxInputFlag: cc.EDITBOX_INPUT_FLAG_SENSITIVE,
    _keyboardReturnType: cc.KEYBOARD_RETURNTYPE_DEFAULT,

    _text: "",
    _placeholderText: "",
    _textColor: null,
    _placeholderColor: null,
    _maxLength: 50,
    _adjustHeight: 18,
    _edTxt: null,
    _edFontSize: 12,
    _edFontName: "Arial",
    _edittype:false,

    _placeholderFontName: "",
    _placeholderFontSize: 14,

    _tooltip: false,

    /**
     * * Constructor.
     * */
    ctor: function (boxSize) {
        cc.ControlButton.prototype.ctor.call(this);
        this._edittype=false;
        this._textColor = cc.white();
        this._placeholderColor = cc.gray();
        this.setContentSize(boxSize);
        this._domInputSprite = new cc.Sprite();
        this._domInputSprite.draw = function(){ };                           //redefine draw function
        this.addChild(this._domInputSprite);
        var selfPointer = this;
        this._edTxt = document.createElement("input");
        this._edTxt.type = "text";
        this._edTxt.style.fontSize = this._edFontSize + "px";
        this._edTxt.style.color = "#000000";
        this._edTxt.style.border = 0;
        this._edTxt.style.background = "transparent";
        //this._edTxt.style.paddingLeft = "2px";
        this._edTxt.style.width = "100%";
        this._edTxt.style.height = "100%";
        this._edTxt.style.active = 0;
        this._edTxt.style.outline = "medium";

        // TODO the event listener will be remove when EditBox removes from parent.
        this._edTxt.addEventListener("input", function () {
            if (selfPointer._delegate && selfPointer._delegate.editBoxTextChanged)
                selfPointer._delegate.editBoxTextChanged(selfPointer, this.value);
        });
        this._edTxt.addEventListener("keyup", function (e) {
            if ((e.keyCode === cc.KEY.enter) && (selfPointer._edittype==false)) {
                e.stopPropagation();
                e.preventDefault();
                cc.canvas.focus();
            }
        });
        this._edTxt.addEventListener("focus", function () {
            if (this.value == selfPointer._placeholderText) {
                this.value = "";
                this.style.fontSize = selfPointer._edFontSize + "px" ;
                this.style.color = cc.convertColor3BtoHexString(selfPointer._textColor);
            }
            if (selfPointer._delegate && selfPointer._delegate.editBoxEditingDidBegin)
                selfPointer._delegate.editBoxEditingDidBegin(selfPointer);
        });
        this._edTxt.addEventListener("blur", function () {
            if (this.value == "") {
                this.value = selfPointer._placeholderText;
                this.style.fontSize = selfPointer._placeholderFontSize + "px" ;
                this.style.color = cc.convertColor3BtoHexString(selfPointer._placeholderColor);
            }
            if (selfPointer._delegate && selfPointer._delegate.editBoxEditingDidEnd)
                selfPointer._delegate.editBoxEditingDidEnd(selfPointer);
            if (selfPointer._delegate && selfPointer._delegate.editBoxReturn)
                selfPointer._delegate.editBoxReturn(selfPointer);
        });

        cc.DOM.convert(this._domInputSprite);
        this._domInputSprite.dom.appendChild(this._edTxt);
        this._domInputSprite.dom.showTooltipDiv = false;
        this._domInputSprite.dom.style.width = (boxSize.width - 6) +"px";
        this._domInputSprite.dom.style.height = (boxSize.height - 6) +"px";

        //this._domInputSprite.dom.style.borderWidth = "1px";
        //this._domInputSprite.dom.style.borderStyle = "solid";
        //this._domInputSprite.dom.style.borderRadius = "8px";
        this._domInputSprite.canvas.remove();
    },

    /**
     * Set the font.
     * @param {String} fontName  The font name.
     * @param {Number} fontSize  The font size.
     */
    setFont: function (fontName, fontSize) {
        this._edFontSize = fontSize;
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    setVerticleAlign:function(value){
        this.vertAlign = value;
    },

    /**
     * set fontName
     * @param {String} fontName
     */
    setFontName: function(fontName){
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    /**
     * set fontSize
     * @param {Number} fontSize
     */
    setFontSize: function(fontSize){
        this._edFontSize = fontSize;
        this._setFontToEditBox();
    },

    _setFontToEditBox: function () {
        if (this._edTxt.value != this._placeholderText){
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize+"px";
        }
    },

    /**
     *  Set the text entered in the edit box.
     * @param {string} text The given text.
     */
    setText: function (text) {
        if (text != null) {
            if (text == "") {
                this._edTxt.value = this._placeholderText;
                this._edTxt.style.color = cc.convertColor3BtoHexString(this._placeholderColor);
            } else {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.convertColor3BtoHexString(this._textColor);
            }
        }
    },

    /**
     * Set the font color of the widget's text.
     * @param {cc.Color3B} color
     */
    setFontColor: function (color) {
        this._textColor = color;
        if (this._edTxt.value != this._placeholderText) {
            this._edTxt.style.color = cc.convertColor3BtoHexString(color);
        }
    },

    /**
     * <p>
     * Sets the maximum input length of the edit box. <br/>
     * Setting this value enables multiline input mode by default.
     * </p>
     * @param {Number} maxLength The maximum length.
     */
    setMaxLength: function (maxLength) {
        if (!isNaN(maxLength) && maxLength > 0) {
            this._maxLength = maxLength;
            this._edTxt.maxLength = maxLength;
        }
    },

    /**
     * Gets the maximum input length of the edit box.
     * @return {Number} Maximum input length.
     */
    getMaxLength: function () {
        return this._maxLength;
    },

    /**
     * Set a text in the edit box that acts as a placeholder when an edit box is empty.
     * @param {string} text The given text.
     */
    setPlaceHolder: function (text) {
        if (text != null) {
            var oldPlaceholderText = this._placeholderText;
            this._placeholderText = text;
            if (this._edTxt.value == oldPlaceholderText) {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.convertColor3BtoHexString(this._placeholderColor);
                this._setPlaceholderFontToEditText();
            }
        }
    },

    /**
     * Set the placeholder's font.
     * @param {String} fontName
     * @param {Number} fontSize
     */
    setPlaceholderFont: function (fontName, fontSize) {
        this._placeholderFontName = fontName;
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },

    /**
     * Set the placeholder's fontName.
     * @param {String} fontName
     */
    setPlaceholderFontName: function (fontName) {
        this._placeholderFontName = fontName;
        this._setPlaceholderFontToEditText();
    },

    /**
     * Set the placeholder's fontSize.
     * @param {Number} fontSize
     */
    setPlaceholderFontSize: function (fontSize) {
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },

    _setPlaceholderFontToEditText: function () {
        if (this._edTxt.value == this._placeholderText){
            this._edTxt.style.fontFamily = this._placeholderFontName;
            this._edTxt.style.fontSize = this._placeholderFontSize + "px";
        }
    },

    /**
     * Set the font color of the placeholder text when the edit box is empty.
     * @param {cc.Color3B} color
     */
    setPlaceholderFontColor: function (color) {
        this._placeholderColor = color;
        if (this._edTxt.value == this._placeholderText) {
            this._edTxt.style.color = cc.convertColor3BtoHexString(color);
        }
    },

    /**
     * Set the input flags that are to be applied to the edit box.
     * @param {Number} inputFlag One of the EditBoxInputFlag constants.
     * e.g.cc.EDITBOX_INPUT_FLAG_PASSWORD
     */
    setInputFlag: function (inputFlag) {
        this._editBoxInputFlag = inputFlag;
        if (inputFlag == cc.EDITBOX_INPUT_FLAG_PASSWORD)
            this._edTxt.type = "password";
        else if (inputFlag==cc.EDITBOX_INPUT_FLAG_NUMBER)
            this._edTxt.type = "number";
        else
            this._edTxt.type = "text";
    },

    /**
     * Gets the  input string of the edit box.
     * @return {string}
     */
    getText: function () {
        return this._edTxt.value;
    },

    /**
     * Init edit box with specified size.
     * @param {cc.Size} size
     * @param {cc.Color3B | cc.Scale9Sprite} normal9SpriteBg
     */
    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if (this.initWithBackgroundSprite(normal9SpriteBg)) {
            this._domInputSprite.setPosition(3, 3);

            this.setZoomOnTouchDown(false);
            this.setPreferredSize(size);
            this.setPosition(0, 0);
            this._addTargetWithActionForControlEvent(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            return true;
        }
        return false;
    },

    /* override functions */
    /**
     * Set the delegate for edit box.
     */
    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    /**
     * Get a text in the edit box that acts as a placeholder when an
     * edit box is empty.
     * @return {String}
     */
    getPlaceHolder: function () {
        return this._placeholderText;
    },

    /**
     * Set the input mode of the edit box.
     * @param {Number} inputMode One of the EditBoxInputMode constants.
     */
    setInputMode: function (inputMode) {
        this._editBoxInputMode = inputMode;
    },

    /**
     * Set the return type that are to be applied to the edit box.
     * @param {Number} returnType One of the CCKeyboardReturnType constants.
     */
    setReturnType: function (returnType) {
        this._keyboardReturnType = returnType;
    },

    keyboardWillShow: function (info) {
        var rectTracked = cc.EditBox.getRect(this);
        // some adjustment for margin between the keyboard and the edit box.
        rectTracked.y -= 4;
        // if the keyboard area doesn't intersect with the tracking node area, nothing needs to be done.
        if (!rectTracked.intersectsRect(info.end)) {
            cc.log("needn't to adjust view layout.");
            return;
        }

        // assume keyboard at the bottom of screen, calculate the vertical adjustment.
        this._adjustHeight = info.end.getMaxY() - rectTracked.getMinY();
        // CCLOG("CCEditBox:needAdjustVerticalPosition(%f)", m_fAdjustHeight);

        //callback
    },
    keyboardDidShow: function (info) {
    },
    keyboardWillHide: function (info) {
        //if (m_pEditBoxImpl != NULL) {
        //    m_pEditBoxImpl->doAnimationWhenKeyboardMove(info.duration, -m_fAdjustHeight);
        //}
    },
    keyboardDidHide: function (info) {
    },

    touchDownAction: function (sender, controlEvent) {
        //this._editBoxImpl.openKeyboard();
    },

	setBackgroundColor:function(color){
		var hex = rgbToHex(color.r,color.g,color.b);
		this._edTxt.style.background=hex;
	},

    setBackgroundInvisible:function(){
      this._edTxt.style.background="rgba(0,0,0,0)";
    },

    //HTML5 Only
    initWithBackgroundColor: function (size, bgColor) {
        this._edWidth = size.width;
        this.dom.style.width = this._edWidth.toString() + "px";
        this._edHeight = size.height;
        this.dom.style.height = this._edHeight.toString() + "px";
        this.dom.style.backgroundColor = cc.convertColor3BtoHexString(bgColor);
    }
});

SingleLineBox.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.RectApplyAffineTransform(rect, node.nodeToWorldTransform());
};

/**
 * create a edit box with size and background-color or
 * @param {cc.Size} size
 * @param {cc.Color3B | cc.Scale9Sprite } normal9SpriteBg
 */
SingleLineBox.create = function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
    var edbox = new SingleLineBox(size);
    if (normal9SpriteBg instanceof cc.Color3B) {
        edbox.setBackgroundColor(normal9SpriteBg);
    } else {
        //Todo
        if (edbox.initWithSizeAndBackgroundSprite(size, normal9SpriteBg)) {
            if (press9SpriteBg)
                edbox.setBackgroundSpriteForState(press9SpriteBg, cc.CONTROL_STATE_HIGHLIGHTED);

            if (disabled9SpriteBg)
                edbox.setBackgroundSpriteForState(disabled9SpriteBg, cc.CONTROL_STATE_DISABLED);
        }
    }
    return edbox;
};



