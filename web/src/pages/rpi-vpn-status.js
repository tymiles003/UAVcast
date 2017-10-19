import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { RPI_COMMANDS, STREAM_FROM_RPI, GET_VPN_IP, READ_DRONECONFIG } from '../Events.js'
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
            config:{
                AppDir:'',
                vpn_type:'',
            },
            commands: {
                Interface:'ifconfig tun0',
                LogFile:'cat ../log/openvpn.log',
                VPN_Disconnect:'sudo ../script/openvpn/./openvpn.sh stop',
                VPN_Connect:'sudo ../script/openvpn/./openvpn.sh start',
                VPN_Interface:'ifconfig tun0',

                NM_VPN_Disconnect:'sudo ../script/openvpn/./nm_openvpn.sh StopOpenVPN',
                NM_VPN_Connect:'sudo ../script/openvpn/./nm_openvpn.sh StartOpenVPN',
                NM_VPN_Saved_Con:'nmcli con show openvpn',        
            },
            result: {
                stream: ''
            },
            intervalId:''
        }
        this.configs = {}
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
    componentWillMount(){
        this.initialvalues()
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
    initialvalues(){
        this.state.socket.emit(READ_DRONECONFIG, (data)=>{
            Object.keys(data).map((key, val)=>{
                this.configs[key] = data[key]
                return true
            })
            this.setState({config:this.configs});
        })     
    }
    render() {
       
        return (
            <div>
                <div className="row">  
                    <div className="col-md-10">
                    <span><h3>VPN Information &nbsp;&nbsp; {this.state.vpn_ip && <span className="text-warning" >Connected: {this.state.vpn_ip}</span>} </h3></span>
                    <h5>OpenVpn needs a profile before connecting. This is automatically added when UAVcast starts, or you can add New Profile manually then try to press connect.<br />
                    Make sure to import the <b>*.ovpn</b> file in setup </h5>
                    {this.state.config.vpn_type === 'NM_Openvpn' ? <span>
                        <RaisedButton
                            label="Connect"
                            backgroundColor="#a4c639"
                            onClick={() => this.submitHandler(this.state.commands.NM_VPN_Connect)}
                            style={style}
                        />
                        <RaisedButton
                            label="Disconnect"
                            backgroundColor="#a4c639"
                            secondary={true}
                            onClick={() => this.submitHandler(this.state.commands.NM_VPN_Disconnect)}
                            style={style}
                        /></span> : 

                        // OpenVpn Selected
                        <span>
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
                        /></span>}
                        {this.state.vpn_ip && <RaisedButton
                            label="View VPN Interface"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.Interface)}
                            style={style}
                        />}
                        <br />
                        <RaisedButton
                            label="Logfile"
                            backgroundColor="#a4c639"
                            primary={true}
                            onClick={() => this.submitHandler(this.state.commands.LogFile)}
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