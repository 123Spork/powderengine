var res = {
    building1_png : 'building1.png',
    items1_png : 'items1.png',
    sprites1_png : 'sprites1.png',
    tile_graphics_txt : 'tile_graphics.txt',
    tiles1_png : 'tiles1.png'
};
var js = js || {};
js.socketioclient = {
  socketioclient_js : '../node_modules/socketioclient/src/socketioclient.js',
};
var cc = cc || {};
cc.resCfg = cc.resCfg || {};
var js = js || {};
var resCfg = cc.resCfg;
var jsRes = js.socketioclient;
var TEST_BASE = "__testBase";

resCfg.socketioclient = {
    ref : [
		jsRes.socketioclient_js
    ]
};
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.cocos2d_html5 = {
    CCActionManager_js : '../node_modules/cocos2d-html5/lib/CCActionManager.js',
    CCCamera_js : '../node_modules/cocos2d-html5/lib/CCCamera.js',
    CCConfiguration_js : '../node_modules/cocos2d-html5/lib/CCConfiguration.js',
    CCDirector_js : '../node_modules/cocos2d-html5/lib/CCDirector.js',
    CCDrawingPrimitives_js : '../node_modules/cocos2d-html5/lib/CCDrawingPrimitives.js',
    CCLoader_js : '../node_modules/cocos2d-html5/lib/CCLoader.js',
    CCScheduler_js : '../node_modules/cocos2d-html5/lib/CCScheduler.js',
    CCAtlasNode_js : '../node_modules/cocos2d-html5/lib/base_nodes/CCAtlasNode.js',
    CCNode_js : '../node_modules/cocos2d-html5/lib/base_nodes/CCNode.js',
    cc_js : '../node_modules/cocos2d-html5/lib/cc.js',
    cc4publish_js : '../node_modules/cocos2d-html5/lib/cc4publish.js',
    CCAffineTransform_js : '../node_modules/cocos2d-html5/lib/cocoa/CCAffineTransform.js',
    CCGeometry_js : '../node_modules/cocos2d-html5/lib/cocoa/CCGeometry.js',
    CCNS_js : '../node_modules/cocos2d-html5/lib/cocoa/CCNS.js',
    cocos2d_externs_js : '../node_modules/cocos2d-html5/lib/cocos2d_externs.js',
    CCLabelTTF_js : '../node_modules/cocos2d-html5/lib/labelTTF/CCLabelTTF.js',
    CCLayer_js : '../node_modules/cocos2d-html5/lib/layers_nodes/CCLayer.js',
    AppControl_js : '../node_modules/cocos2d-html5/lib/platform/AppControl.js',
    CCApplication_js : '../node_modules/cocos2d-html5/lib/platform/CCApplication.js',
    CCClass_js : '../node_modules/cocos2d-html5/lib/platform/CCClass.js',
    CCCommon_js : '../node_modules/cocos2d-html5/lib/platform/CCCommon.js',
    CCConfig_js : '../node_modules/cocos2d-html5/lib/platform/CCConfig.js',
    CCEGLView_js : '../node_modules/cocos2d-html5/lib/platform/CCEGLView.js',
    CCFileUtils_js : '../node_modules/cocos2d-html5/lib/platform/CCFileUtils.js',
    CCMacro_js : '../node_modules/cocos2d-html5/lib/platform/CCMacro.js',
    CCSAXParser_js : '../node_modules/cocos2d-html5/lib/platform/CCSAXParser.js',
    CCScreen_js : '../node_modules/cocos2d-html5/lib/platform/CCScreen.js',
    CCTypes_js : '../node_modules/cocos2d-html5/lib/platform/CCTypes.js',
    CCVisibleRect_js : '../node_modules/cocos2d-html5/lib/platform/CCVisibleRect.js',
    Sys_js : '../node_modules/cocos2d-html5/lib/platform/Sys.js',
    miniFramework_js : '../node_modules/cocos2d-html5/lib/platform/miniFramework.js',
    CCScene_js : '../node_modules/cocos2d-html5/lib/scenes_nodes/CCScene.js',
    CCAnimation_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCAnimation.js',
    CCAnimationCache_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCAnimationCache.js',
    CCSprite_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCSprite.js',
    CCSpriteBatchNode_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCSpriteBatchNode.js',
    CCSpriteFrame_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCSpriteFrame.js',
    CCSpriteFrameCache_js : '../node_modules/cocos2d-html5/lib/sprite_nodes/CCSpriteFrameCache.js',
    CCPointExtension_js : '../node_modules/cocos2d-html5/lib/support/CCPointExtension.js',
    CCVertex_js : '../node_modules/cocos2d-html5/lib/support/CCVertex.js',
    TransformUtils_js : '../node_modules/cocos2d-html5/lib/support/TransformUtils.js',
    CCTexture2D_js : '../node_modules/cocos2d-html5/lib/textures/CCTexture2D.js',
    CCTextureAtlas_js : '../node_modules/cocos2d-html5/lib/textures/CCTextureAtlas.js',
    CCTextureCache_js : '../node_modules/cocos2d-html5/lib/textures/CCTextureCache.js',
    BoundingBoxTest_js : '../node_modules/cocos2d-html5/test/ccnode/BoundingBoxTest.js',
    CCNodeTest2_js : '../node_modules/cocos2d-html5/test/ccnode/CCNodeTest2.js',
    CCNodeTest6_js : '../node_modules/cocos2d-html5/test/ccnode/CCNodeTest6.js',
    LabelTTFA8Test_js : '../node_modules/cocos2d-html5/test/labelTTF/LabelTTFA8Test.js',
    LabelTTFAlignment_js : '../node_modules/cocos2d-html5/test/labelTTF/LabelTTFAlignment.js',
    LabelTTFChinese_js : '../node_modules/cocos2d-html5/test/labelTTF/LabelTTFChinese.js',
    LabelTTFMultiline_js : '../node_modules/cocos2d-html5/test/labelTTF/LabelTTFMultiline.js',
    IgnoreAnchorpointTest1_js : '../node_modules/cocos2d-html5/test/layers/IgnoreAnchorpointTest1.js',
    LayerGradientTest_js : '../node_modules/cocos2d-html5/test/layers/LayerGradientTest.js',
    LayerTest1_js : '../node_modules/cocos2d-html5/test/layers/LayerTest1.js',
    ScheduleUsingSchedulerTest_js : '../node_modules/cocos2d-html5/test/scheduler/ScheduleUsingSchedulerTest.js',
    SchedulerAutoremoveTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerAutoremoveTest.js',
    SchedulerPauseResumeTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerPauseResumeTest.js',
    SchedulerUnscheduleAllHardTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerUnscheduleAllHardTest.js',
    SchedulerUnscheduleAllTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerUnscheduleAllTest.js',
    SchedulerUpdateAndCustomTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerUpdateAndCustomTest.js',
    SchedulerUpdateTest_js : '../node_modules/cocos2d-html5/test/scheduler/SchedulerUpdateTest.js',
    Sprite1Test_js : '../node_modules/cocos2d-html5/test/sprite/Sprite1Test.js',
    SpriteBatchNode1Test_js : '../node_modules/cocos2d-html5/test/sprite/SpriteBatchNode1Test.js',
    SpriteColorOpacity_js : '../node_modules/cocos2d-html5/test/sprite/SpriteColorOpacity.js',
    SpriteNilTexture_js : '../node_modules/cocos2d-html5/test/sprite/SpriteNilTexture.js',
    SpriteZOrder_js : '../node_modules/cocos2d-html5/test/sprite/SpriteZOrder.js',
    TextureColorCacheIssue_js : '../node_modules/cocos2d-html5/test/sprite/TextureColorCacheIssue.js'
};
var cc = cc || {};
cc.resCfg = cc.resCfg || {};
var js = js || {};
var resCfg = cc.resCfg;
var jsRes = js.cocos2d_html5;
var TEST_BASE = "__testBase";

