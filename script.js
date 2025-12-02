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

  // return if board have min 1 empty cell empty, else false
  const isFull = () => {
    let result= false;   // local variable to escape a potential bad behavior of the calculation of state
    loopOnBoard((ii,jj) => {
      if(board[ii][jj] === null){
        result = true;
        return false; // stop the loop, no need to continue is not empty
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

  return{getBoard,resetBoard,setBoard,isFull,winnerCheck};
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
  const tab_player = [createPlayer(1,"o"), createPlayer(2,"x")];
  let index_players = 0;

  // private functions
  const game = () => {
    do {
      for(let ii = index_players; ii < tab_player.length; ii++) {
        gameBoard.getBoard();
        const x = parseInt(prompt("player " + tab_player[ii].getName() + " where do you play on x : "),10);
        const y = parseInt(prompt("player " + tab_player[ii].getName() + " where do you play on y : "),10);

        if (!gameBoard.setBoard(x,y,tab_player[ii].getMarker())) { // stop if input not valid
          console.log("Invalid move, try again.");
          break;
        }
        index_players = (index_players + 1) % 2;

      }
    } while (!gameBoard.isFull() &&
             !winnerCheck(tab_player[0].getMarker()) &&
             !winnerCheck(tab_player[1].getMarker()));
  };
  return {game}

  // public functions
})();
