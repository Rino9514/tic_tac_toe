// game Board object IIFE (1 instance)
const gameBoard = (function() {
  const board = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
  const winningCombos = [
    // rows
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // Columns
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // Diagonals
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];

  //private functions
  // no need to repeat the loop, centralization of the loop
  const loopOnBoard = (callback) => {
    for (let ii = 0; ii < 3; ii++) {
      for (let jj = 0; jj < 3; jj++) {
        if (callback(ii,jj) === false) return;}; // stop the loop
    };
  };
  //no {} mean return something
  const isValid = (ii,jj,marker) =>
    (marker === 'x' || marker === 'o') &&
    Number.isInteger(ii) && Number.isInteger(jj) &&
    ii >= 0 && ii <= 2 && jj >= 0 && jj <= 2 &&
    board[ii][jj] === null;

  //public functions
  const resetBoard = () => {
    loopOnBoard((ii,jj) => { board[ii][jj] = null; });
  };

  // return true if board have min 1  cell empty, else false
  const hasEmptyCell = () => {
    let result= false;   // local variable to escape a potential bad behavior of the calculation of state
    loopOnBoard((ii,jj) => {
      if(board[ii][jj] === null){
        result = true;
        return false; // stop the loop, no need to continue if not empty
      };
    });
    return result;
  };
  // return true if winner false else
  const winnerCheck = (marker) => {
    return winningCombos.some(combinations => {
      // check every element of the winningCombo and check the condition, return true if condition is ok for one case of the tab, combinations of the form of [[0,0], [0,1],[0,2]]
      return combinations.every( position => {
        // check every element the combinations and check the condition, return false if condition is not ok for one case of the tab, position of the form of [1,1]
        return board[position[0]][position[1]] === marker;
      });
    });
  }

  const getBoard = () => board;
  // if not valid return false, if valid return true
  const setBoard = (ii,jj,marker) =>  {if (!isValid(ii, jj, marker)) return false;
                                       board[ii][jj] = marker;
                                       return true;
  };

  return{getBoard,resetBoard,setBoard,hasEmptyCell,winnerCheck};
})();

// factory function for players (2 instances)
function createPlayer (name, marker) {
  let score = 0;
  const game_name = "Player " + name;

  function addScore(){
    score++;
  };
  function getScore(){
    return score;
  };
  function getName(){
    return name;
  };
  function getMarker(){
    return marker;
  };
  function displayInfos(){
    console.log("Score player " + game_name + " " + score);
  };
  return {addScore,
    getScore,
    getName,
    getMarker,
    displayInfos
  };
};

const gamecontroller = (function() {
  const players = [createPlayer(1,"o"), createPlayer(2,"x")];
  let currentPlayerIndex = 0;
  let draw = false;

  // private functions
  // return true if the game is over, else false
  const endGame = () => {
    if (gameBoard.winnerCheck(players[currentPlayerIndex].getMarker())) {
      players[currentPlayerIndex].addScore();
      return true;
    } else if (!gameBoard.hasEmptyCell()){
      draw = true;
      return true;
      }
    return false;
  };

  const displayEndGame = () => {
    if (draw) console.log("This is a draw.");
    else console.log("player "+players[currentPlayerIndex].getName()+ " has win the game.")
  }

  const resetVar = () => {
    currentPlayerIndex = 0;
    draw = false;
  }

  // public functions
  const game = () => {
    gameBoard.resetBoard();
    resetVar();
    // loop of the game
    while (true) {
      const x = parseInt(prompt("player " + players[currentPlayerIndex].getName() + " where do you play on x : "),10);
      const y = parseInt(prompt("player " + players[currentPlayerIndex].getName() + " where do you play on y : "),10);

      if (!gameBoard.setBoard(x,y,players[currentPlayerIndex].getMarker())) { // stop if input not valid
        console.log("Invalid move, try again.");
        continue; // retry for the current player
      }
      if (endGame()) {
        displayEndGame();
        return;
      }
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
      // console.log(!gameBoard.hasEmptyCell(),!gameBoard.winnerCheck(players[0].getMarker()), !gameBoard.winnerCheck(players[1].getMarker()))
    };
  };
  return {game}
})();
