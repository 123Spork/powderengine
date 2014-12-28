/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport = require('node-xport')(module);

function Direction(id, name) {
    this.id = id;
    this.name = name;
}

Direction.add = function (name) {
    var direction = new Direction(Direction.count++, name);
    Direction.lookup[direction.id]   = direction;
    Direction.lookup[direction.name] = direction;

    return direction.id;
};

Direction.find = function (lookup) {
    lookup = Number(lookup);

    if (lookup === Number.NaN) {
        lookup = String(lookup).toLowerCase();
    }

    return Direction[lookup];
};

Direction.count     = 0;
Direction.lookup    = [];

Direction.south = Direction.add("south");
Direction.east  = Direction.add("east");
Direction.north = Direction.add("north");
Direction.west  = Direction.add("west");

xport(Direction);