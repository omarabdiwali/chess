function knight(col, pos) {
  let rPos = pos - 6, rPos1 = pos + 10, lPos = pos - 10, lPos1 = pos + 6,
      dPos = pos + 15, dPos1 = pos + 17, uPos = pos - 15, uPos1 = pos - 17;
  
  if (pos % 8 == 1) {
    let curValid = [rPos, rPos1, dPos1, uPos];
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
    let curValid = [lPos, lPos1, dPos, uPos1];
    let valid = [];

    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos)
      }
    }

    return valid;
  }

  else if (pos % 8 == 7) {
    let curValid = [lPos, lPos1, uPos, uPos1, dPos, dPos1];
    let valid = [];

    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos)
      }
    }

    return valid;

  }

  else if (pos % 8 == 2) {
    let curValid = [rPos, rPos1, uPos, uPos1, dPos, dPos1];
    let valid = [];

    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos)
      }
    }

    return valid;

  }

  else {
    let curValid = [lPos, lPos1, rPos, rPos1, uPos, uPos1, dPos, dPos1];
    let valid = [];

    for (let i = 0; i < curValid.length; i++) {
      const curPos = curValid[i];
      if (curPos <= 64 && curPos >= 1 && checkSamePiece(curPos, col)) {
        valid.push(curPos)
      }
    }

    return valid;

  }
}