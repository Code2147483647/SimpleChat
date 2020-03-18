require('../globalSetup');

const mockMD5Pwd = 'md5pwd';
jest.mock('../../utils/util', () => {
    return {md5Password: jest.fn().mockReturnValue(mockMD5Pwd)}
});
const {md5Password} = require('../../utils/util');
const CreateUser = require('../../application_business_rules/use_cases/CreateUser');

describe('test create user', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test create user success', async () => {
        const
            mockUSer = {name: 't', password: '1', email: 'j@g.com', role: 'MEMBER'},
            mockUserID = 1,
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return null}),
                createUser: jest.fn().mockImplementation(() => {return {...mockUSer, id: mockUserID}})
            };

        const user = await CreateUser(mockUSer.name, mockUSer.email, mockUSer.password, mockUSer.role, {userRepository});
        expect(user).toEqual({...mockUSer, id: mockUserID});
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({email: mockUSer.email});
        expect(md5Password).toHaveBeenCalledTimes(1);
        expect(md5Password.mock.calls[0][0]).toEqual(mockUSer.password);
        expect(userRepository.createUser).toHaveBeenCalledTimes(1);
        mockUSer.password = mockMD5Pwd;
        mockUSer.id = null;
        expect(userRepository.createUser.mock.calls[0][0]).toEqual(mockUSer);
    });

    it('test create user failed by email already exist', async () => {
        const
            mockUSer = {name: 't', password: '1', email: 'j@g.com', role: 'MEMBER'},
            userRepository = {
                getUser: jest.fn().mockImplementation(() =>{return {}}),
            };
        try {
            await CreateUser(mockUSer.name, mockUSer.email, mockUSer.password, mockUSer.role, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('email already exist');
        }
        expect(userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(userRepository.getUser.mock.calls[0][0]).toEqual({email: mockUSer.email});
    });

    it('test create user failed by role invalid', async () => {
        const
            mockUSer = {name: 't', password: '1', email: 'j@g.com', role: 'invalidRole'},
            userRepository = {};
        try {
            await CreateUser(mockUSer.name, mockUSer.email, mockUSer.password, mockUSer.role, {userRepository});
        } catch(e) {
            expect(e.message).toEqual('invalid role type');
        }
    });
});

