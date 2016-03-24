/* global module */
"use strict";

/*
UPNPManager: msearch = UpnpMsearchHeader {
        device_id: "uuid:ae67e622-7a66-465e-bab0-28107b2df980",
        device_type: "",
        service_type: "urn:cellvision:service:Null:1",
        service_ver: "",
        location: "http://10.252.120.202:8592/rootdesc.xml",
        os: "Cellvision UPnP/1.0",
        date: "",
        ext: "",
        expires: 1800,
        alive: true
}
*/
const upnpServer = require('./upnpserver_base.js');

class IpCameraUpnpServer extends upnpServer {

	constructor(ip, udn) {
        var ipcam_config = {
            location: 'http://' + ip + ':8100',
            udn: udn,
            description: 'ipcam_config description',
            adInterval: 180000  // once every 3 minutes
        };
		super(ipcam_config);
  		this._server.addUSN('urn:cellvision:service:Null:1');
  		console.log("im constructed", ip, udn);
	}

	startServer (something) {
  		console.log(something + " upnp simulation started");
  		super.startServer(something);
	}
}

module.exports = IpCameraUpnpServer;