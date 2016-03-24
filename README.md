This uses node.js and assumes you have node and npm installed.

# Dependencies

The following node modules need to be installed:
```
npm install express node-ssdp node-getopt
```

You should also install fswebcam if you want to use a USB web camera (instead
of just being a simulation).
```
sudo apt-get install fswebcam
```

# Usage (as a simulator)

```
cd standalone-ipcam
node ./ipcam.js --sim
```

# Usage (using a USB webcam)

```
cd standalone-ipcam
node ./ipcam.js -d /dev/video1 -r 1280x720
```
