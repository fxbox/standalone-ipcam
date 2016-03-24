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

If your linux laptop has a builtin webcam, then it will typically be called
/dev/video0 and an additional external webcam will show up as /dev/video1.

I tested with the builtin camera on my System76 Galago UltraPro and with an
external Logitech C920.

# Installing node on a Raspberry Pi

The node which comes with the Raspberry Pi seems to be quite old. This code requires
a newer version. I installed node on my Raspberry Pi 2 (running jessie) by doing:
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
node -v
```
node -v reported version 4.2.1.

