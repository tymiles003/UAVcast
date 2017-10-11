import React, { Component } from 'react';
import UavCastbutton from '../modules/uavcast-buttons'
import {START_UAVCAST, UAVCAST_STATUS, READ_DRONECONFIG, DESTINATION_INFORMATION } from '../Events.js';
import CircularProgress from 'material-ui/CircularProgress';
import Errors from '../modules/errors'
// import Toastr from 'toastr';
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            socket: this.props.socket,
            active: false,
            enabled: false,
            config: {
                Cntrl:'',
                starting: false,
                disabling:false,
                GCS_address: '',
                PORT: '',
                GSM_Connect: '',
                UseCam: '',
                intervalId:'',
                UseDns:'',
            },
            software:{
                inadyn:false,
                ser2net:false,
                mavproxy:false,
                gStreamer:false,
                udp_redirect:false
            },
            destination:{
                telem_portIsOpen:false,
                video_portIsOpen:false,
                ip:null,
            }
        }
        this.configs = {}
    }
    componentDidMount() {
        this.initialvalues()
        this.UAVcastStatus()
        var intervalId = setInterval(()=>{ this.UAVcastStatus() },5000)
        this.setState({intervalId:intervalId})
        
    }
    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    UAVcastHandler(v) {
        if(v === START_UAVCAST) {
            this.setState({starting:true})
        }
        this.state.socket.emit(v, (sta) => {
            this.UAVcastStatus()
        })
    }
    UAVcastStatus() {
        this.state.socket.emit(UAVCAST_STATUS, (status) => {
            this.setState({ active: status.active, enabled: status.enabled, starting:!status.active && this.state.starting, software:{udp_redirect:status.udp_redirect, ser2net:status.ser2net,mavproxy:status.mavproxy, gStreamer:status.gStreamer, inadyn:status.inadyn} })
        })
     
    }
    initialvalues() {
        this.state.socket.emit(READ_DRONECONFIG, (data) => {
            Object.keys(data).map((key, val) => {
                this.configs[key] = data[key]
                return true
            })
            this.setState({ config: this.configs, destination:{ip:this.configs.GCS_address} });
            this.checkPort()
        })
    }
    checkPort(){
        this.state.socket.emit(DESTINATION_INFORMATION, this.state.config.GCS_address, {telem_port:this.state.config.PORT, vid_port:this.state.config.UDP_PORT}, (status) => {
            this.setState({destination:{telem_portIsOpen:status.telem_port, video_portIsOpen:status.video_port}})
        })
    }
    hasErrors(){
        if(((this.state.config.UseCam === 'Yes' && !this.state.software.gStreamer) ||
            (this.state.config.Telemetry_Type === 'gpio' && this.state.config.Cntrl === 'APM' && !this.state.software.mavproxy) ||
            (this.state.config.Telemetry_Type === 'ttl' && this.state.config.Cntrl === 'APM' && !this.state.software.udp_redirect) ||
            (this.state.config.UseDns === 'Yes' && !this.state.software.inadyn)) 
            && this.state.active) return true
    }
    render() {
        return (
            <div>
                <h1>UAVcast web portal {this.state.active === true ? <span> ( <span className="text-success">Running</span> )</span> : this.state.starting === true ? <span>&nbsp;&nbsp;<CircularProgress size={40}/></span> :''}</h1>
                <h4>Simply set your configuration in the setup tab, and start casting.</h4>
                <UavCastbutton starting={this.state.starting} enabled={this.state.enabled} active={this.state.active} onSubmit={(v) => this.UAVcastHandler(v)} />
                <div>
                    {this.state.enabled && <span>
                    <h4>UAVcast is enabled and will start automatically during reboot.</h4>
                    </span>}
                    {this.state.active && <span><h2>Hey, Cool!!</h2>
                        <h4>UAVcast is currently running, and if all parameters are set correctly you should now be able to retrive telemetry or video on your Ground Control Station.<br /><br />
                            Telemetry Target: <span className="text-success">{this.state.config.GCS_address}</span> on port: <span className="text-success">{this.state.config.PORT}</span> {this.state.destination.telem_portIsOpen === true ? <span className="text-success">(port is open) </span>:''} <br /></h4>
                            {this.state.config.secondary_tele === 'Yes' && <h4>Secondary Telemetry Target: <span className="text-success">{this.state.config.sec_ip_address}</span> on port: <span className="text-success">{this.state.config.sec_port}</span></h4>} <br />
                            {this.state.config.UseCam === 'Yes' ? <h4>Video Target: <span className="text-success">{this.state.config.GCS_address}</span> on port: <span className="text-success">{this.state.config.UDP_PORT}</span></h4> : ''}  </span>}<br />                        

                </div>
                <Errors hasError={this.hasErrors()} config={this.state.config} software={this.state.software} active={this.state.active} />
            </div>
        );
    }
}

export default Home;