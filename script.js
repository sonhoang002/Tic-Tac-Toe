const Gameboard = (function() {
    const gameBoard = [
        ['X','X',''],
        ['X','X','O'],
        ['X','','O'],
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

const displayController = (function() {
    let checkSymbol = "X";

    function setSymbol(playerSymbol) {
        checkSymbol = playerSymbol;
    }

    function checkHorizontally(rowPosition) {
        for (let c = 0; c < Gameboard.getBoard()[0].length; c ++) {
            if (Gameboard.getBoard()[rowPosition][c] !== checkSymbol) {
                return false;
            }
        }

        return true;
    }

    function checkVertically(colPosition) {
        for (let r = 0; r < Gameboard.getBoard().length; r ++) {
            if (Gameboard.getBoard()[r][colPosition] !== checkSymbol) {
                return false;
            } 
        }

        return true;
    }

    function checkGameStatus() {
        for (let i = 0; i < 3; i ++) {
            if (checkHorizontally(i)) {
                return true;
            }

            if (checkVertically(i)) {
                return true;
            }
        }

        return false;
    }

    return {setSymbol, checkGameStatus};
})();

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

