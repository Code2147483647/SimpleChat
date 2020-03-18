require('../globalSetup');
const mockMD5Pwd = 'md5pwd';
jest.mock('../../utils/util', () => {
    return {md5Password: jest.fn().mockReturnValue(mockMD5Pwd)}
});
const {md5Password} = require('../../utils/util');

const Login = require('../../application_business_rules/use_cases/Login');

describe('test user login', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test login user success', async () => {
        const
            mockUserID = 1,
            email = 'j@g.com',
            password = '111',
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return {id: mockUserID}})
            };

        expect(await Login(email, password, {userRepository})).toEqual({id: mockUserID});
        expect(md5Password).toHaveBeenCalledTimes(1);
        expect(md5Password.mock.calls[0][0]).toEqual(password);
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({email, password: mockMD5Pwd});
    });

    it('test login user failed by login error', async () => {
        const
            email = 'j@g.com',
            password = '111',
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return null})
            };

        try {
            await Login(email, password, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('user not found or password not match');
        }
        expect(md5Password).toHaveBeenCalledTimes(1);
        expect(md5Password.mock.calls[0][0]).toEqual(password);
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({email, password: mockMD5Pwd});
    });
});

