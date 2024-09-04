let minesweeper;
const scl = 70;

function setup() {
  const canvas = document.querySelector('canvas');
  if (canvas) canvas.remove();
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);

  minesweeper = new Minesweeper();
  minesweeper.init();
}

function draw() {
  background(255);

  const board = minesweeper.board;

  for (let col = 0; col < board.length; col++) {
    for (let row = 0; row < board[col].length; row++) {
      const x = scl * col;
      const y = scl * row;
      fill(255);
      stroke(0);
      strokeWeight(2);
      rect(x, y, scl, scl);
    }
  }

  for (const { col, row } of minesweeper.flagged) {
    const x = scl * col;
    const y = scl * row;
    fill('yellow');
    stroke(0);
    strokeWeight(2);
    rect(x, y, scl, scl);
  }

  for (const { col, row } of minesweeper.revealed) {
    const x = scl * col;
    const y = scl * row;
    fill(board[col][row] === -1 ? 'tomato' : 255);
    stroke(0);
    strokeWeight(2);
    rect(x, y, scl, scl);

    fill(0);
    stroke(0);
    strokeWeight(1);
    textSize(20);
    textAlign(CENTER);
    text(board[col][row], x + scl / 2, y + scl / 2 + 10);
  }
}

function mousePressed(event) {
  const col = floor(mouseX / scl);
  const row = floor(mouseY / scl);
  if (event.button === 2) {
    event.preventDefault();
    minesweeper.flag(col, row);
  } else {
    minesweeper.reveal(col, row);
  }
}

function windowResized() {
  setup();
}
