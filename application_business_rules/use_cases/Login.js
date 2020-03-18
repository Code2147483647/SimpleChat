const {md5Password} = require('../../utils/util');
const {LoginError} = require('../../utils/errors');

async function login(email, password, {userRepository}) {
    password = md5Password(password);
    const user = await userRepository.getUser({email, password});
    if (user === null) {
        throw new LoginError();
    }

    return user;
};

module.exports = login;
