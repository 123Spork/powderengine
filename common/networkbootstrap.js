/*jslint node: true, stupid: true*/
"use strict";

var xport   = require('node-xport')(module),
    fs      = require('fs'),
    path    = require('path');

function NetworkBootstrap(config) {
    this.configure(config);
}

NetworkBootstrap.prototype.configure = function (config) {
    this.key   = null;
    this.cert  = null;
    this.paths = { root: path.join('..', 'ssl'), key: null, cert: null };

    if (config.ssl !== undefined && config.ssl !== null) {
        config.ssl.enabled = !(config.ssl.enabled === false);

        this.paths.key     = path.join(this.paths.root, config.ssl.key);
        this.paths.cert    = path.join(this.paths.root, config.ssl.cert);
        this.paths.exists  = { key: fs.existsSync(this.paths.key), cert: fs.existsSync(this.paths.cert) };
        this.sslEnabled    = (config.ssl.enabled && this.paths.exists.key && this.paths.exists.cert);

        if (this.sslEnabled) {
            this.key   = fs.readFileSync(this.paths.key);
            this.cert  = fs.readFileSync(this.paths.cert);
        } else if (config.ssl.enabled) {
            console.log("================================== FATAL ==================================");
            console.log("SSL is enabled, however the key and or certificate filename is invalid.");
            console.log("SSL filenames in the configuration are relative to the ../ssl/ directory.");
            console.log("  Based upon your configuration your key file should be located at:");
            console.log("    => " + path.resolve(this.paths.key));
            console.log("  Based upon your configuration your certificate file should be located at:");
            console.log("    => " + path.resolve(this.paths.cert));
            console.log("Either disable SSL or ensure the configuration and file locations match.");
            console.log("=================================== END ===================================");

            process.exit(0xFF0001);
        }
    }
};

NetworkBootstrap.prototype.isSSLEnabled = function () {
    return this.sslEnabled;
};

NetworkBootstrap.prototype.getKey = function () {
    return this.key;
};

NetworkBootstrap.prototype.getCert = function () {
    return this.cert;
};

NetworkBootstrap.prototype.getTransferProtocol = function () {
    return require(this.getTransferProtocolName());
};

NetworkBootstrap.prototype.getTransferProtocolName = function () {
    return (this.sslEnabled ? "https" : "http");
};

NetworkBootstrap.prototype.createServerInstance = function (requestHandler) {
    if (this.sslEnabled) {
        return this.getTransferProtocol().createServer({ key: this.key, cert: this.cert }, requestHandler);
    }

    return this.getTransferProtocol().createServer(requestHandler);
};

xport(NetworkBootstrap);