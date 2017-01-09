var LocalStrategy   = require('passport-local').Strategy;
//var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            console.log("in login route")
            var db = req.connection;

            db.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, results){ 
                // In case of any error, return using the done method
                console.log("got username: " + username);
                if (err) {
                    console.log("return err: " + err);
                    return done(err);
                }
                // Username does not exist, log the error and redirect back
                if (results.length == 0){
                    console.log("User Not Found with username "+username);
                    return done(null, false, req.flash('message', 'User Not found.'));                 
                }
                // User exists but wrong password, log the error 
                if (!isValidPassword(results[0], password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }
                // User and password both match, return user from done method
                // which will be treated like success
                console.log("returning success login");
                return done(null, results[0]);
            });
        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}