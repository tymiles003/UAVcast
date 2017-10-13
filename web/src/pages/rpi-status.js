import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { fullWhite } from 'material-ui/styles/colors';
import Reboot from 'material-ui/svg-icons/action/cached';
import Shutdown from 'material-ui/svg-icons/action/flight-land';
import { RPI_COMMANDS, STREAM_FROM_RPI } from '../Events.js'
import ShutdownModal from '../modules/modal/Shutdown'
import RebootModal from '../modules/modal/Reboot'
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
                processes: 'top -b -n 5',
                temp: '/opt/vc/bin/vcgencmd measure_temp',
                lsusb:'lsusb',
                dmesg:'dmesg',
                SpeedTest:'/home/pi/UAVcast/usr/bin/./speedtest-cli'
            },
            result: {
                stream: ''
            },
            RebootModal:false,
            ShutdownModal:false
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
    _RebootModal(){
        this.setState({RebootModal:!this.state.RebootModal})
    }
    _ShutdownModal(){
        this.setState({ShutdownModal:!this.state.ShutdownModal})
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
                    <RebootModal open={this.state.RebootModal} yes={() => this.submitHandler(this.state.commands.reboot)} no={()=>{this._RebootModal()}} noLabel="cancel" yesLabel="Reboot Now" title="Do you want to Restart Raspberry PI" content={"Make sure you have saved everyting!"}/>
                    <ShutdownModal open={this.state.ShutdownModal} yes={() => this.submitHandler(this.state.commands.shutdown)} no={()=>{this._ShutdownModal()}} noLabel="cancel" yesLabel="Shutdown Now" title="Do you want to Shutdown Raspberry PI" content={"Make sure you have saved everyting!"}/>
                    <RaisedButton
                            label="Reboot"
                            target="_blank"
                            onClick={() => {this._RebootModal()}}
                            backgroundColor="rgb(206, 193, 42)"
                            icon={<Reboot color={fullWhite} />}
                            style={style}
                        />
                        <RaisedButton
                            label="Shutdown"
                            backgroundColor="#d03f3f"
                            target="_blank"
                            onClick={() => {this._ShutdownModal()}}
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