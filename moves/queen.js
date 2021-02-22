function queen(col, pos) {
  let a = rook(col, pos);
  let b = col == "w" ? bishop("b", pos) : bishop("w", pos);
  let valid = a.concat(b.filter((item) => a.indexOf(item) < 0));
  return valid;
}
