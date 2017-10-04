import React, { Component } from 'react';

class Errors extends Component {
    render() {
        return (
            <div>
                 {this.props.hasError && <div className="panel panel-danger panel-with">
                        <div className="panel-heading">Ooooops!!!   We have a problem!</div>
                       
                            {this.props.config.UseCam === 'Yes' && !this.props.software.gStreamer && this.props.active && 
                            <div className="panel-body">
                            <span><h4><span className="text-danger">Error -> <b>gstreamer</b> not running!!</span></h4><b>gstreamer</b> should be running according to your configuration. Please check your camera and config.</span>
                            </div>}   
                       
                        
                            {this.props.config.Telemetry_Type === 'gpio' && !this.props.software.ser2net && this.props.active && 
                            <div className="panel-body">
                            <span><h4><span className="text-danger">Error -> <b>ser2net</b> not running!!</span></h4><b>ser2net</b> should be running according to your configuration.<br /> 
                             you have choosen to use GPIO TX(Pin8) & RX(Pin10) as telemetry connection.</span>
                            </div>}   
                        
                        
                            {this.props.config.UseDns === 'Yes' && !this.props.software.inadyn && this.props.active && 
                            <div className="panel-body">
                            <span><h4><span className="text-danger">Error -> <b>inadyn</b> not running!!</span></h4><b>inadyn</b> (DNS) should be running according to your configuration. Please check your config.</span>
                            </div>}   

                            {this.props.config.Telemetry_Type === 'ttl' && !this.props.software.udp_redirect && this.props.active && 
                            <div className="panel-body">
                            <span><h4><span className="text-danger">Error -> <b>udp_redirect</b> not running!!</span></h4><b>udp_redirect</b> should be running according to your configuration using TTL to Ethernet Adapter. Please check your config.</span>
                            </div>} 
                        
                 </div>}
            </div>
        );
    }
}

export default Errors;