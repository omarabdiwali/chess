let squares = {};
let currPositions = {};
let a = 646 / 9;
let valid = [];
let endGame = false;

let movePiece;
let prevPos;
let move = "w";
let turn = document.getElementById('turn');
let button = document.getElementById('restart');

function setup() {
  createCanvas(646, 646);
  let curr = 1;
  let startString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  let drawPos = 1;
  
  let bPawn = 1;
  let wPawn = 1;
  let bRook = 1;
  let wRook = 1;
  let bKnight = 1;
  let wKnight = 1;
  let bBishop = 1;
  let wBishop = 1;

  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      (i + j) % 2 == 0 ? fill(222, 184, 135) : fill(85, 107, 47);
      square(a * j, a * i, a);
      squares[curr] = `${(a * j + 5)}, ${(a * i + 5)}`;
      curr += 1;
    }
  }

  for (let i = 0; i < startString.length; i++) {
    
    let letter = startString[i];

    if (letter >= '0' && letter <= '9' && letter != '/') {
      letter = Number(letter);
      for (let i = drawPos; i <= drawPos + letter; i++) {
        currPositions[i] = null;
      }
      drawPos += letter;
    }
    
    else if (letter == letter.toLowerCase() && letter != '/') {
      let img, type;
      if (letter == 'p') {
        img = p;
        type = 'bPawn ' + String(bPawn);
        bPawn += 1;
      }
      else if (letter == 'r') {
        img = r;
        type = 'bRook ' + String(bRook);
        bRook += 1;
      }
      else if (letter == 'n') {
        img = n;
        type = 'bKnight ' + String(bKnight);
        bKnight += 1;
      }
      else if (letter == 'b') {
        img = b;
        type = "bBishop " + String(bBishop);
        bBishop += 1;
      }
      else if (letter == 'k') {
        img = k;
        type = "bKing";
      }
      else if (letter == 'q') {
        img = q;
        type = "bQueen";
      }
      let pos = squares[drawPos];
      pos = pos.split(', ');
      let x = pos[0], y = pos[1];
      image(img, x, y);
      
      currPositions[drawPos] = type;
      drawPos += 1;
    }

    else if (letter == letter.toUpperCase() && letter != '/') {
      let img, type;
      if (letter == 'P') {
        img = P;
        type = 'wPawn ' + String(wPawn);
        wPawn += 1;
      }
      else if (letter == 'R') {
        img = R;
        type = 'wRook ' + String(wRook);
        wRook += 1;
      }
      else if (letter == 'N') {
        img = N;
        type = 'wKnight ' + String(wKnight);
        wKnight += 1;
      }
      else if (letter == 'B') {
        img = B;
        type = 'wBishop ' + String(wBishop);
        wBishop += 1;
      }
      else if (letter == 'K') {
        img = K;
        type = "wKing";
      }
      else if (letter == 'Q') {
        img = Q;
        type = "wQueen";
      }
      let pos = squares[drawPos];
      pos = pos.split(', ');
      let x = pos[0], y = pos[1];
      image(img, x, y);
      currPositions[drawPos] = type;
      drawPos += 1;
    }
  }
}

function draw() {
  if (mouseIsPressed) {
    let x = Math.floor(mouseX / a);
    let y = Math.floor(mouseY / a);
    let pos = (y - 1) * 8 + x;
    let row = Math.floor(pos / 8);
        
    let column = pos - (8 * row);
    if (column == 0) {
      column += 1;
    }
    
    let piece = currPositions[pos];

    if (endGame) {
      return;
    }

    if (piece && (valid && !valid.includes(pos))) {
      if (piece[0] != move) {
        return;
      }
      else {
        valid = [];
      }
    }

    if (valid.length > 0) {
      if (pos != prevPos) {
        let prevRow = Math.floor(prevPos / 8);
        let prevColumn = prevPos - (prevRow * 8);
        if (prevColumn == 0) {
          prevColumn = 1;
        }
        let colour = (prevColumn + prevRow) % 2 == 0;
        let img = moveSq(pos, valid, colour, movePiece, prevPos);
        if (img) {
          valid = [];
          move = move == "w" ? "b" : "w";
          if (!Object.values(currPositions).includes("bKing")) {
            turn.innerHTML = "White Wins!";
            endGame = true;
          }
          else if (!Object.values(currPositions).includes("wKing")) {
            turn.innerHTML = "Black Wins!";
            endGame = true;
          }
          else {
            turn.innerHTML = move == "w" ? "White Moves" : "Black Moves";
          }
        }
      }
    }

    else {
      if (piece) {
        movePiece = piece;
        prevPos = pos;
        valid = getValidMoves(piece, pos);
      }
    
      if (valid) {
        for (let i = 0; i < valid.length; i++) {
          let currPos = valid[i];
          let row = Math.floor(currPos / 8);
          let column = currPos - (8 * row);
          if (column == 0) {
            column += 1;
          }
        }
      }
    }
  }
}

function moveSq(pos1, valid, colour, piece, prevPos) {
  if (valid.includes(pos1)) {
    colour ? fill(85, 107, 47) : fill(222, 184, 135);

    if (pos1 >= 1 && pos1 <= 8 && piece.includes("wPawn")) {
      piece = "wQueen"
    }
    else if (pos1 >= 57 && pos1 <= 64 && piece.includes("bPawn")) {
      piece = "bQueen";
    }
    
    let loc = squares[prevPos];
    loc = loc.split(', ');
    let locX = loc[0] - 5, locY = loc[1] - 5;
    
    square(locX, locY, a);
    
    let movSq = squares[pos1];
    movSq = movSq.split(', ');
    let x2 = movSq[0], y2 = movSq[1];
    let img = getImage(piece);

    let cRow = Math.floor(pos1 / 8);
    let cColumn = pos1 - (cRow * 8);
    
    if (cColumn == 0) {
      cColumn = 1;
    }

    (cColumn + cRow) % 2 == 0 ? fill(85, 107, 47) : fill(222, 184, 135);
    square(x2 - 5, y2 - 5, a);

    currPositions[prevPos] = null;
    currPositions[pos1] = piece;
    
    image(img, x2, y2);
    return true;
  }
}

function getImage(piece) {
  if (piece.includes("wPawn")) {
    return P;
  }
  else if (piece.includes("bPawn")) {
    return p;
  }

  else if (piece.includes("wRook")) {
    return R;
  }

  else if (piece.includes("bRook")) {
    return r;
  }

  else if (piece.includes("wKnight")) {
    return N;
  }

  else if (piece.includes("bKnight")) {
    return n;
  }

  else if (piece.includes("wBishop")) {
    return B;
  }

  else if (piece.includes("bBishop")) {
    return b;
  }

  else if (piece.includes("wQueen")) {
    return Q;
  }

  else if (piece.includes("bQueen")) {
    return q;
  }

  else if (piece.includes('wKing')) {
    return K;
  }

  else if (piece.includes("bKing")) {
    return k;
  }
}

button.addEventListener('click', () => {
  clear();
  valid = [];
  movePiece;
  prevPos;
  move = "w";
  squares = {};
  currPositions = {};
  turn.innerHTML = "White Moves";
  endGame = false;
  setup();
})