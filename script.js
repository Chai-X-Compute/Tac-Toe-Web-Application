class TicTacToe {
    constructor() {
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.aiModeToggle = document.getElementById('aiMode');
        this.scoreX = document.getElementById('scoreX');
        this.scoreO = document.getElementById('scoreO');
        this.scoreDraw = document.getElementById('scoreDraw');
        
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.scores = { X: 0, O: 0, Draw: 0 };
        this.isAIMode = false;
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.aiModeToggle.addEventListener('change', () => this.toggleAIMode());
    }

    toggleAIMode() {
        this.isAIMode = this.aiModeToggle.checked;
        this.restartGame();
    }

    handleCellClick(cell) {
        const cellIndex = Array.from(this.cells).indexOf(cell);

        if (this.gameState[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        this.updateCell(cell, cellIndex);
        this.checkResult();

        // If AI mode is on and it's AI's turn
        if (this.isAIMode && this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;

        // Try to find a winning move
        const winningMove = this.findWinningMove('O');
        if (winningMove !== -1) {
            this.handleCellClick(this.cells[winningMove]);
            return;
        }

        // Try to block player's winning move
        const blockingMove = this.findWinningMove('X');
        if (blockingMove !== -1) {
            this.handleCellClick(this.cells[blockingMove]);
            return;
        }

        // Try to take center if available
        if (this.gameState[4] === '') {
            this.handleCellClick(this.cells[4]);
            return;
        }

        // Take a random available move
        const availableMoves = this.gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);
        
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            this.handleCellClick(this.cells[randomMove]);
        }
    }

    findWinningMove(player) {
        for (let i = 0; i < this.gameState.length; i++) {
            if (this.gameState[i] === '') {
                this.gameState[i] = player;
                if (this.checkWinningCondition()) {
                    this.gameState[i] = '';
                    return i;
                }
                this.gameState[i] = '';
            }
        }
        return -1;
    }

    checkWinningCondition() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.gameState[a] && 
                   this.gameState[a] === this.gameState[b] && 
                   this.gameState[a] === this.gameState[c];
        });
    }

    updateCell(cell, index) {
        this.gameState[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
    }

    checkResult() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            const condition = this.gameState[a] && 
                            this.gameState[a] === this.gameState[b] && 
                            this.gameState[a] === this.gameState[c];

            if (condition) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            this.handleWin(winningLine);
            return;
        }

        if (!this.gameState.includes('')) {
            this.handleDraw();
            return;
        }

        this.changePlayer();
    }

    handleWin(winningLine) {
        this.gameActive = false;
        winningLine.forEach(index => {
            this.cells[index].classList.add('winning');
        });
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
    }

    handleDraw() {
        this.gameActive = false;
        this.scores.Draw++;
        this.updateScores();
        this.statusDisplay.textContent = "Game ended in a draw!";
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    updateScores() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
        this.scoreDraw.textContent = this.scores.Draw;
    }

    restartGame() {
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });

        // If AI mode is on and AI goes first, make AI move
        if (this.isAIMode && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 