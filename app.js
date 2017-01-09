var express = require('express');
//var port     = process.env.PORT || 3000;
var port = 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var exphbs  = require('express-handlebars');
var exphbs = require('hbs');
var mysql = require('mysql');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs');

var app = express();

    exphbs.registerHelper('dateItem', function(whichItem, date_time) {
        var new_date = moment(date_time);

        switch (whichItem) {
            case "day":
                return new_date.format('DD');
            case "year":
                return new_date.format('YYYY');
            case "month":
                return new_date.format('MMM');
            case "time":
                return new_date.format('h:mm a');
        }
    });

exphbs.registerHelper('ifCond', function (v1, operator, v2, options) {
            //console.log("in ifCond");
            switch (operator)
            {
                case "==":
                    return (v1==v2)?options.fn(this):options.inverse(this);

                case "!=":
                    return (v1!=v2)?options.fn(this):options.inverse(this);

                case "===":
                    return (v1===v2)?options.fn(this):options.inverse(this);

                case "!==":
                    return (v1!==v2)?options.fn(this):options.inverse(this);

                case "&&":
                    return (v1&&v2)?options.fn(this):options.inverse(this);

                case "||":
                    return (v1||v2)?options.fn(this):options.inverse(this);

                case "<":
                    return (v1<v2)?options.fn(this):options.inverse(this);

                case "<=":
                    return (v1<=v2)?options.fn(this):options.inverse(this);

                case ">":
                    return (v1>v2)?options.fn(this):options.inverse(this);

                case ">=":
                 return (v1>=v2)?options.fn(this):options.inverse(this);

                default:
                    return eval(""+v1+operator+v2)?options.fn(this):options.inverse(this);
            }
        }
);

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

  console.log('app:connected as id ' + connection.threadId);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
exphbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

var done = false;
app.use(multer({ dest: './public/img/uploads/',
  rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
    //routes.upload_game(file);
  }
}));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.connection = connection;
    next();
});

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
