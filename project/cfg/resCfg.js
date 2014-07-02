var resCfg = cc.resCfg;
var jsRes = js.project;

resCfg["project"] = {
    ref : []//Base references for the project.
};

cc.gameModules = [jsRes.SceneManager_js];//Game modules

resCfg[jsRes.SceneManager_js] = {
    ref : [jsRes.client_js,jsRes.Strings_js, jsRes.Utils_js, jsRes.LocalStorage_js, jsRes.GameTile_js, jsRes.StatsController_js, jsRes.ObjectLists_js, jsRes.map_js, jsRes.PlayersController_js, jsRes.Character_js, jsRes.Scene_js,jsRes.Popup_js,jsRes.MainScene_js, jsRes.Login_js, jsRes.GameScene_js, jsRes.InputBox_js, jsRes.ChatBox_js, jsRes.EntryBox_js]
};