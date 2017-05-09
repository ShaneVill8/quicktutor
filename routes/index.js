var express = require('express');
var Joi = require('joi');
var validationSchemas = require('./validation');
var User = require('../models/user');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    if (req.session)
        res.write("Session: "+JSON.stringify(req.session)+"\n");
    else
        res.write("No session exists");
    res.write("GET / -> index\n");
    res.statusCode = 200;
    res.end();
});


/* POST /users/new
 * Create a new user
 * ARGS:
 *  1. email
 *  2. password
 *  3. firstname
 *  4. lastname
 */
router.post('/users/new', function(req, res) {
    Joi.validate({
        email: req.body.email, 
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }, validationSchemas.newuser, function(err, value) {
        if (err) {
            console.log(err);
            res.statusCode = 400;
            res.end();
        }
        else {
            User.create(req.body.email, req.body.password, req.body.firstname, req.body.lastname, function(err, user) {
                if (err) {
                    console.log(err);
                    res.statusCode = 400;
                    res.end();
                }
                else {
                    res.write('POST /users/new -> User {id:'+user.id+', email:'+user.email+', firstname:'+user.firstname+', lastname:'+user.lastname+'}');
                    res.statusCode = 200;
                    res.end();
                }
            });
        }
    });
});

/* POST /users/delete
 * Delete a specified user
 * ARGS:
 *  1. email
 *  2. password
 */
router.post('/users/delete', function(req, res) {
    Joi.validate({
        email: req.body.email,
        password: req.body.password
    }, validationSchemas.login, function(err, value) {
        if (err) {
            console.log(err);
            res.statusCode = 400;
            res.end();
        }
        else {
            User.authenticate(req.body.email, req.body.password, function(err, user) {
                if (err) {
                    console.log(err);
                    res.statusCode = 400;
                    res.end();
                }
                else {
                    User.delete(user.id, function(err, status) {
                        if (err) {
                            console.log(err);
                            res.statusCode = 400;
                            res.end();
                        }
                        else {
                            res.write('POST /users/new -> Succesfully deleted User');
                            res.statusCode = 200;
                            res.end();
                        }
                    });
                }
            });
        }
    });
});


/* @TEST endpoint for user actions -- uses /test/login.hml */
router.get('/users', function(req, res) {
    res.sendFile(path.resolve('test/user.html'));
});

/* POST /users/login
 * Log a user in
 * ARGS:
 *  1. email
 *  2. password
 */
router.post('/users/login', function(req, res) {
    Joi.validate({
        email: req.body.email, 
        password: req.body.password,
    }, validationSchemas.login, function(err, value) {
        if (err) {
            console.log(err);
            res.statusCode = 400;
            res.end(); 
        }
        else {
            User.authenticate(req.body.email, req.body.password, function(err, user) {
                if (err) {
                    console.log(err);
                    res.statusCode = 400;
                    res.end();
                } else {
                    req.session.user = user;
                    req.session.save(function(err) {
                        if (err)
                            console.log("Failed to save session: "+err);
                        else
                            console.log("Successfully saved session");
                    });
                    res.write('POST /users/auth -> Succesfully authenticated User');
                    res.statusCode = 200;
                    res.end();
                }
            });
        }
    });
}); 


/* POST /users/logout
 * Log a user out
 */
router.post('/users/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log("Failed to log user out:"+err);
            res.statusCode = 400;
            res.end();
        }
        else {
            res.write("POST /users/logout -> Successfully logged out User");
            res.statusCode = 200;
            res.end();
        }
    });
});

module.exports = router;
