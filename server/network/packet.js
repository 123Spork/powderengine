var xport   = require('node-xport')
  ;

function Packet(sender) {
    this.sender = sender;
}

xport(Packet);