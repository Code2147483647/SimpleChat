require('../globalSetup');
const DeleteUser = require('../../application_business_rules/use_cases/DeleteUser');

describe('test delete user', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test delete user success', async () => {
        const
            mockUserID = 1,
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return {id: mockUserID}}),
                deleteUserByID: jest.fn().mockImplementation(() => {return 1})
            };

        const affectedRows = await DeleteUser(mockUserID, {userRepository});
        expect(affectedRows).toEqual(1);
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({id: mockUserID});
        expect(userRepository.deleteUserByID).toHaveBeenCalledTimes(1);
        expect(userRepository.deleteUserByID.mock.calls[0][0]).toEqual(mockUserID);
    });

    it('test delete user failed with already deleted', async () => {
        const
            mockUserID = 1,
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return null})
            };
        
        try {
            DeleteUser(mockUserID, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('user not found');
        }
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({id: mockUserID});
    });
});

