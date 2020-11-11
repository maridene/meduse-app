const sql = require("../model/db.js");
const tables = require("../config/db.tables.js");

//constructor
const Coupon = function(coupon) {
    this.id = coupon.id;
    this.client_id = coupon.client_id;
    this.code = coupon.code;
    this.value = coupon.value;
    this.creation_date = coupon.creation_date;
}

Coupon.findByUserIdAvailable = (userId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.COUPONS} WHERE client_id = ${userId} AND status = 0`,
        (err, res) => {
            if(err) {
                console.log("error retrieving coupons: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("[Coupon.findByUserIdAvailable]: found available coupons: \n", res.length);
                    resolve(res);
                } else {
                    console.log(`no available coupon found for user with id = ${userId}`);
                    resolve([]);
                }
            }
        })
    });
}

Coupon.findByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.COUPONS} WHERE client_id = ${userId}`,
        (err, res) => {
            if(err) {
                console.log("error retrieving coupon: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log(`[Coupon.findByUserId]: found coupons for userId ${userId} ${res.length}`);
                    resolve(res);
                } else {
                    console.log(`no coupon found for user with id = ${userId}`);
                    resolve([]);
                }
            }
        })
    });
}

Coupon.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.COUPONS} WHERE id = ${id}`,
        (err, res) => {
            if(err) {
                console.log("error retrieving coupon: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found coupon: \n", res);
                    resolve(res[0]);
                } else {
                    console.log(`no coupon found with id = ${id}`);
                    resolve([]);
                }
            }
        })
    });
}

Coupon.findByCode = (code) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.COUPONS} WHERE code = '${code}'`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
            if (res.length) {
                console.log("found coupon: ", res);
                resolve(res[0]);
            } else {
                console.log(`no coupon found with code = ${code}`);
                resolve();
            }
        }
      });
    });
};

Coupon.findByCodeAvailable = (code) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.COUPONS} WHERE code = '${code}' AND status = 0`, 
        (err, res) => {
            if (err) {
                console.error("error: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found coupon: ", res);
                    resolve(res[0]);
                } else {
                    console.log(`no coupon found with code = ${code}`);
                    resolve();
                }
            }
        });
    });
};

Coupon.create = (newCoupon) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.COUPONS} SET ?`,  newCoupon, (err, res) => {
            if (err) {
            console.log("error: ", err);
            reject(err);
            } else {
            console.log("created coupon: ", { id: res.insertId, ...newCoupon });
            resolve({ id: res.insertId, ...newCoupon });
            }
        });
    });
};

Coupon.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.COUPONS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
            // not found address with the id
            reject({ kind: "not_found" });
            }
        
            console.log("deleted coupon with id: ", id);
            resolve(res);
        });
    });
};

  module.exports = Coupon;