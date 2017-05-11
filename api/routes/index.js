var express = require('express');
var Joi = require('joi');
var validationSchemas = require('./validation');
var User = require('../models/user');
var Listing = require('../models/listing');
var router = express.Router();
var path = require('path');


validateCookie = function(req) {
    if (!req.session || !req.session.cookie || !req.session.user)
        return false;
    else if (req.session.cookie.expires < Date.now())
        return false;
    else
        return true;
}

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
                    req.session.cookie.expires = new Date(Date.now() + 60000); /*@TODO change from 1m expire time */
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


/* POST /listings/new 
 * Post a new listing. Poster must be logged in.
 * ARGS:
 *   1. Title
 *   2. Description
 *   3. Duration
 */
router.post('/listings/new', function(req, res) {
    if (!validateCookie(req)) {
        res.write("Please login first");
        res.statusCode = 400;
        res.end();
    }
    else {
        Joi.validate({
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration
        }, validationSchemas.newlisting, function(err, value) {
            if (err) {
                console.log(err);
                res.statusCode = 400;
                res.end();
            }
            else {
                Listing.create(req.session.user.id, req.body.title, req.body.description, 
                    req.body.duration, function(err, listing) {
                        if (err) {
                            console.log(err);
                            res.statusCode = 500;
                            res.end();
                        } 
                        else {
                            //req.session.listings[listing.id] = listing;
                            res.write('POST /listing/new -> Successful Listing creation'); 
                            res.statusCode = 200; 
                            res.end();
                        }

                    });
            }
        });
    }
});

/* GET /listings/(id)
 * Get details about a specified listing
 */
router.get('/listings/:id', function(req, res) {
    Listing.findById(req.params.id, function(err, listing) {
        if (err) {
            if (err == 'NOT_FOUND')
                res.statusCode = 404;
            else
                res.statusCode = 500;
            console.log(err);
            res.write(err);
            res.end();
        }
        else {
            res.write("{ 'id': "+listing.id+", 'owner': "+listing.owner+", 'title': "+listing.title+"'description': "+listing.description+", 'time': "+listing.time+", 'duration': "+listing.duration+" }");
            res.statusCode = 200;
            res.end();
        }
    });
});


/* POST /listings/(id)/delete
 * Delete a specified listing. Must be logged in as owner of the id.
 * ARGS:
 *  1. id
 */
router.delete('/listings/:id', function(req, res) {
    Listing.delete(req.params.id, function(err, status) {
        if (err) {
            if (err == 'NOT_FOUND')
                res.statusCode = 404;
            else
                res.statusCode = 500;
            console.log(err);
            res.write(err);
            res.end();
        }
        else {
            res.statusCode = 200;
            res.write("Listing "+req.params.id+" succesfully deleted");
            res.end();
        }
    });

});


/* GET /listings
 * Get all listings
 */ 
router.get('/listings', function(req, res) {
    Listing.getAll(function(err, listings) {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end();
        }
        else {
            res.write('<html><table><tr><th>ID</th><th>Owner</th><th>Title</th><th>Description</th><th>Time</th><th>Duration</th></tr>');
            for (var i = 0; i < listings.length; ++i) {
                res.write('<tr><td>'+listings[i].id+'</td><td>'+listings[i].owner+'</td><td>'+listings[i].title+'</td><td>'+listings[i].description+'</td><td>'+listings[i].time+'</td><td>'+listings[i].duration+'</td></tr>');
            }
            res.write('</tr><\html>');
            res.statusCode = 200;
            res.end();
        }        
    });
});

module.exports = router;
