/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport   = require('node-xport');

function Connection() {
    this.stream = null;
}

xport(Connection);