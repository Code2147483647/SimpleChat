function Users (sequelizeInstance, SequelizeType) {
    const Users = sequelizeInstance.define('users', {
        id: {
            type: SequelizeType.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: SequelizeType.STRING(50),
            allowNull: false
        },
        email: {
            type: SequelizeType.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: SequelizeType.STRING(64),
            allowNull: false
        },
        role: {
            type: SequelizeType.STRING(6),
            allowNull: false
        }
    }, {
        indexex: [{
            unique: true,
            fields: ['email']
        }]
    });

    return Users;
}

module.exports = Users;
