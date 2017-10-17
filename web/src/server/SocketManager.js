const Factory = require('../factory')
const {GET_UPTIME,STREAM_FROM_RPI, SAVE_OVPN, STATUS_OVPN, GET_VPN_IP, SAVE_DRONECONFIG, READ_DRONECONFIG, UAVCAST_STATUS, START_UAVCAST, STOP_UAVCAST,AUTOSTART_UAVCAST, DISABLE_UAVCAST, DESTINATION_INFORMATION, CHECK_BINARY_EXSIST, INSTALL_BINARY, RPI_COMMANDS} = require('../Events')
const io = require('./index.js').io
const ss = require('socket.io-stream');

module.exports = (socket) => {
    socket.on(GET_UPTIME, (clb)=>{
        Factory.getUpTime((value)=>{
            clb(value)
        })
    }),
    socket.on(SAVE_DRONECONFIG, (config, callb)=>{
        Factory.saveDroneConfig(config, (clb) => {
           return callb(clb)
        })
    })
    socket.on(READ_DRONECONFIG, (clb)=>{
        Factory.readDroneConfig((data) => {
            return clb(data);
        })
    })
    socket.on(UAVCAST_STATUS, (val)=>{
        Factory.StatusUAVcast((sta)=>{
            return val(sta)
        })
    })
    socket.on(START_UAVCAST, (val)=>{
        Factory.StartUAVcast((sta)=>{
            return val(sta)
        })
    })
    socket.on(STOP_UAVCAST, (val)=>{
        Factory.StopUAVcast((sta)=>{
            return val(sta)
        })
    })
    socket.on(AUTOSTART_UAVCAST, (val)=>{
        Factory.EnableUAVcast((sta)=>{
            return val(sta)
        })
    })
    socket.on(DISABLE_UAVCAST, (val)=>{
        Factory.DisableUAVcast((sta)=>{
            return val(sta)
        })
    })
    socket.on(DESTINATION_INFORMATION, (ip, obj, val)=>{
        Factory.destInformation(ip, obj, (sta)=>{
            return val(sta)
        })
    })
    socket.on(CHECK_BINARY_EXSIST, (fcType, file, val)=>{
        Factory.checkIfAPMbinaryExsist(fcType ,file,  (sta)=>{
            return val(sta)
        })
    })
    socket.on(INSTALL_BINARY, (fcType, file, val)=>{
        Factory.installBinary(fcType, file,  (sta)=>{
            return val(sta)
        })
    })
    socket.on(RPI_COMMANDS, (commands, done)=>{
        Factory.RpiCommands(commands, (stream)=>{
            socket.emit(STREAM_FROM_RPI, stream)
            done()
        })
    })
    socket.on(GET_VPN_IP, (send_ip)=>{
        Factory.getVpnIp((ip)=>{
            send_ip(ip)
        })
    })
    ss(socket).on(SAVE_OVPN, function(stream, data) {
        Factory.saveVPNovpn(stream, data, (status)=>{
            if (status) return socket.emit(STATUS_OVPN, status)
        })
    });
}