// Initialize Gameboard
const Gameboard = (function() {
    const gameBoard = [
        ['','X','X'],
        ['X','O','O'],
        ['O','X','X'],
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
    let checkSymbol = "X";

    function setSymbol(playerSymbol) {
        checkSymbol = playerSymbol;
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

    function checkDraw() {
        let board = Gameboard.getBoard();
        for (let r = 0; r < board.length; r ++) {
            for (let c = 0; c < board[0].length; c ++) {
                if (board[r][c] == '') {
                    return false;
                }
            }
        }

        return true;
    }

    function checkGameStatus() {
        for (let i = 0; i < 3; i ++) {
            if (checkHorizontally(i)) {
                console.log(`${checkSymbol} win!`);
                return true;
            }

            if (checkVertically(i)) {
                console.log(`${checkSymbol} win!`);
                return true;
            }
        }

        if(checkDiagonal()) {
            console.log(`${checkSymbol} win!`);
            return true;
        }

        if(checkDraw()) {
            console.log("Draw");
            return true;
        }

        console.log("Unfinished");
        return false;
    }

    return {setSymbol, checkGameStatus};
})();

// Player Creation
function createPlayer(name, type) {
    let playerName = name;
    let playerSymbol = type;

    function firstTurn() {
        if (playerSymbol == "X") {
            return goFirst = true;
        } else {
            return goFirst = false;
        }
    };

    // function turnOrder() {

    // }

    const getName = () => playerName;

    function decision(row, col, symbol) {
        if (Gameboard.getBoard()[row][col] == "") {
            Gameboard.addMoveToBoard(row, col, symbol);
        } else {
            alert("cant");
        }
    };

    return {getName, firstTurn, decision};
};

const player1 = createPlayer("Player1", "X");
const player2 = createPlayer("Player2", "O");

