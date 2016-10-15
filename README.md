# UAVcast

Complete Drone casting software for Raspberry PI in conjuction with 3G / 4G or WiFi. Can be used with Ardupilot or Navio boards (Emlid.com)

### Installation

```
sudo apt-get install git
sudo git clone https://github.com/UAVmatrix/UAVcast.git
cd UAVcast/Install
sudo ./Install.sh
```

##How it works
UAVcast uses regular software such as wvdial, inadyn. gstreamer, uqmi, and will fire up each program in the correct order users has defined in the DroneConfig.cfg file. 
 
After you have successfully installed UAVcast and edited DroneConfig, you could simply start UAVcast by running ``` ./DroneStart.sh ``` or ``` sudo systemctl start UAVcast ```
If there is any problems during startup, then please check the logfile located in the ```UAVcast/log ``` category.
 

## Authors

* **Bernt Christian Egeland** - *Initial work* - [PurpleBooth](https://github.com/PurpleBo

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
