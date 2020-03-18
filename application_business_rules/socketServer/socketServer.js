//interface for socketServer

class SocketServer{
    constructor(io) {
    }

    broadcast(roomName, eventName, payload) {
    }
}

class SocketClient {
    constructor(socket) {
    }

    join(roomName) {
    }

    leave(roomName) {
    }
}