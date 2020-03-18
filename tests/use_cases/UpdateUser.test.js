require('../globalSetup');
const mockMD5Pwd = 'md5pwd';
jest.mock('../../utils/util', () => {
    return {md5Password: jest.fn().mockReturnValue(mockMD5Pwd)}
});
const {md5Password} = require('../../utils/util');

const {UpdatePassword} = require('../../application_business_rules/use_cases/UpdateUser');

describe('test update user', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test update user password success', async () => {
        const
            mockUserID = 1,
            password = '111',
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return {id: mockUserID}}),
                updateUserByID: jest.fn().mockImplementation(() => {})
            };

        await UpdatePassword(mockUserID, password, {userRepository});
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({id: mockUserID});
        expect(md5Password).toHaveBeenCalledTimes(1);
        expect(md5Password.mock.calls[0][0]).toEqual(password);
        expect(userRepository.updateUserByID).toHaveBeenCalledTimes(1);
        expect(userRepository.updateUserByID.mock.calls[0][0]).toEqual(mockUserID);
        expect(userRepository.updateUserByID.mock.calls[0][1]).toEqual({password: mockMD5Pwd});
    });

    it('test update user failed with user not found', async () => {
        const
            mockUserID = 1,
            password = '111',
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return null})
            };
        
        try {
            UpdatePassword(mockUserID, password, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('user not found');
        }
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({id: mockUserID});
    });
});

