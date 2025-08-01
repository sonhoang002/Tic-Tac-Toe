// Initialize Gameboard
const Gameboard = (function() {
    let gameBoard = [
        ['','',''],
        ['','',''],
        ['','',''],
    ];

    function resetGameB() {
        gameBoard  = [
            ['','',''],
            ['','',''],
            ['','',''],
        ];
    }
    
    function getBoard() {
        return gameBoard;
    }

    function addMoveToBoard(row = "", col = "", symbol = "") {
        gameBoard[row][col] = symbol;
    }

    return {getBoard, addMoveToBoard, resetGameB};
})();

// Initialize controller
const displayController = (function() {
    let moveIndex = [[0, 0], [0, 1], [0, 2],
                        [1, 0], [1, 1], [1, 2],
                        [2, 0], [2, 1], [2, 2],]
    let turnCount = 0;
    let activePlayer = null;
    let playerList = [];
    let startStatus = false;
    const header = document.querySelector("#header");

    function startGame() {
        if (playerList.length == 2) {
            startStatus = true;
            DOMLogicHandler.addingContentsToContentContainer();
            header.textContent = (`Start Game, ${activePlayer} turn!`);
        }
    }

    function registerPlayer(playerName, playerSymbol) {
        if (startStatus == true) {
            console.log("Game already started!");
            return;
        }
        if (!playerList.find(p => p[0] === playerName)) {
            playerList.push([playerName, playerSymbol]);
        }

        if (turnCount == 0 && playerSymbol == "X") {
            activePlayer = playerName;
            checkSymbol = playerSymbol;
        };
    }

    function numberToMove(number) {
        return moveIndex[number];
    }

    const getStartStatus = () => startStatus;

    const getActivePlayer = () => activePlayer;

    const getPlayerList = () => playerList;

    function setSymbol(playerName, playerSymbol) {
        checkSymbol = playerSymbol;
        registerPlayer(playerName, playerSymbol)
    };

    function checkTurnValidation(playerName) {
        if (activePlayer == playerName) {
            return true;
        }

        console.log(`Not ${playerName} turn!`);
        return false;
    };

    function registerMove(row, col, symbol) {
        if (startStatus == false) {
            console.log("Not enough player!");
            return false;
        }

        if (Gameboard.getBoard()[row][col] !== "") {
            console.log("Invalid Move!");
            return false;
        } else {
            Gameboard.addMoveToBoard(row, col, symbol);
            Gameboard.getBoard().forEach(row => {
                console.log(row.map(String).join(" | "));
            });
            activePlayer = playerList.find(p => p[0] !== activePlayer)[0];
            turnCount ++;
            checkGameStatus();
            checkSymbol = playerList.find(p => p[0] === activePlayer)[1];
            return true;
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
                header.textContent = (`${playerList.find(p => p[0] !== activePlayer)} win!`);
                startStatus = false;
                return true;
            }

            if (checkVertically(i)) {
                header.textContent = (`${playerList.find(p => p[0] !== activePlayer)} win!`);
                startStatus = false;
                return true;
            }
        }

        if(checkDiagonal()) {
            header.textContent = (`${playerList.find(p => p[0] !== activePlayer)} win!`);
            startStatus = false;
            return true;
        }

        if(turnCount == 9) {
            header.textContent = ("Draw");
            startStatus = false;
            return true;
        }

        return false;
    }

    function resetGameA() {
        turnCount = 0;
        activePlayer = playerList.find(p => p[1] === "X")[0];
        Gameboard.resetGameB();
        startGame();
    }

    return {setSymbol, checkGameStatus, registerPlayer,
            getActivePlayer, getPlayerList, checkTurnValidation,
            registerMove, startGame, numberToMove, getStartStatus,
            resetGameA};
})();

// Player Creation
function createPlayer(name, type) {
    let playerName = name;
    let playerSymbol = type;

    const getName = () => playerName;

    const getSymbol = () => playerSymbol;

    function setSymbol(chosenSymbol) {
        playerSymbol = chosenSymbol;
        displayController.registerPlayer(playerName, playerSymbol);
    }

    function decision(row, col) {
        if (displayController.checkTurnValidation(playerName)) {
            displayController.registerMove(row, col, playerSymbol);
        }
    };

    (function registerP() {
        displayController.registerPlayer(playerName, playerSymbol);
    })();

    (function requestStart() {
        displayController.startGame();
    })();

    return {getName, getSymbol, setSymbol, decision};
};

const DOMLogicHandler = (function() {
    const contentDiv = document.querySelector(".contentDiv");
    const resetBtn = document.querySelector(".resetBtn");

    function addingContentsToContentContainer() {
        for (let i = 0; i < 9; i ++) {
            const symbolHolderDiv = document.createElement("div");
            symbolHolderDiv.classList.add("symbolHolderDiv");
            symbolHolderDiv.divNumber = i;
            symbolHolderDiv.addEventListener("click", () => {
                if (displayController.getStartStatus()) {
                    let pName = displayController.getActivePlayer();
                    let pList = displayController.getPlayerList();
                    let pSymbol = pList.find(p => p[0] === pName)[1];

                    const chosenMove = displayController.numberToMove(symbolHolderDiv.divNumber);

                    if (displayController.registerMove(chosenMove[0], chosenMove[1], pSymbol)) {
                        symbolHolderDiv.textContent = `${pSymbol}`;
                    }
                }
            });
            contentDiv.appendChild(symbolHolderDiv);
        }
    }

    (function resetGame() {
        resetBtn.addEventListener("click", () => {
            while(contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }
            displayController.resetGameA();
        });
    })();

    return {addingContentsToContentContainer};
})();

const player1 = createPlayer("Player1", "X");
const player2 = createPlayer("Player2", "O");

