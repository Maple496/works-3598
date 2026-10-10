var Board = (function () {
  var SIZE = 15;
  function metrics(w, h) {
    var pad = 28;
    var cell = Math.min(w, h) - pad * 2;
    var step = cell / (SIZE - 1);
    return { pad: pad, step: step, ox: (w - cell) / 2, oy: (h - cell) / 2 };
  }
  function toPixel(w, h, x, y) {
    var m = metrics(w, h);
    return { px: m.ox + x * m.step, py: m.oy + y * m.step };
  }
  function pick(w, h, mx, my) {
    var m = metrics(w, h);
    var fx = (mx - m.ox) / m.step;
    var fy = (my - m.oy) / m.step;
    var x = Math.round(fx);
    var y = Math.round(fy);
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return null;
    var dx = fx - x;
    var dy = fy - y;
    if (Math.sqrt(dx * dx + dy * dy) > 0.42) return null;
    return { x: x, y: y };
  }
  return { SIZE: SIZE, metrics: metrics, toPixel: toPixel, pick: pick };
})();
