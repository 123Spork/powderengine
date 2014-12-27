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
    "server": {
        "host": "82.1.137.1",
        "port": 1337
    },
    "getProtocol": function() {
        return this.server.protocol;
    },
    "setProtocol": function(protocol) {
        this.server.protocol = protocol;
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
    "setServer": function(protocol, host, port) {
        this.setProtocol(protocol);
        this.setHost(host);
        this.setPort(port);
    },
    "getServerURL": function() {
        return ((this.server.protocol || "http") + "://" + (this.server.host || "localhost") + ":" + (this.server.port || 1337));
    }
};

$.getJSON("config.json", function(data) {
<<<<<<< HEAD
    config.setServer(data.server.protocol, data.server.host, data.server.port);
=======
    document["config"] = data;
    config.setServer(data.server.host, data.server.port);
    document.title = (data.game.name || "Powder Engine");
>>>>>>> e2f1a40b43de533512948cb33ef058512996ff34
});

document["ccConfig"] = config;