var xport   = require('node-xport')(module)
  , fs      = require('fs')
  , path    = require('path')
  ;

function NetworkBootstrap(config) {
    this.configure(config);
}

NetworkBootstrap.prototype.configure = function(config) {
    this._key   = null;
    this._cert  = null;
    this._paths = { root: path.join('..', 'ssl'), key: null, cert: null };

    if (config.ssl !== undefined && config.ssl != null) {
        config.ssl.enabled = !(config.ssl.enabled == false);

        this._paths.key     = path.join(this._paths.root, config.ssl.key);
        this._paths.cert    = path.join(this._paths.root, config.ssl.cert);
        this._paths.exists  = { key: fs.existsSync(this._paths.key), cert: fs.existsSync(this._paths.cert) };
        this._sslEnabled    = (config.ssl.enabled && this._paths.exists.key && this._paths.exists.cert);
        
        if (this._sslEnabled) {
            this._key   = fs.readFileSync(this._paths.key);
            this._cert  = fs.readFileSync(this._paths.cert);
        } else if (config.ssl.enabled) {
            console.log("================================== FATAL ==================================");
            console.log("SSL is enabled, however the key and or certificate filename is invalid.");
            console.log("SSL filenames in the configuration are relative to the ../ssl/ directory.");
            console.log("  Based upon your configuration your key file should be located at:");
            console.log("    => " + path.resolve(this._paths.key));
            console.log("  Based upon your configuration your certificate file should be located at:");
            console.log("    => " + path.resolve(this._paths.cert));
            console.log("Either disable SSL or ensure the configuration and file locations match.")
            console.log("=================================== END ===================================");

            process.exit(0xFF0001);
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