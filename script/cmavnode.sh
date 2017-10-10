#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt
#source $DIR/../DroneConfig.cfg
gcs_ip=$(jq -r '.GCS_address' $CONF)
getIP() {
    if [[ $1 =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]];
        then
           echo $1
        else
       echo `dig +short $1`
    fi
}
if [ $(jq -r '.secondary_tele' $CONF) == "Yes" ]; then
echo Using Secondary telemetry $(jq -r '.sec_ip_address' $CONF) : $(jq -r '.sec_port' $CONF)
FILE="$DIR/./cmav.conf"
/bin/cat <<EOM >$FILE
[aseriallink]
    type=serial
    port=/dev/ttyAMA0
    baud=57600
[audplink]
    type=udp
    targetip=$(getIP $(jq -r '.GCS_address' $CONF)) 
    targetport=$(jq -r '.PORT' $CONF)
[audplink1]
    type=udp
    targetip=$(getIP $(jq -r '.sec_ip_address' $CONF)) 
    targetport=$(jq -r '.sec_port' $CONF)
EOM
else
FILE="$DIR/./cmav.conf"
/bin/cat <<EOM >$FILE
[aseriallink]
    type=serial
    port=/dev/ttyAMA0
    baud=57600
[audplink]
    type=udp
    targetip=$(getIP $(jq -r '.GCS_address' $CONF)) 
    targetport=$(jq -r '.PORT' $CONF)
EOM
fi
sleep 1
sudo cmavnode -f $DIR/./cmav.conf > $DIR/../log/cmavnode.log &
