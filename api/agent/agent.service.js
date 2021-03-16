const agents = require('./agent.model');

module.exports = {
    create,
    getById,
    updateById,
    getAll,
    remove
};



function getAll() {
    return new Promise((resolve, reject) => {
        agents
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        agents
        .getById(id)
        .then((result) => {
            resolve(result);
        }, (err) => {
            reject(err);
        });
    });
}

function create(name) {
    const newAgent = {
        name,
        creation_date: new Date()
    };
    return new Promise((resolve, reject) => {
        agents.create(newAgent)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function updateById(id, name) {
    const modif_date = new Date();
    return new Promise((resolve, reject) => {
        agents.updateById(id, name, modif_date)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        agents.remove(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}
