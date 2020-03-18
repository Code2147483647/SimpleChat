require('../globalSetup');
const constDefine = require('../../constDefine');
const {SendMessage, JoinChatRoom, LeaveChatRoom} = require('../../application_business_rules/use_cases/Chat');

describe('test Chat use case', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test SendMessage', async () => {
        const
            message = 'm',
            name = 'J',
            ts = 111111,
            ioWrapper = {
                broadcast: jest.fn().mockImplementation(() => {})
            },
            socketClient = {
                getUserName: jest.fn().mockImplementation(() => {return name})
            };
        dateSpy = jest.spyOn(Date.prototype, 'getTime').mockReturnValue(ts);
        await SendMessage(message, {ioWrapper, socketClient});
        expect(ioWrapper.broadcast).toHaveBeenCalledTimes(1);
        expect(ioWrapper.broadcast.mock.calls[0][0]).toEqual(constDefine.ROOM_NAME);
        expect(ioWrapper.broadcast.mock.calls[0][1]).toEqual(constDefine.SOCKET_EVENT.SEND_MESSAGE);
        expect(ioWrapper.broadcast.mock.calls[0][2]).toEqual( {message, name, ts});
    });

    it('test join room', async () => {
        const
            socketClient = {
                join: jest.fn().mockImplementation(() => {})
        };

        JoinChatRoom({socketClient});
        expect(socketClient.join).toHaveBeenCalledTimes(1);
        expect(socketClient.join.mock.calls[0][0]).toEqual(constDefine.ROOM_NAME);
    });

    it('test leave room', async () => {
        const
            socketClient = {
                leave: jest.fn().mockImplementation(() => {})
        };

        LeaveChatRoom({socketClient});
        expect(socketClient.leave).toHaveBeenCalledTimes(1);
        expect(socketClient.leave.mock.calls[0][0]).toEqual(constDefine.ROOM_NAME);
    });
});

