var express = require('express');
var router = express.Router();

var beautifyDatetime = function (date_time) {
	return moment(date_time).format("MM/D/YYYY h:mm a");
}

module.exports = function() {
	
	/* GET home page. */
	router.get('/', function(req, res, next) {
		console.log("in get /");
		res.render('ncaa-demo');
		/*console.log("req.xhr: " + req.xhr);
		var db = req.connection;
		var games_list, players_list;
		console.log("in get /: " + db);

		db.query("SELECT * FROM game_info", function(err, results){
			console.log("1res render index");
	          console.log("game_info:result: " + JSON.stringify(results));
	          for (var j = 0; j < results.length; j++) {
	          	var gameDateTime = moment(results[j].date_time);
	          	results[j].game_date = gameDateTime.format("MM/D/YYYY");
	          	results[j].game_time = gameDateTime.format("h:mm a");
	          	console.log("results[j].has_box: " + results[j].has_box);
	          	if (results[j].has_box) {
	          		results[j].box_exists = "true";
	          	} else {
	          		results[j].box_exists = "false";
	          	}
	          }
	          games_list = results;
	          db.query("SELECT * FROM players ORDER BY jersey_number ASC", function(err, results1){
	          	db.query("SELECT * FROM media", function(err2, results2){
	          		console.log("res render index: " + JSON.stringify(results1));
	          		for (var b = 0; b<results1.length; b++) {
	          			results1[b].first_name = results1[b].first_name.trim();
	          			results1[b].last_name = results1[b].last_name.trim();
	          			results1[b].first_name = results1[b].first_name.replace(/-/g, "");
	          			results1[b].last_name = results1[b].last_name.replace(/-/g, "");
	          		}
	          		res.render('index', {games: games_list, players: results1, media_items: results2});
	          	});
	          });
	    });*/
	});

	return router;
}
