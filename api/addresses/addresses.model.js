const sql = require("../model/db.js");

//constructor
const Address = function(address) {
    this.id = address.id;
    this.userId = address.userId;
    this.name = address.name;
    this.city = address.city;
    this.state = address.state;
    this.avenue = address.avenue;
    this.description = address.description;
    this.zipcode = address.zipcode;
    this.phone = address.phone;
}

Address.getByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ADDRESSES WHERE userId = ${userId}`,
        (err, res) => {
            if(err) {
                console.log("error retrieving user adresses: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found user adresses: \n", res);
                    resolve(res);
                } else {
                    console.log(`no adress found for user with id = ${userId}`);
                    resolve([]);
                }
            }
        })
    });
}

Address.getById = (addressId) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ADDRESSES WHERE id = ${addressId}`, 
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log("found address: ", res);
            resolve(res[0]);
          } else {
            console.log(`no addess found with id = ${addressId}`);
            resolve([]);
          }
        }
      });
    });
  };

Address.add = (newAddress) => {
return new Promise((resolve, reject) => {
    sql.query("INSERT INTO ADDRESSES SET ?",  newAddress, (err, res) => {
        if (err) {
        console.log("error: ", err);
        reject(err);
        } else {
        console.log("created address: ", { id: res.insertId, ...newAddress });
        resolve({ id: res.insertId, ...newAddress });
        }
    });
    });
};

Address.remove = (adressId) => {
return new Promise((resolve, reject) => {
    sql.query("DELETE FROM ADDRESSES WHERE id = ?", adressId, (err, res) => {
        if (err) {
        console.log("error: ", err);
        reject(err);
        }
    
        if (res.affectedRows == 0) {
        // not found address with the id
        reject({ kind: "not_found" });
        }
    
        console.log("deleted address with id: ", adressId);
        resolve(res);
    });
    });
};

Address.updateById = (id, address, result) => {
const updateQuery = "UPDATE ADDRESSES SET " +
"name = ?, " +
"city = ?, " +
"state = ?, " +
"avenue = ?, " +
"description = ?, " +
"zipcode = ?, " +
"phone = ?, " +
"WHERE id = ?";

return new Promise((resolve, reject) => {
    sql.query(updateQuery,
    [
        address.name,
        address.city,
        address.state,
        address.avenue,
        address.description,
        address.zipcode,
        address.phone,
        id
    ],
    (err, res) => {
        if (err) {
        console.log("error: ", err);
        reject(err);
        } else if (res.affectedRows == 0) {
        // not found address with the id
        reject({ kind: "not_found" });
        } else {
        console.log("updated address: ", { id: id, ...address });
        resolve({ id: id, ...address });
        }
    }
    );
});
};

  module.exports = Address;