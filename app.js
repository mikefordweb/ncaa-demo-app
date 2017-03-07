var express = require('express');
//var port     = process.env.PORT || 3000;
var port = 3000;
var path = require('path');
var exphbs = require('hbs');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
exphbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(path.join(__dirname, '/public')));

var routes = require('./routes/index')();
app.use('/', routes);

module.exports = app;
