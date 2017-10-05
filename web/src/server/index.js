'use strict';
const SocketManager = require('./SocketManager')
const compression = require('compression')
const express = require('express');
const path = require('path');
const app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(compression())
    app.use(express.static(path.join(__dirname, '../../build'))); 
}

const PORT = process.env.PORT || 80

var server = app.listen(PORT, ()=>{
    console.log('Backend server listen at: ' + PORT)
})

var io = module.exports.io = require('socket.io')(server)
io.on('connection', SocketManager)

// To run the server in production 
// pm2 start process.json --env production
