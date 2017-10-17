import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { RPI_COMMANDS, STREAM_FROM_RPI, GET_VPN_IP } from '../Events.js'
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
                ListVPN:'nmcli con | grep openvpn',
                NMdevices:'nmcli dev',
                VPN_Disconnect:'sudo /home/pi/UAVcast/script/./openvpn.sh StopOpenVPN',
                VPN_Connect:'sudo /home/pi/UAVcast/script/./openvpn.sh StartOpenVPN',
                VPN_Profile:'sudo /home/pi/UAVcast/script/./openvpn.sh importOpenVpn',
                VPN_Saved_Con:'nmcli con show openvpn',
                VPN_Delete_Con:'sudo /home/pi/UAVcast/script/./openvpn.sh deleteOpenVpn',
                VPN_Interface:'ifconfig tun0'
            },
            result: {
                stream: ''
            },
            intervalId:''
        }
        this.StreamOutput = ''
    }
    submitHandler(command) {
        this.StreamOutput = ''
        this.state.socket.emit(RPI_COMMANDS, command, (done) => {
                 Toastr.success('Command sent')
        })
    }
    checkVpnIp(){
        this.state.socket.emit(GET_VPN_IP, (ip) => {
            this.setState({vpn_ip: ip})
        })
    }
    componentDidMount(){
        this.state.socket.on(STREAM_FROM_RPI, (status)=>{
            for (var property in status) {
                this.StreamOutput += status[property].toString().replace(/(?:\r\n|\r|\n)/g, '<br />')
            }
            this.setState({ result: { stream: this.StreamOutput, error: status.error, completed: status.completed } })
        })
        var ip = setInterval(()=> { this.checkVpnIp() }, 5000)
        this.setState({intervalId:ip})
        this.checkVpnIp()
    }
    componentWillUnmount(){
        this.state.socket.removeListener(STREAM_FROM_RPI)
        clearInterval(this.state.intervalId);
    }
    render() {
       
        return (
            <div>
                <div className="row">  
                    <div className="col-md-10">
                    <span><h3>VPN Information &nbsp;&nbsp; {this.state.vpn_ip && <span className="text-warning" >Connected: {this.state.vpn_ip}</span>} </h3></span>
                    <h5>OpenVpn needs a profile before connecting. This is automatically added when UAVcast starts, or you can add New Profile manually then try to press connect.<br />
                    Make sure to import the <b>*.ovpn</b> file in setup </h5>
                        <RaisedButton
                            label="New Profile"
                            backgroundColor="#a4c639"
                            onClick={() => this.submitHandler(this.state.commands.VPN_Profile)}
                            style={style}
                        />
                        <RaisedButton
                            label="Connect"
                            backgroundColor="#a4c639"
                            onClick={() => this.submitHandler(this.state.commands.VPN_Connect)}
                            style={style}
                        />
                        <RaisedButton
                            label="Disconnect"
                            backgroundColor="#a4c639"
                            secondary={true}
                            onClick={() => this.submitHandler(this.state.commands.VPN_Disconnect)}
                            style={style}
                        /><br />
                        <RaisedButton
                            label="View Profile"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.ListVPN)}
                            style={style}
                        />                
                        <RaisedButton
                            label="*.opvn"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.VPN_Saved_Con)}
                            style={style}
                        />
                        <RaisedButton
                            label="Delete Profile"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.VPN_Delete_Con)}
                            style={style}
                        />
                        <RaisedButton
                            label="View VPN Interface"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.VPN_Interface)}
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
                            <h3>output::</h3>
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