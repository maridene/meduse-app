const sql = require("../model/db.js");
const tables = require('../config/db.tables.js');

// constructor
const User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.email = user.email;
  this.phone = user.phone;
  this.role = user.role;
  this.password = user.password;
  this.creationDate = user.creationDate;
};

User.create = (newUser) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    newUser.creationDate = date;
    sql.query(`INSERT INTO ${tables.USERS} SET ?`,  newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("created user: ", { id: res.insertId, ...newUser });
        resolve({ id: res.insertId, ...newUser });
      }
    });
  });
};

User.findById = (userId, result) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE id = ${userId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else if (res.length) {
        console.log("found user: ", res[0]);
        resolve(res[0]);
      } else {
        // not found user with the id
        reject({ kind: "not_found" });
      }      
    });
  });
  
};

User.getAll = result => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("users: ", res);
        resolve(res);
      }
    });
  });
};

User.updateById = (id, user, result) => {
  const updateQuery = `UPDATE ${tables.USERS}  SET ` +
  "name = ?, " +
  "email = ?, " +
  "phone = ?, " +
  "role = ?, " + 
  "WHERE id = ?";

  return new Promise((resolve, reject) => {
    sql.query(updateQuery,
      [
        user.name,
        user.email,
        user.phone,
        user.role,
        id
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else if (res.affectedRows == 0) {
          // not found user with the id
          reject({ kind: "not_found" });
        } else {
          console.log("updated user: ", { id: id, ...user });
          resolve({ id: id, ...user });
        }
      }
    );
  });
};

User.remove = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(`DELETE FROM ${tables.USERS}  WHERE id = ?`, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }
  
      if (res.affectedRows == 0) {
        // not found user with the id
        reject({ kind: "not_found" });
      }
  
      console.log("deleted user with id: ", id);
      resolve(res);
    });
  });
};

User.removeAll = result => {
  return new Promise((resolve, reject) => {
    sql.query(`DELETE FROM ${tables.USERS} `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }
  
      console.log(`deleted ${res.affectedRows} users`);
      resolve(res);
    });
  });
};

User.findByEmail =  (email) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}  WHERE email = '${email}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        resolve(res[0]);
      }
  
      reject({error: {kind: "not_found"}});
    });
  });
};

module.exports = User;