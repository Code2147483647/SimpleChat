const User = require('../../enterprise_business_rules/entities/User');
const {InvalidTypeError} = require('../../utils/errors');

async function listUsers(role, {userRepository}) {
    if (!User.checkRole(role)) {
        throw new InvalidTypeError('role');
    }
    return await userRepository.getUsers({role});
};

module.exports = listUsers;
