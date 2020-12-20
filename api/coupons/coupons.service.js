
const coupons = require('./coupons.model');
const userService = require('./../users/user.service');
const DEFAULT_POINTS = 3000;

module.exports = {
    getById,
    getMyCoupons,
    checkCoupon,
    getAcoupon,
    deleteCoupon,
    updateCouponStatus
};

function getById(id) {
    return new Promise((resolve, reject) => {
        coupons.findById(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function getMyCoupons(userId) {
    return new Promise((resolve, reject) => {
        coupons.findByUserIdAvailable(userId)
            .then((result) => {
                console.log('found ' + result.length + ' coupons for user with id = ' + userId);
                resolve(result);
            }, (error) => {
                console.error('error while retrieving coupons for user with id = ', id);
                reject(error);
            })
    });
}

function checkCoupon(couponCode) {
    return new Promise((resolve, reject) => {
        coupons.findByCodeAvailable(couponCode)
            .then((coupon) => {
                if (coupon) {
                    resolve(coupon);
                } else {
                    console.log('coupon not valid');
                    reject();
                }
            }, (error) => {
                console.error('error while checking coupon valididty');
                reject(error);
            })
    });
}

function getAcoupon(userId) {
    return new Promise((resolve, reject) => {
        userService.getById(userId)
            .then((user) => {
                if (user) {
                    if (user.points >= DEFAULT_POINTS) {
                        generateCoupon(userId)
                            .then((coupon) => {
                                const newPoints = user.points - DEFAULT_POINTS;
                                userService.updateClientPoints(user.id, newPoints)
                                    .then(() => {
                                        resolve(coupon);
                                    }, (error) => reject(error))
                            }, (error) => {
                                console.error('error while creating coupon for user with id = : ', userId);
                                reject(error);
                            });
                    } else {
                        console.error('no enough points to create coupon for user: ', userId);
                        reject();
                    }
                } else {
                    console.log('no user found with id = ', userId);
                    reject();
                }
            }, (error) => {
                console.error('error while retrieving user to generate coupon');
                reject(error);
            });
    });

}

function generateCoupon(userId) {
    const DEFAULT_REDUCTION = '30%';
    const coupon = {
        code: makeCode(),
        value: DEFAULT_REDUCTION,
        client_id: userId,
        creation_date: new Date()
    };
    return new Promise((resolve, reject) => {
        coupons.create(coupon)
            .then((result) => {
                resolve(result);
            }, (err) => {
                console.error('error while creating coupon');
                reject(err);
            })
    });
}

function makePart(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function makeCode() {
     return `MEDUSE-${makePart(4)}-${makePart(4)}-${makePart(4)}`;
 }

 function deleteCoupon(couponId) {
    return new Promise((resolve, reject) => {
        coupons.remove(couponId)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
 }

function updateCouponStatus(id, newStatus) {
    return new Promise((resolve, reject) => {
        coupons.updateStatus(id, newStatus)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
} 
