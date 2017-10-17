import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {orange500} from 'material-ui/styles/colors';
import {SAVE_DRONECONFIG, READ_DRONECONFIG, CHECK_BINARY_EXSIST, INSTALL_BINARY} from '../Events.js'
import Toastr from 'toastr';
import ApmDialog from '../modules/apmDialog'
import RaspImage from '../images/RaspberryPi_Pixhawk_wire.jpg'
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
    <MenuItem key={1} value={"APM"} primaryText="ArduPilot version x" />,
    <MenuItem key={2} value={"Navio"} primaryText="Navio+" />,
    <MenuItem key={3} value={"Navio2"} primaryText="Navio2" />
  ];
const TelemList = [
    <MenuItem key={1} value={"gpio"} primaryText="GPIO TX / RX pins" />,
    <MenuItem key={2} value={"ttl"} primaryText="TTL to Ethernet adapter" />,
  ];
const APM_type = [
    <MenuItem key={2} value={"Plane"} primaryText="ArduPlane" />,
    <MenuItem key={1} value={"Rover"} primaryText="ArduRover" />,
    <MenuItem key={3} value={"Copter-quad"} primaryText="ArduCopter-quad" />,
    <MenuItem key={4} value={"Copter-tri"} primaryText="ArduCopter-tri" />,
    <MenuItem key={5} value={"Copter-y6"} primaryText="ArduCopter-y6" />,
    <MenuItem key={6} value={"Copter-octa"} primaryText="ArduCopter-octa" />,
    <MenuItem key={7} value={"Copter-octa-quad"} primaryText="ArduCopter-octa-quad" />,
    <MenuItem key={8} value={"Copter-heli"} primaryText="ArduCopter-heli" />,
    // <MenuItem key={9} value={"Copter-single"} primaryText="ArduCopter-single" />,
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
                sec_ip_address:'',
                sec_port:''
            },
            ApmDownload:{
                ApmModal:false,
                frame:''
            }
        }
        this.configs = {}
    }
    componentWillMount(){
        this.initialvalues()
    }
    checkIfBinaryExsist(e,i,value){
        this.state.socket.emit(CHECK_BINARY_EXSIST, this.state.config.Cntrl, value, (status)=>{
            if(!status) {
               this.setState({ApmDownload:{ApmModal:true, frame:value}})
               
            }
        })
    }
    ApmBinaryDownload(){
     this.setState({ApmDownload:{ApmModal:false}})
     this.state.socket.emit(INSTALL_BINARY, this.state.config.Cntrl, this.state.ApmDownload.frame, (call_status)=>{
                    if(call_status){
                        return Toastr.success('APM Binary successfully downloaded')
                    } else{
                        return Toastr.error('Ops! Something went wrong. Check your Internet Connnection')
                    }
                    
                })
    }
    handleChange(e,i,value) {
        if(e.target.value == null){
            this.configs[i] = value 
        } else {
            this.configs[e.target.name] = e.target.value      
        }
        if(value === 'Navio' || value === 'Navio2'){
            this.checkIfBinaryExsist(e,i,value)
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
                <div className="row">
                    <div className="col-6 col-md-6">
                        <br /><br />
                        <h5><b>Choose your FlightController</b></h5>             
                        <SelectField
                            name="Cntrl"
                            value={this.state.config.Cntrl}
                            onChange={(e,i,v) => {
                                this.handleChange(e, 'Cntrl', v)
                                }
                            }
                            floatingLabelText="Flight Controller Type"
                            floatingLabelStyle={style.floatingLabelStyle}
                            >
                            {CntrlList}
                        </SelectField>
                        <br /><br />
                    {(this.state.config.Cntrl === 'Navio' || this.state.config.Cntrl === 'Navio2') ? <span>
                        <SelectField
                            name="APM_type"
                            value={this.state.config.APM_type}
                            onChange={(e,i,v) => {
                                this.handleChange(e, 'APM_type', v);
                                this.checkIfBinaryExsist(e, i, v)
                                }
                            }
                            floatingLabelText="Ardupilot Model"
                            floatingLabelStyle={style.floatingLabelStyle}
                            >
                            {APM_type}
                        </SelectField>
                        <br /><br /></span> :  
                        <span><h5><b>Choose RPI telemetry connection.<br />
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
                        <br /><br /></span>}
                        </div>
                            <div className="col-6 col-md-6">
                                <img alt="Raspberry PI Connection overview" src={RaspImage} width="100%" />
                        </div>
                    </div>
                <br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
                <ApmDialog download={() => this.ApmBinaryDownload()} binary={this.state.config.APM_type} open={this.state.ApmDownload.ApmModal} close={()=> this.setState({ApmDownload:{ApmModal:false}})} />
            </div>
        );
    }
}

export default Config;