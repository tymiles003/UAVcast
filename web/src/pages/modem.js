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
const GsmList = [
    <MenuItem key={1} value={"uqmi"} primaryText="UQMI" />,
    <MenuItem key={2} value={"wvdial"} primaryText="wvdial (Most Common)" />,
    <MenuItem key={3} value={"Ethernet"} primaryText="Ethernet cable connected" />,
  ];
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
                wv_init1:"",
                wv_init2:"",
                wv_init3:"",
                wv_Phone:"",
                wv_Modem:"",
                wv_Username:"",
                wv_Password:"",
                wv_Baud:"",
                APN_name:'',
                DroneCheck:'',
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
                <h5>Options; uqmi, wvdial, Ethernet</h5>
                <SelectField
                    name="GSM_Connect"
                    value={this.state.config.GSM_Connect}
                    onChange={(e,i,v) => this.handleChange(e, 'GSM_Connect', v)}
                    floatingLabelText="Cell Connection Software"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {GsmList}
                </SelectField>
                <br /><br />
                <h5><b>Run continuously Online Check?<br /> 
                 If Online connection fails, it will try to reconnect. <span className="text-danger">BETA!</span></b></h5>
                <SelectField
                    name="DroneCheck"
                    value={this.state.config.DroneCheck}
                    onChange={(e,i,v) => this.handleChange(e, 'DroneCheck', v)}
                    floatingLabelText="Connection Checks"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField><br /><br />
        {this.state.config.GSM_Connect === 'wvdial' && <span><h5>Access Point Name given by your operator. Make sure you use a APN with public ip. #Set your Cell operators APN name. Example, Telenor Norway use "internet.public"</h5>
                <TextField
                    name="APN_name"
                    floatingLabelText="Access Point Name (APN)"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.APN_name}
                    hintText="APN"
                    onChange={this.handleChange.bind(this)}
                /><br /><br />
                <h5><b>WvDial</b> configuration. <br />These are standard values, and should not be changed. However, some operators uses diffrent Phone number and credentials. </h5>
                <TextField
                    name="wv_Phone"
                    floatingLabelText="wv_Phone"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_Phone}
                    hintText="Default: *99#"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_init1"
                    floatingLabelText="wv_init1"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_init1}
                    hintText="Default: ATZ"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_init2"
                    floatingLabelText="wv_init2"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_init2}
                    hintText="Default: ATE1"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_init3"
                    floatingLabelText="wv_init3"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_init3}
                    hintText="Default: AT+CGDCONT=1"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_Modem"
                    floatingLabelText="wv_Modem"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_Modem}
                    hintText="Default: /dev/ttyUSB0"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_Username"
                    floatingLabelText="wv_Username"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_Username}
                    hintText="Default: {test}"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_Password"
                    floatingLabelText="wv_Password"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_Password}
                    hintText="Default: {test}"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="wv_Baud"
                    floatingLabelText="wv_Baud"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.wv_Baud}
                    hintText="default: 460800"
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