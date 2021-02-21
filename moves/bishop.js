function bishop(col, pos) {
  let rPos = pos - 7;
  let lPos = pos - 9;
  let drPos = pos + 9;
  let dlPos = pos + 7;

  let valid = [];
  let run = true;

  let activeUpRight = true;
  let activeUpLeft = true;
  let activeDownRight = true;
  let activeDownLeft = true;

  while (run) {
    let ruPiece = currPositions[rPos];
    let rdPiece = currPositions[drPos];
    let luPiece = currPositions[lPos];
    let ldPiece = currPositions[dlPos];

    let end = true;

    if ((!ruPiece || (ruPiece && ruPiece[0] == col)) && rPos >= 1 && rPos <= 64 && activeUpRight && pos % 8 != 0) {
      valid.push(rPos);
      if (ruPiece || rPos % 8 == 0) {
        activeUpRight = false;
      }
      rPos -= 7;
      end = false;
    }

    if ((!rdPiece || (rdPiece && rdPiece[0] == col)) && drPos >= 1 && drPos <= 64 && activeDownRight && pos % 8 != 0) {
      valid.push(drPos);
      if (rdPiece || drPos % 8 == 0) {
        activeDownRight = false;
      }
      drPos += 9;
      end = false;
    }

    if ((!luPiece || (luPiece && luPiece[0] == col)) && lPos >= 1 && lPos <= 64 && activeUpLeft && pos % 8 != 1) {
      valid.push(lPos);
      if (luPiece || lPos % 8 == 1) {
        activeUpLeft = false;
      }
      lPos -= 9;
      end = false;
    }

    if ((!ldPiece || (ldPiece && ldPiece[0] == col)) && dlPos >= 1 && dlPos <= 64 && activeDownLeft && pos % 8 != 1) {
      valid.push(dlPos);
      if (ldPiece || dlPos % 8 == 1) {
        activeDownLeft = false;
      }
      dlPos += 7;
      end = false;
    }

    if (end) {
      run = false;
    }
  }  
  return valid;
}