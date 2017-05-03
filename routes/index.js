var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
    res.write("GET / -> index");
    res.statusCode = 200;
    res.end();
});

router.post('/users/new', function(req, res) {
    User.create(req.body.email, req.body.password, req.body.firstname, req.body.lastname, function(err, user) {
        if (err) {
            res.write(err.code);
            res.statusCode = 400;
        }
        else {
            res.write('POST /users/new -> User {id:'+user.id+', email:'+user.email+', firstname:'+user.firstname+', lastname:'+user.lastname+'}');
            res.statusCode = 200;
        }
        res.end();
    });
});

router.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.write(err.code);
            res.statusCode = 400;
        }
        else {
            res.write('GET /users/'+req.params.id+' -> User {id:'+user.id+', email:'+user.email+', firstname:'+user.firstname+', lastname:'+user.lastname+'}');
            res.statusCode = 200;
        }
        res.end();
 
    });
});  

router.post('/users/auth', function(req, res) {
    User.authenticate(req.body.email, req.body.password, function(err, user) {
        if (err) {
            res.write(err.code);
            res.statusCode = 400;
        } else {
            res.write('POST /users/auth -> SUCCESS: User {id:'+user.id+', email:'+user.email+', firstname:'+user.firstname+', lastname:'+user.lastname+'}');
            res.statusCode = 200;
        }
        res.end(); 
    });
});

module.exports = router;
