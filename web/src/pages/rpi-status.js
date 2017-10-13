import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { fullWhite } from 'material-ui/styles/colors';
import Reboot from 'material-ui/svg-icons/action/cached';
import Shutdown from 'material-ui/svg-icons/action/flight-land';
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
                systemd:'systemctl status UAVcast',
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
    submitHandler(command) {
        this.StreamOutput = ''
        this.state.socket.emit(RPI_COMMANDS, command, (done) => {
                 Toastr.success('Command sent')
        })
    }

    render() {
       
        return (
            <div>
                <div className="row">   
                    <div className="col-md-7">
                    <h3>Raspberry Status</h3>
                        <RaisedButton
                            label="List USB devices"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.lsusb)}
                            style={style}
                        />
                        <RaisedButton
                            label="Kernel Messages"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.dmesg)}
                            style={style}
                        />
                        <RaisedButton
                            label="RPI Temp"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.temp)}
                            style={style}
                        />
                        <RaisedButton
                            label="Network"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.network)}
                            style={style}
                        />
                        <RaisedButton
                            label="SpeedTest"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.SpeedTest)}
                            style={style}
                        />
                    </div>
                </div>
                <div className="row">   
                    <div className="col-md-4">
                    <h3>Restart / Shutdown</h3>
                    <RaisedButton
                            label="Reboot"
                            name="reboot"
                            target="_blank"
                            onClick={() => this.submitHandler(this.state.commands.reboot)}
                            backgroundColor="rgb(206, 193, 42)"
                            icon={<Reboot color={fullWhite} />}
                            style={style}
                        />
                        <RaisedButton
                            label="Shutdown"
                            name="shutdown"
                            backgroundColor="#d03f3f"
                            onClick={() => this.submitHandler(this.state.commands.shutdown)}
                            icon={<Shutdown color={fullWhite} />}
                            style={style}
                        />
                    </div>
                </div>
                <br />
                <div className="col-md-10">
                    <br /><br /><br />
                    <h4>
                      {(this.state.result.stream || this.state.result.error) &&  
                      <Paper zDepth={3}>
                            <div className=" top-buffer">
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