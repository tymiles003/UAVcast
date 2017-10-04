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
const CntrlList = [
    <MenuItem key={1} value={"Navio"} primaryText="Emlid Navio" />,
    <MenuItem key={2} value={"APM"} primaryText="ArduPilot version x" />,
  ];
const TelemList = [
    <MenuItem key={1} value={"gpio"} primaryText="GPIO TX / RX pins" />,
    <MenuItem key={2} value={"ttl"} primaryText="TTL to Ethernet adapter" />,
  ];
const GsmList = [
    <MenuItem key={1} value={"uqmi"} primaryText="UQMI" />,
    <MenuItem key={2} value={"wvdial"} primaryText="wvdial (Most Common)" />,
    <MenuItem key={3} value={"Ethernet"} primaryText="Ethernet cable connected" />,
  ];
const YesNo = [
    <MenuItem key={1} value={"Yes"} primaryText="Yes" />,
    <MenuItem key={2} value={"No"} primaryText="No" />,
  ];
const CamType = [
    <MenuItem key={1} value={"picam"} primaryText="Raspivid PiCam" />,
    <MenuItem key={2} value={"C920"} primaryText="Logitech C920" />,
    <MenuItem key={3} value={"C615"} primaryText="Logitech C615" />,
  ];
const APM_type = [
    <MenuItem key={1} value={"APMrover2"} primaryText="APM rover2" />,
    <MenuItem key={2} value={"ArduPlane"} primaryText="ArduPlane" />,
    <MenuItem key={3} value={"ArduCopter-quad"} primaryText="ArduCopter-quad" />,
    <MenuItem key={4} value={"ArduCopter-tri"} primaryText="ArduCopter-tri" />,
    <MenuItem key={5} value={"ArduCopter-y6"} primaryText="ArduCopter-y6" />,
    <MenuItem key={6} value={"ArduCopter-octa"} primaryText="ArduCopter-octa" />,
    <MenuItem key={7} value={"ArduCopter-octa-quad"} primaryText="ArduCopter-octa-quad" />,
    <MenuItem key={8} value={"ArduCopter-heli"} primaryText="ArduCopter-heli" />,
    <MenuItem key={9} value={"ArduCopter-single"} primaryText="ArduCopter-single" />,
  ];
class Config extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:this.props.socket,
            config:{
                Cntrl:'',
                Telemetry_Type:'',
                GCS_address:'',
                PORT:'',
                GSM_Connect:'',
                wv_Phone:"",
                wv_Modem:"",
                wv_Username:"",
                wv_Password:"",
                wv_Baud:"",
                APN_name:'',
                UseCam:'',
                CameraType:'',
                WIDTH:'',
                HEIGHT:'',
                UDP_PORT:'',
                BITRATE:'',
                FPS:'',
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
            Object.keys(data).map((key, val, va)=>{
                this.configs[key] = data[key]
            })
            this.setState({config:this.configs});
        })     
    }
    render() {
        return (
            <div>
                <h2>Flight Controller</h2>
                <h4>Change these parameters so it match your configuration</h4>
                <form onSubmit={e => this.submitHandler(e)}>
                <br /><br />
                <h5><b>FlightController type. Arguments; <br />Navio, APM(Any Ardupilot boards such as APM2,x  Pixhawk)</b></h5>
                
                <SelectField
                    name="Cntrl"
                    value={this.state.config.Cntrl}
                    onChange={(e,i,v) => this.handleChange(e, 'Cntrl', v)}
                    floatingLabelText="Flight Controller Type"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {CntrlList}
                </SelectField>
                <br /><br />
                <h5>Set your telemetry connection. Options:: <br />(gpio, ttl)  // gpio = pin 8_tx & 10_rx. ttl = ttl_Ethernet converter</h5>
                <SelectField
                    name="Telemetry_Type"
                    value={this.state.config.Telemetry_Type}
                    onChange={(e,i,v) => this.handleChange(e, 'Telemetry_Type', v)}
                    floatingLabelText="Flight Controller Type"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {TelemList}
                </SelectField>
                <br /><br />
                <h5>Run continuously Online Check?<br /> 
                 If Online connection fails, it will try to reconnect.</h5>
                <SelectField
                    name="DroneCheck"
                    value={this.state.config.DroneCheck}
                    onChange={(e,i,v) => this.handleChange(e, 'DroneCheck', v)}
                    floatingLabelText="Connection Checks"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField><br /><br />
                <h5>-----------NAVIO ONLY -------------</h5>
                <h5>Use secondary telemetry?</h5>
                <SelectField
                    name="APM_type"
                    value={this.state.config.APM_type}
                    onChange={(e,i,v) => this.handleChange(e, 'APM_type', v)}
                    floatingLabelText="Ardupilot Model"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {APM_type}
                </SelectField>
                <br />
                <SelectField
                    name="secondary_tele"
                    value={this.state.config.secondary_tele}
                    onChange={(e,i,v) => this.handleChange(e, 'secondary_tele', v)}
                    floatingLabelText="Use Secondary Telemetry"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField>
                <br />
                <TextField
                    name="sec_ip_address"
                    floatingLabelText="sec_ip_address"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.sec_ip_address}
                    hintText="sec_ip_address"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="sec_port"
                    floatingLabelText="sec_port"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.sec_port}
                    hintText="Default: 14550"
                    onChange={this.handleChange.bind(this)}
                /><br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Config;