exports.generateWeightMatrix = function(width, height, snakes, food, walls, coin, health){
	console.log("generateWeightMatrix insidee here $$$")

	var arr = [width][height]; //0,0 to h-1,w-1
	var health = 100; //TODO call health()
	var food = (100-health)*2 
	vals = {"snake":-200, "wall":-300, "coin":100, "food":food}
	
	for(i=0; i<food.length;i++){
		coords = food[i]		
		arr[coords[0]][coords[1]] = vals['food']
	}

	for(i=0; i<snakes.length;i++){
		asnake = snakes[i]
		for(j=0; j<asnake.length;j++){
			coords = asnake[i][j]		
			arr[coords[0]][coords[1]] = vals['snake']
		}
	}

	for(i=0; i<walls.length;i++){
		coords = walls[i]		
		arr[coords[0]][coords[1]] = vals['wall']
	}

	for(i=0; i<gold.length;i++){
		coords = gold[i]		
		arr[coords[0]][coords[1]] = vals['coin']
	}

	console.log("generateWeightMatrix" + arr)

	return arr

}


exports.genDW = function(x,y,arr){
	height = arr[0].length	
	width = arr.length
	dwArr = arr
	
	for(a=0;a<width;a++){
		for(b=0;b<height;b++){
			distx = Math.abs((a-x))
			disty = Math.abs((b-y))
			dwArr[a][b] = (distx+disty)*arr[a][b]
		}
	}

	return dwArr
}

exports.generateDistanceMatrix = function(x,y, width, height){
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

