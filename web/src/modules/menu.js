import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Uavmatrix from '../images/uavmatrix.png'
import './menu.css'

class Menu extends Component {

  render() {
    return (
      <div>


            <div className="nav-side-menu nopadding">
              <div className="brand text-warning">UAVcast</div>
              <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

              <div className="menu-list">

                <ul id="menu-content" className="menu-content collapse out">
                  <Link to="/" >
                    <li>
                      <i className="fa fa-home fa-lg"></i>Home
                </li>
                  </Link>


                  <li data-toggle="collapse" data-target="#service" className="collapsed">
                    <a href="#"><i className="fa fa-fighter-jet fa-lg"></i>UAV Setup <span className="arrow"></span></a>
                  </li>
                  <ul className="sub-menu collapse" id="service">
                    <Link to="fc"><li>Flight Controller</li></Link>
                    <Link to="gcs"><li>Ground Control Station</li></Link>
                    <Link to="modem"><li>Cellular Modem</li></Link>
                    <Link to="camera"><li>Camera</li></Link>
                    <Link to="dns"><li>DNS</li></Link>
                  </ul>
                  <li data-toggle="collapse" data-target="#settings" className="collapsed">
                    <a href="#"><i className="fa fa-cog fa-lg"></i>Raspberry <span className="arrow"></span></a>
                  </li>
                  <ul className="sub-menu collapse" id="settings">
                    <Link to="rpi-status"><li>Rpi Status</li></Link>
                    <Link to="rpi-uavcast-status"><li>UAVcast Diagnostic</li></Link>
                    <Link to="rpi-modem-status"><li>Modem Diagnostic</li></Link>
                  </ul>
                </ul>
              </div>
              <div className="text-center text-success"><h5>{this.props.uptime}</h5></div>
              <div className="logo text-center"><a target="_blank" href="http://uavmatrix.com"><img alt="UAVmatrix.com" src={Uavmatrix} width="90%" /></a></div>
        </div>

     
      <div className="col-xs-10 nopadding">
          <div className="uavcast-header navbar navbar-dark bg-dark fixed-top">
            <p className="navbar-brand">UAVcast - Casting software for unmanned vehicles </p>
          
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="http://uavmatrix.com">UAVmatrix
                  <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="http://uavmatrix.com/d/5110-UAVcast-Casting-software-for-Raspberry-PI-Supports-3G-4G-WiFi">Disuccsion Thread</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="https://github.com/UAVmatrix/UAVcast/tree/Web_UI">GitHub</a>
                </li>
              </ul>
        
          </div>
          </div>
      </div>
    );
  }
}

export default Menu;