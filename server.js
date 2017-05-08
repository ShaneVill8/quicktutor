var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

// Session Storage connection
var sessionStore = new MySQLStore({
    host     : 'localhost',
    user     : 'qt',
    password : 'qt',
    database : 'quicktutor_session'
});

// Routes file
var routes = require('./routes/index');

// Init App
var app = express();

// Body Parser Middelware
app.use(bodyParser.json());

// Express Session
app.use(session({
    secret: 'my-secret-key',
    saveUninitialized: false, 
    resave: true
}));

app.use('/', routes);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});

