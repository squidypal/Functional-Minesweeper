import { Board } from './libraries/gameEngine.js';

class Game {
    constructor() {

        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.currentDifficulty = 'beginner';
        this.board = null;
        this.timerInterval = null;
        this.startTime = null;
        
        this.initializeUI();
        this.startNewGame();
    }

    initializeUI() {
        this.boardElement = document.querySelector('#board');
        this.counterElement = document.querySelector('.counter');
        this.timerElement = document.querySelector('.timer');
        this.faceButton = document.querySelector('.face');
        this.difficultyButtons = document.querySelectorAll('.difficulty button[role="tab"]');

        this.faceButton.addEventListener('click', () => this.handleReset());
        
        this.difficultyButtons.forEach((button, index) => {
            const difficulties = ['beginner', 'intermediate', 'expert'];
            button.addEventListener('click', () => this.handleDifficultyChange(difficulties[index]));
        });
    }

    startNewGame() {
        const config = this.difficulties[this.currentDifficulty];
        this.board = new Board(config.rows, config.cols, config.mines);
        
        this.stopTimer();
        this.startTime = null;
        
        this.updateCounter();
        this.updateTimer();
        this.updateFace(':D');
        this.renderBoard();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';

        this.boardElement.style.setProperty('--cols', this.board.cols);

        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                const cellElement = this.createCellElement(r, c);
                this.boardElement.appendChild(cellElement);
            }
        }
    }

    createCellElement(row, col) {
        const cell = this.board.cells[row][col];
        const cellElement = document.createElement('div');
        
        cellElement.className = 'cell hidden';
        cellElement.setAttribute('role', 'gridcell');
        cellElement.setAttribute('tabindex', '0');
        cellElement.dataset.row = row;
        cellElement.dataset.col = col;

        cellElement.addEventListener('click', (e) => this.handleCellClick(e, row, col));
        cellElement.addEventListener('contextmenu', (e) => this.handleCellRightClick(e, row, col));
        
        return cellElement;
    }

    handleCellClick(event, row, col) {
        if (this.board.isGameOver) {
            return;
        }

        if (!this.startTime) {
            this.startTimer();
        }
        
        const result = this.board.revealCell(row, col);
        this.updateBoard();
        
        if (!result) {
            this.handleGameOver(false);
        } else if (this.board.isWon) {
            // Game won
            this.handleGameOver(true);
        }
    }

    handleCellRightClick(event, row, col) {
        event.preventDefault();
        
        if (this.board.isGameOver) {
            return;
        }

        if (!this.startTime) {
            this.startTimer();
        }
        
        this.board.toggleFlag(row, col);
        this.updateBoard();
        this.updateCounter();
    }

    updateBoard() {
        const cellElements = this.boardElement.querySelectorAll('.cell');
        
        cellElements.forEach((cellElement) => {
            const row = parseInt(cellElement.dataset.row);
            const col = parseInt(cellElement.dataset.col);
            const cell = this.board.cells[row][col];
            
            this.updateCellElement(cellElement, cell);
        });
    }

    updateCellElement(cellElement, cell) {

        cellElement.className = 'cell';
        cellElement.textContent = '';
        
        if (cell.isFlagged) {
            cellElement.classList.add('hidden', 'flag');
            cellElement.textContent = '🚩';
        } else if (cell.isRevealed) {
            cellElement.classList.add('revealed');
            
            if (cell.isMine) {
                cellElement.classList.add('mine');
                cellElement.textContent = '💣';
            } else if (cell.adjacentMines > 0) {
                cellElement.classList.add(`number${Math.min(cell.adjacentMines, 3)}`);
                cellElement.textContent = cell.adjacentMines;
            }
        } else {
            cellElement.classList.add('hidden');
        }
    }

    handleGameOver(won) {
        this.stopTimer();
        
        if (won) {
            this.updateFace(':>');
        } else {
            this.updateFace(':<');
        }
    }


    handleDifficultyChange(difficulty) {
        this.currentDifficulty = difficulty;
        this.startNewGame();
    }

    handleReset() {
        this.startNewGame();
    }

    updateCounter() {
        const remaining = this.board.getRemainingFlags();
        this.counterElement.textContent = String(remaining).padStart(3, '0');
    }

    updateTimer() {
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = String(Math.min(elapsed, 999)).padStart(3, '0');
        } else {
            this.timerElement.textContent = '000';
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateFace(emoji) {
        this.faceButton.textContent = emoji;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
