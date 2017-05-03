var db = require('../db.js');
var crypto = require('crypto');
var session = require('express-session')

var User = function(data) {
    this.data = data;
}

User.prototype.data = {};

/* Update an existing user */
User.prototype.save = function(callback) {
    var self = this; // Give query scope of user object
    db.query('UPDATE Users SET email = ?, firstname = ?, lastname = ? WHERE id = ?',
             [self.email, self.firstname, self.lastname], function(err, results, fields) {
                if (err)
                     callback(err.code);
                 callback(null, self); 
             }
    );
}

/* Authenticate the provided credentials */
User.authenticate = function(email, password, callback) {
    User.findByEmail(email, function(err, user) {
        if (err)
            callback(err)
        db.query('SELECT password, salt FROM Users WHERE email ='+db.escape(email), function(err, results, fields) {
            if (err)
                callback(err.code)
            if (results.length < 1)
                callback('user not found')
            console.log(results);
            var hash = sha512(password, results[0].salt);
            if (hash.value != results[0].password)
                callback('invalid password')
            User.findByEmail(email, function(err, user) {
                callback(null, user);
            });
        });
    });
}

/* Create a new user */
User.create = function(email, password, firstname, lastname, callback) {
    var hash = sha512(password, genSalt(16));
    db.query('INSERT INTO Users (email, password, salt, firstname, lastname) VALUES(?, ?, ?, ?, ?)', 
        [email, hash.value, hash.salt, firstname, lastname], function(err, results, fields) {
            if (err)
                callback(err.code);
            User.findByEmail(email, function(err, user) {
                callback(null, user);
            });
        });
}

/* Retreieve user by their id */
User.findById = function(id, callback) {
    db.query('SELECT id, email, firstname, lastname FROM Users WHERE id = '+db.escape(id), function (err, results, fields) {
        if (err)
            callback(err.code);
        if (results.length < 1)
            callback('NOT_FOUND');
        callback(null, new User(results[0].id, results[0].email, results[0].firstname, results[0].lastname));
    });
}

/* Retreieve user by their email */
User.findByEmail = function(email, callback) {
    db.query('SELECT id, email, firstname, lastname FROM Users WHERE email = '+db.escape(email), function (err, results, fields) {
        if (err)
            callback(err);
        callback(null, new User(id, email, firstname, lastname));
    });
}


/* Generate salt with specified length*/
var genSalt = function(length) {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);  
}

var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return {
        salt: salt,
        value: hash.digest('hex')
    }
}

module.exports = User;
