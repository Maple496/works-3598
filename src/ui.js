var UI = (function () {
  function drawBackground(g, w, h) {
    g.fillStyle = '#e8c88f';
    g.fillRect(0, 0, w, h);
  }
  function drawGrid(g, w, h, size) {
    var m = Board.metrics(w, h);
    g.strokeStyle = '#6b4a2b';
    g.lineWidth = 1;
    for (var i = 0; i < size; i++) {
      g.beginPath();
      g.moveTo(m.ox, m.oy + i * m.step);
      g.lineTo(m.ox + (size - 1) * m.step, m.oy + i * m.step);
      g.stroke();
      g.beginPath();
      g.moveTo(m.ox + i * m.step, m.oy);
      g.lineTo(m.ox + i * m.step, m.oy + (size - 1) * m.step);
      g.stroke();
    }
    var stars = [[3, 3], [11, 3], [7, 7], [3, 11], [11, 11]];
    g.fillStyle = '#6b4a2b';
    for (var s = 0; s < stars.length; s++) {
      var pt = Board.toPixel(w, h, stars[s][0], stars[s][1]);
      g.beginPath();
      g.arc(pt.px, pt.py, 3, 0, Math.PI * 2);
      g.fill();
    }
  }
  function drawStones(g, w, h, grid) {
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
        var p = grid[y][x];
        if (p === 0) continue;
        var pt = Board.toPixel(w, h, x, y);
        g.beginPath();
        g.arc(pt.px, pt.py, Board.metrics(w, h).step * 0.42, 0, Math.PI * 2);
        g.fillStyle = p === 1 ? '#111111' : '#f5f5f5';
        g.fill();
        g.strokeStyle = '#555555';
        g.lineWidth = 1;
        g.stroke();
      }
    }
  }
  function drawStatus(g, w, h, text) {
    g.fillStyle = 'rgba(0,0,0,0.55)';
    g.fillRect(0, h - 30, w, 30);
    g.fillStyle = '#ffffff';
    g.font = '14px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, w / 2, h - 15);
  }
  return { drawBackground: drawBackground, drawGrid: drawGrid, drawStones: drawStones, drawStatus: drawStatus };
})();
