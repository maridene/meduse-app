const notifiedUsers = require('./notifiedUsers.model');

module.exports = {
    getAllNotifiedUsers
};


function getAllNotifiedUsers() {
    return new Promise((resolve, reject) => {
        notifiedUsers.getAll()
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}