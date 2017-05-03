var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
//var flash = require('connect-flash');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//var passport = require('passport');

// Session Storage connection
var sessionStore = new MySQLStore({
    host     : 'localhost',
    user     : 'qt',
    password : 'qt',
    database : 'quicktutor_session'
});

var routes = require('./routes/index');

// Init App
var app = express();

// Body Parser Middelware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser);

// Express Session
app.use(session({
    secret: 'my-secret-key',
    saveUninitialized: false, 
    resave: true
}));

//@TODO Explore passport
// Init Passport
//app.use(passport.initialize());
//app.use(passport.session());

// Express Validator
/*app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));*/

//@TODO Explore flash
//app.use(flash());

// Globals
/*app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});*/

app.use('/', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});
