#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt
function DroneInit {
case $(jq -r '.GSM_Connect' $CONF) in
	"Yes")	
			#Check if Modem should be enabled
			ModemManager
			sleep 5
			#Check if VPN should be enabled
			OpenVpn
			StartBroadcast
	;;
	"No")
			#Check if VPN should be enabled
			OpenVpn
			StartBroadcast
	;;
esac
}

function StartBroadcast {
while true
do
sudo ping -c 1 google.com
	if [[ $? == 0 ]];
			then
				echo "Network available."
				ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null && echo Seems like RPI is connected to Internet, all ok. || echo Seems like your RPI does not have internet connection. Trying to continue anyway.
							pidof inadyn >/dev/null
								if [[ $? -ne 0 ]] ; then 
								inadyn
								fi
							case $(jq -r '.Cntrl' $CONF) in
								"APM")
									gstreamer
									Telemetry_Type
								;;
								"Navio+")
									gstreamer
									ArduPilot
								;;
								"Navio2")
									gstreamer
									ArduPilot
								;;
							esac
				break;
			else
		echo "Network is not available, waiting.."
	sleep 5
	fi
done
echo "If you see this message, then Network was successfully loaded."
}
function ModemManager {
    sudo $DIR/./ModemManager/ModemManager.sh Autostart > $DIR/../log/ModemManager.log 2>&1
}
function OpenVpn {
if [ $(jq -r '.vpn_use' $CONF) == "Yes" ]; then
		ip a show tun0 up  >/dev/null
		if [[ $? == 0 ]]; then
		echo "VPN network already up"
		else
		 echo "Starting VPN"
		 if [ $(jq -r '.vpn_type' $CONF) == "NM_Openvpn" ]; then
		  sudo $DIR/./openvpn/nm_openvpn.sh init > $DIR/../log/openvpn.log 2>&1 &
		  else
		  if [ $(jq -r '.vpn_type' $CONF) == "Openvpn" ]; then
		  sudo $DIR/./openvpn/openvpn.sh start > $DIR/../log/openvpn.log 2>&1 &
		  fi
		fi
	fi
fi
}
function Telemetry_Type {
if [ $(jq -r '.Telemetry_Type' $CONF) == "ttl" ]; then
pidof udp_redirect >/dev/null
    	if [[ $? -ne 0 ]] ; then  
			sudo $DIR/./udp-send.sh > $DIR/../log/TTLRedirect.log 2>&1 & 
			sleep 0.3
			pidof udp_redirect >/dev/null
			sleep 0.3
				if [[ $? -eq 0 ]] ; then 
					echo 'UDP_redirect script started'
					return 1
					else
					echo 'Another UDP_redirect process already running'
				fi
				return 0
		else
	    echo "Another udp_redirect process already running"
        fi
elif [ $(jq -r '.Telemetry_Type' $CONF) == "gpio" ]; then
		pidof cmavnode >/dev/null
    	if [[ $? -ne 0 ]] ; then  
			sudo $DIR/./cmavnode.sh &
			sleep 0.3
			pidof cmavnode >/dev/null
			sleep 0.3
				if [[ $? -eq 0 ]] ; then 
					echo 'Serial streaming script started'
					return 1
					else
					echo 'Another mavproxy process already running'
				fi
				return 0
		else
	    echo "Another mavproxy process already running"
       fi
fi
}
function gstreamer {
if [ $(jq -r '.UseCam' $CONF) == "Yes" ]; then
pidof gst-launch-1.0 >/dev/null
	if [[ $? -ne 0 ]] ; then 
		sudo $DIR/./camera.sh > $DIR/../log/gstreamer.log 2>&1 &
		sleep 5
		pidof gst-launch-1.0 >/dev/null
			if [[ $? -eq 0 ]] ; then
					echo "gStreamer Started"
			else
			echo 'Could`t start gStreamer'
			fi
	else
	echo "Another gStreamer process already running"
	fi
fi
}
function inadyn {
if [ $(jq -r '.UseDns' $CONF) == "Yes" ]; then
   sleep 1
	   if ps ax | grep -v grep | grep inadyn > /dev/null
				then
					echo "inadyn service running"
				else
					echo "Trying to start inadyn"
					sudo  inadyn --username $(jq -r '.Username' $CONF) --password $(jq -r '.Password' $CONF) --update_period_sec 600 --alias $(jq -r '.Alias' $CONF) --dyndns_system $(jq -r '.dyndns_system' $CONF) > $DIR/../log/inadyn.log 2>&1 & 
					sleep 1
					  if ps ax | grep -v grep | grep inadyn > /dev/null
						  then
						  echo "inadyn successfully started"
					  else 
						  echo "could not start inadyn"
					  fi
		     fi
	fi
	} 
function ArduPilot {
pidof $(jq -r '.APM_type' $CONF) > /dev/null
	if [[ $? -ne 0 ]] ; then
		sudo $DIR/./Ardupilot.sh > $DIR/../log/Ardupilot.log 2>&1 & 
		sleep 5
		pidof $(jq -r '.APM_type' $CONF) >/dev/null
			if [[ $? -eq 0 ]] ; then
			echo "APM started"
			else
			echo 'could`t start ArduPilot'
			fi
	else
		echo "APM already running"
	fi
}
