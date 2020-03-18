const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const {routes, RoutePaths} = require('./routes/api/user');
const feRouters = require('./routes/fe/route');
const log = require('../../utils/log');
const config = require('../../config');
const app = express();
const http = require('http').Server(app)

const constDefine = require('../../constDefine');

app.use(bodyParser.json());
app.use(cookieParser(constDefine.COOKIE_SECRET));
app.use(session({
  secret: constDefine.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false},
}));

// ejs
app.set("view engine","ejs");
app.use(express.static(path.join('./', 'views')));
app.use(morgan(':date[iso] - :req[user-id] :method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.urlencoded({ extended: false }));

const apiRouter = express.Router();
for (aRoute of routes) {
    const router = express.Router();
    const args = [aRoute.path, ...aRoute.middlewares, aRoute.handler];
    router[aRoute.method](...args);
    apiRouter.use(RoutePaths.prefix, router);
}
app.use('/api', auth, apiRouter);

const feRouter = express.Router();
for (aRoute of feRouters) {
    const args = [aRoute.path, ...aRoute.middlewares, aRoute.handler];
    feRouter[aRoute.method](...args);
    app.use('/', feRouter);
}
app.use('/', feRouter);

app.set('port', config.webServer.port || 8080);
function startServer() {
    http.listen(app.get('port'), () => {
        log.log('Express server listening on port ' + app.get('port'));
    });
}

function getHttp() {
    return http;
}

module.exports = {startServer, getHttp};
