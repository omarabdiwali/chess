function king(col, pos) {
  let tR = pos - 7, tL = pos - 9, t = pos - 8, r = pos + 1,
    l = pos - 1, bR = pos + 9, bL = pos + 7, b = pos + 8;
  
  if (pos % 8 == 1) {
    let curValid = [tR, t, r, bR, b];
    let valid = [];
    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos);
      }
    }
    return valid;
  }

  else if (pos % 8 == 0) {
    let curValid = [tL, t, l, bL, b];
    let valid = [];
    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos);
      }
    }
    return valid;
  }

  else {
    let curValid = [tR, t, tL, r, l, bR, b, bL];
    let valid = [];

    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos);
      }
    }
    return valid;
  }
}