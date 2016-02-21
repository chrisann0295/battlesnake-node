var config = require('../config.json');
var express = require('express');
var router = express.Router();

//map holds state of all running games (keys are the gameid)
var games = {};

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
  console.log('Game: ', req.body.game, ' has begun!');
  gameid = req.body.game;

  //create new game state
  games[gameid] = {
    id: gameid,
    state: "alive",
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
	console.log('Received /MOVE request')

	//find game state in hash table
	var gameid = req.body.game;
	var currentGame = games[gameid];

	//catch games that have ended/haven't begun
	if (currentGame === "undefined" || currentGame === "null") {
		res.status(404);
		return;
	}

	console.log("Valid game: ",(currentGame!=="undefined"))
	
	//current game stats
	var turn = req.body.turn;
	
	//locations of game objects
	var snakes = req.body.snakes;
	var food = req.body.food;
	var walls = req.body.walls;
	var gold = req.body.gold; 
	
	// Board dimensions
	var boardWidth = req.body.width;
	var boardHeight = req.body.height;
	console.log('Board Size:',boardWidth,boardHeight)

	//find mySnake
	var mySnake;
	for (i = 0; i < snakes.length; i++) {
			if (snakes[i].id === "a1e0221f-66e8-4f79-a125-6abdef413a9a") {
					mySnake = snakes[i];
			}
	}
	var myHead = mySnake.coords[0];
	console.log('My head is at: ',myHead)

	//if my snake is dead -> ignore request
	if (mySnake.status === "dead") {
		return res.status(404);
	}
	console.log('I am still alive!')

	//generate data matrices
	var weightMatrix = generateWeightMatrix(boardWidth, boardHeight, snakes,food,walls,gold, mySnake.health);
	var distanceMatrix = generateDistanceMatrix(myHead[0],myHead[1],boardWidth,boardHeight)
	
	//console.log('-----------WM:----------- \n')
	//prettyPrint(weightMatrix)
	//console.log('\n-----------DM:----------- \n')
	//prettyPrint(distanceMatrix)
	
	
	//find optimal move
	var mymove = moveCalculator(myHead[0], myHead[1], boardWidth, boardHeight, weightMatrix);
	console.log('calculated move is: ', mymove)

	// Response data
	var data = {
			move: mymove, // one of: ["up", "down", "left", "right"]
			taunt: mySnake.coords || config.snake.taunt.move
	};

	return res.send(data);
});

// End the session
router.post(config.routes.end, function(req, res) {
	//get gameid
	var gameid = req.body.game;

	//delete game state from map
	delete games[gameid];

	// We don't need a response so just send back a 200
	res.status(200)
	return res.json({}).end();
});

function generateDistanceMatrix (x,y, width, height){

	//init 2d array to zero
  var distanceMatrix = [];
  for(var x = 0; x < width; x++){
      distanceMatrix[x] = [];    
      for(var y = 0; y < height; y++){ 
          distanceMatrix[x][y] = 0;    
      }    
  }
  
	//find distances to all points
  for(a=0; a<width; a++){
    for(b=0; b<height; b++){
      distx = Math.abs((a-x))
      disty = Math.abs((b-y))
      distanceMatrix[a][b] = (distx+disty)
    }
  }
	
  return distanceMatrix;
}

function generateWeightMatrix (width, height, snakes, food, walls, gold, health){

	//init 2d matrix to 0
  var arr = [];
  for(var x = 0; x < width; x++){
      arr[x] = [];    
      for(var y = 0; y < height; y++){ 
          arr[x][y] = 0;    
      }    
  }
	
	//weights for game objects
  //vals = {"snake":-200, "walls":-300, "gold":101, "food":100}
  
	//add food to weight matrix
  for(i=0; i<food.length;i++){
    coords = food[i]    
    arr[coords[1]][coords[0]] = 100
  }
	
	//add snakes to weight matrix
  for(i=0; i<snakes.length;i++){
    asnake = snakes[i]
    for(j=0; j<asnake.coords.length;j++){
      coords = asnake.coords[j]   
      arr[coords[1]][coords[0]] = -200
    }
  }
	
	if(typeof walls !== "undefined"){
		//add walls to weight matrix
		for(i=0; i<walls.length;i++){
			coords = walls[i]   
			arr[coords[1]][coords[0]] = -300
		}
	}

	if(typeof gold !== "undefined"){
		for(i=0; i<gold.length;i++){
			coords = gold[i]    
			arr[coords[1]][coords[0]] = 101
		}

	}
  
  return arr
}


function moveCalculator(headX, headY, boardWidth, boardHeight, weightMatrix) {
  var dir= {'west':false, 'east':false, 'north':false, 'south':false};

  console.log("Calculating our move")
  var tempX
    , tempY
    , distanceMatrix;
	
	distanceMatrix = generateDistanceMatrix(headX, headY, boardWidth, boardHeight);
	
	//find highest weight cell
	dest = [headX,headY]
	for (var x = 0; x < boardWidth; x++) {
		for (var y = 0; y < boardHeight; y++) {
			if(weightMatrix[x][y]*distanceMatrix[x][y] >=  weightMatrix[dest[0]][dest[1]]*distanceMatrix[dest[0]][dest[1]]){
				dest = [x,y]
			}
			
		}
	}
	
	x = dest[0]
	y = dest[1]
	
	if(x-headX > 0){
		dir['west']=true
	}else if(x-headX < 0){
		dir['east']=true
		 
	}else{
		
		if(y-headY > 0){
			dir['south']=true
		
		}else if(x-headX < 0){
			dir['north']=true
			 
		}else{
			//default
			dir['south']=true
		}
		
	}


  if (headX === 0) {
    dir['west'] = false
  } 

  if (headX === boardWidth -1) {
    dir['east'] = false
  }

  if (headY === 0) {
    dir['north'] = false
  }
  if (headY === boardHeight - 1) {
    dir['south'] = false
  }

	console.log('Possible moves: ', dir)
  
	if(dir['east'] ===true){
		return "east"
	}else if(dir['west'] ===true){
		return "west"
		
	}else if(dir['south'] ===true){
		return "south"
		
	}else if(dir['north'] ===true){
		return "north"
		
	}else{
		return null
	}

};

function prettyPrint(matrix){
  
	for (var i = 0; i < matrix.length; i++){
		mystring = ""; 
		for (var j = 0; j < matrix[i].length; j++){
			whitespace = "";  		
			if (matrix[i][j] >= 0 && matrix[i][j] < 100)
				whitespace = "   "; 
			if (matrix[i][j] >= 100)
				whitespace = " ";
			mystring = mystring + whitespace + matrix[i][j] + ","; 
		}
		console.log("["+mystring+"]"); 
	}
 }




module.exports = router;
