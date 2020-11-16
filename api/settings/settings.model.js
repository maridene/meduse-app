const sql = require("../model/db.js");
const tables = require('../config/db.tables.js');

// constructor
const Settings = function(data) {
  this.id = data.id;
  this.label = data.label;
  this.value = data.value;
};

Settings.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.SETTINGS}`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Settings.getByType = (type) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.SETTINGS} WHERE type = '${type}'`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Settings.getByLabel = (label) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.SETTINGS} WHERE label = '${label}'`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.length) {
                    console.log(`[Settings.getByLabel]: found with settings with label: ${label}`);
                    resolve(res[0]);
                } else {
                    console.log(`[Settings.getByLabel]: no settings found with label: ${label}`);
                    resolve();
                }
            }
        });
    });
};

Settings.updateByLabel = (label, value) => {
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE ${tables.SETTINGS} SET value = '${value}' WHERE label = '${label}'`, (err, res) => {
            if (err) {
                console.log('[Settings.updateByLabel]: error while updating settings entry with label = ', label);
                reject(err);
            } 
            if (res.affectedRows == 0) {
                // not found blog with the label
                reject();
            }
    
            console.log("updated settings: ", { label, value });
            resolve({ label, value });
        });
    });
};

module.exports = Settings;