const log = require('../../utils/log');
const config = require('../../config');
const events = require('./events');
const ctrl = require('../../interface_adapters/controllers/ChatController');

const socketIOConfig = config.socketio;

class SocketServerWrapper {
    constructor(io) {
        this.io = io;
    }

    async broadcast(roomName, eventName, payload) {
        this.io.to(roomName).emit(eventName, JSON.stringify(payload));
    }
}

class SocketClient {
    constructor(socket) {
        this.socket = socket
    }

    async join(roomName) {
        await this.socket.join(roomName);
    }

    async leave(roomName) {
        await this.socket.leave(roomName);
    }

    getUserName() {
        return this.socket.handshake.query.name;
    }
}

function registerEvents(client, ioWrapper) {
    for (let event of events) {
        client.socket.on(event.name, async (payload) =>  await event.handler(client, ioWrapper, payload));
    }
}

function startServer(http) {
    const io = require('socket.io')(http, socketIOConfig);
    const ioWrapper = new SocketServerWrapper(io);
    io.of('/').adapter.on('error', function (err) {log.error(err)});
    io.on('connection', async (socket) => {
        const client = new SocketClient(socket);
        registerEvents(client, ioWrapper);
        await ctrl.joinRoom(client);
    });

    log.log('socket server initialized');
}

module.exports = {startServer};
