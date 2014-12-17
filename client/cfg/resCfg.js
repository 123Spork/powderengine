var resCfg = cc.resCfg;
var jsRes = js.client;

resCfg["client"] = {
    ref : []//Base references for the project.
};

cc.gameModules = [jsRes.SceneManager_js];//Game modules

resCfg[jsRes.SceneManager_js] = {
    ref : [
    	jsRes.SingleLineBox_js,
	    jsRes.MultiLineBox_js,
	    jsRes.Strings_js,
	    jsRes.Utils_js,
	    jsRes.LocalStorage_js,
	    jsRes.ListView_js,
	    jsRes.GameTile_js,
	    jsRes.StatsController_js,
	    jsRes.ObjectLists_js,
	    jsRes.map_js,
	    jsRes.PlayersController_js,
	    jsRes.Character_js,
	    jsRes.Scene_js,
	    jsRes.DropDownList_js,
	    jsRes.Popup_js,
	    jsRes.Book_js,
	    jsRes.NpcChatPanel_js,
	    jsRes.Equipment_js,
	    jsRes.Inventory_js,
	    jsRes.Bank_js,
	    jsRes.Sign_js,
	    jsRes.Quests_js,
	    jsRes.Skills_js,
	    jsRes.ScriptEditor_js,
	    jsRes.ItemEditor_js,
	    jsRes.SettingsEditor_js,
	    jsRes.QuestEditor_js,
	    jsRes.MapEditor_js,
	    jsRes.NPCEditor_js,
	    jsRes.ShopEditor_js,
	    jsRes.SkillsEditor_js,
	    jsRes.PopupList_js,
	    jsRes.ScriptingList_js,
	    jsRes.MainScene_js,
	    jsRes.News_js,
	    jsRes.Credits_js,
	    jsRes.Login_js,
	    jsRes.GameScene_js,
	    jsRes.InputBox_js,
	    jsRes.ChatBox_js,
	    jsRes.EntryBox_js,
	    jsRes.client_js,
    ]
};