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
    (marker === 'X' || marker === 'O') &&
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
  function resetScore(){
    score=0;
  }
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
    console.log("Score player " + game_name + " : " + score);
  };
  return {addScore,
    resetScore,
    getScore,
    getName,
    getMarker,
    displayInfos
  };
};

const gameController = (function() {
  const players = [createPlayer(1,"X"), createPlayer(2,"O")];
  let currentPlayerIndex = 0;
  let firstPlayerIndex = 0;

  // public functions
  const getPlayer =  (index) => players[index];

  const getCurrentPlayer =  () => players[currentPlayerIndex];

  const toTheFirstPlayer =  () => currentPlayerIndex = firstPlayerIndex;

  const playRound = (xx,yy) => {
    // stop if input not valid
    if (!gameBoard.setBoard(xx,yy,players[currentPlayerIndex].getMarker())) {
      return false;
    }

    if (gameBoard.winnerCheck(players[currentPlayerIndex].getMarker())) {
      players[currentPlayerIndex].addScore();
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
      //remember who is the first player of the round
      firstPlayerIndex = currentPlayerIndex;
      return "win";
    }

    if (!gameBoard.hasEmptyCell()){
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
      //remember who is the first player of the round
      firstPlayerIndex = currentPlayerIndex;
      return "draw";
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % 2;

    return "continue";;
  };

  const restartGame = () => {
    gameBoard.resetBoard();
    currentPlayerIndex = 0;
    players[0].resetScore();
    players[1].resetScore();
  }
  return {restartGame,playRound,getPlayer,getCurrentPlayer,toTheFirstPlayer}
})();

const displayController = (function(){
  const cases = document.querySelectorAll(".case");
  const prompter = document.querySelector(".prompter");
  const score_player1 = document.querySelector(".score_player1");
  const score_player2 = document.querySelector(".score_player2");
  const reset_btn = document.querySelector(".reset");
  const restart_btn = document.querySelector(".restart");

  //private
  const updatePrompter = (text) => {
    prompter.textContent = text;
  };
  const updateScore = () => {
    score_player1.textContent = gameController.getPlayer(0).getScore();
    score_player2.textContent = gameController.getPlayer(1).getScore();
  }
  const clearBoardUI = () => {
    cases.forEach(cell => cell.textContent = "");
  };
  // handle the click on the cases,
  // check the win, draw and change the prompter and the cases value and the tab of the board
  const handleCLick = (event) => {
    const cell = event.currentTarget;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const currentPlayer = gameController.getCurrentPlayer();
    const resultRound = gameController.playRound(row,col);

    // end of the fonction when have a problem
    if (!resultRound) return;
    cell.textContent = currentPlayer.getMarker();

    if (resultRound === "continue"){
      updatePrompter("Player " + gameController.getCurrentPlayer().getName() + " turn");
    }
    else if (resultRound === "draw") {
      updatePrompter("It's a DRAW ! ")
      removeListeners();
    }
    else if (resultRound === "win") {
      updatePrompter("Player " + currentPlayer.getName()+ " WIN !");
      updateScore();
      removeListeners();
    }

  };
  //create eventlistener on all cases
  const addListeners = () => {
    cases.forEach( element => element.addEventListener("click", handleCLick));
  }
  //remove eventlistener on all cases
  const removeListeners = () => {
    cases.forEach( element => element.removeEventListener("click", handleCLick));
  }
  //reset the round
  reset_btn.addEventListener("click", () => {
    gameBoard.resetBoard();
    clearBoardUI();
    gameController.toTheFirstPlayer();
    updatePrompter("Player " + gameController.getCurrentPlayer().getName() + " turn");
    removeListeners();
    addListeners();
  });
  //restart the whole game
  restart_btn.addEventListener("click", () => {
    gameController.restartGame();
    clearBoardUI();
    updatePrompter("Player "+ gameController.getCurrentPlayer().getName() + " turn");
    updateScore();
    removeListeners();
    addListeners();
  });

    addListeners(); //make the game playable instantly
})();
