const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const users = require('./user.model');

module.exports = {
    authenticate,
    getAll,
    getClients,
    getAdmins,
    getById,
    create,
    deleteUser,
    update
};

function authenticate({ email, password }) {
    return new Promise((resolve, reject) => {
        users.findByEmail(email).then((result) => {
            if (result && !result.error) {
                if (result.password === password) {
                    const token = jwt.sign({ sub: result.id, role: result.role }, config.secret);
                    const { password, ...userWithoutPassword } = result;
                    resolve( {
                        ...userWithoutPassword,
                        token
                    });
                }
            } else {
                reject({error: result.error});
            }
        });
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        users
        .getAll()
        .then((all) => {
            const usersWithoutPassword = all
            .map((u) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
            });
            resolve(usersWithoutPassword);
        }, (err) => {
            reject(err);
        });
    });
}

function getClients() {
    return new Promise((resolve, reject) => {
        users
        .getAllUsers()
        .then((all) => {
            const usersWithoutPassword = all
            .map((u) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
            });
            resolve(usersWithoutPassword);
        }, (err) => {
            reject(err);
        });
    });
}

function getAdmins() {
    return new Promise((resolve, reject) => {
        users
        .getAllAdmins()
        .then((all) => {
            const usersWithoutPassword = all
            .map((u) => {
                const { password, ...userWithoutPassword } = u;
                return userWithoutPassword;
            });
            resolve(usersWithoutPassword);
        }, (err) => {
            reject(err);
        });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        const user = users.findById(id)
        .then((user) => {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
        }, (error) => {
            reject(error);
        });
    });
}

function create({prefix, name, email, password, phone}, role) {
    return new Promise((resolve, reject) => {
        emailAvailable(email).then((result) => {
            console.log('emailAvailable:', result);
            if (result) {
                users.create({prefix, name, email, phone, password, role})
                    .then((result) => {
                        console.log('result create', result);
                        resolve(result);
                    }, (err) => {
                        console.log('err', err);
                        reject(err);
                    })
            } else {
                reject({kind: 'email_not_available'});
            }
        }, (err) => {
            reject(err);
        })
    });
}

function deleteUser(id) {
    return new Promise((resolve, reject) => {
        users.remove(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function update() {
    return new Promise((resolve, reject) => {
        users.updateById(id)
            .then((user) => {
                resolve(user);
            }, (err) => {
                reject(err);
            })
    });
}

function emailAvailable(email) {
    return new Promise((resolve, reject) => {
        users.findByEmail(email)
        .then((user) => {
            resolve(false);
        }, (err) => {
            if (err.error.kind && err.error.kind === "not_found") {
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
}