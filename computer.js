document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const cells = document.querySelectorAll(".cell");
    const startButton = document.getElementById("computer-el");
    const winningMessage = document.querySelector(".winning-message");
    const winningMessageText = document.querySelector("[data-winning-message-text]");
    const restartButton = document.getElementById("restart-el");

    const WINNING_COMBINATIONS = [
        [0, 1, 2], // Rows
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Columns
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonals
        [2, 4, 6]
    ];

    let boardGame = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false; // Game starts inactive

    // Start or restart the game
    function startGame() {
        gameActive = true;
        boardGame = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        cells.forEach(cell => cell.textContent = '');
        winningMessage.classList.remove("show");
    }

    // Check if a player has won
    function checkWinner(player) {
        return WINNING_COMBINATIONS.some(combination => 
            combination.every(index => boardGame[index] === player)
        );
    }

    // Check if the board is full (draw condition)
    function isBoardFull() {
        return boardGame.every(cell => cell !== '');
    }

    // Display the winning or draw message
    function showWinningMessage(message) {
        winningMessageText.textContent = message;
        winningMessage.classList.add("show");
        gameActive = false;
    }

    // Minimax algorithm for AI moves
    function minimax(board, isMaximizing) {
        if (checkWinner('O')) return { score: 10 }; // AI wins
        if (checkWinner('X')) return { score: -10 }; // Human wins
        if (isBoardFull()) return { score: 0 }; // Draw

        let bestScore = isMaximizing ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                const piece = isMaximizing ? 'O' : 'X';
                board[i] = piece;

                const result = minimax(board, !isMaximizing);
                board[i] = '';

                if (isMaximizing && result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                } else if (!isMaximizing && result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }

        return { score: bestScore, move: bestMove };
    }

    // AI's move
    function computerMove() {
        if (gameActive) {
            const bestMove = minimax(boardGame, true).move;
            if (bestMove !== null) {
                boardGame[bestMove] = 'O';
                cells[bestMove].textContent = 'O';

                if (checkWinner('O')) {
                    showWinningMessage("It is never that easy..! try again");
                } else if (isBoardFull()) {
                    showWinningMessage("What a match!!! It is a draw 🤝");
                } else {
                    currentPlayer = 'X';
                }
            }
        }
    }

    // Human's move
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (gameActive && cell.textContent === "" && currentPlayer === 'X') {
                const index = Array.from(cells).indexOf(cell);
                boardGame[index] = 'X';
                cell.textContent = 'X';

                if (checkWinner('X')) {
                    showWinningMessage("You Win! Kudos");
                } else if (isBoardFull()) {
                    showWinningMessage("What a match!!! It is a draw 🤝");
                } else {
                    currentPlayer = 'O';
                    computerMove();
                }
            }
        });
    });

    // Start the game when the button is clicked
    startButton.addEventListener("click", startGame);
    
    // Restart the game
    restartButton.addEventListener("click", startGame);
});


