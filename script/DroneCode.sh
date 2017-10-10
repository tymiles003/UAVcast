#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt
function DroneInit {
case $(jq -r '.GSM_Connect' $CONF) in
	"Ethernet")
	 ip="$(ifconfig | grep -A 1 'eth0' | tail -1 | cut -d ':' -f 2 | cut -d ' ' -f 1)"
	 echo "Ethernet ip is $ip"
	 StartBroadcast
	;;
	"uqmi")
		 if ps ax | grep -v grep | grep $(jq -r '.GSM_Connect' $CONF) > /dev/null
			then
				echo "$(jq -r '.GSM_Connect' $CONF) service running"
				StartBroadcast
			else
				echo "$(jq -r '.GSM_Connect' $CONF) is not running"
				echo "Trying to start UQMI"
				uqmi
				sleep 5
				StartBroadcast
		 fi
	;;
	"wvdial")	
			wvdial
			sleep 5
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
									Telemetry_Type
									gstreamer
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

function Telemetry_Type {
if [ $(jq -r '.Telemetry_Type' $CONF) == "ttl" ]; then
pidof udp_redirect >/dev/null
    	if [[ $? -ne 0 ]] ; then  
			sudo $DIR/./udp-send.sh > $DIR/../log/BroadCast.log 2>&1 & 
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
# elif [ $(jq -r '.Telemetry_Type' $CONF) == "gpio" ]; then
# 		pidof ser2net >/dev/null
#     	if [[ $? -ne 0 ]] ; then  
# 			sudo $DIR/./ser2net.sh > $DIR/../log/BroadCast-GPIO.log 2>&1 & 
# 			sleep 0.3
# 			pidof ser2net >/dev/null
# 			sleep 0.3
# 				if [[ $? -eq 0 ]] ; then 
# 					echo 'ser2net script started'
# 					return 1
# 					else
# 					echo 'Another ser2net process already running'
# 				fi
# 				return 0
# 		else
# 	    echo "Another ser2net process already running"
#        fi
# fi
elif [ $(jq -r '.Telemetry_Type' $CONF) == "gpio" ]; then
		pidof cmavnode >/dev/null
    	if [[ $? -ne 0 ]] ; then  
			sudo $DIR/./cmavnode.sh > $DIR/../log/BroadCast-GPIO.log 2>&1 & 
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

function uqmi {
sudo uqmi -d /dev/cdc-wdm0 --stop-network 4294967295 --autoconnect
sleep 2
    if ! sudo uqmi -s -d /dev/cdc-wdm0 --get-data-status | grep '"connected"' > /dev/null; then
		sudo uqmi -d /dev/cdc-wdm0 --stop-network 4294967295 --autoconnect
		sleep 2
		sudo uqmi -d /dev/cdc-wdm0 --network-register
		echo network register
		sleep 3
		echo Connecting 4G
			sudo uqmi -s -d /dev/cdc-wdm0 --start-network $(jq -r '.APN_name' $CONF) --keep-client-id wds --autoconnect &
		sleep 15
		if ! sudo uqmi -s -d /dev/cdc-wdm0 --get-data-status | grep '"connected"' > /dev/null; then
			echo "GSM Not Connected!"
		else
			echo "GSM Connected"
			sudo dhclient -v wwan0
	fi
	else
		echo "UQMI is already connected to internet."
	fi
	}
function wvdial {
FILE="$DIR/./wvdial.conf"
/bin/cat <<EOM >$FILE
[Dialer Defaults]
Init1 = $(jq -r '.wv_init1' $CONF)
Init2 = $(jq -r '.wv_init2' $CONF)
Init3 = $(jq -r '.wv_init3' $CONF) ,"IP", "$(jq -r '.APN_name' $CONF)"
Stupid Mode = 1 
Carrier Check = $(jq -r '.wv_carrier_check' $CONF)
MessageEndPoint = "0x01"
Modem Type = Analog Modem
ISDN = 0
Phone = $(jq -r '.wv_Phone' $CONF)
Modem = $(jq -r '.wv_Modem' $CONF)
Username = $(jq -r '.wv_Username' $CONF)
Password = $(jq -r '.wv_Password' $CONF)
Baud = $(jq -r '.wv_Baud' $CONF)
Auto Reconnect = $(jq -r '.wv_Auto_Reconnect' $CONF)
EOM
   if ps ax | grep -v grep | grep $(jq -r '.GSM_Connect' $CONF) > /dev/null
			then
				echo "$(jq -r '.GSM_Connect' $CONF) service running"
			else
				echo "$(jq -r '.GSM_Connect' $CONF) not running. We will start it"
				sudo wvdial -C $DIR/./wvdial.conf > $DIR/../log/wvdial.log 2>&1 & 
				sleep 20
				  if ps ax | grep -v grep | grep $(jq -r '.GSM_Connect' $CONF) > /dev/null
				      then
				      echo "$(jq -r '.GSM_Connect' $CONF) successfully started"
					  rm $FILE
				  else 
				      echo "could not start $(jq -r '.GSM_Connect' $CONF)"
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

