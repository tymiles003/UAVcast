#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../../DroneConfig.txt

VPN_pass_file="../../usr/etc/pass.conf"
VPN_ovpn_file="../../usr/etc/openvpn.ovpn"
function StartOpenVPN {
while true
do
    sudo ping -c 1 google.com
    sleep 1
        if [[ $? == 0 ]];
                then
                    #Create password file
                    setPasswordFile

                    #Import Profile
                    importOpenVpn

                    #Set Autoreconnect ON
                    sudo nmcli c modify openvpn connection.autoconnect yes

                    echo "Contacting OpenVPN server..."
                    sudo nmcli conn up openvpn passwd-file $DIR/$VPN_pass_file
                break;
                else
            echo "Network is not available for VPN, waiting.."
        sleep 5
        fi
done
}

function StopOpenVPN {
   #Stop VPN
   sudo nmcli connection down openvpn
   
   #Delete Profile
   deleteOpenVpn

   #Delete Password file
   DeletePasswordFile
}

function importOpenVpn {
sudo nmcli con | grep openvpn >/dev/null
 if [[ $? == 0 ]]; then
  echo "Profile already exsist, Delete Profile and then create a new one."
 else 
    echo "Creating new Profile.."
    sudo nmcli connection import type openvpn file $DIR/$VPN_ovpn_file
    sudo nmcli con modify id openvpn vpn.user-name openvpn
 fi
}

function reloadOpenVpn {
   sudo nmcli conn reload openvpn
}

function deleteOpenVpn {
   sudo nmcli conn delete openvpn
}

function DeletePasswordFile {
   sudo rm $DIR/$VPN_pass_file >/dev/null 2>&1
}
function init {
    StopOpenVPN
    importOpenVpn
    reloadOpenVpn
    StartOpenVPN
}
function setPasswordFile {
FILE="$DIR/$VPN_pass_file"
/bin/cat <<EOM >$FILE
vpn.secrets.password:$(jq -r '.vpn_password' $CONF)
EOM

#Set persmission
sudo chmod 600 -R $DIR/../../usr/etc/
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