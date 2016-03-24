/* global module */
"use strict";

const Server = require('node-ssdp').Server;

class upnpServer {
  constructor(parameters) {
    this.parameters = parameters;
    //console.log(parameters);
    this._server = new Server(parameters);
  }

  createServer() {
    // Define callbacks
    //console.log("Defining callbacks");
    this._server.on('advertise-alive', function (headers) {
      // Expire old devices from your cache. 
      // Register advertising device somewhere (as designated in http headers heads) 
      //console.log("Advertising")
      //console.log(headers);
    });

    this._server.on('advertise-bye', function (headers) {
      // Remove specified device from cache. 
      //console.log("Saying Bye")
      //console.log(headers);
    });    
  }

  startServer(something) {
    //console.log("Superclass start server: " + something);
    this._server.start();      
  }

  stopServer(something) {
    //console.log("Superclass stop server " + something);
    this._server.stop();      
  }
}
       
module.exports = upnpServer;
    