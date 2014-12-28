/*jslint node: true, stupid: true, plusplus: true*/
"use strict";

var xport       = require('node-xport')(module),
    mongoose    = require('mongoose');

var SchemaUser = mongoose.Schema({
    id: Number,
    name: String,
    pass: String,
    mail: String,
    registration: Number,
    lastLogin: Number
});

/* Module Export */
xport(SchemaUser);