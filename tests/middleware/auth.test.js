require('../globalSetup');
const mockUser = {name: 't', password: '1', email: 'j@g.com', id: 1};
jest.mock('../../interface_adapters/controllers/UserController', () => {
    return {
        getUserByID: jest.fn().mockImplementation((_) => {return mockUser})
    };
});
const ctrl = require('../../interface_adapters/controllers/UserController');
const auth = require('../../frameworks_drivers/webserver/middlewares/auth');

describe('test auth with bypass path', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    });

    it('test', async () => {
        const
            req = {
                path: '/user/login'
            },
            res = {},
            next = jest.fn().mockImplementation(() => {});
        await auth(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('test auth success by session', async () => {
        const
            req = {
                path: '/user/updateUserByID',
                session: {
                    user: {
                        id: 1
                    }
                }
            },
            res = {redirect: jest.fn().mockImplementation(() => {})},
            next = jest.fn().mockImplementation(() => {});
        await auth(req, res, next);
        expect(ctrl.getUserByID).toHaveBeenCalledTimes(1);
        expect(ctrl.getUserByID.mock.calls[0][0]).toEqual(req.session.user.id);
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('test auth failed with user not found', async () => {
        const
            req = {
                path: '/user/updateUserByID',
                session: {
                    user: {
                        id: 1
                    }
                }
            },
            res = {redirect: jest.fn().mockImplementation(() => {})},
            next = jest.fn().mockImplementation(() => {});
        ctrl.getUserByID = jest.fn().mockImplementation(() => null);
        await auth(req, res, next);
        expect(ctrl.getUserByID).toHaveBeenCalledTimes(1);
        expect(ctrl.getUserByID.mock.calls[0][0]).toEqual(req.session.user.id);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect.mock.calls[0][0]).toEqual('/login');
    });
});