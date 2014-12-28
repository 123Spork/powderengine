/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport = require('node-xport');

function PEClass() {
    this.super = null;
}

PEClass.prototype.toString = function () {
    return "[object PEClass]";
};

xport(PEClass);