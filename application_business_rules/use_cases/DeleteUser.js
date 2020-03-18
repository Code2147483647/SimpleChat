const {UserNotFoundError} = require('../../utils/errors');

async function deleteUserByID(id, {userRepository}) {
    const user = await userRepository.getUser({id});
    if (Object.isEmpty(user)) {
        throw new UserNotFoundError();
    }

    return await userRepository.deleteUserByID(id);
};

module.exports = deleteUserByID;
