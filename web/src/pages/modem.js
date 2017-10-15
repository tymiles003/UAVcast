import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {orange500} from 'material-ui/styles/colors';
import {SAVE_DRONECONFIG, READ_DRONECONFIG} from '../Events.js'
import Toastr from 'toastr';
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
                GSM_Connect:'',
                MM_Phone:"",
                MM_Modem:"",
                MM_Username:"",
                MM_Password:"",
                MM_Pin:"",
                APN_name:'',
                MM_Con_Check:'',
            }
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
    render() {
        return (
            <div>
                <h2>Modem Configuration</h2>
                <form onSubmit={e => this.submitHandler(e)}>  
                <h5>Choose whether or not you will connect online using modem.
                There is also varoius modem diagnostics in <a href="rpi-status">RPI</a> page <br />
                Modem will be activated when you start UAVcast. However, it will not be disconnected when you stop UAVcast, do this manually in RPI page under modem section </h5>
                <SelectField
                    name="GSM_Connect"
                    value={this.state.config.GSM_Connect}
                    onChange={(e,i,v) => this.handleChange(e, 'GSM_Connect', v)}
                    floatingLabelText="Use Modem?"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField>
                <br /><br />
                 {this.state.config.GSM_Connect === 'Yes' && <span><h5><b>Run continuously Online Check?<br /> 
                 If Online connection fails, it will try to reconnect. <span className="text-danger">BETA!</span></b></h5>
                <SelectField
                    name="MM_Con_Check"
                    value={this.state.config.MM_Con_Check}
                    onChange={(e,i,v) => this.handleChange(e, 'MM_Con_Check', v)}
                    floatingLabelText="Connection Autoconnect"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField><br /><br />
                <h5>Access Point Name given by your operator. Make sure you use a APN with public ip. #Set your Cell operators APN name. Example, Telenor Norway use "internet.public"</h5>
                <TextField
                    name="APN_name"
                    floatingLabelText="Access Point Name (APN)"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.APN_name}
                    hintText="APN"
                    onChange={this.handleChange.bind(this)}
                /><br /><br />
                <h5><b>ModemManager</b> configuration. <br />These are standard values, and should not be changed. However, some operators uses diffrent Phone number and credentials. </h5>
                <TextField
                    name="MM_Modem"
                    floatingLabelText="Device Address"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.MM_Modem}
                    hintText="Default: cdc-wdm0"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="MM_Username"
                    floatingLabelText="MM_Username"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.MM_Username}
                    hintText="Default: {test}"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="MM_Password"
                    floatingLabelText="MM_Password"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.MM_Password}
                    hintText="Default: {test}"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="MM_Pin"
                    floatingLabelText="Sim Pin Code"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.MM_Pin}
                    hintText="PIN"
                    onChange={this.handleChange.bind(this)}
                /></span>}
               <br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Modem;