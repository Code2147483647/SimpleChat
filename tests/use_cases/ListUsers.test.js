require('../globalSetup');

const ListUsers = require('../../application_business_rules/use_cases/ListUsers');

describe('test list user', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test list users success', async () => {
        const
            role = 'MEMBER',
            mockResults = [{id: 1}, {id: 2}];
            userRepository = {
                getUsers: jest.fn().mockImplementation(() => {return mockResults}),
            };

        const members = await ListUsers(role, {userRepository});
        expect(members).toEqual(mockResults);
        expect(userRepository.getUsers).toHaveBeenCalledTimes(1);
        expect(userRepository.getUsers.mock.calls[0][0]).toEqual({role});
    });

    it('test list users failed by invalid role type', async () => {
        const
            role = 'invalidType',
            mockResults = [{id: 1}, {id: 2}];
            userRepository = {
                getUsers: jest.fn().mockImplementation(() => {return mockResults}),
            };
        try {
            await ListUsers(role, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('invalid role type');
        }
    });
});

