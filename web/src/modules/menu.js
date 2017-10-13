import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './menu.css'

class Menu extends Component {

  render() {
    return (
      <div className="nav-side-menu">
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
            <Link to="/rpi" >
              <li>
                <i className="fa fa-cog fa-lg"></i>Raspberry
            </li>
            </Link>
          </ul>
        </div>
        <div className="text-center text-success"><h5>{this.props.uptime}</h5></div>
      </div>

    );
  }
}

export default Menu;