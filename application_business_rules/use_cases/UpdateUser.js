const User = require('../../enterprise_business_rules/entities/User');
const {md5Password} = require('../../utils/util');
const {UserNotFoundError} = require('../../utils/errors');

async function updatePassword(id, password, {userRepository}) {
    const user = await userRepository.getUser({id});
    if (Object.isEmpty(user)) {
        throw new UserNotFoundError();
    }

    password = md5Password(password);
    await userRepository.updateUserByID(id, {password});
};

module.exports = {
    UpdatePassword: updatePassword
};