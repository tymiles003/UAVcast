#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt
#source $DIR/../DroneConfig.cfg
gcs_ip=$(jq -r '.GCS_address' $CONF)
if [[ $gcs_ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]];
 then
    ip=$gcs_ip
  else
  ip=`dig +short $gcs_ip`
fi
FILE="$DIR/./ser2net.conf"
/bin/cat <<EOM >$FILE
udp,$(jq -r '.PORT' $CONF):raw:600:/dev/ttyAMA0:57600 8DATABITS NONE 1STOPBIT remaddr=ipv4,udp,$ip,$(jq -r '.PORT' $CONF)
EOM
sleep 1.5
sudo ser2net -c $DIR/./ser2net.conf > $DIR/../log/ser2net.log &
