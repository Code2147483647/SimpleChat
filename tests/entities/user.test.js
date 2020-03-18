require('sugar').extend();
const User = require('../../enterprise_business_rules/entities/User');

describe('test user entity', () => {
    it('test check role', () => {
        expect(User.checkRole('ADMIN')).toEqual(true);
        expect(User.checkRole('MEMBER')).toEqual(true);
        expect(User.checkRole('invalidRole')).toEqual(false);
    });

    it('test admin user', () => {
        const
        name = 'John',
        email = 'j@g.com',
        password = '123456',
        role = 'ADMIN',
        id = 2;
        const user = new User(name, email, password, role, id);
        expect(user.isAdmin()).toEqual(true);
        expect(user.isMember()).toEqual(false);
    })

    it('test member user', () => {
        const
        name = 'John',
        email = 'j@g.com',
        password = '123456',
        role = 'MEMBER',
        id = 2;
        const user = new User(name, email, password, role, id);
        expect(user.isMember()).toEqual(true);
        expect(user.isAdmin()).toEqual(false);
    })
});