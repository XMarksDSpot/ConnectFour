class Game {
  constructor(height = 6, width = 7) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.currPlayer = 1; 
    this.board = []; 
    this.playerNames = ['', ''];
    this.gameContainer = document.getElementById("game-container");
    this.htmlBoard = document.getElementById("board");
    this.startButton = document.getElementById("start-game");
    this.restartButton = document.getElementById("restart-game");
    this.playerInput = document.getElementById("playerName");
    this.submitButton = document.getElementById("submitName");
    this.currentPlayerSpan = document.getElementById("current-player");
    
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
    this.submitButton.addEventListener("click", () => this.setPlayerNames());
    this.makeBoard();
    this.makeHtmlBoard();
  }

  setPlayerNames() {
    let playerName = this.playerInput.value.trim();

    if (!this.playerNames[0]) {
      if (playerName) {
        this.playerNames[0] = playerName;
        this.playerInput.value = '';
        alert("Enter Player 2's name");
      } else {
        alert("Please enter a valid name for Player 1!");
      }
    } else if (!this.playerNames[1]) {
      if (playerName) {
        this.playerNames[1] = playerName;
        this.playerInput.style.display = "none";
        this.submitButton.style.display = "none";
        this.startGame();
      } else {
        alert("Please enter a valid name for Player 2!");
      }
    }
  }

  startGame() {
    this.gameContainer.style.display = "block";
    this.startButton.style.display = "none";
    this.resetGame();
    this.updateTurnDisplay();
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board[y] = Array.from({ length: this.WIDTH });
    }
  }

  makeHtmlBoard() {
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    this.htmlBoard.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      this.htmlBoard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = "-100vh";

    const cell = document.getElementById(`${y}-${x}`);
    cell.append(piece);

    setTimeout(() => {
      piece.style.top = "0";
    }, 0);
  }

  endGame(msg) {
    alert(msg);
    this.restartButton.style.display = "inline-block";
  }

  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} ${this.playerNames[this.currPlayer - 1]} won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame("Tie game!");
    }

    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    this.updateTurnDisplay();
  }

  updateTurnDisplay() {
    const playerName = this.playerNames[this.currPlayer - 1];
    this.currentPlayerSpan.textContent = playerName;
    this.currentPlayerSpan.style.color = this.currPlayer === 1 ? "red" : "#0582af";
  }

  checkForWin() {
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  restartGame() {
    this.board = [];
    this.makeBoard();
    this.htmlBoard.innerHTML = '';
    this.makeHtmlBoard();
    this.currPlayer = 1;
    this.updateTurnDisplay();
    this.restartButton.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
