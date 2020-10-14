const role = require("./helpers/role");



function isEmptyCredentials({email, password}) {
    return (!email || email.length <= 0) || (!password || password.length <= 0);
}

const formValid =  {
    admin: (form) => 
        !isEmptyCredentials({email: form.email, password: form.password}) && form.name && form.name.length,
    user: (form) =>
        !isEmptyCredentials({email: form.email, password: form.password}) && form.name && form.name.length
}

const isNormalInteger = (str) =>  /^\+?(0|[1-9]\d*)$/.test(str);

module.exports = {
    isEmptyCredentials,
    formValid: formValid,
    isNormalInteger
};
