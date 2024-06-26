const sql = require("../config/db.js");
const tables = require('../config/db.tables.js');

// constructor
const Agent = function(agent) {
  this.id = agent.id;
  this.label = agent.name;
  this.creation_date = agent.creation_date;
  this.modif_date = agent.modif_date;
};

Agent.getAll = () => {
    const query = `SELECT * FROM meduse.${tables.AGENTS}`;

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

Agent.getById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.AGENTS} WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                resolve();
            }
        });
    });
}

Agent.create = (newAgent) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.AGENTS} SET ?`, newAgent, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve({ id: res.insertId, ...newAgent });
        });
    });
};

Agent.updateById = (id, agent) => {
    const query = `UPDATE ${tables.AGENTS} SET 
    \`label\` = '${agent.name}', 
    \`description\` = '${agent.modif_date}' 
    WHERE (\`id\` = '${id}')`;
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                reject(null, err);
            }
    
            if (res.affectedRows == 0) {
                // not found Agent with the id
                reject();
            }
    
            resolve({ id: id, ...agent });
        });
    });
};

Agent.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.AGENTS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found AGENT with the id
                reject();
                return;
            }
            resolve(res);
        });
    });

};

Agent.removeAll = result => {
    sql.query(`DELETE FROM ${tables.AGENTS}`, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Agent;
