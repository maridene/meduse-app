const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const users = require('./user.model');
const mailService = require('../mailing/mail.service');

sha3_256 = require('js-sha3').sha3_256;

module.exports = {
    authenticate,
    getAll,
    getClients,
    getAdmins,
    getById,
    getClientById,
    create,
    deleteUser,
    update,
    upgradeClientToPremium,
    updateClientPoints,
    search,
    getCreatedClientsByMonth,
    resetPassword
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
                } else {
                    reject();
                }
            } else {
                reject({error: result.error});
            }
        }, (err) => reject(err));
    });
}

async function resetPassword(email) {
    const user = await users.findByEmail(email);
    if (user) {
        const newGeneratedPwd = generateNewPassword();
        const newGeneratedPwdEncrypted = sha3_256(newGeneratedPwd);
        const newUserData = await users.updateById(user.id, {password: newGeneratedPwdEncrypted});
        if (newUserData) {
           mailService.sendPasswordResetMail(user.name, newGeneratedPwd, user.email);
        }
    }
}

function generateNewPassword() {
    const randomStr = (Math.random() + 1).toString(36).substring(7);
    return 'meduse-' + randomStr;
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
        users.findById(id)
        .then((user) => {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
        }, (error) => {
            reject(error);
        });
    });
}

function getClientById(id) {
    return new Promise((resolve, reject) => {
        users.findById(id)
        .then((user) => {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
        }, (error) => {
            reject(error);
        });
    });
}

function create({prefix, name, email, password, phone, phone2, mf}, role) {
    return new Promise((resolve, reject) => {
        emailAvailable(email).then((result) => {
            if (result) {
                users.create({prefix, name, email, phone, phone2, password, role, mf})
                    .then((result) => {
                        mailService.sendWelcomeMail(name, email);
                        resolve(result);
                    }, (err) => {
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

function update(id, userData) {
    return new Promise((resolve, reject) => {
        users.updateById(id, userData)
            .then((user) => {
                resolve(user);
            }, (err) => {
                reject(err);
            })
    });
}

function updateClientPoints(clientId, points) {
    return new Promise((resolve, reject) => {
        users.updateClientPoints(clientId, points)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
    });
}

function upgradeClientToPremium(id) {
    return new Promise((resolve, reject) => {
        users.upgradeClientToPremium(id)
            .then(() => {
                resolve();
            }, (error) => {
                reject(error);
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

function search(query) {
    return new Promise((resolve, reject) => {
        users
        .search(query)
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

async function getCreatedClientsByMonth(yearMonth) {
    const result = {month: yearMonth, clients: []};
    const createdUsers = await users.getCreatedClientsByMonth(yearMonth);
    if (createdUsers && createdUsers.length) {
        result.clients = createdUsers;
    }
    return result;
}
