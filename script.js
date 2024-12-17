function game() {
  const startNewGame = document.querySelector('.start-new-game');
  const popup = document.querySelector('.popup');
  const butonX = document.querySelector('.button-x');
  const butonO = document.querySelector('.button-o');
  const winMessage = document.querySelector('.winner-message');
  const cells = document.querySelectorAll('.cell');

  let human = 'x';
  let ai = 'o';
  const setXO = (humanChar) => {
    if (humanChar === 'x') {
      return () => {
        ai = 'o';
        human = 'x';
        popup.style.display = 'none';
      };
    } else if (humanChar === 'o') {
      return () => {
        ai = 'x';
        human = 'o';
        popup.style.display = 'none';
        const random = Math.floor(Math.random() * 8);
        turn(random, ai);
      };
    }
  };
  butonX.addEventListener('click', setXO('x'));
  butonO.addEventListener('click', setXO('o'));

  startNewGame.addEventListener('click', startGame);
  const cellsArr = Array.from(cells);
  const winCombos = [[0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]];
  let origBoard;
  function startGame() {
    origBoard = Array.from(Array(9).keys());
    winMessage.style.display = 'none';
    cellsArr.forEach((item) => {
      item.innerHTML='';
      item.classList.remove('green', 'red', 'blue');
      item.addEventListener('click', turnClick, false);
    });
    popup.style.display = 'flex';
  }
  function turnClick(cell) {
    if (typeof origBoard[cell.target.id] === 'number') {
      turn(cell.target.id, human);
      console.log(origBoard);
      if (!checkWin(origBoard, human) && !checkTie()) {
        turn(bestSpot(), ai);
      }
      console.log(origBoard);
    }
  }
  function gameOver(gameWon) {
    for (const index of winCombos[gameWon.index]) {
      document.getElementById(index).classList.add(gameWon.player == human ? 'blue' : 'red');
    }
    for (let i = 0; i < cellsArr.length; i += 1) {
      cellsArr[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === human ? 'You won!' : 'You lose!');
  }
  function checkTie() {
    if (emptySquares().length === 0) {
      for (let i = 0; i < cellsArr.length; i += 1) {
        cellsArr[i].classList.add('green');
        cellsArr[i].removeEventListener('click', turnClick, false);
      }
      declareWinner('Tie!');
      return true;
    }
    return false;
  }
  function renderCell(id, player) {
    const html = (player === 'x') ? 
       '<span><i class="fa fa-times" aria-hidden="true"></i></span>':
        '<span><i class="fa fa-circle-o" aria-hidden="true"></i>'
    document.getElementById(id).innerHTML = html;
  }
  function turn(id, player) {
    origBoard[id] = player;
    renderCell(id, player);
    //document.getElementById(id).classList.add(player);
    const gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
    checkTie();
  }
  function checkWin(board, player) {
    const plays = board.reduce((acc, elem, index) => {
      if (elem === player) {
        return acc.concat(index);
      } else {
        return acc;
      }
    }, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index, player};
        break;
      }
    }
    return gameWon;
  }
  function declareWinner(who) {
    winMessage.style.display = 'block';
    winMessage.innerText = who;
    
   
  }
  function bestSpot() {
    return minimax(origBoard, ai).index;
  }
  function emptySquares() {
    return origBoard.filter(item => typeof item === 'number');
  }
  function minimax(newBoard, player) {
    const availSpots = emptySquares(newBoard);
    if (checkWin(newBoard, human)) {
      return { score: -10 };
    } else if (checkWin(newBoard, ai)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    const moves = [];
    for (let i = 0; i < availSpots.length; i += 1) {
      const move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;
      if (player === ai) {
        const result = minimax(newBoard, human);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, ai);
        move.score = result.score;
      }
      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }
    let bestMove;
    if (player === ai) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i += 1) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i += 1) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
  startGame();
}
game();