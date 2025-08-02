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
    let initialTurnOrder = [["X", 0], ["O", 0]];
    const header = document.querySelector("#header");

    const getStartStatus = () => startStatus;

    const getActivePlayer = () => activePlayer;

    const getPlayerList = () => playerList;

    const emptyPlayerList = () => playerList = [];

    const resetInitialTurnOrder = () => initialTurnOrder = [["X", 0], ["O", 0]];

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
        } else {
            header.textContent = "Can't have the same name!";
        }

        if (turnCount == 0 && playerSymbol == "X") {
            activePlayer = playerName;
            checkSymbol = playerSymbol;
            initialTurnOrder.find(s => s[0] === checkSymbol)[1] ++;
            // console.log(initialTurnOrder.find(s => s[0] === checkSymbol)[1])
        };
    }

    function numberToMove(number) {
        return moveIndex[number];
    }

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
            header.textContent = "Invalid Move!";
            return false;
        } else {
            Gameboard.addMoveToBoard(row, col, symbol);
            Gameboard.getBoard().forEach(row => {
                console.log(row.map(String).join(" | "));
            });
            activePlayer = playerList.find(p => p[0] !== activePlayer)[0];
            turnCount ++;
            if (!checkGameStatus()) {
                header.textContent = `${activePlayer} turn!`;
            }
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
                header.textContent = (`${playerList.find(p => p[0] !== activePlayer)[0]} win!`);
                startStatus = false;
                return true;
            }

            if (checkVertically(i)) {
                header.textContent = (`${playerList.find(p => p[0] !== activePlayer)[0]} win!`);
                startStatus = false;
                return true;
            }
        }

        if(checkDiagonal()) {
            header.textContent = (`${playerList.find(p => p[0] !== activePlayer)[0]} win!`);
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
        if (initialTurnOrder[0][1] > initialTurnOrder[1][1]) {
            activePlayer = playerList.find(p => p[1] === "O")[0];
            initialTurnOrder[1][1] ++;
        } else {
            activePlayer = playerList.find(p => p[1] === "X")[0];
            console.log(activePlayer);
            initialTurnOrder[0][1] ++;
        }
        Gameboard.resetGameB();
        startGame();
    }

    function hardReset() {
        emptyPlayerList();
        resetInitialTurnOrder();
        startStatus = false;
        turnCount = 0;
        Gameboard.resetGameB();
    }

    return {setSymbol, checkGameStatus, registerPlayer,
            getActivePlayer, getPlayerList, checkTurnValidation,
            registerMove, startGame, numberToMove, getStartStatus,
            resetGameA, hardReset};
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

    (function registerP() {
        displayController.registerPlayer(playerName, playerSymbol);
    })();

    (function requestStart() {
        displayController.startGame();
    })();

    return {getName, getSymbol, setSymbol};
};


// DOM input & output
const DOMLogicHandler = (function() {
    const contentDiv = document.querySelector(".contentDiv");
    const resetBtn = document.querySelector("#resetBtn");
    const readyBtn = document.querySelector("#startBtn");
    const hardResetBtn = document.querySelector("#hardResetBtn");
    const player1Name = document.querySelector("#userName1");
    const player2Name = document.querySelector("#userName2");
    const header = document.querySelector("#header");

    function resetDOM() {
        const selectedRadio1 = document.querySelectorAll('input[name="radio1"]');
            selectedRadio1.forEach(radio => {
                radio.disabled = false;
        });
        player1Name.value = "";
        player2Name.value = "";
        player1Name.placeholder = "Player1";
        player2Name.placeholder = "Player2";
        player1Name.disabled = false;
        player2Name.disabled = false;
        header.textContent = "";
    }

    (function normalReset() {
        resetBtn.addEventListener("click", () => {
            while(contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }
            displayController.resetGameA();
        });
    })();

    (function hardReset() {
        hardResetBtn.addEventListener("click", () => {
            while(contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }
            displayController.hardReset();
            resetDOM();
        });
    })();

    (function addingPlayerToGame() {
        readyBtn.addEventListener("click", () => {
            if (displayController.getStartStatus()) {
                header.textContent = "Game already started!";
                return;
            }
            if (player1Name.value.trim() == "") {
                player1Name.value = player1Name.placeholder;
            } 
            if (player2Name.value.trim() == "") {
                player2Name.value = player2Name.placeholder;
            }
            const selectedRadio1Checked = document.querySelector('input[name="radio1"]:checked')
            const selectedRadio2Checked = document.querySelector('input[name="radio2"]:checked')

            createPlayer(player1Name.value, selectedRadio1Checked.value);
            createPlayer(player2Name.value, selectedRadio2Checked.value);

            if (player1Name.value !== player2Name.value) {
                const selectedRadio1 = document.querySelectorAll('input[name="radio1"]');
                selectedRadio1.forEach(radio => {
                    radio.disabled = true;
                });

                player1Name.disabled = true;
                player2Name.disabled = true;
            }
        });
    })();

    (function switchSymbol() {
        const selectedRadio1 = document.querySelectorAll('input[name="radio1"]');
        const selectedRadio2 = document.querySelectorAll('input[name="radio2"]');

        selectedRadio1.forEach(radio => {
            radio.addEventListener("click", () => {
                const selectedValue = document.querySelector('input[name="radio1"]:checked');
                const oppositeValue = selectedValue.value === "X" ? "O" : "X";

                selectedRadio2.forEach(radio2 => {
                    radio2.checked = radio2.value === oppositeValue;
                });
            });
        });
    })();

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

                updateDisableState();
            });

            contentDiv.appendChild(symbolHolderDiv);
        }
    }

    return {addingContentsToContentContainer};
})();

function updateDisableState() {
    const allCells = document.querySelectorAll(".symbolHolderDiv");
    allCells.forEach(cell => {
        if (!displayController.getStartStatus()) {
            console.log(displayController.getStartStatus());
            cell.classList.add("disable");
        } else {
            cell.classList.remove("disable");
        }
    })
}



// const player1 = createPlayer("Player1", "X");
// const player2 = createPlayer("Player2", "O");

