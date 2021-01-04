const sql = require("../model/db.js");
const tables = require("../config/db.tables.js");


// constructor
const NotifiedUsers = function(notifiedUsers) {
    this.id = notifiedUsers.id;
    this.email = notifiedUsers.email;
};
  
NotifiedUsers.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ADMIN_NOTIFICATIONS}`, (err, res) => {
            if (err) {
                console.error("[NotifiedUsers.getAll]: ", err);
                reject(err);
            }
            resolve(res);
        });
    });
};
  
module.exports = NotifiedUsers;