exports.weight = function(x,y,board){

  var cell_weight = food(x,y,board) + snake(x,y,board);
  return cell_weight;
}

var food = function(x,y,board){
  if(board[x][y].state === "food"){
    return 10;  
  }else{
    return 0;
  }
}

var snake = function(x,y,board){
  if(board[x][y].state === "head" || board[x][y].state === "body"){
    return -9999;  
  }else{
    return 0;
  }
}

