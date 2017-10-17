#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt

#Include date time for logging
dt=$(date '+%d/%m/%Y %H:%M:%S');
echo "$dt"

gcs_ip=$(jq -r '.GCS_address' $CONF)
if [[ $gcs_ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]];
 then
    ip=$gcs_ip
  else
  ip=`dig +short $gcs_ip`
fi
echo Ground Control IP adress: $ip
sudo $DIR/./udp_redirect 0.0.0.0 14550 $ip 14550 &
