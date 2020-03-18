require('../globalSetup');
const mockUC = {
    ListUsers: {},
    Login: {},
    DeleteUser: {},
    UpdatePassword: {},
    CreateUser: {}
};
const mockRep = {
    userRepository: {}
};
jest.mock('../../application_business_rules/use_cases/ListUsers', () => {
    return jest.fn().mockImplementation(() => {return mockUC.ListUsers()})
});
jest.mock('../../application_business_rules/use_cases/Login', () => {
    return jest.fn().mockImplementation(() => {return mockUC.Login()})
});
jest.mock('../../application_business_rules/use_cases/DeleteUser', () => {
    return jest.fn().mockImplementation(() => {return mockUC.DeleteUser()})
});
jest.mock('../../application_business_rules/use_cases/UpdateUser', () => {
    return {UpdatePassword: jest.fn().mockImplementation(() => {return mockUC.UpdatePassword()})};
});
jest.mock('../../application_business_rules/use_cases/CreateUser', () => {
    return jest.fn().mockImplementation(() => {return mockUC.CreateUser()});
});
jest.mock('../../interface_adapters/storage/UserRepositoryMySQL.js', () => {
    // return jest.fn().mockImplementation(() => {});
    return mockRep.userRepository;
});

const ctrl = require('../../interface_adapters/controllers/UserController');
const {EmailAlreadyExistError, UserNotFoundError} = require('../../utils/errors');
describe('test userController', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test findMembers success', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            mockResults = [{id: 1, name: '1', email: '1@g.com'}, {id: 2, name: '2', email: '2@g.com'}];
            mockUC.ListUsers = () => mockResults;
        await ctrl.findMembers({}, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":true,
            "data":[
               {
                  "id":1,
                  "name":"1",
                  "email":"1@g.com"
               },
               {
                  "id":2,
                  "name":"2",
                  "email":"2@g.com"
               }
            ]
         });
    });

    it('test findMembers failed with error', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            };
        mockUC.ListUsers = () => {throw new Error('error');}
        await ctrl.findMembers({}, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "message":"failed to list member",
            "errorType":"systemError",
            "errorCode":"1000"
         });
    });

    it('test login success success', async () => {
        const
            res = {
                redirect: jest.fn().mockImplementation(() => {}),
                cookie: jest.fn().mockImplementation(() => {})
            },
            mockUser = {id: 1, name: 'J', email: 'J@g.com', password: '1'},
            req = {
                data: {email: mockUser.email, password: mockUser.password},
                session: {}
            };
        mockUC.Login = () => {return mockUser};
        await ctrl.login(req, res);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect.mock.calls[0][0]).toEqual('/chat');
        expect(res.cookie).toHaveBeenCalledTimes(2);
        expect(res.cookie.mock.calls[0][0]).toEqual('name');
        expect(res.cookie.mock.calls[0][1]).toEqual(mockUser.name);
        expect(res.cookie.mock.calls[1][0]).toEqual('id');
        expect(res.cookie.mock.calls[1][1]).toEqual(mockUser.id);
        expect(req.session).toEqual({user: {id: mockUser.id, name: mockUser.name}});
    });

    it('test login failed', async () => {
        const
            res = {
                redirect: jest.fn().mockImplementation(() => {})
            },
            mockUser = {id: 1, name: 'J', email: 'J@g.com', password: '1'},
            req = {
                data: {email: mockUser.email, password: mockUser.password},
            };
        mockUC.Login = () => {throw new Error('error')};
        await ctrl.login(req, res);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect.mock.calls[0][0]).toEqual('/login');
    });

    it('test logout', async () => {
        const
            res = {
                redirect: jest.fn().mockImplementation(() => {}),
                clearCookie: jest.fn().mockImplementation(() => {})
            },
            req = {
                session: {
                    destroy: jest.fn().mockImplementation(() => {})
                }
            };
        mockUC.Login = () => {throw new Error('error')};
        await ctrl.logout(req, res);

        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect.mock.calls[0][0]).toEqual('/login');
        expect(res.clearCookie).toHaveBeenCalledTimes(2);
        expect(res.clearCookie.mock.calls[0][0]).toEqual('name');
        expect(res.clearCookie.mock.calls[1][0]).toEqual('id');
        expect(req.session.destroy).toHaveBeenCalledTimes(1)
    });

    it('test deleteUser success', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            userID = 1,
            req = {
                data: {id: userID}
            };

        mockUC.DeleteUser = () => {};
        await ctrl.deleteUser(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":true,
            "data": {}
         });
    });

    it('test deleteUser failed', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            userID = 1,
            req = {
                data: {id: userID}
            };

        mockUC.DeleteUser = () => {throw new Error('error')};
        await ctrl.deleteUser(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "errorCode": "1000",
            "errorType": "systemError",
            "message": "failed to delete user"
         });
    });

    it('test update user password success', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            userID = 1,
            password = '1',
            req = {
                data: {id: userID, password}
            };

        mockUC.UpdatePassword = () => {};
        await ctrl.updateUser(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":true,
            "data": {}
         });
    });

    it('test update user password failed', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            userID = 1,
            password = '1',
            req = {
                data: {id: userID, password}
            };

        mockUC.UpdatePassword = () => {throw new Error('error')};
        await ctrl.updateUser(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "errorCode": "1000",
            "errorType": "systemError",
            "message": "failed to update user"
         });
    });

    it('test update user password failed with user not found', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            userID = 1,
            password = '1',
            req = {
                data: {id: userID, password}
            };

        mockUC.UpdatePassword = () => {throw new UserNotFoundError()};
        await ctrl.updateUser(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "errorCode": "3003",
            "errorType": "userNotFoundError",
            "message": "user not found"
         });
    });

    it('test register user success', async () => {
        const
            res = {
                redirect: jest.fn().mockImplementation((_1) => {})
            },
            password = '1',
            name = 'J',
            email = 'J@g.com',
            req = {
                data: {name, password, email}
            };

        mockUC.CreateUser = () => {};
        await ctrl.register(req, res);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect.mock.calls[0][0]).toEqual('/login');
    });

        it('test register user failed', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            password = '1',
            name = 'J',
            email = 'J@g.com',
            req = {
                data: {name, password, email}
            };

        mockUC.CreateUser = () => {throw new Error('error')};
        await ctrl.register(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "errorCode": "1000",
            "errorType": "systemError",
            "message": "failed to register"
         });
    });

    it('test register user failed with email exist', async () => {
        const
            res = {
                json: jest.fn().mockImplementation((_1) => {})
            },
            password = '1',
            name = 'J',
            email = 'J@g.com',
            req = {
                data: {name, password, email}
            };

        mockUC.CreateUser = () => {throw new EmailAlreadyExistError()};
        await ctrl.register(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json.mock.calls[0][0]).toEqual({
            "success":false,
            "errorCode": "3002",
            "errorType": "duplicatedEmailError",
            "message": "duplicated email"
         });
    });

    it('test get user by id', async () => {
        const userID = 1;
        mockRep.userRepository.getUser = jest.fn().mockImplementation(() => {return {id: userID}});
        const result = await ctrl.getUserByID(userID);
        expect(mockRep.userRepository.getUser).toHaveBeenCalledTimes(1);
        expect(mockRep.userRepository.getUser.mock.calls[0][0]).toEqual({id: userID});
        expect(result).toEqual({id: userID});
        
    });
});