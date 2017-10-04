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
const CamType = [
    <MenuItem key={1} value={"picam"} primaryText="Raspivid PiCam" />,
    <MenuItem key={2} value={"C920"} primaryText="Logitech C920" />,
    <MenuItem key={3} value={"C615"} primaryText="Logitech C615" />,
  ];

class Camera extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:this.props.socket,
            config:{
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
                return true
            })
            this.setState({config:this.configs});
        })     
    }
    render() {
        return (
            <div>
                <h2>Camera Configuration</h2>
                <form onSubmit={e => this.submitHandler(e)}>
                <br /><br />
                <h5>Do you want to use WebCamera?</h5>
                <SelectField
                    name="UseCam"
                    value={this.state.config.UseCam}
                    onChange={(e,i,v) => this.handleChange(e, 'UseCam', v)}
                    floatingLabelText="Use Webcamera"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField>
                <br /><br />
                {this.state.config.UseCam === 'Yes' && <span>
                    <h4> Select Camera type and resolution</h4>
                    <h5>Note! you need to restart UAVcast for changes to take effect</h5>
                <SelectField
                    name="CameraType"
                    value={this.state.config.CameraType}
                    onChange={(e,i,v) => this.handleChange(e, 'CameraType', v)}
                    floatingLabelText="Webcamera Type"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {CamType}
                </SelectField>
                <br /><br />
                <TextField
                    name="WIDTH"
                    floatingLabelText="WIDTH"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.WIDTH}
                    hintText="Default: 1280"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="HEIGHT"
                    floatingLabelText="HEIGHT"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.HEIGHT}
                    hintText="Default: 720"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="UDP_PORT"
                    floatingLabelText="UDP_PORT"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.UDP_PORT}
                    hintText="Default: 5000"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="BITRATE"
                    floatingLabelText="BITRATE"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.BITRATE}
                    hintText="Default: 1500000"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="FPS"
                    floatingLabelText="FPS"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.FPS}
                    hintText="default: 20"
                    onChange={this.handleChange.bind(this)}
                /><br /><br /></span>}
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Camera;