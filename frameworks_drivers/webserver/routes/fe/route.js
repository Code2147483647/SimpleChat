//views
const userController = require('../../../../interface_adapters/controllers/UserController');

function requiredLogin(req, res, next) {
    if (!Object.isEmpty(req.session.user)) {
        return next();
    }

    res.redirect('/login');
}

async function requireAdmin(req, res, next) {
    const user = await userController.getUserByID(req.session.user.id);
    if (user.isAdmin()) {
        return next();
    }

    res.redirect('/chat');
}

function rootHandler(req, res) {
    res.redirect('login');
}

function loginHandler(req, res) {
    // already login
    if (!Object.isEmpty(req.session.user)) {
        return res.redirect('/chat');
    }

    res.render('login', {page:'login',  menuId:'login'});
}

function registerHandler(req, res) {
    // already login
    if (!Object.isEmpty(req.session.user)) {
        return res.redirect('/chat');
    }

    res.render('register', {page:'register',  menuId:'register'});
}

function manageMemberHandler(req, res) {
    res.locals = {name: req.session.user.name};
    res.render('manageMember', {page:'manageMember',  menuId:'manageMember'});
}

function chatHandler(req, res) {
    const user = req.session.user;
    res.locals = {name: user.name, role: user.role};
    res.render('chat', {page:'chat',  menuId:'chat'});
}


const route = [{
    method: 'get',
    path: '/',
    middlewares: [],
    handler: rootHandler
},{
    method: 'get',
    path: '/login',
    middlewares: [],
    handler: loginHandler
}, {
    method: 'get',
    path: '/register',
    middlewares: [],
    handler: registerHandler
}, {
    method: 'get',
    path: '/manageMember',
    middlewares: [requiredLogin, requireAdmin],
    handler: manageMemberHandler
}, {
    method: 'get',
    path: '/chat',
    middlewares: [requiredLogin],
    handler: chatHandler
}];

module.exports = route;