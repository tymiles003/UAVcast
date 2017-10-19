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
import Vpn from './pages/vpn';
import RpiStatus from './pages/rpi-status';
import RpiUavcastStatus from './pages/rpi-uavcast-status';
import RpiModemStatus from './pages/rpi-modem-status';
import VpnStatus from './pages/rpi-vpn-status';
import './index.css'
import ReactGA from 'react-ga';

if (process.env.NODE_ENV === 'production') {
  // Google Analytics UA-107582726-1
  ReactGA.initialize('UA-107582726-1', {
    debug: false,
    titleCase: true
  });
}

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

const socketUrl = extractHostname(window.location.href)
const socket = io(socketUrl)

class HomesWrapper extends React.Component {
  render(){
    return (
        <Home socket={socket} />
    );
  }
}
class FcWrapper extends React.Component {
  render(){
    return (
        <Fc socket={socket} />
    );
  }
}
class GcsWrapper extends React.Component {
  render(){
    return (
        <Gcs socket={socket} />
    );
  }
}
class ModemWrapper extends React.Component {
  render(){
    return (
        <Modem socket={socket} />
    );
  }
}
class DnsWrapper extends React.Component {
  render(){
    return (
        <Dns socket={socket} />
    );
  }
}
class CameraWrapper extends React.Component {
  render(){
    return (
        <Camera socket={socket} />
    );
  }
}
class VpnWrapper extends React.Component {
  render(){
    return (
        <Vpn socket={socket} />
    );
  }
}
class RpiStatusWrapper extends React.Component {
  render(){
    return (
        <RpiStatus socket={socket} />
    );
  }
}
class RpiUavcastStatusWrapper extends React.Component {
  render(){
    return (
        <RpiUavcastStatus socket={socket} />
    );
  }
}
class RpiModemStatusWrapper extends React.Component {
  render(){
    return (
        <RpiModemStatus socket={socket} />
    );
  }
}
class VpnStatusWrapper extends React.Component {
  render(){
    return (
        <VpnStatus socket={socket} />
    );
  }
}

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
        <Route path="/vpn" component={VpnWrapper} ></Route>
        <Route path="/rpi-status" component={RpiStatusWrapper} ></Route>
        <Route path="/rpi-uavcast-status" component={RpiUavcastStatusWrapper} ></Route>
        <Route path="/rpi-modem-status" component={RpiModemStatusWrapper} ></Route>
        <Route path="/rpi-vpn-status" component={VpnStatusWrapper} ></Route>
      </Layout>
    </BrowserRouter>
  </MuiThemeProvider>,
  app);
