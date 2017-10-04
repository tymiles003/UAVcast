#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
#source $DIR/../DroneConfig.cfg
source $DIR/./DroneCode.sh
CONF=$DIR/../DroneConfig.txt
pidof -x DroneCode.sh >/dev/null
	if [[ $? -ne 0 ]] ; then 		
    	if [ $(jq -r '.DroneCheck' $CONF) == "Yes" ]; then
			LOCKFILE=/tmp/lock.txt
					if [ -e ${LOCKFILE} ] && kill -0 `cat ${LOCKFILE}`; then
						exit
					fi
					# make sure the lockfile is removed when we exit and then claim it
					trap "rm -f ${LOCKFILE}; exit" INT TERM EXIT
					echo $$ > ${LOCKFILE}
					wget -q --tries=10 --timeout=20 --spider http://google.com
					if [[ $? -ne 0 ]]; then
								sleep 1
								wget -q --tries=10 --timeout=20 --spider http://google.com
								if [[ $? -ne 0 ]]; then
									 echo "RPI is offline, run DroneCode"
									 case $(jq -r '.GSM_connect' $CONF) in
										"uqmi")
											pidof -x $(jq -r '.GSM_connect' $CONF) >/dev/null
											if [[ $? -ne 0 ]] ; then 	
													echo "Trying to start UQMI"
													uqmi
											 fi
											;;
											"wvdial")	
													wvdial
											;;
									esac
								else
									echo "RPI Online"
							fi
						else
							echo "RPI Online"
						fi

					rm -f ${LOCKFILE}
					
		fi			
	else
		echo "UAVcast running."
		exit
	fi	
