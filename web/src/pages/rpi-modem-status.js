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
                MM_Disconnect:'sudo ../script/ModemManager/./ModemManager.sh stopConnection',
                MM_Connect:'sudo ../script/ModemManager/./ModemManager.sh Autostart',
                SpeedTest:'../usr/bin/./speedtest-cli'
            },
            UAVcastStatus:{
                systemd:'systemctl status UAVcast',
                ModemManager:'cat ../log/ModemManager.log'
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
                    <h3>Modem Information</h3>
                    <h5>Modem manager needs a profile before connecting. This is automatically added when UAVcast starts, or you can add New Profile manually then try to press connect.<br />
                    Supported Devices can be found <a href="https://www.freedesktop.org/wiki/Software/ModemManager/SupportedDevices/">here</a></h5>
                        <RaisedButton
                            label="Connect"
                            backgroundColor="#a4c639"
                            onClick={() => this.submitHandler(this.state.commands.MM_Connect)}
                            style={style}
                        />
                        <RaisedButton
                            label="Disconnect"
                            backgroundColor="#a4c639"
                            secondary={true}
                            onClick={() => this.submitHandler(this.state.commands.MM_Disconnect)}
                            style={style}
                        /><br />
                      
                        <RaisedButton
                            label="Modem Information"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.modemInfo)}
                            style={style}
                        />
                        <RaisedButton
                            label="List Modems"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.ListModems)}
                            style={style}
                        />
                        <RaisedButton
                            label="Connected devices"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.NMdevices)}
                            style={style}
                        />
                        <RaisedButton
                            label="SpeedTest"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.SpeedTest)}
                            style={style}
                        /><br /><br />
                        <h5>Logfiles generated when new profile (initialization) is added.</h5>
                        <RaisedButton
                            label="Init Log"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.UAVcastStatus.ModemManager)}
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