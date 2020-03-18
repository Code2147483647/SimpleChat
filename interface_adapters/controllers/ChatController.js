const {JoinChatRoom, LeaveChatRoom, SendMessage} = require('../../application_business_rules/use_cases/Chat');
class ChatController {
    async sendMessage(socketClient, ioWrapper, payload) {
        await SendMessage(payload, {ioWrapper, socketClient});
    }

    async joinRoom(socketClient) {
        await JoinChatRoom({socketClient});
    }

    async leaveRoom(socketClient) {
        await LeaveChatRoom({socketClient});
    }
}

const instance = new ChatController();
module.exports = instance;