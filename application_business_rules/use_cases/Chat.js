const Message = require('../../enterprise_business_rules/entities/Message');
const {ROOM_NAME, SOCKET_EVENT}= require('../../constDefine');

async function SendMessage(message, {ioWrapper, socketClient}) {
    const name = socketClient.getUserName();
    const ts = new Date().getTime();
    const m = new Message(name, ts, message);
    await ioWrapper.broadcast(ROOM_NAME, SOCKET_EVENT.SEND_MESSAGE, m);
};

async function JoinChatRoom({socketClient}) {
    socketClient.join(ROOM_NAME);
}

async function LeaveChatRoom({socketClient}) {
    socketClient.leave(ROOM_NAME);
}

module.exports = {SendMessage, JoinChatRoom, LeaveChatRoom};
