const Sequelize = require('sequelize');
const config = require('../../config');
const Op = Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

const options = {
    dialect: 'mysql',
    host: config.mysql.host,
    port: config.mysql.port,
    pool: {
        idle: 30000,
    },
    define: {
        timestamps: false
    },
    operatorsAliases,
    logging: false
};

const mysql = config.mysql;
const dbInstance = new Sequelize(mysql.database, mysql.user, mysql.password, options);

// initial
const db = {
    // import users models
    users: dbInstance.import(__dirname + '/models/users'),
    dbInstance,
    Sequelize
};

db.testConnection = async () => {
    try {
        await db.dbInstance.authenticate();
        console.log('success');
    } catch (e) {
        console.log('connection fail', e);
    }
};

module.exports = db;
