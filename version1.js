document.addEventListener("DOMContentLoaded", () => {

  let playerName = '';
  const WIDTH = 7;
  const HEIGHT = 6;

  let currPlayer = 1;
  const board = [];
  const elems = {
    nameInput: document.getElementById("playerName"),
    submitName: document.getElementById("submitName"),
    startGame: document.getElementById("start-game"),
  };

  elems.submitName.onclick = () => {
    playerName = elems.nameInput.value.trim();

    if (playerName) {
      elems.nameInput.style.display = "none";
      elems.submitName.style.display = "none";
      startGame();
    } else {
      alert("Please enter a valid name!");
    }
  };

  function startGame() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.display = "block";
    document.getElementById("start-game").style.display = "none";
    resetGame();
    makeBoard();
    makeHtmlBoard();
  }

  function makeBoard() {
    for (let y = 0; y < HEIGHT; y++) {
      board[y] = Array.from({ length: WIDTH });
    }
  }

  function makeHtmlBoard() {
    const htmlBoard = document.querySelector("#board");

    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  function findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }

  function placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${currPlayer}`);
    piece.style.top = "-100vh";

    const cell = document.getElementById(`${y}-${x}`);
    cell.append(piece);

    setTimeout(() => {
      piece.style.top = "0";
    }, 0);
  }

  function endGame(msg) {
    alert(msg);
    document.getElementById("restart-game").style.display = "inline-block";
  }

  function handleClick(evt) {
    const x = +evt.target.id;

    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    board[y][x] = currPlayer;
    placeInTable(y, x);

    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }

    if (board.every((row) => row.every((cell) => cell))) {
      return endGame("Tie!");
    }

    currPlayer = currPlayer === 1 ? 2 : 1;

    updateTurnDisplay();
  }

  function updateTurnDisplay() {
    const currentPlayerSpan = document.querySelector("#current-player span");
    currentPlayerSpan.textContent = currPlayer;
    currentPlayerSpan.innerText = `${currPlayer}`;

    if (currPlayer === 1) {
      currentPlayerSpan.style.color = "red";
    } else {
      currentPlayerSpan.style.color = "blue";
    }
  }

  function checkForWin() {
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  function restartGame() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("start-game").style.display = "inline-block";
    document.getElementById("restart-game").style.display = "none";
    resetGame();
  }

  function resetGame() {
    board.length = 0;

    const htmlBoard = document.querySelector("#board");
    while (htmlBoard.firstChild) {
      htmlBoard.removeChild(htmlBoard.firstChild);
    }
  }
  makeBoard();
  makeHtmlBoard();

  document.getElementById("start-game").addEventListener("click", startGame);
  document.getElementById("restart-game").addEventListener("click", restartGame);
});
