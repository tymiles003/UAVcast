import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Uavmatrix from '../images/uavmatrix.png'
import './menu.css'

class Menu extends Component {

  render() {
    return (
      <div>
        <div id="wrapper">
          <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">UAVcast <span className="media-hide" > - Casting software for unmanned vehicles</span></a>
            </div>
            <div className="collapse navbar-collapse navbar-ex1-collapse">
              <ul className="nav navbar-nav side-nav">
                <li className="active"> <Link to="/" ><i className="fa fa-dashboard"></i> Home</Link></li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-caret-square-o-down"></i> Setup<b className="caret"></b></a>
                  <ul className="dropdown-menu">
                    <li><Link to="fc" >Flight Controller</Link></li>
                    <li><Link to="gcs">Ground Control Station</Link></li>
                    <li><Link to="modem">Cellular Modem</Link></li>
                    <li><Link to="camera">Camera</Link></li>
                    <li><Link to="dns">DNS</Link></li>
                    <li><Link to="vpn">VPN</Link></li>
                  </ul>
                </li>
                
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-caret-square-o-down"></i> Diagnostic<b className="caret"></b></a>
                  <ul className="dropdown-menu">
                    <li><Link to="rpi-status">Raspberry</Link></li>
                    <li><Link to="rpi-uavcast-status">UAVcast</Link></li>
                    <li><Link to="rpi-modem-status">Modem</Link></li>
                    <li><Link to="rpi-vpn-status">VPN</Link></li>
                  </ul>
                </li>
                <div className="logo text-center"><a target="_blank" href="http://uavmatrix.com"><img alt="UAVmatrix.com" src={Uavmatrix} width="90%" /></a></div>
              </ul>
              
              <ul className="nav navbar-nav navbar-right navbar-user menu-hide">
                <li>
                <a target="_blank" href="http://uavcast.uavmatrix.com"><i className="fa fa-newspaper-o"></i> Documentation </a>
                </li>
                <li>
                  <a target="_blank" href="http://uavmatrix.com/d/5110-UAVcast-Casting-software-for-Raspberry-PI-Supports-3G-4G-WiFi"><i className="fa fa-comment"></i> Discussion Thread </a>
                </li>
                <li>
                  <a target="_blank" href="https://github.com/UAVmatrix/UAVcast"><i className="fa fa-github"></i> GitHub </a>
                </li>
                <li>
                 <span className="AppVersion">v{this.props.AppVersion}</span>
                </li>
                {/* <li className="dropdown user-dropdown">
                  <a href=""><i className="fa fa-comment"></i> John Smith </a>
                </li> */}
              </ul>
              
            </div>

          </nav>
          <div id="page-wrapper">
            {this.props.children}
          </div>
        </div>
      </div>
    );

  }
}


export default Menu;