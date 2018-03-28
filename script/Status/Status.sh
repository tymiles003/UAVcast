#!/bin/bash
Status(){
Ser2net="$(/bin/pidof -x ser2net)"
Cmavnode="$(/bin/pidof -x cmavnode)"
Inadyn="$(/bin/pidof -x inadyn)"
gStreamer="$(/bin/pidof -x gst-launch-1.0)"

if [[ $(systemctl is-active UAVcast) != 0 ]]; then
        Enabled=true
else
        Enabled=false
fi

if [[ $(systemctl is-enabled UAVcast) != 0 ]]; then
        Active=true
else
        Active=false
fi

}

Status
jq -n "{sysCtlEnable:\"$Enabled\",sysCtlActive:\"$Active\", ser2net:\"$Ser2net\", mavproxy:\"$Cmavnode\", Inadyn:\"$Inadyn\", gStreamer:\"$gStreamer\"}"
