var Engine = (function () {
  var SIZE = 15;
  var grid, current, winner, moves;
  function reset() {
    grid = [];
    for (var y = 0; y < SIZE; y++) {
      var row = [];
      for (var x = 0; x < SIZE; x++) row.push(0);
      grid.push(row);
    }
    current = 1;
    winner = 0;
    moves = [];
  }
  function checkLine(x, y, dx, dy) {
    var p = grid[y][x];
    var n = 1;
    var i = 1;
    while (x + dx * i >= 0 && x + dx * i < SIZE && y + dy * i >= 0 && y + dy * i < SIZE && grid[y + dy * i][x + dx * i] === p) { n++; i++; }
    i = 1;
    while (x - dx * i >= 0 && x - dx * i < SIZE && y - dy * i >= 0 && y - dy * i < SIZE && grid[y - dy * i][x - dx * i] === p) { n++; i++; }
    return n >= 5;
  }
  function place(x, y) {
    if (winner !== 0 || x < 0 || x >= SIZE || y < 0 || y >= SIZE || grid[y][x] !== 0) return false;
    grid[y][x] = current;
    moves.push({ x: x, y: y, p: current });
    var dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (var d = 0; d < dirs.length; d++) {
      if (checkLine(x, y, dirs[d][0], dirs[d][1])) { winner = current; break; }
    }
    if (winner === 0) current = current === 1 ? 2 : 1;
    return true;
  }
  function state() {
    return { size: SIZE, grid: grid, current: current, winner: winner, moves: moves.length };
  }
  reset();
  return { SIZE: SIZE, reset: reset, place: place, state: state };
})();
