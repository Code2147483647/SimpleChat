class UserRepository {
    constructor() {
    }

    // return user list <model.user> by cond
    async getUsers(cond) {}

    // update user by id
    async updateUserByID(user) {}

    // delete user by ID
    async deleteUserByID(userID) {}

    // create user input <model.user>
    async createUser(user) {}
}

// interface for UserRepository
module.exports = UserRepository;
