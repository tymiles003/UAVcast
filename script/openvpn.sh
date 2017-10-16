#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt

function StartOpenVPN {
while true
do
    sudo ping -c 1 google.com
    sleep 1
        if [[ $? == 0 ]];
                then
                    setPasswordFile
                    sudo nmcli c modify openvpn connection.autoconnect yes
                    echo "Contacting OpenVPN server..."
                    sudo nmcli conn up openvpn passwd-file $DIR/../packages/openvpn/pass.conf
                break;
                else
            echo "Network is not available for VPN, waiting.."
        sleep 5
        fi
done
}

function StopOpenVPN {
   sudo nmcli connection down openvpn
}

function importOpenVpn {
sudo nmcli con | grep openvpn >/dev/null
 if [[ $? == 0 ]]; then
  echo "Profile already exsist, Delete Profile and then create a new one."
 else 
    echo "Creating new Profile.."
    sudo nmcli connection import type openvpn file $DIR/../packages/openvpn/openvpn.ovpn
    sudo nmcli con modify id openvpn vpn.user-name openvpn
 fi
}

function reloadOpenVpn {
   sudo nmcli conn reload openvpn
}

function deleteOpenVpn {
   sudo nmcli conn delete openvpn
}
function init {
    StopOpenVPN
    importOpenVpn
    reloadOpenVpn
    StartOpenVPN
}
function setPasswordFile {
FILE="$DIR/../packages/openvpn/pass.conf"
/bin/cat <<EOM >$FILE
vpn.secrets.password:$(jq -r '.vpn_password' $CONF)
EOM
}
case "$1" in
        "StartOpenVPN")
        StartOpenVPN
        ;;
        "StopOpenVPN")
        StopOpenVPN
        ;;
        "importOpenVpn")
        importOpenVpn
        ;;
        "reloadOpenVpn")
        reloadOpenVpn
        ;;
        "init")
        init
        ;;
         "deleteOpenVpn")
        deleteOpenVpn
        ;;
esac