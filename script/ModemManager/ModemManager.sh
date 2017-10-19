#!/bin/bash
# Source function library.
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../../DroneConfig.txt

#Include date time for logging
dt=$(date '+%d/%m/%Y %H:%M:%S');
echo "$dt"

prog="Modem-Manager"

Autostart() {
    setPin
    addProfile
    if [ $(jq -r '.MM_Con_Check' $CONF) == "Yes" ]; then
    AutoConnect
    fi
    startConnection
}
setPin() {
    echo "Initializing Modem..."
    sudo mmcli -i 0 --pin=$(jq -r '.MM_Pin' $CONF)
}

addProfile() {
    echo "New Profile Created"
    sudo nmcli c add type gsm ifname $(jq -r '.MM_Modem' $CONF) con-name UAVcast apn $(jq -r '.APN_name' $CONF) user $(jq -r '.MM_Username' $CONF) password $(jq -r '.MM_Password' $CONF)
}   

AutoConnect() {
    sudo nmcli c modify UAVcast connection.autoconnect yes
}   

startConnection() {  
   echo -n $"Starting $prog: " 
   sudo nmcli r wwan on
}  
stopConnection() {
    nmcli r wwan off
    nmcli connection delete UAVcast
}

case "$1" in
    setPin)
        setPin
        ;;
    addProfile)
        addProfile
        ;;
    AutoConnect)
        AutoConnect
        ;;
    startConnection)
        startConnection
        ;;
    Autostart)
        Autostart
        ;;
    stopConnection)
        stopConnection
        ;;
    *)
        echo $"Usage: $0 {setPin|addProfile|AutoConnect|startConnection|Autostart|stopConnection}"
        exit 1
esac