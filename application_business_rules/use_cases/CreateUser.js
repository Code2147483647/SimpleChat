const User = require('../../enterprise_business_rules/entities/User');
const {md5Password} = require('../../utils/util');
const {InvalidTypeError, EmailAlreadyExistError} = require('../../utils/errors');

async function createUser(name, email, password, role, {userRepository}) {
    // check role is valid
    if (!User.checkRole(role)) {
        throw new InvalidTypeError('role');
    }

    // check email already used
    const existedUser = await userRepository.getUser({email});
    if (existedUser) {
        throw new EmailAlreadyExistError();
    }

    password = md5Password(password);
    const user = new User(name, email, password, role);
    return await userRepository.createUser(user);
};

module.exports = createUser;
