#!/bin/bash

. config.sh

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
# Generate UAVcast.service file
FILE=$DIR/"systemd/UAVcast.service"

/bin/cat <<EOM >$FILE
[Unit]
Description=UAVcast Drone Software
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=/home/pi/UAVcast
Type=forking
GuessMainPID=no
ExecStart=/bin/bash DroneStart.sh start
KillMode=control-group
Restart=on-failure
[Install]
WantedBy=network-online.target
EOM

# Copy generated UAVcast.service file to systemd
cp $FILE /lib/systemd/system/
sudo systemctl daemon-reload
# sudo systemctl enable $FILE

# If RPI 3, we need to remap the UART pins
set_dtoverlay_pi_three

# set config for cmdline.txt and config.txt
do_serial

# This will ensure that all configured network devices are up and have an IP address assigned before boot continues.
sudo systemctl enable systemd-networkd-wait-online.service

# Update and Upgrade the Pi, otherwise the build may fail due to inconsistencies
sudo apt-get update -y 

# Get the required libraries
sudo apt-get install -y --force-yes jq build-essential dnsutils inadyn usb-modeswitch \
                                    cmake dh-autoreconf wvdial gstreamer1.0-tools gstreamer1.0-plugins-good gstreamer1.0-plugins-bad
#                                   libboost-all-dev libconfig++-dev libreadline-dev

#Args Options for installing web interface
args=$1                           
argsToLower=$(echo "$args" | tr '[:upper:]' '[:lower:]')
case $argsToLower in
          "web")
            echo Installing UAVcast including Web interface
            #Run Web instalation
            sudo sh $DIR/./web.sh
        ;;
        *)
         printf "\n\n NOTE!!!  Installing UAVcast without Web Interface \n\n\n use web argurment ( ./install.sh web ) to install web UI.\n\n\n\n"
        ;;
esac

################# COMPILE UAV software ############
#UAVcast dependencies
mkdir $Basefolder/packages
cd $Basefolder/packages

git clone https://github.com/UAVmatrix/libubox.git libubox
git clone git://nbd.name/uqmi.git
git clone https://github.com/UAVmatrix/cmavnode.git

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

######################################
# Using prebuildt binary in /usr/bin #
# use code below to compile cmavnode #
######################################

# cd $Basefolder/packages/cmavnode   
# sudo git submodule update --init
# sudo mkdir build && cd build
# cmake ..
# sudo make install

# Create symlink to cmavnode
sudo ln -s $Basefolder/usr/bin/cmavnode /usr/bin/cmavnode

# Completed
printf "\n\n\nInstallastion completed. \n Reboot RPI and access UAVcast webinterface \n by opening your browser and type the IP of RPI.\n"
