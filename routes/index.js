var express = require('express');
var router = express.Router();

module.exports = function() {
	
	/* GET home page. */
	router.get('/', function(req, res, next) {
		console.log("in get /");
		res.render('ncaa-demo');
	});

	return router;
}
