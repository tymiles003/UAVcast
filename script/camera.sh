#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
CONF=$DIR/../DroneConfig.txt
#source $DIR/../DroneConfig.cfg
function usepicam {
raspivid  -n -w $(jq -r '.WIDTH' $CONF) -h $(jq -r '.HEIGHT' $CONF) -b $(jq -r '.BITRATE' $CONF) -fps $(jq -r '.FPS' $CONF) -t 0 -o - | \
    gst-launch-1.0 --gst-debug-level=0 -v \
    fdsrc !  \
    h264parse ! \
    rtph264pay config-interval=10 pt=96 ! \
    udpsink host=$(jq -r '.GCS_address' $CONF) port=$(jq -r '.UDP_PORT' $CONF)
}
function C615 {
gst-launch-1.0 -v rtpbin name=rtpbin v4l2src device=/dev/video0 ! \
        video/x-raw,width=$(jq -r '.WIDTH' $CONF),height=$(jq -r '.HEIGHT' $CONF),framerate=30/1 ! queue ! \
        omxh264enc target-bitrate=500000 control-rate=1 ! \
        "video/x-h264,profile=main" ! h264parse ! \
        queue max-size-bytes=10000000 ! \
        rtph264pay pt=96 config-interval=1 ! \
        rtpbin.send_rtp_sink_0 rtpbin.send_rtp_src_0 ! \
        udpsink port=$(jq -r '.UDP_PORT' $CONF) host=$(jq -r '.GCS_address' $CONF) ts-offset=0 \
        name=vrtpsink rtpbin.send_rtcp_src_0 ! \
        rtpbin.recv_rtcp_sink_0
}
function C920 {
gst-launch-1.0 -v rtpbin name=rtpbin v4l2src device=/dev/video0 \
        ! video/x-raw,width=$(jq -r '.WIDTH' $CONF),height=$(jq -r '.HEIGHT' $CONF),framerate=30/1 \
        ! queue \
        ! omxh264enc target-bitrate=$(jq -r '.BITRATE' $CONF) control-rate=3 \
        ! "video/x-h264,profile=high" \
        ! h264parse \
        ! queue max-size-bytes=10000000 \
        ! rtph264pay pt=96 config-interval=1 \
        ! rtpbin.send_rtp_sink_0 rtpbin.send_rtp_src_0 \
	! udpsink port=$(jq -r '.UDP_PORT' $CONF) host=$(jq -r '.GCS_address' $CONF) ts-offset=0 name=vrtpsink rtpbin.send_rtcp_src_0 \
    	! udpsink port=$(jq -r '.UDP_PORT' $CONF) host=$(jq -r '.GCS_address' $CONF) sync=false async=false name=vrtcpsink udpsrc port=5000 name=vrtpsrc \
        ! rtpbin.recv_rtcp_sink_0
}
echo $(jq -r '.CameraType' $CONF)
case "$(jq -r '.CameraType' $CONF)" in
        "picam")
        usepicam
        ;;
        "C920")
        C920
        ;;
        "C615")
        C615
        ;;
esac
