var xport   = require('node-xport')(module)
  , fs      = require('fs')
  , path    = require('path')
  ;

function NetworkBootstrap(config) {
    this.configure(config);
}

NetworkBootstrap.prototype.configure = function(config) {
    this._key = null;
    this._cert = null;
    this._paths     = { root: path.join('..', 'ssl'), key: null, cert: null };

    if (config.ssl !== undefined && config.ssl != null) {
        this._paths.key     = path.join(this._paths.root, config.ssl.key);
        this._paths.cert    = path.join(this._paths.root, config.ssl.cert);
        
        this._sslEnabled    = (fs.existsSync(this._paths.key) && fs.existsSync(this._paths.cert));
        if (this._sslEnabled) {
            this._key   = fs.readFileSync(this._paths.key);
            this._cert  = fs.readFileSync(this._paths.cert);
        }
    }
};

NetworkBootstrap.prototype.isSSLEnabled = function() {
    return this._sslEnabled;
};

NetworkBootstrap.prototype.getKey = function() {
    return this._key;
};

NetworkBootstrap.prototype.getCert = function() {
    return this._cert;
};

NetworkBootstrap.prototype.getTransferProtocol = function() {
    return require(this.getTransferProtocolName());
};

NetworkBootstrap.prototype.getTransferProtocolName = function() {
    return (this._sslEnabled ? "https" : "http");
};

NetworkBootstrap.prototype.createServerInstance = function(requestHandler) {
    if (this._sslEnabled) {
        return this.getTransferProtocol().createServer({ key: this._key, cert: this._cert }, requestHandler);
    }

    return this.getTransferProtocol().createServer(requestHandler);
};

xport(NetworkBootstrap);