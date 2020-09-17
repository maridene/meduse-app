const blogs = require('./blog.model');

module.exports = {
    create,
    findById,
    updateById,
    getAll,
    remove,
    removeAll
};

function getAll() {
    return new Promise((resolve, reject) => {
        blogs
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function create(newBlog) {
    return new Promise((resolve, reject) => {
        blogs.create(newBlog)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        blogs
        .findById(id)
        .then((result) => {
            resolve(result);
        }, (err) => {
            reject(err);
        });
    });
}

function updateById(id, newBlog) {
    return new Promise((resolve, reject) => {
        blogs.updateById(id, newBlog)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        blogs.remove(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function removeAll() {
    return new Promise((resolve, reject) => {
        blogs.removeAll(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}
