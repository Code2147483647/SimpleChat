const ListUsers = require('../../application_business_rules/use_cases/ListUsers');
const Login = require('../../application_business_rules/use_cases/Login');
const CreateUser = require('../../application_business_rules/use_cases/CreateUser');
const DeleteUser = require('../../application_business_rules/use_cases/DeleteUser');
const {UpdatePassword} = require('../../application_business_rules/use_cases/UpdateUser');
const userRepository = require('../../interface_adapters/storage/UserRepositoryMySQL');
const {RoleEnum} = require('../../enterprise_business_rules/entities/User');
const log = require('../../utils/log');
const {ERROR_TYPE, getSuccessfulResult, getFailedResult} = require('../../utils/jsonResult');
const {ErrorCode} = require('../../utils/errors');

class UserController {
    async findMembers (req, res) {
        try {
            const users = await ListUsers(RoleEnum.MEMBER, {userRepository});
            const payload = users.reduce((acc, user) => {
                acc.push({
                    id: user.id,
                    name: user.name,
                    email: user.email
                });
                return acc;
            }, []);
            return res.json(getSuccessfulResult(payload));
        } catch(e) {
            log.error('failed to list member', `${e}`);
            return res.json(getFailedResult('failed to list member', ERROR_TYPE.system.systemError));
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.data;
            const user = await Login(email, password, {userRepository});
            req.session.user = {
                id: user.id,
                name: user.name,
                role: user.role
            };

            // for ejs
            res.cookie('name', user.name);
            res.cookie('id', user.id);
            res.redirect('/chat');
        } catch(e) {
            log.error('failed to login', `${e.message}`);
            // return res.json(getFailedResult('failed to login', ERROR_TYPE.system.systemError));
            res.redirect('/login');
        }
    }

    async logout(req, res) {
        req.session.destroy();

        // remove user data
        res.clearCookie('name');
        res.clearCookie('id');
        res.redirect('/login');
    }

    async deleteUser(req, res) {
        const {id} = req.data;
        try {
            await DeleteUser(id, {userRepository});
            res.json(getSuccessfulResult({}));
        } catch(e) {
            log.error('failed tot delete user', `${e}`);
            res.json(getFailedResult('failed to delete user', ERROR_TYPE.system.systemError));
        }
    }

    async updateUser(req, res) {
        const {id, password} = req.data;
        try {
            await UpdatePassword(id, password, {userRepository})
            return res.json(getSuccessfulResult({}));
        } catch (e) {
            log.error('failed tot update user', `${e}`);
           if (e.code == ErrorCode.UserNotFoundError)  {
               return res.json(getFailedResult(e.message, ERROR_TYPE.user.userNotFoundError));
           }
           return res.json(getFailedResult('failed to update user', ERROR_TYPE.system.systemError));
        }
    }

    async register(req, res) {
        const {name, email, password} = req.data;
        try {
            await CreateUser(name, email, password, RoleEnum.MEMBER, {userRepository});
            res.redirect('/login');
        } catch(e) {
            log.error('failed to register', `${e}`);
            if (e.code == ErrorCode.DuplicateEntryError || e.code == ErrorCode.EmailAlreadyExistError) {
                return res.json(getFailedResult('duplicated email', ERROR_TYPE.user.duplicatedEmailError));
            }
            return res.json(getFailedResult('failed to register', ERROR_TYPE.system.systemError));
        }
    }

    async getUserByID(id) {
        return await userRepository.getUser({id});
    }
}


const instance = new UserController();
module.exports = instance;
