var LocalStrategy   = require('passport-local').Strategy;
//var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                var db = req.connection;

                db.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, results){
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    if (results.length > 0) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));   
                    } else {
                        //console.log("INSERT INTO users (username, password, email, first_name, last_name) VALUES ('" + username + "', '" + createHash(password) + "', '"+req.body.email+"','"+req.body.firstName +"', '"+req.body.lastName+"')");
                        var pwd = createHash(password);
                        var role = "admin";
                        var newUserMysql = {
                            username: username,
                            password: pwd,
                            role: role  // use the generateHash function in our user model
                        };
                        db.query("INSERT INTO users (username, password, email, first_name, last_name, role) VALUES ('" + username + "', '" + pwd + "', '"+req.body.email+"','"+req.body.firstName.toLowerCase() +"', '"+req.body.lastName.toLowerCase()+"', '"+role+"')", function(err, results){
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            } else {
                                newUserMysql.id = results.insertId
                                return done(null, newUserMysql);
                            }
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}