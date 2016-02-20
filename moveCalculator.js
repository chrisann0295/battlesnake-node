var directionArray = [4]
  , matrixGenerators = require('./gen');

function moveCalculator(headX, headY, boardWidth, boardHeight, weightMatrix) {
  var tempX
    , tempY
    , distanceMatrix;

  for(var dir = 0; dir < directionArray.length(); dir++) {
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
  
    distanceMatrix = matrixGenerators.generateDistanceMatrix(tempX, tempY, boardHeight, boardWidth);

    for (var x = 0; x < boardWidth; x++) {
      for (var y = 0; y < boardHeight; y++) {
        directionArray[dir] = directionArray[dir] + (weightMatrix[x][y] * distanceMatrix[x][y]);
      }
    }
  }

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


module.exports = {
  moveCalculator: moveCalculator
}