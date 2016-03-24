'use strict';

// From: http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js

module.exports = function get_address() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ip;
    var mac;

    for (let ifname of Object.keys(ifaces)) {
      for (let iface of ifaces[ifname]) {
        if (iface.family == 'IPv4' && !iface.internal) {
          if (ifname.lastIndexOf('eth', 0) == 0) {
            return [iface.address, iface.mac];
          }
          if (typeof ip === 'undefined') {
            ip = iface.address;
            mac = iface.mac;
          }
        }
      }
    }
    return [ip, mac];
}

