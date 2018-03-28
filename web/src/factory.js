"use strict";
const exec = require('child_process').exec;
const { spawn } = require('child_process');
const child = spawn('pwd');
const shell = require('shelljs');
const fs = require('fs');
const path = require("path");
// var Promise = require('bluebird')
module.exports = {
    getUpTime: function (clb) {
        const child = spawn('uptime -p', { detached: true, shell: true });
        child.stdout.on('data', (data) => {
            clb({ uptime: data.toString('utf8') });
        });
        child.on('exit', function () {
            child.kill();
        });

    },
    saveDroneConfig: function (config, clb) {
        try {
            let _json = JSON.stringify(config, null, 2)
            let date = new Date()
            console.log(_json);
            fs.writeFile('../DroneConfig.txt', _json, function (err) {
                return clb(true)
            });

        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }

    },
    readDroneConfig: function (clb) {
        try {
            fs.readFile('../DroneConfig.txt', (err, data) => {
                if (err) throw err;
                let result = JSON.parse(data);
                return clb(result)
            });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    StatusUAVcast: function (sta) {
        var status = { active: false, enabled: false, ser2net: false, mavproxy:false, gStreamer: false, inadyn:false, udp_redirect:false }
        let sta1 = null, sta2 = null, sta3 = null, sta4 = null, sta5 = false, sta6 = false, sta7=false
        try {
            // This function has to be rebuild using status.sh
            // sta1 = new Promise((resolve, reject) => {
            //     const child = exec('sh ../script/Status/Status.sh', { detached: true, shell: true });
            //     child.stdout.on('data', (data) => {
            //         status = JSON.parse(data)
            //         resolve()
            //     })
            // })
            sta1 = new Promise((resolve, reject) => {
                const child = spawn('systemctl is-active UAVcast', { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    let str = data.toString('utf8').replace(/\s/g, '');

                    if (str === "active") {
                        status = Object.assign(status, { active: true })
                        resolve()
                    } else {
                        status = Object.assign(status, { active: false })
                        resolve()
                    }
                });
            })
            sta2 = new Promise((resolve, reject) => {
                const child = spawn('systemctl is-enabled UAVcast', { detached: true, shell: true });
                child.stdout.on('data', (data) => {

                    if (data.toString('utf8').indexOf("enabled") !== -1) {
                        status = Object.assign(status, { enabled: true })
                        resolve()
                    } else {
                        status = Object.assign(status, { enabled: false })
                        resolve()
                    }
                });
            })
            sta3 = new Promise((resolve, reject) => {
                const child = spawn('/bin/pidof', ['-x', 'ser2net'], { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    status = Object.assign(status, { ser2net: true })
                    resolve()
                });
                child.stderr.on('data', (data) => {
                    console.log(data.toString('utf8'));
                });
                child.on('close', (data) => {
                    resolve()
                });
            })
            sta4 = new Promise((resolve, reject) => {
                const child = spawn('/bin/pidof', ['-x', 'cmavnode'], { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    status = Object.assign(status, { mavproxy: true })
                    resolve()
                });
                child.stderr.on('data', (data) => {
                    console.log(data.toString('utf8'));
                });
                child.on('close', (data) => {
                    resolve()
                });
            })
            sta5 = new Promise((resolve, reject) => {
                const child = spawn('/bin/pidof', ['-x', 'inadyn'], { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    status = Object.assign(status, { inadyn: true })
                    resolve()
                });
                child.stderr.on('data', (data) => {
                    console.log(data.toString('utf8'));
                });
                child.on('close', (data) => {
                    resolve()
                });
            })
            sta6 = new Promise((resolve, reject) => {
                const child = spawn('/bin/pidof', ['-x', 'gst-launch-1.0'], { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    status = Object.assign(status, { gStreamer: true })
                    resolve()
                });
                child.stderr.on('data', (data) => {
                    console.log(data.toString('utf8'));
                });
                child.on('close', (data) => {
                    resolve()
                });
            })
            sta7 = new Promise((resolve, reject) => {
                const child = spawn('/bin/pidof', ['-x', 'udp_redirect'], { detached: true, shell: true });
                child.stdout.on('data', (data) => {
                    status = Object.assign(status, { udp_redirect: true })
                    resolve()
                });
                child.stderr.on('data', (data) => {
                    console.log(data.toString('utf8'));
                });
                child.on('close', (data) => {
                    resolve()
                });
            })

        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
        finally {
            Promise.all([sta1, sta2, sta3, sta4, sta5, sta6, sta7]).then(v => {
                return sta(status)
            });
        }
    },
    destInformation: function(ip, obj, sta){
        let dest = null, sta1 = null
        var info = {} ;

        try { 
            sta1 = new Promise((resolve, reject) => {   
                Object.keys(obj).map(function(key, index) {      
                const child = spawn('nc', ['-z','-v','-w5', '-u', ip, obj[key]], { detached: true, shell: true });
                 child.on('exit', (code) => {
                    info = Object.assign(info, { [key]: code === 0 })
                    resolve()
                });
               
              })
            })
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
        finally {
           
            Promise.all([sta1]).then(v => {
                console.log(info);
                return sta(info)
            });
        }
    },
    StartUAVcast: function (sta) {
        try {

            const child = spawn('systemctl start UAVcast', { detached: true, shell: true });
            child.stdout.on('data', (data) => {
                return sta({ UAVcast: data.toString('utf8') });
            });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    StopUAVcast: function (sta) {
        try {
            const child = spawn('systemctl stop UAVcast', { detached: true, shell: true });
            child.stdout.on('data', (data) => {
                return sta({ UAVcast: 'Stopping' });
            });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    EnableUAVcast: function (sta) {
        try {
            shell.exec('systemctl enable UAVcast',
                (error, stdout, stderr) => {
                    return sta('enabled')
                });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    DisableUAVcast: function (sta) {
        try {
            shell.exec('systemctl disable UAVcast',
                (error, stdout, stderr) => {
                    return sta('Disabled')
                });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    checkIfAPMbinaryExsist: function (fcType, file, sta) {
        try {
            var naviofld = path.join(__dirname, '..', '..', 'emlid', fcType);
            const child = spawn('test', ['-f', naviofld + '/' + 'ardu' + file.toLowerCase()], { detached: true, shell: true });
            child.on('exit', (code) => {
               if (code === 0) return sta(true)
               return sta(false)
            });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    installBinary: function (fcType, file, sta) {
        try {
            let planeCopterRover = (file === 'Rover' || file === 'Plane') ?  file : file.substring(0, file.indexOf('-'))
            let binaryFileName = 'ardu' + file.toLowerCase()
            let frameType = (planeCopterRover === 'Plane' || planeCopterRover === 'Rover') ? fcType.toLowerCase() : fcType.toLowerCase() + '-' +  file.substring(file.indexOf('-')+1)
            const child = spawn('wget', ['-P', path.join(__dirname, '..', '..', 'emlid', fcType),'http://firmware.eu.ardupilot.org/'+ planeCopterRover +'/stable/'+ frameType + '/' + binaryFileName], { detached: true, shell: true });           
            child.on('exit', (code) => {
                shell.exec('chmod 777 -R ' + path.join(__dirname, '..', '..', 'emlid/'))
                if (code === 0) return sta(true)
                return sta(false)
            });
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    RpiCommands: function (commands, sta) {
        var status = {}
        try {
            const child = spawn(commands, { detached: true, shell: true }); 
            child.stdout.on('data', (data) => {
                sta(Object.assign(status, { stream: data.toString('utf8')}))
                console.log(data.toString('utf8'));
            });  
            child.stderr.on('data', (error) => {
                sta(Object.assign(status, { error: error.toString('utf8')}))
                console.log(error.toString('utf8'));
            });        
  
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    },
    saveVPNovpn: function(stream, data, status){
        var result = {}
        let filename = path.basename(data.name);
        if(filename.split('.').pop() != 'ovpn') return status(Object.assign(result, {error:"Wrong fileformat, has to be *.ovpn"}))

        fs.writeFile('../usr/etc/openvpn.ovpn', data.data, function (err) {
            if (err) {
                return status(Object.assign(result, {error:"There was a problem uploading the file"}))
            }
            return status(Object.assign(result, {success: data.name + "<br /> Successfully saved"}))
           
        });
    },
    getVpnIp: function(status){
        try {
            const child = spawn("ifconfig tun0 | awk '/inet /{print substr($2,1)}'", { detached: true, shell: true }); 
            child.stdout.on('data', (ip) => {
                return status(ip.toString('utf8'))
            });  
            child.stderr.on('data', (error) => {
                return status('')
            });        
        } catch (ex) {
            console.log(`exec error: ${ex.message}`);
        }
    }
}