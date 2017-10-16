import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dropzone from 'react-dropzone'
import {orange500} from 'material-ui/styles/colors';
import {SAVE_DRONECONFIG, READ_DRONECONFIG, SAVE_OVPN, STATUS_OVPN} from '../Events.js'
import Toastr from 'toastr';
var ss = require('socket.io-stream');
// var fs = require('fs')
const style = {
    margin: 12,
    TextField:{
        color:'rgba(6, 0, 255, 0.87)'
    },
    floatingLabelStyle: {
        color: orange500,
      },
  }

const YesNo = [
    <MenuItem key={1} value={"Yes"} primaryText="Yes" />,
    <MenuItem key={2} value={"No"} primaryText="No" />,
  ];
class Modem extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:this.props.socket,
            config:{
                vpn_use:'',
            
            },
            files:[]
            
        }
        this.configs = {}
    }
    componentWillMount(){
        this.initialvalues()
    }
    handleChange(e,i,value) {
        if(e.target.value == null){
            this.configs[i] = value
        } else {
            this.configs[e.target.name] = e.target.value
        }
        this.setState({config:this.configs});
    }
    submitHandler(e){
    e.preventDefault()
    this.state.socket.emit(SAVE_DRONECONFIG, this.state.config, (status)=>{
            if(status) {
                Toastr.success('Values are successfully saved')
            } else {
                Toastr.error('Ooops! Something went wrong. Try again')
            }
        })
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
    onDrop(files) {
        this.setState({files});
        var stream = ss.createStream();
        var reader = new FileReader();
        reader.onload = () => {
            if (!!reader.result) {
                ss(this.state.socket).emit(SAVE_OVPN, stream, {name:  files[0].name, data:reader.result});
                this.state.socket.on(STATUS_OVPN, (status)=>{
                   this.state.socket.removeAllListeners(STATUS_OVPN);
                   if(status.success) return Toastr.success(status.success)
                   return Toastr.error(status.error)
                })
            }
          }
        reader.readAsText(files[0]);
      }
    render() {
        return (
            <div>
                <h2>VPN</h2>
                <br />
                <form onSubmit={e => this.submitHandler(e)}>  
                <p>APN connection will be started Automatically when UAVcast starts. You can manually start / stop VPN in the VPN diagnostic page.</p>
                <p>Use OpenVpn</p>
                <SelectField
                    name="vpn_use"
                    value={this.state.config.vpn_use}
                    onChange={(e,i,v) => this.handleChange(e, 'vpn_use', v)}
                    floatingLabelText="Use VPN?"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField><br /><br /><br /><br />
                 {this.state.config.vpn_use === 'Yes' && <span>
                <TextField
                    name="vpn_username"
                    floatingLabelText="Openvpn Username"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.vpn_username}
                    hintText="Username"
                    onChange={this.handleChange.bind(this)}
                /><br /><br /><br /><br />
                <TextField
                    name="vpn_password"
                    type="password"
                    floatingLabelText="Openvpn Password"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.vpn_password}
                    hintText="Password"
                    onChange={this.handleChange.bind(this)}
                /><br /><br /><br /><br />
                <h5><b>*.ovpn</b> Config<br />Drop your ovpn file</h5>
                
                <Dropzone className="DropZoneOvpn" onDrop={this.onDrop.bind(this)} multiple={false}>
                    <p>Drop ovpn file here</p>
                </Dropzone>
                <aside>
                    {this.state.files > 0 ? <h3>Dropped files</h3> : ''}
                    <ul><br /><h4>
                        {
                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                        }
                    </h4></ul>
                </aside>
               </span>}
               <br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Modem;