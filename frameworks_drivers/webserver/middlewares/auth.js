const ctrl = require('../../../interface_adapters/controllers/UserController');
const log = require('../../../utils/log');
const {UserNotFoundError} = require('../../../utils/errors');
const {RoutePaths} = require('../routes/api/user');
const bypassPaths = [RoutePaths.prefix + RoutePaths.login, RoutePaths.prefix + RoutePaths.register];

async function auth (req, res, next) {
    if (bypassPaths.includes(req.path)) {
        return next();
    }

    try {
        await authBySession(req);
        next();
    } catch(e) {
        log.log('failed user authorization', e.message);
        return res.redirect('/login');
    }
}

async function authBySession(req) {
    if (!Object.isEmpty(req.session.user)) {
        const user = await ctrl.getUserByID(req.session.user.id);
        if (user !== null) {
            req.user = user;
            return;
        }
    }

    throw new Error('failed to auth by session');
}

module.exports = auth;
