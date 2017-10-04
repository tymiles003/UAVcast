import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
class Gcs extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:this.props.socket,
            config:{
                GCS_address:'',
                PORT:'',
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
                <h2>Ground Control Station</h2>
                <h4>Change these parameters so it match your configuration</h4>
                <form onSubmit={e => this.submitHandler(e)}>
                <br /><br />
                <h5><b>Set your DynDns or IP of Ground Control Station</b></h5>
                <TextField
                    name="GCS_address"
                    floatingLabelText="Ground Control Station IP"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.GCS_address}
                    hintText="GCS address"
                    onChange={this.handleChange.bind(this)}
                /><br /><br />
                <h5><b>Ground Control Station Telemetry Port APM or Navio should start streaming to.<br /> NOTE! You need to open this port on your GCS network.</b></h5>
                <TextField
                    name="PORT"
                    floatingLabelText="GCS Telemetry Port"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.PORT}
                    hintText="PORT"
                    onChange={this.handleChange.bind(this)}
                /><br /><br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Gcs;