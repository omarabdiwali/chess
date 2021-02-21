function rook(col, pos) {
  let rMove = 1;
  let lMove = 1;

  let nxtPos = pos + 8;
  let prevPos = pos - 8;
  let run = true;

  let bcount = 0;
  let bcount1 = 0;
  let bcount2 = 0;
  let bcount3 = 0;

  let validPos = [];

  while (run) {
    let rNxt = pos + rMove;
    let lNxt = pos - lMove;

    let piece = currPositions[nxtPos];
    let prevPiece = currPositions[prevPos];
    let rPiece = currPositions[rNxt];
    let lPiece = currPositions[lNxt];

    let end = true;

    if ((!piece || piece[0] != col) && bcount == 0 && nxtPos <= 64 && nxtPos >= 1) {
      validPos.push(nxtPos);
      if (piece && piece[0] != col) {
        bcount = 1;
      }
      nxtPos += 8;
      end = false;
    }

    if ((!prevPiece || prevPiece[0] != col) && bcount3 == 0 && prevPos <= 64 && prevPos >= 1) {
      validPos.push(prevPos);
      if (prevPiece && prevPiece[0] != col) {
        bcount3 = 1;
      }
      prevPos -= 8;
      end = false;
    }

    if ((!rPiece || rPiece[0] != col) && bcount1 == 0 && pos % 8 != 0) {
      validPos.push(rNxt);
      if (rNxt % 8 == 0 || (rPiece && rPiece[0] != col)) {
        bcount1 = 1;
      }
      rMove += 1;
      end = false;
    }

    if ((!lPiece || lPiece[0] != col) && bcount2 == 0 && pos % 8 != 1) {
      validPos.push(lNxt);
      if (lNxt % 8 == 1 || (lPiece && lPiece[0] != col)) {
        bcount2 = 1;
      }
      lMove += 1
      end = false;
    }

    if (end) {
      run = false;
    }
  }
  return validPos;
}