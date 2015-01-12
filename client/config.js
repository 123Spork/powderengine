$.ajaxSetup({ async: false });

var config = {
    COCOS2D_DEBUG: 2,
    showFPS : true,
    frameRate : 60,
    tag : "gameCanvas",
    renderMode:1,
    "tileSize":32,
    "characterSize":32,
    "language":"EN",
    "characterSheets":["sprites1.png"],
    "tileSheets":["tiles0.png","tiles1.png","items1.png","building1.png","40x40Tiles.png"],
    "sounds":["menu","maps"],
    "server": {
        "host": "localhost",
        "port": 1337
    },
    "getHost": function() {
        return this.server.host;
    },
    "setHost": function(host) {
        this.server.host = host;
    },
    "getPort": function() {
        return this.server.port;
    },
    "setPort": function(port) {
        this.server.port = port;
    },
    "getServer": function() {
        return this.server;
    },
    "setServer": function(host, port) {
        this.setHost(host);
        this.setPort(port);
    },
    "getServerURL": function() {
        return (window.location.protocol + "//" + (this.server.host || "localhost") + ":" + (this.server.port || 1337));
    }
};

$.getJSON("config.json", function(data) {
    document["config"] = data;
    config.setServer(data.server.host, data.server.port);
    document.title = (data.game.name || "Powder Engine");
});

document["ccConfig"] = config;