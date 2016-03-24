'use strict';
const fs = require("fs");
const path = require('path');
const express = require('express');
const spawnSync = require('child_process').spawnSync;

var GetOpt = require('node-getopt');
var getopt = new GetOpt([
  ['',  'sim',              'Behave like an IP Camera Simulator' ],
  ['d', 'device=ARG',       'Specify camera device (i.e. /dev/video1)'],
  ['r', 'resolution=ARG',   'Specify resolution (i.e. 1280x720)'],
  ['h', 'help',             'Display help' ],
  ['v', 'verbose',          'Show verbose output' ],
]);

var opt = getopt.parseSystem();
if (opt.options.verbose) {
    console.log(opt);
}

var ip;
var mac;
var port = 8100;

if (opt.options.help) {
    getopt.showHelp();
    process.exit(1);
}

if (opt.options.sim) {
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

console.log('Our IP Address =', ip, 'port =', port, 'UDN =', udn);

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
  if (opt.options.sim) {
    res.status(200).sendFile(path.join(__dirname, 'colville.jpg'));
    return;
  }
  var snapshot_process;

  var image_filename = '/tmp/cam.jpg';
  var snapshot_cmd = 'fswebcam';
  var snapshot_args = ['--no-banner'];
  if ('device' in opt.options) {
      snapshot_args.push('-d');
      snapshot_args.push(opt.options.device);
  }
  if ('resolution' in opt.options) {
      snapshot_args.push('-r');
      snapshot_args.push(opt.options.resolution);
  }
  snapshot_args.push(image_filename);
  if (opt.options.verbose) {
      console.log('snapshot_cmd  =', snapshot_cmd);
      console.log('snapshot_args =', snapshot_args);
  }
  var result = spawnSync(snapshot_cmd, snapshot_args);
  if (result.status != 0) {
      res.status(500).type('html').send(
          '<html>' +
            '<body>' +
              '<h1>Camera Error</h1>' +
              '<h2>Command</h2>' +
              '<pre>' + snapshot_cmd + ' ' + snapshot_args.join(' ') + '</pre>' +
              '<h2>stdout</h2>' +
              '<pre>' + result.stdout + '</pre>' +
              '<h2>stderr</h2>' +
              '<pre>' + result.stderr + '</pre>' +
            '</body>' +
          '</html>'
      );
  } else {
      res.status(200).sendFile(image_filename);
  }
})

var server = app.listen(port, ip, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("IpCamera app listening at http://%s:%s", host, port)

})

// start the upnp broadcast
if (opt.options.sim) {
    camera.startServer('Link-IpCamera Simulator');
} else {
    camera.startServer('Link-IpCamera');
}
