var xport = require('node-xport')(module)
  ;

function Direction(id, name) {
    this.id = Direction.count;
    this.name = name;
}

Direction.add = function(name) {
    var direction = new Direction(name);
    Direction.lookup[direction.id]   = direction;
    Direction.lookup[direction.name] = direction;

    Direction.count++;

    return direction.id;
};

Direction.find = function(lookup) {
    if ((lookup = new Number(lookup)) == Number.NaN) {
        lookup = new String(lookup).toLowerCase();
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