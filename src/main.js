if (typeof Work === 'undefined') {
  var Work = (function () {
    var defs = {};
    return {
      register: function (d) { defs[d.name] = d; },
      get: function (n) { return defs[n]; }
    };
  })();
}

var canvas = null, g = null, raf = 0;
var hover = null;
var hoverValid = false;
var docKeyHandler = null;

function statusText(s) {
  if (s.winner === 1) return '黑棋胜利！点击棋盘或按 R 重新开始';
  if (s.winner === 2) return '白棋胜利！点击棋盘或按 R 重新开始';
  if (s.moves === 0) return '点击/触摸棋盘或用方向键+回车开始（R 重开）';
  return s.current === 1 ? '轮到黑棋落子（方向键移动，回车落子，R 重开）' : '轮到白棋落子（方向键移动，回车落子，R 重开）';
}

function render() {
  if (!g || !canvas) return;
  var w = canvas.width, h = canvas.height;
  var s = Engine.state();
  UI.drawBackground(g, w, h);
  UI.drawGrid(g, w, h, s.size);
  UI.drawStones(g, w, h, s.grid);
  if (hoverValid && s.winner === 0) {
    var pt = Board.toPixel(w, h, hover.x, hover.y);
    g.strokeStyle = 'rgba(200,60,60,0.8)';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(pt.px, pt.py, Board.metrics(w, h).step * 0.42, 0, Math.PI * 2);
    g.stroke();
  }
  UI.drawStatus(g, w, h, statusText(s));
}

function loop() {
  render();
  raf = requestAnimationFrame(loop);
}

function attemptPlace() {
  if (!hoverValid) return;
  if (!Engine.place(hover.x, hover.y) && Engine.state().winner !== 0) Engine.reset();
}

function clampHover(v) {
  return Math.max(0, Math.min(Engine.SIZE - 1, v));
}

function mount(ctx) {
  canvas = document.createElement('canvas');
  canvas.width = ctx.bounds.w;
  canvas.height = ctx.bounds.h;
  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.touchAction = 'none';
  ctx.stage.appendChild(canvas);
  g = canvas.getContext('2d');
  Engine.reset();
  hover = { x: 7, y: 7 };
  hoverValid = true;
  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    hover = Board.pick(canvas.width, canvas.height, e.clientX - r.left, e.clientY - r.top);
    hoverValid = !!hover;
  });
  canvas.addEventListener('mouseleave', function () { hoverValid = false; });
  canvas.addEventListener('click', function (e) {
    var r = canvas.getBoundingClientRect();
    var cell = Board.pick(canvas.width, canvas.height, e.clientX - r.left, e.clientY - r.top);
    if (!cell) return;
    if (!Engine.place(cell.x, cell.y) && Engine.state().winner !== 0) Engine.reset();
  });
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var t = e.changedTouches[0];
    if (!t) return;
    var r = canvas.getBoundingClientRect();
    var cell = Board.pick(canvas.width, canvas.height, t.clientX - r.left, t.clientY - r.top);
    if (!cell) return;
    if (!Engine.place(cell.x, cell.y) && Engine.state().winner !== 0) Engine.reset();
  }, { passive: false });
  docKeyHandler = function (e) {
    if (e.key === 'r' || e.key === 'R') { Engine.reset(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); attemptPlace(); return; }
    if (!hover) { hover = { x: 7, y: 7 }; }
    hoverValid = true;
    if (e.key === 'ArrowLeft') { hover.x = clampHover(hover.x - 1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { hover.x = clampHover(hover.x + 1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { hover.y = clampHover(hover.y - 1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hover.y = clampHover(hover.y + 1); e.preventDefault(); }
  };
  document.addEventListener('keydown', docKeyHandler);
  ctx.onBounds(function (b) { canvas.width = b.w; canvas.height = b.h; });
  raf = requestAnimationFrame(loop);
}

function destroy() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (docKeyHandler) document.removeEventListener('keydown', docKeyHandler);
  docKeyHandler = null;
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  canvas = null;
  g = null;
}

Work.register({ name: '五子棋工坊', mount: mount, destroy: destroy });
