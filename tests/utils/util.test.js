require('../globalSetup');
const {md5Password} = require('../../utils/util');
describe('util test', () => {
    it('test encrypt password success by md5 method', () => {
        const md5Result =
            '96e79218965eb72c92a549dd5a33011283d8bd84fda0b044ef3de2d22b49a75f';
        expect(md5Password('111111')).toEqual(md5Result);
    });

    it('test encrypt password with invalid input', () => {
        try {
            md5Password('')
        } catch(e) {
            expect(e.message).toEqual('password required');
        }
    });
});