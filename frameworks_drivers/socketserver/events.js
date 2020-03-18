const constDefine = require('../../constDefine');
const ctrl = require('../../interface_adapters/controllers/ChatController');
const events = [{
    name: constDefine.SOCKET_EVENT.SEND_MESSAGE,
    handler: ctrl.sendMessage
}, {
    name: constDefine.SOCKET_EVENT.JOIN_ROOM,
    handler: ctrl.joinRoom
}, {
    name: constDefine.SOCKET_EVENT.LEAVE_ROOM,
    handler: ctrl.leaveRoom
}];

module.exports = events;