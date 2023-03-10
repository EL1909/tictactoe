/**
 * Variables to be used to play the game
 */

let origBoard;
let huPlayer = 'X';
let comPlayer = 'O';    

/**
 * Array containing arrays to determine winning combinations on the board cells
 */
let winWays = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

let cells = document.getElementsByClassName('cell');

/** Calling function to start the game */
startGame();

/** 
 * Determine function to start the game 
 * Stablish behivor to "replay" button at end of each game
 * Load values from winWays array to origBoard variable
 * The for loop restart the grid to play again
*/
function startGame() {
    document.getElementById('endgame').style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

/** 
 * first if allow only play on cells where there are numbers
 * turn lets the player to select a square
 * second if let AI play after checking the game is not Draw
 */
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), comPlayer);
    }
}

/** 
 * Insert the player selection to the grid
 * checkWin seeks if a winning combination from the array happened
 * Stablish the end of the game
 */
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}
/**
 * the function find places in the board where the user had already played
 * reduce "a"dd "i"ndexes to an empty array to be filled with "e"lements in the board
 * The for loop verify if any value in winComb array matches
 * if the winCombo array matches, gameWon sets combination and player
 */
function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
      (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winWays.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

/**
 * first loop sets color to the winning combination and calls increment function
 * second loop cuts the option to keep cliking cells
 * declares winning statement at end of the game 
 */
function gameOver(gameWon)  {
    for (let index of winWays [gameWon.index]) {
        if (gameWon.player == huPlayer) {
        document.getElementById(index).style.backgroundColor = "blue";
        incrementHuman();
         } else {
        document.getElementById(index).style.backgroundColor = "red";
        incrementAI();
    } 
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "AI Wins");
}

/**
 * uses "who" to declare winner according to whom
 * made the first combination made 
 */
function declareWinner(who) {
    document.getElementById("endgame").style.display = "block";
    document.getElementById("text").innerText = who;
}

/**
 * finds the first space that is not empty
 */
function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return emptySquares()[0];
}

/**
 * looks if there are no more available cells to play
 */
function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(`
        Draw! 
        Play Again!?
        `)
        return true;
    }
   return false;
}

/**
 * Gets the current score from the DOM and increments it by 1
 */
function incrementHuman() {

    let oldScore = parseInt(document.getElementById("score").innerText);
    document.getElementById("score").innerText = ++oldScore;
}

/**
 *  Gets the current score from the DOM and increments it by 1
 */
function incrementAI() {

    let oldScore = parseInt(document.getElementById("incorrect").innerText);
    document.getElementById("incorrect").innerText = ++oldScore;    
}