resCfg["cocos2d-html5"] = {
    ref : [//Base references for the project.
        jsRes.CCClass_js,
        jsRes.CCGeometry_js,
        jsRes.Sys_js,
        jsRes.CCConfig_js,
        jsRes.miniFramework_js,
        jsRes.CCCommon_js,
        jsRes.CCMacro_js,
        jsRes.CCFileUtils_js,
        jsRes.CCTypes_js,
        jsRes.CCEGLView_js,
        jsRes.CCScreen_js,
        jsRes.CCVisibleRect_js,
        jsRes.CCNS_js,
        jsRes.CCAffineTransform_js,
        jsRes.CCPointExtension_js,
        jsRes.CCVertex_js,
        jsRes.TransformUtils_js,
        jsRes.CCNode_js,
        jsRes.CCAtlasNode_js,
        jsRes.CCTexture2D_js,
        jsRes.CCTextureCache_js,
        jsRes.CCTextureAtlas_js,
        jsRes.CCScene_js,
        jsRes.CCLayer_js,
        jsRes.CCSprite_js,
        jsRes.CCAnimation_js,
        jsRes.CCAnimationCache_js,
        jsRes.CCSpriteFrame_js,
        jsRes.CCSpriteFrameCache_js,
        jsRes.CCSpriteBatchNode_js,
        jsRes.CCConfiguration_js,
        jsRes.CCDirector_js,
        jsRes.CCCamera_js,
        jsRes.CCScheduler_js,
        jsRes.CCLoader_js,
        jsRes.CCDrawingPrimitives_js,
        jsRes.CCApplication_js,
        jsRes.CCSAXParser_js,
        jsRes.AppControl_js,
        jsRes.CCLabelTTF_js,
        jsRes.CCActionManager_js
    ]
};

