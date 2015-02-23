var baseCfg = {
    projName : "client",
    resPath : "cfg/res.js",
    modluesPathMap : {
        "client" : "./",
        "cocos2d-html5" : "../node_modules/powder-cocos2d/cocos2d-html5/",
        "cctouch" : "../node_modules/powder-cocos2d/cctouch/",
        "cceditbox" : "../node_modules/powder-cocos2d/cceditbox/",
        "ccgui" : "../node_modules/powder-cocos2d/ccgui/",
        "cccliping" : "../node_modules/powder-cocos2d/cccliping/",
        "ccshapenode" : "../node_modules/powder-cocos2d/ccshapenode/",
        "ccrendertexture" : "../node_modules/powder-cocos2d/ccrendertexture/",
        "ccactions" : "../node_modules/powder-cocos2d/ccactions/",
        "ccprogress" : "../node_modules/powder-cocos2d/ccprogress/",
        "ccaudio" : "../node_modules/powder-cocos2d/ccaudio/"
    },
    baseJsList : [
        "../node_modules/powder-cocos2d/cocos2d-html5/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCClass.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/cocoa/CCGeometry.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/Sys.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCConfig.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/miniFramework.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCCommon.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCMacro.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCFileUtils.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCTypes.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCEGLView.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCScreen.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCVisibleRect.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/cocoa/CCNS.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/cocoa/CCAffineTransform.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/support/CCPointExtension.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/support/CCVertex.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/support/TransformUtils.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/base_nodes/CCNode.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/base_nodes/CCAtlasNode.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/textures/CCTexture2D.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/textures/CCTextureCache.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/textures/CCTextureAtlas.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/scenes_nodes/CCScene.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/layers_nodes/CCLayer.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCSprite.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCAnimation.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCAnimationCache.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCSpriteFrame.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCSpriteFrameCache.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/sprite_nodes/CCSpriteBatchNode.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCConfiguration.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCDirector.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCCamera.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCScheduler.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCLoader.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCDrawingPrimitives.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCApplication.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/CCSAXParser.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/platform/AppControl.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/labelTTF/CCLabelTTF.js",
        "../node_modules/powder-cocos2d/cocos2d-html5/lib/CCActionManager.js",
        "../node_modules/powder-cocos2d/cctouch/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/cctouch/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/cctouch/lib/CCTouchDelegateProtocol.js",
        "../node_modules/powder-cocos2d/cctouch/lib/CCTouchHandler.js",
        "../node_modules/powder-cocos2d/cctouch/lib/CCTouchDispatcher.js",
        "../node_modules/powder-cocos2d/cctouch/lib/CCMouseDispatcher.js",
        "../node_modules/powder-cocos2d/ccshapenode/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/ccshapenode/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/ccshapenode/lib/CCDrawNode.js",
        "../node_modules/powder-cocos2d/cccliping/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/cccliping/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/cccliping/lib/CCClippingNode.js",
        "../node_modules/powder-cocos2d/ccrendertexture/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/ccrendertexture/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/ccrendertexture/lib/CCRenderTexture.js",
        "../node_modules/powder-cocos2d/ccactions/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/ccactions/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCAction.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionInterval.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionInstant.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionCamera.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionEase.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionCatmullRom.js",
        "../node_modules/powder-cocos2d/ccactions/lib/CCActionTween.js",
        "../node_modules/powder-cocos2d/ccprogress/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/ccprogress/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/ccprogress/lib/CCProgressTimer.js",
        "../node_modules/powder-cocos2d/ccprogress/lib/CCActionProgressTimer.js",
        "../node_modules/powder-cocos2d/ccgui/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/ccgui/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControl.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlButton.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlUtils.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCInvocation.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCScale9Sprite.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCMenuPassive.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlSaturationBrightnessPicker.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlHuePicker.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlColourPicker.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlSlider.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlSwitch.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlStepper.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCControlExtension/CCControlPotentiometer.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCScrollView/CCScrollView.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCScrollView/CCSorting.js",
        "../node_modules/powder-cocos2d/ccgui/lib/CCScrollView/CCTableView.js",
        "../node_modules/powder-cocos2d/cceditbox/cfg/jsRes.js",
        "../node_modules/powder-cocos2d/cceditbox/cfg/resCfg.js",
        "../node_modules/powder-cocos2d/cceditbox/lib/CCdomNode.js",
        "../node_modules/powder-cocos2d/cceditbox/lib/CCEditBox.js",
        "../node_modules/powder-cocos2d/ccaudio/lib/SimpleAudioEngine.js",
        "cfg/jsRes.js",
        "cfg/resCfg.js"
    ]
};