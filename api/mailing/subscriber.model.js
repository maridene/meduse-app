const sql = require("../model/db.js");
const tables = require("../config/db.tables.js");

// constructor
const Subscriber = function(subscriber) {
  this.id = subscriber.id;
  this.email = subscriber.email;
};

Subscriber.subscribe = (subscriber) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.SUBSCRIBERS} SET ?`, subscriber, (err, res) => {
            if (err) {
                console.log('[Subscriber.subscribe]: duplicated subscriber');
                resolve();
            }
            resolve({ id: res.insertId, ...subscriber });
        });
    });
};

Subscriber.getById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.SUBSCRIBERS} WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                console.log("[Subscriber.findById]: no subscriber found with id: " + id);
                reject();
            }
        });
    });
}

Subscriber.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.SUBSCRIBERS} WHERE email = ${email}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                console.log("[Subscriber.findByEmail]: no subscriber found with email: " + email);
                reject();
            }
        });
    });
}

Subscriber.getAll = () => {
    const query = `SELECT * FROM meduse.${tables.SUBSCRIBERS}`;
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Subscriber.removeById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.SUBSCRIBERS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            if (res.affectedRows == 0) {
                // not found subscriber with the id
                reject();
                return;
            }
            console.log("[Subscriber.removeById]: deleted subscriber with id: ", id);
            resolve(res);
        });
    });
};

Subscriber.removeByEmail = (email) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.SUBSCRIBERS} WHERE email = ?`, email, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            if (res.affectedRows == 0) {
                // not found subscriber with the email
                reject();
                return;
            }
            console.log("[Subscriber.removeById]: deleted subscriber with email: ", email);
            resolve(res);
        });
    });

};

module.exports = Subscriber;
