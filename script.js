// game Board object IIFE (1 instance)
const gameBoard = (function() {
  const board = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
  let empty = true;

  //private function
  // no need to repeat the loop, centralization of the loop
  const loopOnBoard = (callback) => {
    for (let ii = 0; ii < 3; ii++) {
      for (let jj = 0; jj < 3; jj++) {
        if (callback(ii,jj) === false) return;}; // stop the loop
    };
  };
  //no {} mean return
  const isValid = (ii,jj,marker) =>
    (marker === 'x' || marker === 'o') &&
    Number.isInteger(ii) && Number.isInteger(jj) &&
    ii >= 0 && ii <= 2 && jj >= 0 && jj <= 2 &&
    board[ii][jj] === null;


  //public functions
  const resetBoard = () => {
    loopOnBoard((ii,jj) => { board[ii][jj] = null; });
    empty = true;
  };

  // local variable to escape a potential bad behavior of the calculation of state
  const isEmpty = () => {
    let result= true;
    loopOnBoard((ii,jj) => {
      if(board[ii][jj] !== null){
        result = false;
        return false; // stop the loop
      };
    });
    empty = result;
    return result;
  };

  const getBoard = () => board;

  const setBoard = (ii,jj,marker) => {isValid(ii,jj,marker) ? board[ii][jj] = marker : console.log("Non pas comme ça petit coquin.")};

  return{getBoard,resetBoard,setBoard,isEmpty};
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
// let player_one = createPlayer(1,"o");
// let player_two = createPlayer(2,"x");
