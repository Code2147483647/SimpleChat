const db = require('../../frameworks_drivers/db/sequelize');
const User = require('../../enterprise_business_rules/entities/User');
const log = require('../../utils/log');
const {SQLError, DuplicateEntryError} = require('../../utils/errors');

// static method for map seq obj to user entity
const Mapper = {
    toUser: (seqUser) => {
        const {name, email, password, role, id} = seqUser;
        return new User(name, email, password, role, id);
    }
};

// interface form application_business_rules/repositories/UserRepository.js
class UserRepository {
    constructor() {
        this.db = db;
        this.model = db.users;
    }

    async getUsers(cond) {
        try {
            const seqUsers = await this.model.findAll({where: cond});
            return seqUsers.map((seqUser) => {
                return Mapper.toUser(seqUser);
            });
        } catch(e) {
            // log.error('failed to get users', e);
            throw new SQLError(`${e}`);
        }
    }

    async getUser(cond) {
        try {
            const seqUser = await this.model.findOne({where: cond});
            if (Object.isEmpty(seqUser)) {
                return null;
            }

            return Mapper.toUser(seqUser);
        } catch(e) {
            // log.error('failed to get user', e);
            throw new SQLError(`${e}`);
        }
    }

    async createUser(user) {
        try {
            const seqUser = await this.model.create(user);
            return Mapper.toUser(seqUser);
        } catch(e) {
            // log.error('failed to create users', e);
            if (e instanceof db.Sequelize.UniqueConstraintError) {
                throw new DuplicateEntryError();
            }
            throw new SQLError(`${e}`);
        }
    }

    async updateUserByID(id, {name, email, password, role}) {
        try {
            const affectedRows = await this.model.update({name, email, password, role}, {where: {id}});
            return affectedRows;
        } catch(e) {
            // log.error('failed to update users', e);
            throw new SQLError(`${e}`);
        }
    }

    async deleteUserByID(userID) {
        try {
            const affectedRows = await this.model.destroy({where: {id: userID}});
            return affectedRows;
        } catch(e) {
            // log.error('failed to delete users', e);
            throw new SQLError(`${e}`);
        }
    }
}

const instance = new UserRepository();
module.exports = instance;
