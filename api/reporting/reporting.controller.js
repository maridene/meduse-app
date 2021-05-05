const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const Role = require('helpers/role');
const constants = require("../config/constants");
fs = require('fs');
require('dotenv').config({ path: __dirname + '/.env'});

const dev = process.env.dev === '1';
const reportsPath = dev ? 'reports' : constants.REPORTS_PATH;

router.post('/', report);
router.get('/', authorize(Role.ADMIN), getReport);

module.exports = router;

async function report(req, res, next) {
    const content = req.body.content;
    const date = new Date();
    let dateString = date.toLocaleDateString().replace(/\//g,'-');
    const dateTime =  dateString + ' at ' + date.toLocaleTimeString();
    const file = reportsPath + '/' + 'client-errors' + '.log';
    let message = dateTime + '\n' + content;
    
    console.log(message);
    
    try {
        if (fs.existsSync(file)) {
            message = '\n \n ' + message; 
            fs.appendFileSync(file, message);
            console.log('Reporting service: message logged to existing File: ', file);
        } else {
            createAndWrite(file, message);
        }
      } catch(err) {
          console.log('Reporting service: error while fetching for report file');
      }

}

function createAndWrite(file, content) {
    fs.writeFile(file, content, (err) => {
        if (err) throw err;
        
        console.log('Reporting service: message logged to new File: ', file);
    });
}

async function getReport(req, res, next) {

}
