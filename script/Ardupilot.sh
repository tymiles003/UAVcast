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

echo $ip
echo APM starting -> stream pointing to address: $ip
if [ $(jq -r '.secondary_tele' $CONF) == "Yes" ]; then
echo Using Secondary telemetry $(jq -r '.sec_ip_address' $CONF) : $(jq -r '.sec_port' $CONF)
sudo $(jq -r '.APM_type' $CONF) -A udp:$ip:$(jq -r '.PORT' $CONF)-C udp:$(jq -r '.sec_ip_address' $CONF):$(jq -r '.sec_port' $CONF)
else
sudo $(jq -r '.APM_type' $CONF) -A udp:$ip:$(jq -r '.PORT' $CONF)
fi
