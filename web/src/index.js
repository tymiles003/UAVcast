import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom'
//import io from 'socket.io/node_modules/socket.io-client';
import io from 'socket.io-client/dist/socket.io';
import Layout from './components/layout'
import Home from './pages/home';
import Fc from './pages/fc';
import Gcs from './pages/gcs';
import Modem from './pages/modem';
import Camera from './pages/camera';
import Dns from './pages/dns';
import RpiStatus from './pages/rpi-status';
import RpiUavcastStatus from './pages/rpi-uavcast-status';
import RpiModemStatus from './pages/rpi-modem-status';
import './index.css'
import ReactGA from 'react-ga';

// Google Analytics
ReactGA.initialize('UA-107582726-1');

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  return hostname;
}

// const socketUrl = "http://10.0.0.162"
const socketUrl = extractHostname(window.location.href)
const socket = io(socketUrl)

var HomesWrapper = React.createClass({
  render: function () {
    return (
        <Home socket={socket} />
    );
  }
});
var FcWrapper = React.createClass({
  render: function () {
    return (
        <Fc socket={socket} />
    );
  }
});
var GcsWrapper = React.createClass({
  render: function () {
    return (
        <Gcs socket={socket} />
    );
  }
});
var ModemWrapper = React.createClass({
  render: function () {
    return (
        <Modem socket={socket} />
    );
  }
});
var DnsWrapper = React.createClass({
  render: function () {
    return (
        <Dns socket={socket} />
    );
  }
});
var CameraWrapper = React.createClass({
  render: function () {
    return (
        <Camera socket={socket} />
    );
  }
});
var RpiStatusWrapper = React.createClass({
  render: function () {
    return (
        <RpiStatus socket={socket} />
    );
  }
});
var RpiUavcastStatusWrapper = React.createClass({
  render: function () {
    return (
        <RpiUavcastStatus socket={socket} />
    );
  }
});
var RpiModemStatusWrapper = React.createClass({
  render: function () {
    return (
        <RpiModemStatus socket={socket} />
    );
  }
});
const app = document.getElementById('root')
ReactDOM.render(
  <MuiThemeProvider>
    <BrowserRouter >
      <Layout socket={socket}>
        <Route exact path='/' component={HomesWrapper} ></Route>
        <Route path="/fc" component={FcWrapper} ></Route>
        <Route path="/gcs" component={GcsWrapper} ></Route>
        <Route path="/modem" component={ModemWrapper} ></Route>
        <Route path="/dns" component={DnsWrapper} ></Route>
        <Route path="/camera" component={CameraWrapper} ></Route>
        <Route path="/rpi-status" component={RpiStatusWrapper} ></Route>
        <Route path="/rpi-uavcast-status" component={RpiUavcastStatusWrapper} ></Route>
        <Route path="/rpi-modem-status" component={RpiModemStatusWrapper} ></Route>
      </Layout>
    </BrowserRouter>
  </MuiThemeProvider>,
  app);
