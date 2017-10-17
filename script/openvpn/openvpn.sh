#! /bin/bash
#
# openvpn-client    Start/Stop the openvpn client
#
# chkconfig: 2345 90 60
# description: start openvpn client at boot
# processname: openvpn
 
# Source function library.
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../../DroneConfig.txt

. /lib/lsb/init-functions

daemon="openvpn"
prog="openvpn-client"
conf_file="$DIR/../../usr/etc/openvpn.ovpn"
pass_file="$DIR/../../usr/etc/pass.conf"

start() {
    echo -n $"Starting $prog: " 
        setPasswordFile
        if [ -e /var/lock/subsys/openvpn-client ] && [ $(pgrep -fl "openvpn --config $conf_file" | wc -l) -gt 0 ]; then
        echo "Exit"
        exit 1
    fi
    sudo $daemon --config $conf_file --auth-user-pass $pass_file #>/dev/null 2>&1 &
    RETVAL=$?
    echo
    [ $RETVAL -eq 0 ] && touch /var/lock/subsys/openvpn-client;
    return $RETVAL
}

stop() {
    echo -n $"Stopping $prog: "
    pid=$(ps -ef | grep "[o]penvpn --config $conf_file" | awk '{ print $2 }')
    kill $pid > /dev/null 2>&1 &&
    RETVAL=$?
    echo
    rm -f /var/lock/subsys/openvpn-client >/dev/null 2>&1
    DeletePasswordFile
    return $RETVAL
}   

status() {
    pgrep -fl "openvpn --config $conf_file" >/dev/null 2>&1
    RETVAL=$?
    if [ $RETVAL -eq 0 ]; then
        pid=$(ps -ef | grep "[o]penvpn --config $conf_file" | awk '{ print $2 }')
        echo $"$prog (pid $pid) is running..."
    else
        echo $"$prog is stopped"
    fi
}   

restart() {
    stop
    start
}  

function DeletePasswordFile {
    sudo rm $pass_file >/dev/null 2>&1
}

function setPasswordFile {
FILE="$pass_file"
/bin/cat <<EOM >$FILE
$(jq -r '.vpn_username' $CONF)
$(jq -r '.vpn_password' $CONF)
EOM
#Set persmission
sudo chmod 777 $DIR/../../usr/etc/
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    condrestart)
        [ -f /var/lock/subsys/openvpn-client ] && restart || :
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart}"
        exit 1
esac
