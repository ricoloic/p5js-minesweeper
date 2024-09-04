function Minesweeper() {}

Minesweeper.prototype.init = function (difficulty = 'beginner') {
  let cols;
  let rows;
  let mineCount;

  if (difficulty === 'beginner') {
    cols = 8;
    rows = 8;
    mineCount = 10;
  } else if (difficulty === 'intermediate') {
    cols = 16;
    rows = 16;
    mineCount = 40;
  } else if (difficulty === 'expert') {
    cols = 16;
    rows = 30;
    mineCount = 99;
  }

  this.cols = cols;
  this.rows = rows;
  this.mineCount = mineCount;

  const availableSpots = [];

  this.revealed = [];
  this.flagged = [];
  this.board = [];
  for (let col = 0; col < cols; col++) {
    this.board[col] = [];
    for (let row = 0; row < rows; row++) {
      this.board[col][row] = null;
      availableSpots.push({ col, row });
    }
  }

  for (let i = 0; i < mineCount; i++) {
    const index = floor(random(0, availableSpots.length));
    const [{ col, row }] = availableSpots.splice(index, 1);
    this.board[col][row] = -1;
  }

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (this.board[col][row] === -1) continue;

      let neighbouringMines = 0;

      for (let x = col - 1; x <= col + 1; x++) {
        if (x < 0 || x > cols - 1) continue;
        for (let y = row - 1; y <= row + 1; y++) {
          if (y < 0 || y > rows - 1) continue;
          if (this.board[x][y] === -1) {
            neighbouringMines++;
          }
        }
      }

      this.board[col][row] = neighbouringMines;
    }
  }
};

Minesweeper.prototype.flag = function (col, row) {
  if (col >= this.cols || col < 0 || row >= this.rows || row < 0) {
    return;
  }

  const isRevealed = this.revealed.findIndex((spot) => col === spot.col && row === spot.row) !== -1;
  if (isRevealed) {
    return;
  }

  const flagIndex = this.flagged.findIndex((spot) => col === spot.col && row === spot.row);
  if (flagIndex !== -1) {
    this.flagged.splice(flagIndex, 1);
  } else {
    this.flagged.push({ col, row });
  }
};

Minesweeper.prototype.reveal = function (col, row) {
  if (col >= this.cols || col < 0 || row >= this.rows || row < 0) {
    return;
  }

  const isRevealed = this.revealed.findIndex((spot) => col === spot.col && row === spot.row) !== -1;
  const isFlagged = this.flagged.findIndex((spot) => col === spot.col && row === spot.row) !== -1;
  if (isRevealed || isFlagged) {
    return;
  }

  if (this.revealed.length === 0 && this.board[col][row] !== 0) {
    this.init();
    this.reveal(col, row);
    return;
  }

  this.revealed.push({ col, row });

  if (this.board[col][row] === -1) {
    // lose the game
    this.revealAll();
    return;
  }

  if (this.board[col][row] === 0) {
    for (let x = col - 1; x <= col + 1; x++) {
      if (x < 0 || x > this.cols - 1) continue;
      for (let y = row - 1; y <= row + 1; y++) {
        if (y < 0 || y > this.rows - 1) continue;
        this.reveal(x, y);
      }
    }
  }
};

Minesweeper.prototype.revealAll = function () {
  for (let col = 0; col < this.cols; col++) {
    for (let row = 0; row < this.rows; row++) {
      this.reveal(col, row);
    }
  }
};
