function queen(col, pos) {
  let a = rook(col, pos);
  let b;
  if (col == "w") {
    b = bishop("b", pos);
  }
  else {
    b = bishop("w", pos);
  } 
  let valid = a.concat(b.filter((item) => a.indexOf(item) < 0));
  return valid;
}