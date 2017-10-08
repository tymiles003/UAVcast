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

const YesNo = [
    <MenuItem key={1} value={"Yes"} primaryText="Yes" />,
    <MenuItem key={2} value={"No"} primaryText="No" />,
  ];
const APM_type = [
    <MenuItem key={1} value={"ardurover"} primaryText="APM rover2" />,
    <MenuItem key={2} value={"arduplane"} primaryText="ArduPlane" />,
    <MenuItem key={3} value={"arducopter-quad"} primaryText="ArduCopter-quad" />,
    <MenuItem key={4} value={"arducopter-tri"} primaryText="ArduCopter-tri" />,
    <MenuItem key={5} value={"arducopter-y6"} primaryText="ArduCopter-y6" />,
    <MenuItem key={6} value={"arducopter-octa"} primaryText="ArduCopter-octa" />,
    <MenuItem key={7} value={"arducopter-octa-quad"} primaryText="ArduCopter-octa-quad" />,
    <MenuItem key={8} value={"arducopter-heli"} primaryText="ArduCopter-heli" />,
    <MenuItem key={9} value={"arducopter-single"} primaryText="ArduCopter-single" />,
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
                APM_type:'',
                secondary_tele:'',
                sec_ip_address:'',
                sec_port:''
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
                return true
            })
            this.setState({config:this.configs});
        })     
    }
    render() {
        return (
            <div>
                <h2>Flight Controller configuration</h2>
                <form onSubmit={e => this.submitHandler(e)}>
                <br /><br />
                <h5><b>Choose your FlightController</b></h5>
                
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
                <h5><b>Choose RPI telemetry connection.<br />
                NOTE! GPIO uses pin 8_tx & 10_rx.</b></h5>
                <SelectField
                    name="Telemetry_Type"
                    value={this.state.config.Telemetry_Type}
                    onChange={(e,i,v) => this.handleChange(e, 'Telemetry_Type', v)}
                    floatingLabelText="Telemetry Connection"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {TelemList}
                </SelectField>
                <br /><br />
               {this.state.config.Cntrl === 'Navio' && <span><h5>NAVIO CONFIG ONLY</h5>
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
                /></span>}<br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Config;