import React, { Component } from 'react';
import Menu from '../modules/menu';
import {GET_UPTIME} from '../Events.js'

// toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!')
class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            socket:null, 
            uptime:null,
        }
        this.getUptime = this.getUptime.bind(this)
    }
    componentWillMount() {
        this.initSocket();
    }
    componentDidMount(){
        setInterval(()=>{this.getUptime();},30000)
        this.getUptime();
    }
    initSocket(){
        let socket = this.props.socket
        socket.on('connect', () => {
            console.log("Raspberry PI connected ");
        })
        this.setState({socket})
       
    }
    getUptime(){
        const { socket } = this.state
        socket.emit(GET_UPTIME, (value)=>{ this.setState({uptime:'RPI ' + value.uptime}) })
    }
    render() {
        
        const {uptime} = this.state
        return (
            <div>
               <Menu uptime={uptime} />
                 
            <div className="container" id="main">
                <div className="row">
                    <div className="col-md-12">
                     <div className="container top-buffer"> {this.props.children} </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default Layout;