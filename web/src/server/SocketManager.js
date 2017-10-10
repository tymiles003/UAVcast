const Factory = require('../factory')
const {GET_UPTIME, SAVE_DRONECONFIG, READ_DRONECONFIG, UAVCAST_STATUS, START_UAVCAST, STOP_UAVCAST,AUTOSTART_UAVCAST, DISABLE_UAVCAST, DESTINATION_INFORMATION, CHECK_BINARY_EXSIST, INSTALL_BINARY} = require('../Events')
const io = require('./index.js').io

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
}
