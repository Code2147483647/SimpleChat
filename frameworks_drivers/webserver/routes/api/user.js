const ctrl = require('../../../../interface_adapters/controllers/UserController');
const validator = require('is-my-json-valid');
const {ERROR_TYPE, getFailedResult, getValidatorErrorResult} = require('../../../../utils/jsonResult');
const {FIELD_PATTERN} = require('../../../../constDefine');

function deleteValidator(req, res, next) {
    const data = {
        id: !isNaN(req.params.id) && req.params.id.toNumber() || null
    };

    const schema = {
        type: 'object',
        properties: {
            id: {type: 'integer', minimum: 2}
        },
        required: ['id']
    };

    const validate = validator(schema);
    if (!validate(data)) {
        return res.json(getValidatorErrorResult(validate.errors));
    }

    req.data = data;
    next();
}

function updateValidator(req, res, next) {
    const data = {
        password: req.body.password,
        id: !isNaN(req.params.id) && req.params.id.toNumber() || null
    };

    const schema = {
        type: 'object',
        properties: {
            password: {type: 'string', pattern: FIELD_PATTERN.PASSWORD},
            id: {type: 'integer', minimum: 2}
        },
        required: ['password', 'id']
    };

    const validate = validator(schema);
    if (!validate(data)) {
        return res.json(getValidatorErrorResult(validate.errors));
    }

    req.data = data;
    next();
}

function registerValidator(req, res, next) {
    const data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
    };

    const schema = {
        type: 'object',
        properties: {
            email: { type: 'string', pattern: FIELD_PATTERN.EMAIL},
            password: {type: 'string', pattern: FIELD_PATTERN.PASSWORD},
            name: {type: 'string', pattern: FIELD_PATTERN.NAME}
        },
        required: ['email', 'password', 'name']
    };

    const validate = validator(schema);
    if (!validate(data)) {
        return res.json(getValidatorErrorResult(validate.errors));
    }

    req.data = data;
    next();
}

function loginValidator(req, res, next) {
    const data = {
        email: req.body.email,
        password: req.body.password
    };

    const schema = {
        type: 'object',
        properties: {
            email: { type: 'string', pattern: FIELD_PATTERN.EMAIL},
            password: {type: 'string', pattern: FIELD_PATTERN.PASSWORD}
        },
        required: ['email', 'password']
    };

    const validate = validator(schema);
    if (!validate(data)) {
        return res.json(getValidatorErrorResult(validate.errors));
    }

    req.data = data;
    next();
}

function isAdmin(req, res, next) {
    if (!req.user.isAdmin()) {
        return res.json(
            getFailedResult('member cant do this operation', ERROR_TYPE.user.permissionDenied)
        );
    }
    next();
}

const RoutePaths = {
    prefix: '/user',
    listMembers: '/listMembers',
    login: '/login',
    logout: '/logout',
    register: '/register',
    updateUserByID: '/:id',
    deleteUserByID: '/:id'
};

const routes = [{
    method: 'get',
    path: RoutePaths.listMembers,
    middlewares: [isAdmin],
    handler: ctrl.findMembers
}, {
    method: 'post',
    path: RoutePaths.login,
    middlewares: [loginValidator],
    handler: ctrl.login
}, {
    method: 'get',
    path: RoutePaths.logout,
    middlewares: [],
    handler: ctrl.logout
}, {
    method: 'post',
    path: RoutePaths.register,
    middlewares: [registerValidator],
    handler: ctrl.register
}, {
    method: 'put',
    path: RoutePaths.updateUserByID,
    middlewares: [isAdmin, updateValidator],
    handler: ctrl.updateUser
}, {
    method: 'delete',
    path: RoutePaths.deleteUserByID,
    middlewares: [isAdmin, deleteValidator],
    handler: ctrl.deleteUser
}];

module.exports = {
    routes,
    RoutePaths
};
