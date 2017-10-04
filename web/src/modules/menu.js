import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './menu.css'

class Menu extends Component {

  render() {
    return (
      <div className="nav-side-menu">
        <div className="brand">UAVcast</div>
        <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

        <div className="menu-list">

          <ul id="menu-content" className="menu-content collapse out">
            <Link to="/" >
              <li>
                <i className="fa fa-home fa-lg"></i>Home
            </li>
            </Link>


            <li data-toggle="collapse" data-target="#service" className="collapsed">
              <a href="#"><i className="fa fa-globe fa-lg"></i> Setup <span className="arrow"></span></a>
            </li>
            <ul className="sub-menu collapse" id="service">
              <Link to="fc"><li>Flight Controller</li></Link>
              <Link to="gcs"><li>Ground Control Station</li></Link>
              <Link to="modem"><li>Cellular Modem</li></Link>
              <Link to="camera"><li>Camera</li></Link>
              <Link to="dns"><li>DNS</li></Link>
            </ul>
          </ul>
        </div>
        <div className="text-center text-success">{this.props.uptime}</div>
      </div>

    );
  }
}

export default Menu;