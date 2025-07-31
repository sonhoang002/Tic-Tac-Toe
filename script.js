// Initialize Gameboard
const Gameboard = (function() {
    const gameBoard = [
        ['','',''],
        ['','',''],
        ['','',''],
    ];
    
    function getBoard() {
        return gameBoard;
    }

    function addMoveToBoard(row = "", col = "", symbol = "") {
        gameBoard[row][col] = symbol;
    }

    return {getBoard,
            addMoveToBoard,
    };
})();

// Initialize controller
const displayController = (function() {
    // let checkSymbol = "X";
    let turnCount = 0;
    let activePlayer = null;
    let playerList = [];

    function registerPlayer(playerName, playerSymbol) {
        playerList.push(playerName);
        if (turnCount == 0 && playerSymbol == "X") {
            activePlayer = playerName;
            checkSymbol = playerSymbol;
        };
    }

    const getActivePlayer = () => activePlayer;

    function setSymbol(playerSymbol) {
        checkSymbol = playerSymbol;
    };

    function checkTurnValidation(playerName) {
        if (activePlayer == playerName) {
            return true;
        }

        console.log(`Not ${playerName} turn!`);
        return false;
    };

    function registerMove(row, col, symbol) {
        if (Gameboard.getBoard()[row][col] !== "") {
            console.log("Invalid Move!");
            return;
        } else {
            Gameboard.addMoveToBoard(row, col, symbol);
            Gameboard.getBoard().forEach(row => {
                console.log(row.map(String).join(" | "));
            });
            activePlayer = playerList.find(p => p !== activePlayer);
            turnCount ++;
            checkGameStatus();
        }

    }

    function checkVertically(colPosition) {
        for (let r = 0; r < Gameboard.getBoard().length; r ++) {
            if (Gameboard.getBoard()[r][colPosition] !== checkSymbol) {
                return false;
            } 
        }

        return true;
    }

    function checkHorizontally(rowPosition) {
        for (let c = 0; c < Gameboard.getBoard()[0].length; c ++) {
            if (Gameboard.getBoard()[rowPosition][c] !== checkSymbol) {
                return false;
            }
        }

        return true;
    }

    function checkDiagonal() {
        let board = Gameboard.getBoard();
        let firstDiagonal = [board[0][0], board[1][1], board[2][2]];
        let secondDiagonal = [board[0][2], board[1][1], board[2][0]];

        if (firstDiagonal[0] == checkSymbol &&
            firstDiagonal[1] == checkSymbol &&
            firstDiagonal[2] == checkSymbol) {
                return true;
        };
        
        if (secondDiagonal[0] == checkSymbol &&
            secondDiagonal[1] == checkSymbol &&
            secondDiagonal[2] == checkSymbol) {
                return true;
        }

        return false;
    }

    function checkGameStatus() {
        for (let i = 0; i < 3; i ++) {
            if (checkHorizontally(i)) {
                console.log(`${playerList.find(p => p !== activePlayer)} win!`);
                return true;
            }

            if (checkVertically(i)) {
                console.log(`${playerList.find(p => p !== activePlayer)} win!`);
                return true;
            }
        }

        if(checkDiagonal()) {
            console.log(`${playerList.find(p => p !== activePlayer)} win!`);
            return true;
        }

        if(turnCount == 9) {
            console.log("Draw");
            return true;
        }

        return false;
    }

    return {setSymbol, checkGameStatus, registerPlayer, getActivePlayer, checkTurnValidation, registerMove};
})();

// Player Creation
function createPlayer(name, type) {
    let playerName = name;
    let playerSymbol = type;

    (function registerP() {
        displayController.registerPlayer(playerName, playerSymbol);
    })();

    const getName = () => playerName;

    function decision(row, col) {
        if (displayController.checkTurnValidation(playerName)) {
            displayController.registerMove(row, col, playerSymbol);
        }
    };

    return {getName, decision};
};

const player1 = createPlayer("Player1", "X");
const player2 = createPlayer("Player2", "O");

