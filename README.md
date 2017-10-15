# UAVcast

### See [UAVcast docs](http://uavcast.uavmatrix.com) for detailed information
Complete Drone casting software for Raspberry PI in conjuction with 3G / 4G or WiFi. Can be used with Ardupilot or Navio boards (Emlid.com)

Discussion forum thread
[UAVcast docs](http://uavmatrix.com/viewpost/5/110/741/0/Raspberry-Pi/UAVcast.-Casting-software-for-Raspberry-PI.-Supports-3G-/-4G-/-WiFi.)


### Installation

```
sudo apt-get update
sudo apt-get install git
sudo git clone -b Web_UI https://github.com/UAVmatrix/UAVcast.git
cd UAVcast/install
sudo ./install.sh web (notice the web argument)
```

## Commands
UAVcast uses systemd process handler. use the below commands if you want to start stopp service from comand line.

### Start
```sudo systemctl start UAVcast```

### Stop
```sudo systemctl stop UAVcast```

### Restart
```sudo systemctl restart UAVcast```

### Start on boot 
```sudo systemctl enable UAVcast```

### Not run on boot (for troubleshooting or other tasks)
```sudo systemctl disable UAVcast```


 
### Video
If you are using UAVcast with camera, its highly recommended to use gstreamer on the receiver end to achieve minimal latency.
Download [gstreamer](https://gstreamer.freedesktop.org/download/)

Use this client pipeline to receive video feed from UAVcast.

``` 
gst-launch-1.0.exe -e -v udpsrc port=5000 ! application/x-rtp, payload=96 ! rtpjitterbuffer ! rtph264depay ! avdec_h264 ! fpsdisplaysink sync=false text-overlay=false 
```

If you are using PiCam, remember to enable the camera in ```Raspi-Config```

## Authors

* **Bernt Christian Egeland** - *creator and founder of UAVmatrix.com* - (http://uavmatrix.com)
