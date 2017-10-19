import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { RPI_COMMANDS, STREAM_FROM_RPI } from '../Events.js'
import Toastr from 'toastr';
// const uuidv4 = require('uuid/v4');
const style = {
    margin: 12,
};

class Rpi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            socket: this.props.socket,
            commands: {
                shutdown: 'shutdown now',
                reboot: 'shutdown -r now',
                network: 'ifconfig',
                list: 'ls',
                processes: 'top -b -n 5',
                temp: '/opt/vc/bin/vcgencmd measure_temp',
                modemInfo:'mmcli -m 0',
                lsusb:'lsusb',
                dmesg:'dmesg',
                ListModems:'mmcli -L',
                NMdevices:'nmcli dev',
                MM_Disconnect:'nmcli r wwan off',
                MM_Connect:'nmcli r wwan on',
                MM_Init:'sudo /home/pi/UAVcast/script/./ModemManager.sh',
                MM_Saved_Con:'nmcli connection show',
                MM_Delete_Con:'nmcli connection delete UAVcast',
                SpeedTest:'/home/pi/UAVcast/usr/bin/./speedtest-cli'
            },
            UAVcastStatus:{
                systemd:'systemctl status UAVcast -l',
                inadyn:'cat /home/pi/UAVcast/log/inadyn.log',
                gStreamer:'cat /home/pi/UAVcast/log/gstreamer.log',
                MavProxy:'cat /home/pi/UAVcast/log/Mavproxy.log',
                NavioArdupilot:'cat /home/pi/UAVcast/log/Ardupilot.log',
                TTLRedirect:'cat /home/pi/UAVcast/log/TTLRedirect.log',
                ModemManager: 'cat /home/pi/UAVcast/log/ModemManager.log'
            },
            result: {
                stream: ''
            }
        }
        this.StreamOutput = ''

    }
    submitHandler(command) {
        this.StreamOutput = ''
        this.state.socket.emit(RPI_COMMANDS, command, (done) => {
                 Toastr.success('Command sent')
        })
    }
    componentDidMount(){
        this.state.socket.on(STREAM_FROM_RPI, (status)=>{
            for (var property in status) {
                this.StreamOutput += status[property].toString().replace(/(?:\r\n|\r|\n)/g, '<br />')
            }
            this.setState({ result: { stream: this.StreamOutput, error: status.error, completed: status.completed } })
        })
    }
    componentWillUnmount(){
        this.state.socket.removeListener(STREAM_FROM_RPI)
    }
    render() {
       
        return (
            <div>
                <div className="row">  
                    <div className="col-md-10">
                    <h3>UAVcast Logfiles</h3>
                    <h5>Logfiles generated from UAVcast. <br />
                    Post content on UAVcast <a target="__blank" href="http://uavmatrix.com/d/5110-UAVcast-Casting-software-for-Raspberry-PI-Supports-3G-4G-WiFi">main disscussion thread</a> if you experience any problems</h5>
                        <RaisedButton
                            label="Systemd"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.systemd)}
                            style={style}
                        />
                        <RaisedButton
                            label="Inadyn"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.inadyn)}
                            style={style}
                        />
                        <RaisedButton
                            label="gStreamer"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.gStreamer)}
                            style={style}
                        />
                        <RaisedButton
                            label="MavProxy"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.MavProxy)}
                            style={style}
                        />
                        <RaisedButton
                            label="Navio"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.NavioArdupilot)}
                            style={style}
                        />
                        <RaisedButton
                            label="TTL/ETH redirect"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.TTLRedirect)}
                            style={style}
                        />
                       
                    </div> 
                </div>
                <div className="col-md-10">
                    <br /><br /><br />
                    <h4>
                      {(this.state.result.stream || this.state.result.error) &&  
                      <Paper zDepth={3}>
                            <div className="rpi-stream-output top-buffer">
                            <h3>Raspberry output stream::</h3>
                            <br />
                            <p className="text-success" dangerouslySetInnerHTML={{__html:this.state.result.stream}} />
                            <p className="text-danger" dangerouslySetInnerHTML={{__html:this.state.result.error}} />
                            </div>
                      </Paper>
                      }
                    </h4>

                </div>
            </div>
        );
    }
}

export default Rpi;