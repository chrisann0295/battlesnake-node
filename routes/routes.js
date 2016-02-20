var config = require('../config.json');
var express = require('express');
var router = express.Router();
var Cell = require('../cell.js')
var Gen = require('../gen.js')

//global snake info
var total_score = 0;



//map holds state of all running games (keys are the gameid)
var games = {};

//example game state
var game = {
    id: "testing",
    state: "alive",
    coords: [
        [0, 0]
    ],
    score: 0,
    width: 0,
    height: 0
}
games["testing"] = game;

// Get the state of the snake
router.get(config.routes.state, function(req, res) {
    // Do something here to calculate the returned state

    // Response data
    var data = {
        name: config.snake.name,
        color: config.snake.color,
        head_url: config.snake.head_url,
        taunt: config.snake.taunt.state,
        games: games
    };

    //return all game states
    return res.json(data);
});

// Start
router.post(config.routes.start, function(req, res) {

    //log the game id
    console.log('Game ID:', req.body.game);
	gid = req.body.game;

    //create new game state
    games[gid] = {
        id: gid,
        state: "alive",
        coords: [],
        score: 0,
		turn: 0,
		width: req.body.width,
		height: req.body.height
    }


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
router.post(config.routes.move, function(req, res) {
    

    //find game state in hash table
    var gameid = req.body.game;
    var currState = games[gameid];

    //catch games that have ended/haven't begun
    if (currState === "null" || currState === "undefined") {
        res.status(404);
        res.end();
        return;

    } else {

 
        var turn = req.body.turn;
        var snakes = req.body.snakes;
        var food = req.body.food;
		var walls = req.body.walls;
		var gold = req.body.gold; 

		var mysnake;

        //find my snake
        for (i = 0; i < snakes.length; i++) {
            if (snakes[i].id === "a1e0221f-66e8-4f79-a125-6abdef413a9a") {
                mysnake = snakes[i];
            }
        }
		myhead = mysnake[0]

		//2d array of weights
		var W = Gen.genW(currState.height,currState.width,,snake,food,walls,gold);
		
		//2d array of distances from snake head
		var D = Gen.genD(myhead[0],myhead[1])
		console.log(arr)


        //is snake dead?
        if (mysnake.state === "dead") {
            //do what?????
			//mymove = "up"
        } else {

            //Figure out where to move
            mymove = "up";

        }



        // Response data
        var data = {
            move: mymove, // one of: ["up", "down", "left", "right"]
            taunt: 'What?!' || config.snake.taunt.move
        };

        return res.json(data);
    }
});

// End the session
router.post(config.routes.end, function(req, res) {

    var gameid = req.body.game;
    //update global score
    total_score += games[gameid].score;
    //delete game state from map
    delete games[gameid];

    // We don't need a response so just send back a 200
    res.status(200)
    return res.json({}).end();

    return;
});


module.exports = router;
