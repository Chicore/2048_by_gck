const board = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newGameButton').addEventListener('click', newGame);
    document.addEventListener('keydown', handleKeyPress);
    newGame();
});

function newGame() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    score = 0;
    updateScore();
    generateNewNumber();
    generateNewNumber();
    updateBoard();
    document.getElementById('gameover-container').style.display = 'none';
}

function generateNewNumber() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.getElementById(`grid-cell-${i}-${j}`);
            cell.textContent = board[i][j] === 0 ? '' : board[i][j];
            cell.style.backgroundColor = getBackgroundColor(board[i][j]);
        }
    }
}

function getBackgroundColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#ccc0b3';
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
    generateNewNumber();
    updateBoard();
    if (isGameOver()) {
        document.getElementById('gameover-container').style.display = 'block';
    }
}

function moveUp() {
    for (let j = 0; j < 4; j++) {
        let compressed = compress(board.map(row => row[j]));
        for (let i = 0; i < 4; i++) {
            board[i][j] = compressed[i];
        }
    }
}

function moveDown() {
    for (let j = 0; j < 4; j++) {
        let compressed = compress(board.map(row => row[j]).reverse()).reverse();
        for (let i = 0; i < 4; i++) {
            board[i][j] = compressed[i];
        }
    }
}

function moveLeft() {
    for (let i = 0; i < 4; i++) {
        board[i] = compress(board[i]);
    }
}

function moveRight() {
    for (let i = 0; i < 4; i++) {
        board[i] = compress(board[i].reverse()).reverse();
    }
}

function compress(row) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
        }
    }
    newRow = newRow.filter(val => val !== 0);
    while (newRow.length < 4) {
        newRow.push(0);
    }
    updateScore();
    return newRow;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}
// 添加一个函数来延迟操作
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleKeyPress(event) {
    let moved = false; // 用于判断是否有移动
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) { // 如果有移动，则生成新数字并更新界面
        await sleep(200); // 等待动画完成
        generateNewNumber();
        updateBoard();
    }
    if (isGameOver()) {
        document.getElementById('gameover-container').style.display = 'block';
    }
}

// 修改移动函数，返回是否有移动
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let compressed = compress(board.map(row => row[j]));
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== compressed[i]) {
                moved = true;
            }
            board[i][j] = compressed[i];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let compressed = compress(board.map(row => row[j]).reverse()).reverse();
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== compressed[i]) {
                moved = true;
            }
            board[i][j] = compressed[i];
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let compressed = compress(board[i]);
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== compressed[j]) {
                moved = true;
            }
            board[i][j] = compressed[j];
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let compressed = compress(board[i].reverse()).reverse();
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== compressed[j]) {
                moved = true;
            }
            board[i][j] = compressed[j];
        }
    }
    return moved;
}
// 添加触摸事件监听
const gridContainer = document.getElementById('grid-container');
let startX, startY, endX, endY;

// 触摸开始
gridContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
});

// 触摸结束
gridContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) { // 水平滑动
        if (deltaX > 0) {
            moveRight(); // 向右滑动
        } else {
            moveLeft(); // 向左滑动
        }
    } else { // 垂直滑动
        if (deltaY > 0) {
            moveDown(); // 向下滑动
        } else {
            moveUp(); // 向上滑动
        }
    }

    // 生成新数字并更新界面
    generateNewNumber();
    updateBoard();
    if (isGameOver()) {
        document.getElementById('gameover-container').style.display = 'block';
    }
});