resCfg[TEST_BASE] = {res : [res.grossini_dance_atlas_png, res.grossinis_sister1_png, res.grossinis_sister2_png, res.grossini_png,
    res.tcc_issue_1_png, res.tcc_issue_1_plist, res.tcc_issue_2_png, res.tcc_issue_2_plist]};

cc.gameModules = [ jsRes.CCNodeTest2_js, jsRes.CCNodeTest6_js, jsRes.BoundingBoxTest_js,
    //--- cc.node tests end
    jsRes.Sprite1Test_js, jsRes.SpriteBatchNode1Test_js, jsRes.SpriteColorOpacity_js, jsRes.SpriteZOrder_js, jsRes.SpriteNilTexture_js, jsRes.TextureColorCacheIssue_js,
    //--- cc.Sprite tests end
    jsRes.SchedulerAutoremoveTest_js, jsRes.SchedulerPauseResumeTest_js, jsRes.SchedulerUnscheduleAllTest_js, jsRes.SchedulerUnscheduleAllHardTest_js,
    jsRes.SchedulerUpdateTest_js, jsRes.SchedulerUpdateAndCustomTest_js, jsRes.ScheduleUsingSchedulerTest_js,
    //--- cc.Scheduler tests end
    jsRes.LayerTest1_js, jsRes.IgnoreAnchorpointTest1_js, jsRes.LayerGradientTest_js,
    //--- Layer tests end
    jsRes.LabelTTFMultiline_js, jsRes.LabelTTFChinese_js, jsRes.LabelTTFA8Test_js, jsRes.LabelTTFAlignment_js
    //--- LabelTTF tests end
];

resCfg[jsRes.Sprite1Test_js] = { layer : "Sprite1Test", title : "Non Batched Sprite" };
resCfg[jsRes.SpriteBatchNode1Test_js] = { layer : "SpriteBatchNode1Test", title : "Batched Sprite" };
resCfg[jsRes.SpriteColorOpacity_js] = { layer : "SpriteColorOpacity", title : "Sprite: Color & Opacity" };
resCfg[jsRes.SpriteZOrder_js] = { layer : "SpriteZOrder", title : "Sprite: Z order" };
resCfg[jsRes.SpriteNilTexture_js] = { layer : "SpriteNilTexture", title : "Sprite without texture -- [opacity and color should work]" };
resCfg[jsRes.TextureColorCacheIssue_js] = { layer : "TextureColorCacheIssue", title : "Texture Color Cache Issue Test -- [You should see two different sprites colored green and blue]" };

resCfg[jsRes.CCNodeTest2_js] = { layer : "CCNodeTest2", title : "anchorPoint and children" };
resCfg[jsRes.CCNodeTest6_js] = { layer : "CCNodeTest6", title : "remove/cleanup with children" };
resCfg[jsRes.BoundingBoxTest_js] = { layer : "BoundingBoxTest", title : "Bounding Box Test -- [Testing getBoundingBox(). See console]" };

resCfg[jsRes.SchedulerAutoremoveTest_js] = { layer : "SchedulerAutoremoveTest", title : "Self-remove an scheduler -- [1 scheduler will be auto Removed in 3 seconds. See console]" };
resCfg[jsRes.SchedulerPauseResumeTest_js] = { layer : "SchedulerPauseResumeTest", title : "Pause / Resume -- [Scheduler should be paused after 3 seconds. See console]" };
resCfg[jsRes.SchedulerUnscheduleAllTest_js] = { layer : "SchedulerUnscheduleAllTest", title : "Unschedule All callbacks -- [All scheduled callbacks will be unscheduled in 4 seconds. See console]" };
resCfg[jsRes.SchedulerUnscheduleAllHardTest_js] = { layer : "SchedulerUnscheduleAllHardTest", title : "Unschedule All callbacks #2 -- [Unschedules all callbacks after 4s. Uses CCScheduler. See console]" };
resCfg[jsRes.SchedulerUpdateTest_js] = { layer : "SchedulerUpdateTest", title : "Schedule update with priority -- [3 scheduled updates. Priority should work. Stops in 4s. See console]" };
resCfg[jsRes.SchedulerUpdateAndCustomTest_js] = { layer : "SchedulerUpdateAndCustomTest", title : "Schedule Update + custom callback -- [Update + custom callback at the same time. Stops in 4s. See console]" };
resCfg[jsRes.ScheduleUsingSchedulerTest_js] = { layer : "ScheduleUsingSchedulerTest", title : "Schedule / Unschedule using Scheduler -- [After 5 seconds all callbacks should be removed]" };

