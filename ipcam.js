'use strict';
const fs = require("fs");
const path = require('path');
const express = require('express');

var GetOpt = require('node-getopt');
var getopt = new GetOpt([
  ['', 'sim', 'Behave like an IP Camera Simulator' ],
  ['h', 'help',     'Display help' ],
]);

var opt = getopt.parseSystem();
//console.log(opt);

var ip;
var mac;
var port = 8100;

if ('help' in opt.options) {
    getopt.showHelp();
    process.exit(1);
}

if ('sim' in opt.options) {
    ip = '127.0.0.1';
    mac = 'aaaaaaaaaaaa';
} else {
    var get_address = require('./get_address.js');

    var addrs = get_address();
    ip = addrs[0]
    mac = addrs[1].replace(/:/g, '');
}
var udn = 'uuid:18db9b78-f188-11e5-9ce9-' + mac;
var port = 8100;

console.log('Our IP Address =', ip, mac);

var upnp_ipcamera = require('./upnp_ipcamera.js');

// start a webserver that hosts the xml
var app = express();
var camera = new upnp_ipcamera(ip, udn);

app.get('/', function (req, res) {
   res.status(200).type('xml').send(
     '<?xml version=\"1.0\"?>' +
     '<root xmlns=\"urn:schemas-upnp-org:device-1-0\">' +
       '<specVersion>' + 
          '<major>1</major>' +
          '<minor>0</minor>' + 
        '</specVersion>' +
        '<URLBase>http://' + ip + ':' + port + '</URLBase>' +
        '<device>' +
          '<deviceType>urn:schemas-upnp-org:device:Basic:1.0</deviceType>' +
          '<friendlyName>Link IpCam(' + ip + ':' + port + ')</friendlyName>' +
          '<manufacturer>Project-Link</manufacturer>' +
          '<modelDescription>Wireless Internet Camera</modelDescription>' +
          '<modelName>Link-IpCamera</modelName>' +
          '<modelNumber>Link-IpCamera</modelNumber>' +
          '<UDN>' + udn + '</UDN>' +
          '<UPC/>' +
          '<serviceList>' +
            '<service>' +
              '<serviceType>urn:cellvision:service:Null:1</serviceType>' +
              '<serviceId>urn:cellvision:serviceId:RootNull</serviceId>' +
              '<SCPDURL>/rootService.xml</SCPDURL>' +
            '</service>' +
          '</serviceList>' +
          '<presentationURL>http://' + ip + ':' + port + '</presentationURL>' +
        '</device>' +
      '</root>'
    );
})

app.get('/image/jpeg.cgi', function (req, res) {
  if ('sim' in opt.options) {
    res.status(200).sendFile(path.join(__dirname, 'colville.jpg'));
  } else {
    res.status(200).type('ascii').send('Not running the simulator');
  }
})


var server = app.listen(port, ip, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("IpCamera app listening at http://%s:%s", host, port)

})

// start the upnp broadcast

camera.startServer('Link-IpCamera');
console.log('After camera.startServer');