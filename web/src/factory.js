"use strict";
const exec = require('child_process').exec;
const { spawn } = require('child_process');
const child = spawn('pwd');
const shell = require('shelljs');
const fs = require('fs');
var Promise = require('bluebird')
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
        var status = { active: false, enabled: false, ser2net: false, gStreamer: false, inadyn:false, udp_redirect:false }
        let sta1 = null, sta2 = null, sta3 = null, sta4 = null, sta5 = false, sta6 = false
        try {
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
            sta5 = new Promise((resolve, reject) => {
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
            sta6 = new Promise((resolve, reject) => {
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
            Promise.all([sta1, sta2, sta3, sta4, sta5, sta6]).then(v => {
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
            //   let e = shell.exec('systemctl start UAVcast',
            //         (error, stdout, stderr) => {
            //             console.log(stdout);
            //             sta({ UAVcast: stdout });
            //             if (error !== null) {
            //                 console.log(`exec error: ${error}`);
            //             }
            //             e.kill()
            //         });
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

            // shell.exec('systemctl stop UAVcast',
            //     (error, stdout, stderr) => {
            //         sta({ UAVcast: 'Stopping' });
            //         if (error !== null) {

            //             console.log(`exec error: ${error}`);
            //         }
            //     });
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
    }
}