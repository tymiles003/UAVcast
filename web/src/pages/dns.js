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
class Config extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:this.props.socket,
            config:{
                UseDns:'',
                Username:'',
                Password:'',
                Alias:'',
                dyndns_system:''
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
                <h2>DNS Configuration</h2>
                <form onSubmit={e => this.submitHandler(e)}>
                <h5>Set Indadyn parameters</h5>
                <SelectField
                    name="UseDns"
                    value={this.state.config.UseDns}
                    onChange={(e,i,v) => this.handleChange(e, 'UseDns', v)}
                    floatingLabelText="Use DNS?"
                    floatingLabelStyle={style.floatingLabelStyle}
                    >
                    {YesNo}
                </SelectField><br />
{this.state.config.UseDns === 'Yes' && <span><TextField
                    name="Username"
                    floatingLabelText="Username"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.Username}
                    hintText="Username"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="Password"
                    type="password"
                    floatingLabelText="Password"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.Password}
                    hintText="Password"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="Alias"
                    floatingLabelText="Alias"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.Alias}
                    hintText="Alias"
                    onChange={this.handleChange.bind(this)}
                /><br />
                <TextField
                    name="dyndns_system"
                    floatingLabelText="dyndns_system"
                    floatingLabelStyle={style.floatingLabelStyle}
                    value={this.state.config.dyndns_system}
                    hintText="default@no-ip.com"
                    onChange={this.handleChange.bind(this)}
                />
                </span>}
               <br /><br /><br />
                <RaisedButton type="submit" label="Save parameters" primary={true} style={style} />
                </form>
            </div>
        );
    }
}

export default Config;