#!/bin/bash
. config.sh

# Create a log file of the build as well as displaying the build on the tty as it runs
# exec > >(tee build_UAV.log)
# exec 2>&1

# Get current Directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Get Parrent Directory
Basefolder="$(cd ../; pwd)" 

# Create systemctl for easy stop/start/restart
Systemd=$DIR/"systemd"
main="$MAINPID"
if [ ! -d "$Systemd" ] 
then
 mkdir systemd
fi

FILE=$DIR/"systemd/UAVcast.service"

/bin/cat <<EOM >$FILE
[Unit]
Description=UAVcast Drone Software
After=network.target
[Service]
WorkingDirectory=/home/pi/UAVcast
Type=forking
GuessMainPID=no
ExecStart=/bin/bash DroneStart.sh start
KillMode=control-group
[Install]
WantedBy=uavcast-user.target
EOM

cp $FILE /lib/systemd/system/
sudo systemctl daemon-reload
#sudo systemctl enable $FILE

#Get Pitype
get_pi_type
#If RPI 3, we need to remap the UART pins
set_dtoverlay_pi_three
#set config for cmdline.txt and config.txt
do_serial


#Navio Options
Navio=$1
echo Installing UAVcast $Navio
################# COMPILE UAV software ############
 
 
# # Update and Upgrade the Pi, otherwise the build may fail due to inconsistencies
sudo apt-get update -y --force-yes

# Get the required libraries
sudo apt-get install -y --force-yes jq build-essential dnsutils inadyn usb-modeswitch \
                                    cmake dh-autoreconf wvdial gstreamer1.0-tools gstreamer1.0-plugins-good gstreamer1.0-plugins-bad
                                    
cd /home/pi
Lower=$(echo "$Navio" | tr '[:upper:]' '[:lower:]')
echo $Lower 
case $Lower in
          "navio2")
          echo Installing Navio2
          wget 'http://files.emlid.com/apm/apm-navio2_3.3.2-rc2-beta-1.2_armhf.deb' -O apm-navio2.deb
	  sudo dpkg -i apm-navio2.deb
        ;;
        "navio")
          Installing Navio
          wget 'http://files.emlid.com/apm/apm.deb' -O apm.deb
          sudo dpkg -i apm.deb
        ;;
esac

# WEB SERVICES INSTALLATION
cd $Basefolder/web
#node and npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs 

#install pm2 web server
sudo npm install --production
sudo npm install pm2@latest -g
sudo pm2 start process.json --env production
sudo pm2 startup
sudo pm2 save

#UAVcast dependencies
mkdir $Basefolder/packages
cd $Basefolder/packages

git clone https://github.com/UAVmatrix/libubox.git libubox
git clone git://nbd.name/uqmi.git
git clone https://github.com/UAVmatrix/ser2net-3.4.git

wget  https://s3.amazonaws.com/json-c_releases/releases/json-c-0.12.tar.gz
tar -xvf json-c-0.12.tar.gz
cd $Basefolder/packages/json-c-0.12
sed -i s/-Werror// Makefile.in   && ./configure --prefix=/usr --disable-static  && make -j1
make install


cd $Basefolder/packages/libubox
cmake CMakeLists.txt -DBUILD_LUA=OFF
make
sudo make install
mkdir -p /usr/include/libubox
cp *.h /usr/include/libubox
cp libubox.so /usr/lib
cp libblobmsg_json.so /usr/lib

cd $Basefolder/packages/uqmi
sudo cmake CMakeLists.txt
sudo make install

cd $Basefolder/packages/ser2net-3.4
sudo autoreconf -f -i
sudo ./configure && make
sudo make install
sudo make clean



echo "Installastion completed. Reboot RPI and access UAVcast webinterface by opening your browser and type the IP of RPI."
