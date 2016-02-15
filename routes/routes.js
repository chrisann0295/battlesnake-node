var config  = require('../config.json');
var express = require('express');
var router  = express.Router();

//global snake info
var total_score = 0;

//map holds state of all running games (keys are the gameid)
var games = {};

//example game state
var game = {
  id: "example";
  state: "alive";
  coords: [[0,0]];
  score: 0;
}
games["example"] = game;

// Get the state of the snake
router.get(config.routes.state, function (req, res) {
  // Do something here to calculate the returned state

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: config.snake.taunt.state,
    state: "alive",
    coords: [[0, 0], [0, 1], [0, 2], [1, 2]],
    score: 4
  };

	//return all game states
  return res.json(games);
});

// Start
router.post(config.routes.start, function (req, res) {

  //log the game id
  console.log('Game ID:', req.body.game_id);   

  //create new game state
  games[req.body.game_id] = {
    id:req.body.game_id,
    state: "alive",
    coords: [],
    score:0;
  }

	games[req.body.game_id].width = req.body.width;
  games[req.body.game_id].height = req.body.height;
 
  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: config.snake.taunt.start
  };

  return res.json(data);
});

// Move
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move

  var gameid = req.body.game_id;
  var currState = games[gameid];

  //catch games that have ended/haven't begun
  if (currState === "null" || currState === "undefined"){
    res.status(404);
    res.end();
    return;

  }else{
  	
		var board = req.body.board;
		var turn = req.body.turn;
		var snakes = req.body.snakes;
		var food = req.body.food;




		// Response data
		var data = {
		  move: 'up', // one of: ["up", "down", "left", "right"]
		  taunt: 'What?!' || config.snake.taunt.move
		};

		return res.json(data);
  }
});

// End the session
router.post(config.routes.end, function (req, res) {
 
  var gameid = req.body.game_id;
  //update global score
  total_score += games[gameid].score;
  //delete game state from map
  games[gameid] = null;

  // We don't need a response so just send back a 200
  res.status(200);
  res.end();
  return;
});


module.exports = router;
