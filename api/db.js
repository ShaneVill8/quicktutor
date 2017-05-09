var mysql = require('mysql');

var db = {};
// Database connection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'qt',
    password : 'qt',
    database : 'quicktutor'
});

module.exports = db;


