var cc = cc || {};
cc.resCfg = cc.resCfg || {};

/**
 * A function to handle situations using so many callback.
 * @param tasks functions
 * @param cb    callback, arguments are err and results
 */
cc.series = function(tasks, cb){
    var count = tasks.length;
    var results = [];
    for(var i = 0, li = tasks.length; i < li; ++i){
        tasks[i](function(err){
            if(err) return cb(err);
            results.push(Array.apply(null, arguments).slice(1));
            count--;
            if(count <= 0) return cb(null, results);
        });
    }
};
function ResLoader(baseCfg){
    var baseCfg = baseCfg || {};//content of baseCfg.js
    var baseJsList = baseCfg.baseJsList || [];//base js list to be loaded first
    var modluesPathMap = baseCfg.modluesPathMap;//path map of modules
    var isBaseResLoaded = false;//is base resources loaded
    var isBase4TestLoaded = false;//is base for test loaded
    this.is4Test = false;//is for test
    var baseResCache = {};//cache for base resources
    var resCfg = cc.resCfg;
    var jsCache = {};//cache for js
    var resCache = {};//cache for resources

    var jsCache4All = {};//cache for all js

    /**
     * Desc: Get base resources to be loaded
     * @param js
     * @returns {Array}
     * @private
     */
    function _getBaseRes(js){
        var cfg = resCfg[js];
        if(!cfg) return [];
        var resArr = [];
        var ref = cfg.ref || [];
        for(var i = 0, li = ref.length; i < li; i++){
            resArr = resArr.concat(_getBaseRes(ref[i]));
        }
        var res = cfg.res || [];
        for(var i = 0, li = res.length; i < li; ++i){
            var resPath = res[i];
            if(!resPath || baseResCache[resPath]) continue;
            resArr.push({src : resPath});
            baseResCache[res[i]] = true;
        }
        return resArr;
    }

    /**
     * Desc: Get base resources to be loaded
     * @returns {Array}
     */
    this.getBaseResList = function(){
        return _getBaseRes(baseCfg.projName);
    };

    /**
     * Desc: Load game module
     * @param moduleName
     * @param cb
     */
    this.loadGameModule = function(moduleName, cb){
        jsCache = {};
        resCache = {};
        var jsArr = [], resArr = [];
        if(!isBaseResLoaded){
            var baseResult = this.getResCfg(baseCfg.projName) || {jsArr:[], resArr:[]};
            jsArr = jsArr.concat(baseResult.jsArr);
            resArr = resArr.concat(baseResult.resArr);

            if(this.is4Test && !isBase4TestLoaded){//for test
                var base4TestResult = this.getResCfg(TEST_BASE) || {jsArr:[], resArr:[]};
                jsArr = jsArr.concat(base4TestResult.jsArr);
                resArr = resArr.concat(base4TestResult.resArr);
            }
        }
        var gmResult = this.getResCfg(moduleName) || {jsArr:[], resArr:[]};
        var result = {jsArr : jsArr.concat(gmResult.jsArr), resArr : resArr.concat(gmResult.resArr)};
        this.loadJs("", result.jsArr, function(){
            if(!isBaseResLoaded) {
                isBaseResLoaded = true;
                isBase4TestLoaded = true;
            }
            cb(result.resArr);
        });
    };
    /**
     * Desc: Get resCfg by cfgName.
     * @param js
     * @returns {*}
     */
    this.getResCfg = function(js){
        if(!js || baseJsList.indexOf(js) >= 0) return null;
        var cfg = resCfg[js];
        var isJs = js.length >= 4 && js.substring(js.length - 3) == ".js";//is js ?

        cfg = cfg || {};

        var result = {jsArr:[], resArr:[]};
        var ref = cfg.ref || [];
        for(var i = 0, li = ref.length; i < li; i++){
            if(!ref[i]) continue;
            var r = this.getResCfg(ref[i]);
            if(r){
                if(r.jsArr && r.jsArr.length > 0) result.jsArr = result.jsArr.concat(r.jsArr);
                if(r.resArr && r.resArr.length > 0) result.resArr = result.resArr.concat(r.resArr);
            }
        }
        var res = cfg.res || [];
        for(var i = 0, li = res.length; i < li; ++i){
            var resPath = res[i];
            if(!resPath || resCache[resPath]) continue;
            result.resArr.push({src : resPath});
            resCache[resPath] = true;
        }
        if(isJs) {
            var results = js.match(/\[\%[\w_\d\-]+\%\]/);
            if(results && results.length > 0){
                var moduleName = results[0].substring(2, results[0].length - 2);
                js = js.replace(/\[\%[\w_\d\-]+\%\]/, modluesPathMap[moduleName]);//replace module name with path
            }
            result.jsArr.push(js);
        }
        jsCache[js] = true;
        return result;
    }

    /**
     * Load js files.
     * @param baseDir   The pre path for jsList.
     * @param jsList    List of js path.
     * @param cb        Callback function
     *
     *      If the arguments.length == 2, then the baseDir turns to be "".
     * @returns {*}
     */
    this.loadJs = function(baseDir, jsList, cb){
        if(arguments.length < 1) return;
        if(arguments.length == 1){
            jsList = baseDir instanceof Array ? baseDir : [baseDir];
            baseDir = "";
        }else if(arguments.length == 2){
            if(typeof jsList == "function"){
                cb = jsList;
                jsList = baseDir instanceof Array ? baseDir : [baseDir];
                baseDir = "";
            }else{
                jsList = jsList instanceof Array ? jsList : [jsList];
            }
        }else{
            jsList = jsList instanceof Array ? jsList : [jsList];
        }
        return this._loadJsList(baseDir, jsList, 0, cb);
    };

    /**
     * Add next after loaded.
     * @param baseDir
     * @param jsList
     * @param index
     * @param cb
     * @returns {*}
     * @private
     */
    this._loadJsList4Dependency = function(baseDir, jsList, index, cb){
        if(index >= jsList.length) {
            if(cb) cb();
            return;
        }
        var jsPath = baseDir + jsList[index];
        if(jsCache4All[jsPath]) return this._loadJsList4Dependency(baseDir, jsList, index+1, cb);
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = jsPath;
        jsCache4All[jsPath] = true;
        var self = this;
        script.addEventListener('load',function(){
            self._loadJsList4Dependency(baseDir, jsList, index+1, cb);
            this.removeEventListener('load', arguments.callee, false);
        },false);
        document.body.appendChild(script);
    };
    /**
     * Desc: A private function to load js list.
     * @param baseDir   The pre path for jsList.
     * @param jsList    Js list.
     * @param index     Index of current js to be loaded.
     * @param cb        Callback function
     * @private
     */
    this._loadJsList = function(baseDir, jsList, index, cb){
        baseDir = baseDir || "";
        if(index >= jsList.length) {
            if(cb) cb();
            return;
        }
        var d = document;

        if (navigator.userAgent.indexOf("Trident/5") > -1) {
            this._loadJsList4Dependency(baseDir, jsList, index, cb);
        }
        else {
            var tasks = [];
            for(var i = 0, li = jsList.length; i < li; i++){
                var itemi = jsList[i];
                tasks.push(function(cb1){
                    var jsPath = this.jsPath;
                    if(jsCache4All[jsPath]) return cb1(null);
                    var s = d.createElement('script');
                    s.async = false;
                    s.src = jsPath;
                    jsCache4All[jsPath] = true;
                    s.addEventListener('load',function(){
                        this.removeEventListener('load', arguments.callee, false);
                        cb1(null);
                    },false);
                    s.addEventListener('error',function(){
                        cb1("Load " + jsPath + " failed!");
                    },false);
                    d.body.appendChild(s);
                }.bind({jsPath : baseDir + itemi}));
            }
            cc.series(tasks, function(err){
                if(err) throw err;
                cb();
            });
        }
    };

    /**
     * Draw a loading gif while loading js.
     * @returns {HTMLElement}
     * @private
     */
    this._loadJsImg = function(){
        var jsLoadingImg = document.getElementById("cocos2d_loadJsImg");
        if(!jsLoadingImg){
            jsLoadingImg = document.createElement('img');
            jsLoadingImg.src = "data:image/gif;base64,R0lGODlhEAAQALMNAD8/P7+/vyoqKlVVVX9/fxUVFUBAQGBgYMDAwC8vL5CQkP///wAAAP///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAANACwAAAAAEAAQAAAEO5DJSau9OOvNex0IMnDIsiCkiW6g6BmKYlBFkhSUEgQKlQCARG6nEBwOgl+QApMdCIRD7YZ5RjlGpCUCACH5BAUAAA0ALAAAAgAOAA4AAAQ6kLGB0JA4M7QW0hrngRllkYyhKAYqKUGguAws0ypLS8JxCLQDgXAIDg+FRKIA6v0SAECCBpXSkstMBAAh+QQFAAANACwAAAAACgAQAAAEOJDJORAac6K1kDSKYmydpASBUl0mqmRfaGTCcQgwcxDEke+9XO2WkxQSiUIuAQAkls0n7JgsWq8RACH5BAUAAA0ALAAAAAAOAA4AAAQ6kMlplDIzTxWC0oxwHALnDQgySAdBHNWFLAvCukc215JIZihVIZEogDIJACBxnCSXTcmwGK1ar1hrBAAh+QQFAAANACwAAAAAEAAKAAAEN5DJKc4RM+tDyNFTkSQF5xmKYmQJACTVpQSBwrpJNteZSGYoFWjIGCAQA2IGsVgglBOmEyoxIiMAIfkEBQAADQAsAgAAAA4ADgAABDmQSVZSKjPPBEDSGucJxyGA1XUQxAFma/tOpDlnhqIYN6MEAUXvF+zldrMBAjHoIRYLhBMqvSmZkggAIfkEBQAADQAsBgAAAAoAEAAABDeQyUmrnSWlYhMASfeFVbZdjHAcgnUQxOHCcqWylKEohqUEAYVkgEAMfkEJYrFA6HhKJsJCNFoiACH5BAUAAA0ALAIAAgAOAA4AAAQ3kMlJq704611SKloCAEk4lln3DQgyUMJxCBKyLAh1EMRR3wiDQmHY9SQslyIQUMRmlmVTIyRaIgA7";

            var canvasNode = document.getElementById(document["ccConfig"].tag);
            canvasNode.style.backgroundColor = "black";
            canvasNode.parentNode.appendChild(jsLoadingImg);

            var canvasStyle = getComputedStyle?getComputedStyle(canvasNode):canvasNode.currentStyle;
            jsLoadingImg.style.left = canvasNode.offsetLeft + (parseFloat(canvasStyle.width) - jsLoadingImg.width)/2 + "px";
            jsLoadingImg.style.top = canvasNode.offsetTop + (parseFloat(canvasStyle.height) - jsLoadingImg.height)/2 + "px";
            jsLoadingImg.style.position = "absolute";
        }
        return jsLoadingImg;
    };


    /**
     * Load base for game, such as js.
     * @param cb
     */
    this.loadGame = function(){
        var self = this;
        this._loadJsList4Dependency("", [baseCfg.modluesPathMap[baseCfg.projName] + baseCfg.resPath], 0, function(){
            var jsLoadingImg = self._loadJsImg();
            if(baseJsList.length > 0){
                self._loadJsList("", baseJsList, 0, function(){
                    jsLoadingImg.parentNode.removeChild(jsLoadingImg);//remove loading gif
                    self._loadJsList("", ["main.js"], 0, function(){
                    });
                });
                return;
            }
        });
    };

}

