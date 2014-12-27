var xport = require('node-xport')
  ;

var PEClass = (function() {
    function PEClass() {}

    PEClass.prototype.constructor = function() {
        this.super = null;
    };

    PEClass.prototype.toString = function() {
        return "[object PEClass]";
    };
})();

PEClass.extend = function() {

};

xport(PEClass);