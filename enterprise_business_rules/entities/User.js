const RoleEnum = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER'
};

class User {
    constructor(name, email, password, role, id = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role
    }

    isAdmin() {
        return RoleEnum.ADMIN === this.role;
    }

    isMember() {
        return RoleEnum.MEMBER === this.role;
    }
}

User.checkRole = (role) => {
    return Object.values(RoleEnum).includes(role);
}

module.exports = User;
module.exports.RoleEnum = RoleEnum;
