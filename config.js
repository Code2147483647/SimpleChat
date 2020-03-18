const config = {
    mysql: {
        host: 'localhost',
        user: 'aimazing',
        password: '12345678',
        database: 'AIMazing',
        port: 3306
    },
    webServer: {
        port: 8080
    },
    socketio: {
        path: '/chat',
        pingTimeout: 60000,
        pingInterval: 10000,
        cookie: false
    }
};

module.exports = config;
