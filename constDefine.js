const FIELD_PATTERN = {
    EMAIL: '^\\w+([\\.\\-]?\\w+)*@\\w+([\\.\\-]?\\w+)*(\\.\\w{2,8})+$',
    NAME: '^[\\u4e00-\\u9fa5\\w\\-\\.\\(\\)][\\u4e00-\\u9fa5\\w\\-\\.\\(\\)\\s]{0,49}$',
    PASSWORD: '^[0-9A-Za-z!@#$%\\^&*()_]{6,20}$'
};
const COOKIE_SECRET = 'mySecret';

const ROOM_NAME = 'PRIMARY';
const SOCKET_EVENT = {
    SEND_MESSAGE: 'send_message',
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room'
};

module.exports = {
    FIELD_PATTERN,
    ROOM_NAME,
    SOCKET_EVENT,
    COOKIE_SECRET
}