cc.resLoader = new ResLoader(baseCfg);

/**
 * Load game module.
 * @param moduleName
 * @param cb
 */
cc.loadGameModule = function(moduleName, cb){
    cc.resLoader.loadGameModule(moduleName, cb);
}


//======================test unit=====================

/**
 * Get class by class path.
 * @param classPath
 * @returns {*}
 */
cc.getClazz = function(classPath){
    var clazz = null;
    var arr = classPath.split(".");
    for(var i = 0; i < arr.length; ++i){
        clazz = clazz == null ? window[arr[i]] : clazz[arr[i]];
    }
    return clazz;
};
/**
 * Test for sprite.
 * @param cfgName
 */
cc.testSprite = function(clazz, args){
    var layer = cc.Layer.create();
    var sprite = clazz.create(args || {});
    layer.addChild(sprite);
    var winSize = cc.Director.getInstance().getWinSize();
    sprite.setPosition(winSize.width/2, winSize.height/2);
    var scene = cc.Scene.create();
    scene.addChild(layer);
    cc.Director.getInstance().replaceScene(scene);
};
/**
 * Test for layer.
 * @param cfgName
 */
cc.testLayer = function(clazz, args){
    var scene = cc.Scene.create();
    scene.addChild(clazz.create(args || {}));
    cc.Director.getInstance().replaceScene(scene);
};
/**
 * Test for scene.
 * @param cfgName
 */
