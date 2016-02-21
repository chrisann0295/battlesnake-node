var config = require('../config.json');
var express = require('express');
var router = express.Router();
var Cell = require('../cell.js')
var Gen = require('../gen.js')
// var moveCalculator = require('../moveCalculator')

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
    width: 30,
    height: 20
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


  // console.log(data);
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
  console.log("####################INSIDE MOVE FUNCTION.....", req.body)
    //find game state in hash table
    var gameid = req.body.game;
    var currState = games[gameid];

    //catch games that have ended/haven't begun
    if (currState === "null" || currState === "undefined") {
        // res.end();
        return  res.status(404);

    } else {
 
    var turn = req.body.turn;
    var snakes = req.body.snakes;
    var food = req.body.food;
    var walls = req.body.walls;
    var gold = req.body.gold; 

    // Board dimensions
    var boardHeight = req.body.height;
    var boardWidth = req.body.width;

    var mysnake;

    //find my snake
    for (i = 0; i < snakes.length; i++) {
        if (snakes[i].id === "a1e0221f-66e8-4f79-a125-6abdef413a9a") {
            mysnake = snakes[i];
        }
    }

    // console.log('$$$$$$$$$$ my snake is:', mysnake);

    var myHead = mysnake.coords[0];

    //is snake dead?
    if (mysnake.status === "dead") {
      res.status(404);
      return;

    } else {
      console.log('$$$$$$ wefsdmfdkjfndkjgnkjfg', games)
        // currState.height, snakes,food,walls,gold, mysnake.health)

      var weightMatrix = generateWeightMatrix(boardWidth, boardHeight, snakes,food,walls,gold, mysnake.health);
      mymove = moveCalculator(myHead[0], myHead[1], boardWidth, boardHeight, weightMatrix);

       console.log('$$$$$$ mymove is:', mymove)

    }
        // Response data
        var data = {
            move: mymove, // one of: ["up", "down", "left", "right"]
            taunt: 'What?!' || config.snake.taunt.move
        };

        return res.send(data);
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


function generateWeightMatrix (width, height, snakes, food, walls, gold, health){
  var arr = [];
  for(var x = 0; x < width; x++){
      arr[x] = [];    
      for(var y = 0; y < height; y++){ 
          arr[x][y] = 0;    
      }    
  }

  var food = (100-health)*2 
  vals = {"snake":-200, "wall":-300, "gold":100, "food":food}
  
  for(i=0; i<food.length;i++){
    coords = food[i]    
    arr[coords[0]][coords[1]] = vals['food']
  }

  for(i=0; i<snakes.length;i++){
    asnake = snakes[i]
    for(j=0; j<asnake.coords.length;j++){
      coords = asnake.coords[j]   
      arr[coords[0]][coords[1]] = vals['snake']
    }
  }



  for(i=0; i<walls.length;i++){
    coords = walls[i]   
    arr[coords[0]][coords[1]] = vals['wall']
  }


  for(i=0; i<gold.length;i++){
    coords = gold[i]    
    arr[coords[0]][coords[1]] = vals['gold']
  }

  console.log("generateWeightMatrix\n" ,arr)

  return arr

}


function moveCalculator(headX, headY, boardWidth, boardHeight, weightMatrix) {
  var directionArray = [0,0,0,0];

  console.log("$$$$$$$$$$$$$$$$$$ moveCalculator")
  var tempX
    , tempY
    , distanceMatrix;

  for(var dir = 0; dir < directionArray.length; dir++) {
    if (dir === 0) { // North
      tempX = headX;
      tempY = headY + 1;

    } else if (dir === 1) { //East
      tempX = headX + 1;
      tempY = headY;

    } else if (dir === 2) { //South
      tempX = headX;
      tempY = headY - 1;

    } else { // West
      tempX = headX - 1;
      tempY = headY;
    }
  
    distanceMatrix = generateDistanceMatrix(tempX, tempY, boardWidth, boardHeight);

  console.log("$$$$$$$$$$$$$$$$$$ distanceMatrix\n", distanceMatrix)


    for (var x = 0; x < boardWidth; x++) {
      for (var y = 0; y < boardHeight; y++) {
        directionArray[dir] = directionArray[dir] + (weightMatrix[x][y] * distanceMatrix[x][y]);
      }
    }
  }

  if (headX === 0) {
    console.log("$$$$$$$$$$$$")
    directionArray[3] = -9999999;
  } 

  if (headX === boardWidth -1) {
    console.log("$$$$$$$$$$$$wdew")
    directionArray[1] = -9999999;
  }

  if (headY === 0) {
    console.log("$$$$$$$$$$$$fdnfnf")
    directionArray[0] = -9999999;
  }
  if (headY === boardHeight - 1) {
    console.log("$$$$$$$$$$wkjdnwjkedwje$$")
    directionArray[2] = -9999999;
  }

console.log(directionArray)
  var bestMove = 0;
  for (var i = 0; i < 4; i++) {
    if (directionArray[i] > directionArray[bestMove]) {
      bestMove = i;
    }
  }

  switch(bestMove) {
    case 0: return "north"
            break;

    case 1: return "east"
            break;

    case 2: return "south"
            break;

    case 3: return "west"
            break;
  }

  return null;

};


function generateDistanceMatrix (x,y, width, height){
  // var distanceMatrix = [width][height];

  var distanceMatrix = [];
  for(var x = 0; x < width; x++){
      distanceMatrix[x] = [];    
      for(var y = 0; y < height; y++){ 
          distanceMatrix[x][y] = 0;    
      }    
  }
  
  for(a=0; a<width; a++){
    for(b=0; b<height; b++){
      distx = Math.abs((a-x))
      disty = Math.abs((b-y))
      distanceMatrix[a][b] = (distx+disty)
    }
  }

  console.log("distanceMatrix" + distanceMatrix)

  return distanceMatrix;
}



module.exports = router;
