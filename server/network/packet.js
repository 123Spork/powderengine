/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport   = require('node-xport');

function Packet(sender) {
    this.sender = sender;
}

xport(Packet);