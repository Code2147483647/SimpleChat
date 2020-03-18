#! /usr/bin/env node

require('sugar').extend();
const {startServer, getHttp} = require('./frameworks_drivers/webserver/server');
const socketServer = require('./frameworks_drivers/socketserver/server');
const log = require('./utils/log');
try {
    socketServer.startServer(getHttp());
    startServer();
} catch(e) {
    log.log(e)
    process.exit(1);
}