resCfg[jsRes.LayerTest1_js] = { layer : "LayerTest1", title : "ColorLayer resize" };
resCfg[jsRes.IgnoreAnchorpointTest1_js] = { layer : "IgnoreAnchorpointTest1", title : "ignore Anchorpoint Test #1 -- [red:true  green:true]" };
resCfg[jsRes.LayerGradientTest_js] = { layer : "LayerGradientTest", title : "LayerGradient Test" };

resCfg[jsRes.LabelTTFMultiline_js] = { layer : "LabelTTFMultiline", title : "Testing cc.LabelTTF Word Wrap" };
resCfg[jsRes.LabelTTFChinese_js] = { layer : "LabelTTFChinese", title : "Testing cc.LabelTTF with Chinese character" };
resCfg[jsRes.LabelTTFA8Test_js] = { layer : "LabelTTFA8Test", title : "Testing A8 Format" };
resCfg[jsRes.LabelTTFAlignment_js] = { layer : "LabelTTFAlignment", title : "cc.LabelTTF alignment" };
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.cctouch = {
    CCMouseDispatcher_js : '../node_modules/cctouch/lib/CCMouseDispatcher.js',
    CCTouchDelegateProtocol_js : '../node_modules/cctouch/lib/CCTouchDelegateProtocol.js',
    CCTouchDispatcher_js : '../node_modules/cctouch/lib/CCTouchDispatcher.js',
    CCTouchHandler_js : '../node_modules/cctouch/lib/CCTouchHandler.js',
    MouseTest_js : '../node_modules/cctouch/test/MouseTest.js',
    TouchAllAtOnce_js : '../node_modules/cctouch/test/TouchAllAtOnce.js',
    TouchOneByOneTest_js : '../node_modules/cctouch/test/TouchOneByOneTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.cctouch;

resCfg["cctouch"] = {
    ref : [
        jsRes.CCTouchDelegateProtocol_js,
        jsRes.CCTouchHandler_js,
        jsRes.CCTouchDispatcher_js,
        jsRes.CCMouseDispatcher_js
    ]//Base references for the project.
};

resCfg[TEST_BASE] = {res: [res.r2_png]};

cc.gameModules = [jsRes.TouchOneByOneTest_js, jsRes.TouchAllAtOnce_js, jsRes.MouseTest_js];

resCfg[jsRes.TouchOneByOneTest_js] = { layer : "TouchOneByOneTest", title : "Touches One by One. Touch the left / right and see console" };
resCfg[jsRes.TouchAllAtOnce_js] = { layer : "TouchAllAtOnce", title : "Touches All At Once. Touch and see console" };
resCfg[jsRes.MouseTest_js] = { layer : "MouseTest", title : "Mouse test. Move mouse and see console" };
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.ccshapenode = {
    CCDrawNode_js : '../node_modules/ccshapenode/lib/CCDrawNode.js',
    ShapeNodeTest_js : '../node_modules/ccshapenode/test/ShapeNodeTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.ccshapenode;

resCfg["ccshapenode"] = {
    ref : [
        jsRes.CCDrawNode_js
    ]//Base references for the project.
};

cc.gameModules = [jsRes.ShapeNodeTest_js];

resCfg[jsRes.ShapeNodeTest_js] = { layer : "ShapeNodeTest", title : "ShapeNodeTest" }

exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.cccliping = {
    CCClippingNode_js : '../node_modules/cccliping/lib/CCClippingNode.js',
    ScrollViewTest_js : '../node_modules/cccliping/test/ScrollViewTest.js',
    SpriteStencilTest_js : '../node_modules/cccliping/test/SpriteStencilTest.js',
    TriangleStencilTest_js : '../node_modules/cccliping/test/TriangleStencilTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.cccliping;

resCfg["cccliping"] = {
    ref : [
        jsRes.CCClippingNode_js
    ]//Base references for the project.
};

resCfg[TEST_BASE] = {
    res : [res.background2_png]
};

cc.gameModules = [jsRes.ScrollViewTest_js, jsRes.TriangleStencilTest_js, jsRes.SpriteStencilTest_js];

resCfg[jsRes.ScrollViewTest_js] = { layer : "ScrollViewTest", title : "Clipping node", subTitle : "with image scrolling in a rectangle stencil" };
resCfg[jsRes.TriangleStencilTest_js] = { layer : "TriangleStencilTest", title : "Clipping node", subTitle : "with triangle stencil and sprite content" };
resCfg[jsRes.SpriteStencilTest_js] = { layer : "SpriteStencilTest", title : "Clipping node", subTitle : "with sprite stencil and a green triangle as content" };
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.ccrendertexture = {
    CCRenderTexture_js : '../node_modules/ccrendertexture/lib/CCRenderTexture.js',
    RenderTextureTest_js : '../node_modules/ccrendertexture/test/RenderTextureTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.ccrendertexture;

resCfg["ccrendertexture"] = {
    ref : [
        jsRes.CCRenderTexture_js
    ]//Base references for the project.
};
resCfg[TEST_BASE] = {res : [res.fire_png]};
cc.gameModules = [jsRes.RenderTextureTest_js];

resCfg[jsRes.RenderTextureTest_js] = { layer : "RenderTextureTest", title : "RenderTextureTest" }
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.ccactions = {
    CCAction_js : '../node_modules/ccactions/lib/CCAction.js',
    CCActionCamera_js : '../node_modules/ccactions/lib/CCActionCamera.js',
    CCActionCatmullRom_js : '../node_modules/ccactions/lib/CCActionCatmullRom.js',
    CCActionEase_js : '../node_modules/ccactions/lib/CCActionEase.js',
    CCActionInstant_js : '../node_modules/ccactions/lib/CCActionInstant.js',
    CCActionInterval_js : '../node_modules/ccactions/lib/CCActionInterval.js',
    CCActionTween_js : '../node_modules/ccactions/lib/CCActionTween.js',
    ActionAnimateTest_js : '../node_modules/ccactions/test/ActionAnimateTest.js',
    ActionBezierTest_js : '../node_modules/ccactions/test/ActionBezierTest.js',
    ActionBezierToCopyTest_js : '../node_modules/ccactions/test/ActionBezierToCopyTest.js',
    ActionBlinkTest_js : '../node_modules/ccactions/test/ActionBlinkTest.js',
    ActionFadeTest_js : '../node_modules/ccactions/test/ActionFadeTest.js',
    ActionJumpTest_js : '../node_modules/ccactions/test/ActionJumpTest.js',
    ActionManualTest_js : '../node_modules/ccactions/test/ActionManualTest.js',
    ActionMoveTest_js : '../node_modules/ccactions/test/ActionMoveTest.js',
    ActionRotateTest_js : '../node_modules/ccactions/test/ActionRotateTest.js',
    ActionRotateXY_js : '../node_modules/ccactions/test/ActionRotateXY.js',
    ActionScaleTest_js : '../node_modules/ccactions/test/ActionScaleTest.js',
    ActionSequence2Test_js : '../node_modules/ccactions/test/ActionSequence2Test.js',
    ActionSequenceTest_js : '../node_modules/ccactions/test/ActionSequenceTest.js',
    ActionSkewRotateScaleTest_js : '../node_modules/ccactions/test/ActionSkewRotateScaleTest.js',
    ActionSkewTest_js : '../node_modules/ccactions/test/ActionSkewTest.js',
    ActionTintTest_js : '../node_modules/ccactions/test/ActionTintTest.js',
    Issue1008Test_js : '../node_modules/ccactions/test/Issue1008Test.js'
};
var resCfg = cc.resCfg;
var jsRes = js.ccactions;

resCfg["ccactions"] = {
    ref : [
        jsRes.CCAction_js,
        jsRes.CCActionInterval_js,
        jsRes.CCActionInstant_js,
        jsRes.CCActionCamera_js,
        jsRes.CCActionEase_js,
        jsRes.CCActionCatmullRom_js,
        jsRes.CCActionTween_js
    ]//Base references for the project.
};

resCfg[TEST_BASE] = {
    res : [
        res.grossini_png,
        res.grossinis_sister1_png,
        res.grossinis_sister2_png,
        res.grossini_dance_1_png,
        res.grossini_dance_2_png,
        res.grossini_dance_3_png,
        res.grossini_dance_4_png,
        res.grossini_dance_5_png,
        res.grossini_dance_6_png,
        res.grossini_dance_7_png,
        res.grossini_dance_8_png,
        res.grossini_dance_9_png,
        res.grossini_dance_10_png,
        res.grossini_dance_11_png,
        res.grossini_dance_12_png,
        res.grossini_dance_13_png,
        res.grossini_dance_14_png,
        res.animations_2_plist,
        res.grossini_dance_png,
        res.grossini_dance_plist,
        res.grossini_blue_png,
        res.grossini_blue_plist,
        res.grossini_family_png,
        res.grossini_family_plist
    ]
};

cc.gameModules = [
    jsRes.ActionManualTest_js, jsRes.ActionMoveTest_js, jsRes.ActionScaleTest_js, jsRes.ActionRotateTest_js,
    jsRes.ActionRotateXY_js, jsRes.ActionSkewTest_js, jsRes.ActionSkewRotateScaleTest_js, jsRes.ActionJumpTest_js,
    jsRes.ActionBezierTest_js, jsRes.ActionBezierToCopyTest_js, jsRes.Issue1008Test_js, jsRes.ActionBlinkTest_js,
    jsRes.ActionFadeTest_js, jsRes.ActionTintTest_js, jsRes.ActionAnimateTest_js, jsRes.ActionSequenceTest_js,
    jsRes.ActionSequence2Test_js
];

resCfg[jsRes.ActionManualTest_js] = {layer : "ActionManualTest", title : "Sprite properties", subTitle : "Manual Transformation"}
resCfg[jsRes.ActionMoveTest_js] = {layer : "ActionMoveTest", title : "cc.MoveTo / cc.MoveBy"}
resCfg[jsRes.ActionScaleTest_js] = {layer : "ActionScaleTest", title : "cc.ScaleTo / cc.ScaleBy"}
resCfg[jsRes.ActionRotateTest_js] = {layer : "ActionRotateTest", title : "cc.RotateTo / cc.RotateBy"}
resCfg[jsRes.ActionRotateXY_js] = {layer : "ActionRotateXY", title : "cc.RotateBy(x,y) / cc.RotateTo(x,y)"}
resCfg[jsRes.ActionSkewTest_js] = {layer : "ActionSkewTest", title : "cc.SkewTo / cc.SkewBy"}
resCfg[jsRes.ActionSkewRotateScaleTest_js] = {layer : "ActionSkewRotateScaleTest", title : "Skew + Rotate + Scale"}
resCfg[jsRes.ActionJumpTest_js] = {layer : "ActionJumpTest", title : "cc.JumpTo / cc.JumpBy", subTitle : "Actions will stop for 0.25s after 2 seconds"}
resCfg[jsRes.ActionBezierTest_js] = {layer : "ActionBezierTest", title : "cc.BezierBy / cc.BezierTo"}
resCfg[jsRes.ActionBezierToCopyTest_js] = {layer : "ActionBezierToCopyTest", title : "cc.BezierTo copy test", subTitle : "Both sprites should move across the same path"}
resCfg[jsRes.Issue1008Test_js] = {layer : "Issue1008Test", title : "Issue 1008", subTitle : "cc.BezierTo + Repeat. See console"}
resCfg[jsRes.ActionBlinkTest_js] = {layer : "ActionBlinkTest", title : "cc.Blink"}
resCfg[jsRes.ActionFadeTest_js] = {layer : "ActionFadeTest", title : "cc.FadeIn / cc.FadeOut"}
resCfg[jsRes.ActionTintTest_js] = {layer : "ActionTintTest", title : "cc.TintTo / cc.TintBy"}
resCfg[jsRes.ActionAnimateTest_js] = {layer : "ActionAnimateTest", title : "Animation Test", subTitle : "Center: Manual animation. Border: using file format animation"}
resCfg[jsRes.ActionSequenceTest_js] = {layer : "ActionSequenceTest", title : "cc.Sequence: Move + Rotate"}
resCfg[jsRes.ActionSequence2Test_js] = {layer : "ActionSequence2Test", title : "Sequence of InstantActions"}
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.ccprogress = {
    CCActionProgressTimer_js : '../node_modules/ccprogress/lib/CCActionProgressTimer.js',
    CCProgressTimer_js : '../node_modules/ccprogress/lib/CCProgressTimer.js',
    ProgressTimerBarMidTest_js : '../node_modules/ccprogress/test/ProgressTimerBarMidTest.js',
    ProgressTimerBarMidTest2_js : '../node_modules/ccprogress/test/ProgressTimerBarMidTest2.js',
    ProgressTimerHorizontalTest_js : '../node_modules/ccprogress/test/ProgressTimerHorizontalTest.js',
    ProgressTimerRadialTest_js : '../node_modules/ccprogress/test/ProgressTimerRadialTest.js',
    ProgressTimerVerticalTest_js : '../node_modules/ccprogress/test/ProgressTimerVerticalTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.ccprogress;

resCfg["ccprogress"] = {
    ref : [
        jsRes.CCProgressTimer_js,
        jsRes.CCActionProgressTimer_js
    ]//Base references for the project.
};
resCfg[TEST_BASE] = {res : [res.powered_png]};
cc.gameModules = [jsRes.ProgressTimerRadialTest_js,jsRes.ProgressTimerHorizontalTest_js,jsRes.ProgressTimerVerticalTest_js,jsRes.ProgressTimerBarMidTest_js,jsRes.ProgressTimerBarMidTest2_js];

resCfg[jsRes.ProgressTimerRadialTest_js] = { layer : "ProgressTimerRadial", title : "ProgressTimerRadial" }
resCfg[jsRes.ProgressTimerHorizontalTest_js] = { layer : "ProgressTimerHorizontal", title : "ProgressTimerHorizontal" }
resCfg[jsRes.ProgressTimerVerticalTest_js] = { layer : "ProgressTimerVertical", title : "ProgressTimerVertical" }
resCfg[jsRes.ProgressTimerBarMidTest_js] = { layer : "ProgressTimerBarMid", title : "ProgressTimerBarMid" }
resCfg[jsRes.ProgressTimerBarMidTest2_js] = { layer : "ProgressTimerBarMid2", title : "ProgressTimerBarMid2" }
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.ccgui = {
    CCControl_js : '../node_modules/ccgui/lib/CCControlExtension/CCControl.js',
    CCControlButton_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlButton.js',
    CCControlColourPicker_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlColourPicker.js',
    CCControlHuePicker_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlHuePicker.js',
    CCControlPotentiometer_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlPotentiometer.js',
    CCControlSaturationBrightnessPicker_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlSaturationBrightnessPicker.js',
    CCControlSlider_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlSlider.js',
    CCControlStepper_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlStepper.js',
    CCControlSwitch_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlSwitch.js',
    CCControlUtils_js : '../node_modules/ccgui/lib/CCControlExtension/CCControlUtils.js',
    CCInvocation_js : '../node_modules/ccgui/lib/CCControlExtension/CCInvocation.js',
    CCMenuPassive_js : '../node_modules/ccgui/lib/CCControlExtension/CCMenuPassive.js',
    CCScale9Sprite_js : '../node_modules/ccgui/lib/CCControlExtension/CCScale9Sprite.js',
    CCScrollView_js : '../node_modules/ccgui/lib/CCScrollView/CCScrollView.js',
    CCSorting_js : '../node_modules/ccgui/lib/CCScrollView/CCSorting.js',
    CCTableView_js : '../node_modules/ccgui/lib/CCScrollView/CCTableView.js',
    ButtonEventTest_js : '../node_modules/ccgui/test/ButtonEventTest.js',
    ButtonStylingTest_js : '../node_modules/ccgui/test/ButtonStylingTest.js',
    ColorPickerTest_js : '../node_modules/ccgui/test/ColorPickerTest.js',
    ControlSliderTest_js : '../node_modules/ccgui/test/ControlSliderTest.js',
    GuiTest_js : '../node_modules/ccgui/test/GuiTest.js',
    PotentiometerTest_js : '../node_modules/ccgui/test/PotentiometerTest.js',
    S9SpriteFromBatchNodeTest_js : '../node_modules/ccgui/test/S9SpriteFromBatchNodeTest.js',
    S9SpriteFromSpriteSheetTest_js : '../node_modules/ccgui/test/S9SpriteFromSpriteSheetTest.js',
    StepperTest_js : '../node_modules/ccgui/test/StepperTest.js',
    SwitchButtonTest_js : '../node_modules/ccgui/test/SwitchButtonTest.js',
    TableViewTest_js : '../node_modules/ccgui/test/TableViewTest.js',
    VariableSizeButtonsTest_js : '../node_modules/ccgui/test/VariableSizeButtonsTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.ccgui;

resCfg["ccgui"] = {
    ref : [
        jsRes.CCControl_js,
        jsRes.CCControlButton_js,
        jsRes.CCControlUtils_js,
        jsRes.CCInvocation_js,
        jsRes.CCScale9Sprite_js,
        jsRes.CCMenuPassive_js,
        jsRes.CCControlSaturationBrightnessPicker_js,
        jsRes.CCControlHuePicker_js,
        jsRes.CCControlColourPicker_js,
        jsRes.CCControlSlider_js,
        jsRes.CCControlSwitch_js,
        jsRes.CCControlStepper_js,
        jsRes.CCControlPotentiometer_js,
        jsRes.CCScrollView_js,
        jsRes.CCSorting_js,
        jsRes.CCTableView_js
    ]//Base references for the project.
};

resCfg[TEST_BASE] = {
    ref: [jsRes.GuiTest_js],
    res: [
        res.background_png,
        res.sliderProgress_png,
        res.sliderThumb_png,
        res.sliderTrack_png,
        res.CCControlColourPickerSpriteSheet_plist,
        res.CCControlColourPickerSpriteSheet_png,
        res.buttonBackground_png,
        res.switch_mask_png,
        res.switch_off_png,
        res.switch_on_png,
        res.switch_thumb_png,
        res.potentiometerButton_png,
        res.potentiometerProgress_png,
        res.potentiometerTrack_png,
        res.stepper_minus_png,
        res.stepper_plus_png,
        res.button_png,
        res.buttonHighlighted_png,
        res.blocks9_png,
        res.blocks9ss_png,
        res.blocks9ss_plist
    ]
};

cc.gameModules = [
    jsRes.ControlSliderTest_js,
    jsRes.ColorPickerTest_js,
    jsRes.SwitchButtonTest_js,
    jsRes.PotentiometerTest_js,
    jsRes.StepperTest_js,
    jsRes.VariableSizeButtonsTest_js,
    jsRes.ButtonEventTest_js,
    jsRes.ButtonStylingTest_js,
    jsRes.S9SpriteFromSpriteSheetTest_js,
    jsRes.S9SpriteFromBatchNodeTest_js,
    jsRes.TableViewTest_js
];

resCfg[jsRes.ControlSliderTest_js] = { layer : "ControlSliderTest", title : "GUI Slider" };
resCfg[jsRes.ColorPickerTest_js] = { layer : "ColorPickerTest", title : "GUI Color Picker" };
resCfg[jsRes.SwitchButtonTest_js] = { layer : "SwitchButtonTest", title : "GUI Switch Button" };
resCfg[jsRes.PotentiometerTest_js] = { layer : "PotentiometerTest", title : "GUI Potentiometer" };
resCfg[jsRes.StepperTest_js] = { layer : "StepperTest", title : "GUI Stepper" };
resCfg[jsRes.VariableSizeButtonsTest_js] = { layer : "VariableSizeButtonsTest", title : "GUI Various Sized Buttons" };
resCfg[jsRes.ButtonEventTest_js] = { layer : "ButtonEventTest", title : "GUI Button Events" };
resCfg[jsRes.ButtonStylingTest_js] = { layer : "ButtonStylingTest", title : "GUI Button Styling" };
resCfg[jsRes.S9SpriteFromSpriteSheetTest_js] = { layer : "S9SpriteFromSpriteSheetTest", title : "GUI Scale9Sprite", subTitle: "Loaded from sprite sheet (stored rotated)" };
resCfg[jsRes.S9SpriteFromBatchNodeTest_js] = { layer : "S9SpriteFromBatchNodeTest", title : "GUI Scale9Sprite", subTitle: "Created empty and updated from sprite batch node" };
resCfg[jsRes.TableViewTest_js] = { layer : "TableViewTest", title : "GUI Table View" };
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.cceditbox = {
    CCEditBox_js : '../node_modules/cceditbox/lib/CCEditBox.js',
    CCdomNode_js : '../node_modules/cceditbox/lib/CCdomNode.js',
    EditBoxTest_js : '../node_modules/cceditbox/test/EditBoxTest.js'
};
var resCfg = cc.resCfg;
var jsRes = js.cceditbox;

resCfg["cceditbox"] = {
    ref : [
        jsRes.CCdomNode_js,
        jsRes.CCEditBox_js
    ]//Base references for the project.
};

resCfg[TEST_BASE] = {
    res : [res.green_edit_png, res.orange_edit_png, res.yellow_edit_png]
};

cc.gameModules = [jsRes.EditBoxTest_js];

resCfg[jsRes.EditBoxTest_js] = { layer : "EditBoxTest", title : "Edit box test" };
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
var js = js || {};
js.project = {
    Book_js : './src/Book.js',
    Character_js : './src/Character.js',
    ChatBox_js : './src/ChatBox.js',
    EntryBox_js : './src/EntryBox.js',
    Equipment_js : './src/Equipment.js',
    GameScene_js : './src/GameScene.js',
    GameTile_js : './src/GameTile.js',
    InputBox_js : './src/InputBox.js',
    Inventory_js : './src/Inventory.js',
    ItemEditor_js : './src/ItemEditor.js',
    LocalStorage_js : './src/LocalStorage.js',
    Login_js : './src/Login.js',
    MainScene_js : './src/MainScene.js',
    MapEditor_js : './src/MapEditor.js',
    ObjectLists_js : './src/ObjectLists.js',
    PlayersController_js : './src/PlayersController.js',
    Popup_js : './src/Popup.js',
    PopupList_js : './src/PopupList.js',
    Scene_js : './src/Scene.js',
    SceneManager_js : './src/SceneManager.js',
    StatsController_js : './src/StatsController.js',
    Strings_js : './src/Strings.js',
    Utils_js : './src/Utils.js',
    WarpEditor_js : './src/WarpEditor.js',
    client_js : './src/client.js',
    map_js : './src/map.js'
};
var resCfg = cc.resCfg;
var jsRes = js.project;

resCfg["project"] = {
    ref : []//Base references for the project.
};

cc.gameModules = [jsRes.SceneManager_js];//Game modules

resCfg[jsRes.SceneManager_js] = {
    ref : [jsRes.client_js,jsRes.Strings_js, jsRes.Utils_js, jsRes.LocalStorage_js, jsRes.GameTile_js, jsRes.StatsController_js, jsRes.ObjectLists_js, jsRes.map_js, jsRes.PlayersController_js, jsRes.Character_js, jsRes.Scene_js,jsRes.Popup_js, jsRes.Book_js, jsRes.Equipment_js, jsRes.Inventory_js, jsRes.ItemEditor_js, jsRes.MapEditor_js, jsRes.PopupList_js, jsRes.WarpEditor_js, jsRes.MainScene_js, jsRes.Login_js, jsRes.GameScene_js, jsRes.InputBox_js, jsRes.ChatBox_js, jsRes.EntryBox_js]
};
exports.res = res;
exports.resCfg = resCfg;
exports.gameModules = cc.gameModules;
exports.jsRes = js;