cc.testScene = function(clazz, args){
    var scene = clazz.create(args || {});
    cc.Director.getInstance().replaceScene(scene);
};
/**
 * Desc: Test for ccbi.This function requires ccb module.
 * @param cfgName
 */
cc.testCCBI = function(cfgName, cfg){
    var node = cc.BuilderReader.load(cfgName);
    var scene = cc.Scene.create();
    if(node != null) scene.addChild(node);
    cc.Director.getInstance().replaceScene(scene);
};

//unit map
cc.unitMap = {
    scene : cc.testScene,
    layer : cc.testLayer,
    sprite : cc.testSprite
};
//unit map for custom
cc.unitMap4Cust = {
    ccbi : cc.testCCBI
};
cc._trans4Res = function(resArr){
    var arr = [];
    for(var i = 0, li = resArr.length; i < li; i++){
        var itemi = resArr[i];
        arr.push({src : itemi});
    }
    return arr;
}
/**
 * Desc: Enter point of test unit.
 * @param cfgName
 * @param loader
 */
cc.test = function(cfgName, loader){
    loader = loader || cc.LoaderScene;
    cc.resLoader.is4Test = true;
    cc.loadGameModule(cfgName, function(resArr){
        loader.preload(resArr, function(){
            var cfg = resCfg[cfgName];
            if(!cfg) throw "Please config the info of [" + cfgName + "] in resCfg.js first!"
            for (var key in cc.unitMap4Cust) {
                if(!key) continue;
                if(!cfg[key]) continue;
                //for custom, the args will be cfgName and cfg
                if(cc.unitMap4Cust[key]) return c.unitMap4Cust[key](cfgName, cfg);
            }
            for (var key in cc.unitMap) {
                if(!key) continue;
                if(!cfg[key]) continue;
                //for custom, the args will be cfgName and cfg
                var clazz = cc.getClazz(cfg[key]);
                if(!clazz) return console.error("class of [" + cfg[key] + "] not exists!");
                //for normal, the args will be class and args of cfg.
                return cc.unitMap[key](clazz, cfg.args);
            }
        });
    });
};

cc.resLoader.loadGame();