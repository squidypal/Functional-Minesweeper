
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }

    reveal() {
        if (this.isFlagged || this.isRevealed) {
            return false;
        }
        this.isRevealed = true;
        return true;
    }

    toggleFlag() {
        if (!this.isRevealed) {
            this.isFlagged = !this.isFlagged;
        }
    }

    setMine() {
        this.isMine = true;
    }

    incrementAdjacentMines() {
        this.adjacentMines++;
    }
}

class Board {
    constructor(rows, cols, mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.cells = [];
        this.isGameOver = false;
        this.isWon = false;
        this.firstClick = true;
        
        this.initializeCells();
    }


    initializeCells() {
        for (let r = 0; r < this.rows; r++) {
            this.cells[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.cells[r][c] = new Cell(r, c);
            }
        }
    }

    placeMines(avoidRow, avoidCol) {
        let minesPlaced = 0;
        
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // Avoid first clicked cell and already placed mines
            if ((row === avoidRow && col === avoidCol) || this.cells[row][col].isMine) {
                continue;
            }
            
            this.cells[row][col].setMine();
            minesPlaced++;
        }
        
        this.calculateAdjacentMines();
    }

    calculateAdjacentMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.cells[r][c].isMine) {
                    const count = this.countAdjacentMines(r, c);
                    this.cells[r][c].adjacentMines = count;
                }
            }
        }
    }

    countAdjacentMines(row, col) {
        let count = 0;
        const neighbors = this.getNeighbors(row, col);
        
        for (const neighbor of neighbors) {
            if (neighbor.isMine) {
                count++;
            }
        }
        
        return count;
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                neighbors.push(this.cells[newRow][newCol]);
            }
        }
        
        return neighbors;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    revealCell(row, col) {
        const cell = this.cells[row][col];

        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
        }

        if (!cell.reveal()) {
            return true;
        }

        if (cell.isMine) {
            this.isGameOver = true;
            this.revealAllMines();
            return false;
        }

        if (cell.adjacentMines === 0) {
            this.floodFill(row, col);
        }

        this.checkWinCondition();
        
        return true;
    }

    floodFill(row, col) {
        const neighbors = this.getNeighbors(row, col);
        
        for (const neighbor of neighbors) {
            if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.reveal();
                
                if (neighbor.adjacentMines === 0) {
                    this.floodFill(neighbor.row, neighbor.col);
                }
            }
        }
    }

    toggleFlag(row, col) {
        if (!this.isGameOver) {
            this.cells[row][col].toggleFlag();
        }
    }

    revealAllMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.cells[r][c].isMine) {
                    this.cells[r][c].isRevealed = true;
                }
            }
        }
    }

    checkWinCondition() {
        let revealedCount = 0;
        const totalNonMines = (this.rows * this.cols) - this.mineCount;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.cells[r][c].isRevealed && !this.cells[r][c].isMine) {
                    revealedCount++;
                }
            }
        }
        
        if (revealedCount === totalNonMines) {
            this.isWon = true;
            this.isGameOver = true;
        }
    }

    getRemainingFlags() {
        let flaggedCount = 0;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.cells[r][c].isFlagged) {
                    flaggedCount++;
                }
            }
        }
        
        return this.mineCount - flaggedCount;
    }
}

export { Cell, Board };
