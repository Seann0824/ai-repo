// 消消乐游戏逻辑

class Match3Game {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.score = 0;
        this.moves = 30;
        this.target = 1000;
        this.selectedGem = null;
        this.isProcessing = false;
        this.gemTypes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '💎'];
        this.gemColors = ['gem-red', 'gem-blue', 'gem-green', 'gem-yellow', 'gem-purple', 'gem-orange', 'gem-pink'];
        
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.showStartModal();
    }

    cacheDOM() {
        this.boardElement = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.targetElement = document.getElementById('target');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.startModal = document.getElementById('startModal');
        this.gameOverTitle = document.getElementById('gameOverTitle');
        this.gameOverText = document.getElementById('gameOverText');
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restart());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
    }

    showStartModal() {
        this.startModal.classList.remove('hidden');
    }

    startGame() {
        this.startModal.classList.add('hidden');
        this.createBoard();
        this.render();
    }

    createBoard() {
        this.board = [];
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row][col] = this.getRandomGem();
            }
        }
        // 确保初始棋盘没有匹配
        while (this.findMatches().length > 0) {
            this.removeMatches();
            this.fillBoard();
        }
    }

    getRandomGem() {
        return Math.floor(Math.random() * this.gemTypes.length);
    }

    render() {
        this.boardElement.innerHTML = '';
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const gem = document.createElement('div');
                gem.className = `gem ${this.gemColors[this.board[row][col]]}`;
                gem.textContent = this.gemTypes[this.board[row][col]];
                gem.dataset.row = row;
                gem.dataset.col = col;
                gem.addEventListener('click', (e) => this.handleGemClick(e, row, col));
                gem.addEventListener('touchstart', (e) => this.handleTouch(e, row, col));
                this.boardElement.appendChild(gem);
            }
        }
        this.updateUI();
    }

    handleGemClick(e, row, col) {
        if (this.isProcessing || this.moves <= 0) return;

        const gem = e.target;

        if (!this.selectedGem) {
            this.selectedGem = { row, col, element: gem };
            gem.classList.add('selected');
        } else {
            const prevRow = this.selectedGem.row;
            const prevCol = this.selectedGem.col;

            if (prevRow === row && prevCol === col) {
                gem.classList.remove('selected');
                this.selectedGem = null;
                return;
            }

            if (this.isAdjacent(prevRow, prevCol, row, col)) {
                this.swapGems(prevRow, prevCol, row, col);
            } else {
                this.selectedGem.element.classList.remove('selected');
                this.selectedGem = { row, col, element: gem };
                gem.classList.add('selected');
            }
        }
    }

    handleTouch(e, row, col) {
        e.preventDefault();
        this.handleGemClick(e, row, col);
    }

    isAdjacent(row1, col1, row2, col2) {
        return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }

    async swapGems(row1, col1, row2, col2) {
        this.isProcessing = true;
        
        // 交换
        [this.board[row1][col1], this.board[row2][col2]] = 
        [this.board[row2][col2], this.board[row1][col1]];

        const matches = this.findMatches();

        if (matches.length > 0) {
            this.moves--;
            this.selectedGem.element.classList.remove('selected');
            this.selectedGem = null;
            this.render();
            await this.processMatches();
        } else {
            // 没有匹配，交换回来
            [this.board[row1][col1], this.board[row2][col2]] = 
            [this.board[row2][col2], this.board[row1][col1]];
            
            // 显示错误动画
            const gem1 = document.querySelector(`[data-row="${row1}"][data-col="${col1}"]`);
            const gem2 = document.querySelector(`[data-row="${row2}"][data-col="${col2}"]`);
            gem1.classList.add('shake');
            gem2.classList.add('shake');
            
            setTimeout(() => {
                gem1.classList.remove('shake');
                gem2.classList.remove('shake');
                this.selectedGem.element.classList.remove('selected');
                this.selectedGem = null;
                this.render();
                this.isProcessing = false;
            }, 300);
        }
    }

    findMatches() {
        const matches = [];
        const visited = new Set();

        // 检查横向匹配
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize - 2; col++) {
                const gem = this.board[row][col];
                let matchLength = 1;
                
                while (col + matchLength < this.boardSize && 
                       this.board[row][col + matchLength] === gem) {
                    matchLength++;
                }
                
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        const key = `${row},${col + i}`;
                        if (!visited.has(key)) {
                            visited.add(key);
                            matches.push({ row, col: col + i });
                        }
                    }
                }
            }
        }

        // 检查纵向匹配
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = 0; row < this.boardSize - 2; row++) {
                const gem = this.board[row][col];
                let matchLength = 1;
                
                while (row + matchLength < this.boardSize && 
                       this.board[row + matchLength][col] === gem) {
                    matchLength++;
                }
                
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        const key = `${row + i},${col}`;
                        if (!visited.has(key)) {
                            visited.add(key);
                            matches.push({ row: row + i, col });
                        }
                    }
                }
            }
        }

        return matches;
    }

    async processMatches() {
        let hasMatches = true;
        let combo = 0;

        while (hasMatches) {
            const matches = this.findMatches();
            
            if (matches.length === 0) {
                hasMatches = false;
                break;
            }

            combo++;
            
            // 计算得分
            const baseScore = matches.length * 10;
            const comboBonus = combo > 1 ? (combo - 1) * 20 : 0;
            const points = baseScore + comboBonus;
            this.score += points;

            // 显示连击
            if (combo > 1) {
                this.showCombo(combo);
            }

            // 标记匹配的宝石
            matches.forEach(({ row, col }) => {
                const gem = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (gem) gem.classList.add('matched');
            });

            await this.delay(300);

            // 移除匹配的宝石
            matches.forEach(({ row, col }) => {
                this.board[row][col] = -1;
            });

            this.render();
            
            // 宝石下落
            await this.dropGems();
            
            // 填充新宝石
            this.fillBoard();
            this.render();
            
            await this.delay(200);
        }

        this.isProcessing = false;
        this.updateUI();
        this.checkGameEnd();
    }

    async dropGems() {
        for (let col = 0; col < this.boardSize; col++) {
            let emptyRow = this.boardSize - 1;
            
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col] !== -1) {
                    if (row !== emptyRow) {
                        this.board[emptyRow][col] = this.board[row][col];
                        this.board[row][col] = -1;
                    }
                    emptyRow--;
                }
            }
        }
    }

    fillBoard() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === -1) {
                    this.board[row][col] = this.getRandomGem();
                }
            }
        }
    }

    removeMatches() {
        const matches = this.findMatches();
        matches.forEach(({ row, col }) => {
            this.board[row][col] = -1;
        });
    }

    showCombo(combo) {
        const comboText = document.createElement('div');
        comboText.className = 'combo-text';
        comboText.textContent = `${combo} 连击!`;
        comboText.style.left = '50%';
        comboText.style.top = '40%';
        comboText.style.transform = 'translateX(-50%)';
        document.body.appendChild(comboText);
        
        setTimeout(() => comboText.remove(), 1000);
    }

    showHint() {
        // 简单的提示：找到第一个可能的交换
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // 尝试与右边交换
                if (col < this.boardSize - 1) {
                    [this.board[row][col], this.board[row][col + 1]] = 
                    [this.board[row][col + 1], this.board[row][col]];
                    
                    if (this.findMatches().length > 0) {
                        [this.board[row][col], this.board[row][col + 1]] = 
                        [this.board[row][col + 1], this.board[row][col]];
                        
                        const gem1 = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        const gem2 = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
                        gem1.classList.add('hint');
                        gem2.classList.add('hint');
                        
                        setTimeout(() => {
                            gem1.classList.remove('hint');
                            gem2.classList.remove('hint');
                        }, 2000);
                        return;
                    }
                    
                    [this.board[row][col], this.board[row][col + 1]] = 
                    [this.board[row][col + 1], this.board[row][col]];
                }
                
                // 尝试与下边交换
                if (row < this.boardSize - 1) {
                    [this.board[row][col], this.board[row + 1][col]] = 
                    [this.board[row + 1][col], this.board[row][col]];
                    
                    if (this.findMatches().length > 0) {
                        [this.board[row][col], this.board[row + 1][col]] = 
                        [this.board[row + 1][col], this.board[row][col]];
                        
                        const gem1 = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        const gem2 = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
                        gem1.classList.add('hint');
                        gem2.classList.add('hint');
                        
                        setTimeout(() => {
                            gem1.classList.remove('hint');
                            gem2.classList.remove('hint');
                        }, 2000);
                        return;
                    }
                    
                    [this.board[row][col], this.board[row + 1][col]] = 
                    [this.board[row + 1][col], this.board[row][col]];
                }
            }
        }
    }

    checkGameEnd() {
        if (this.score >= this.target) {
            this.gameOver(true);
        } else if (this.moves <= 0) {
            this.gameOver(false);
        }
    }

    gameOver(won) {
        this.gameOverTitle.textContent = won ? '🎉 恭喜过关!' : '😢 游戏结束';
        this.gameOverText.textContent = `最终得分: ${this.score}`;
        this.gameOverModal.classList.remove('hidden');
    }

    restart() {
        this.score = 0;
        this.moves = 30;
        this.selectedGem = null;
        this.isProcessing = false;
        this.gameOverModal.classList.add('hidden');
        this.createBoard();
        this.render();
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.movesElement.textContent = this.moves;
        this.targetElement.textContent = this.target;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 启动游戏
const game = new Match3Game();
