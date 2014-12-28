/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport       = require('node-xport')(module),
    Direction   = require('./direction');

function Entity() {
    this.position = {
        x: 0,
        y: 0,
        dir: Direction.south
    };

    this.velocity = {
        x: 0,
        y: 0
    };

    this.sprite = 0;
    this.spawned = false;
}

Entity.prototype.update = function (time) {
    this.position.x += this.velocity.x * time;
    this.position.y += this.velocity.y * time;
};

Entity.prototype.move = function (x, y) {
    if (x === undefined) {
        return;
    }

    x = Number(x);
    y = Number(y);

    if (Number(x) === Number.NaN) {
        return this.move(x.x, x.y);
    }

    this.position.x = x;
    this.position.y = y;
};

/* Module Export */
xport(Entity);