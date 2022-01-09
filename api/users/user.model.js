const sql = require("../config/db.js");
const tables = require('../config/db.tables.js');

// constructor
const User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.email = user.email;
  this.phone = user.phone;
  this.phone2 = user.phone2;
  this.role = user.role;
  this.password = user.password;
  this.creationDate = user.creationDate
  this.premium = user.premium;
  this.points = user.points;
  this.mf = user.mf;
};

User.create = (newUser) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    newUser.creationDate = date;
    sql.query(`INSERT INTO ${tables.USERS} SET ?`,  newUser, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id: res.insertId, ...newUser });
      }
    });
  });
};

User.findById = (userId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE id = ${userId}`, (err, res) => {
      if (err) {
        reject(err);
      } else if (res.length) {
        resolve(res[0]);
      } else {
        // not found user with the id
        reject({ kind: "not_found" });
      }      
    });
  });
  
};

User.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE role = 'User'`, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

User.getAllAdmins = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE role = 'Admin'`, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

User.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}`, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

User.updateById = (id, user) => {
  const entries = getUpdateUserEntries(user);
  const values = getUpdateUserValues(user);
  const queryStr = `UPDATE ${tables.USERS} SET ${entries} WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    sql.query(queryStr, values,
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.affectedRows == 0) {
          // not found user with the id
          reject({ kind: "not_found" });
        } else {
          if (user.hasOwnProperty('password')){
            delete user.password;
          }
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
        reject(err);
      }
  
      if (res.affectedRows == 0) {
        // not found user with the id
        reject({ kind: "not_found" });
      }
      resolve(res);
    });
  });
};

User.removeAll = result => {
  return new Promise((resolve, reject) => {
    sql.query(`DELETE FROM ${tables.USERS} `, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

User.findUserByEmail =  (email) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}  WHERE email = '${email}' AND role ='User'`, (err, res) => {
      if (err) {
        reject({error: err});
      }
      if (res.length) {
        resolve(res[0]);
      }
      reject({error: {kind: "not_found"}});
    });
  });
};

User.findAdminByEmail =  (email) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}  WHERE email = '${email}' AND role = 'Admin'`, (err, res) => {
      if (err) {
        reject({error: err});
      }
  
      if (res.length) {
        resolve(res[0]);
      }
  
      reject({error: {kind: "not_found"}});
    });
  });
};

User.findByEmail =  (email) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS}  WHERE email = '${email}'`, (err, res) => {
      if (err) {
        reject({error: err});
      }
  
      if (res.length) {
        resolve(res[0]);
      }
  
      reject({error: {kind: "not_found"}});
    });
  });
};

User.updateClientPoints = (id, points) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE ${tables.USERS}  SET ` +
      "points = ? WHERE id = ?";
    sql.query(updateQuery,
      [
        points,
        id
      ],
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.affectedRows == 0) {
          // not found user with the id
          reject({ kind: "not_found" });
        } else {
          resolve({ id, points });
        }
      }
    );
  });
}

User.upgradeClientToPremium = (id) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE ${tables.USERS} SET premium = 1 WHERE id = ${id}`;
    sql.query(updateQuery,
      (err, res) => {
        if (err) {
          reject(err);
        } else if (res.affectedRows == 0) {
          // not found user with the id
          reject({ kind: "not_found" });
        } else {
          resolve();
        }
      }
    );
  });
}

function getUpdateUserEntries(user){
  return Object.keys(user).map((e) => `${e} = ?`).join(', ');
}

function getUpdateUserValues(user) {
  return Object.values(user);
}

User.search = (query) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE name LIKE '%${query}%'`, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

User.getCreatedClientsByMonth = (yearMonth) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.USERS} WHERE creationDate LIKE '${yearMonth}-%' AND role = 'User'`, 
    (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.length) {
          resolve(res);
        } else {
          resolve();
        }
      }
    });
  });
};

module.exports = User;
