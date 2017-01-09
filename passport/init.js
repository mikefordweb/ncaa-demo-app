var login = require('./login');
var signup = require('./signup');
//var User = require('../models/user');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'darby2012',
  database : 'havoc',
  port     : '3306'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('init.js: connected as id ' + connection.threadId);
});

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log("serialize user: " + JSON.stringify(user));
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        //var db = req.connection;
        console.log("deserialize user: " + JSON.stringify(user));
        connection.query("SELECT * FROM users WHERE user_id = '"+user.user_id+"'", function(err, rows){
            if (err) console.log("err: " + err);
            console.log("rows: " + rows);
            if (!rows) {
                console.log("no rows");
            }
            console.log("logged in: " + rows[0]);
            done(err, rows[0]);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}