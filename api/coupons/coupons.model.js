const sql = require("../config/db.js");
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res);
                } else {
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res);
                } else {
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res[0]);
                } else {
                    resolve();
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
          reject(err);
        } else {
            if (res.length) {
                resolve(res[0]);
            } else {
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res[0]);
                } else {
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
            reject(err);
            } else {
            resolve({ id: res.insertId, ...newCoupon });
            }
        });
    });
};

Coupon.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.COUPONS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
            // not found address with the id
            reject({ kind: "not_found" });
            }
            resolve(res);
        });
    });
};

Coupon.updateStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE ${tables.COUPONS} SET status = ${status} where id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
              } else if (res.affectedRows == 0) {
                // not found coupon with the id
                reject({ kind: "not_found" });
              } else {
                resolve({ id, status });
              }
        });
    });
};

  module.exports = Coupon;