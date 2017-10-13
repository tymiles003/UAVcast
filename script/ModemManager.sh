#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt

#Include date time for logging
dt=$(date '+%d/%m/%Y %H:%M:%S');
echo "$dt"

echo "Initializing Modem..."
sudo mmcli -i 0 --pin=$(jq -r '.MM_Pin' $CONF)
sudo nmcli c add type gsm ifname $(jq -r '.MM_Modem' $CONF) con-name UAVcast apn $(jq -r '.APN_name' $CONF) user $(jq -r '.MM_Username' $CONF) password $(jq -r '.MM_Password' $CONF)
if [ $(jq -r '.MM_Con_Check' $CONF) == "Yes" ]; then
sudo nmcli c modify UAVcast connection.autoconnect yes
fi
sudo nmcli r wwan on
