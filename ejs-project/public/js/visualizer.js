// Grid state
const ROWS = 25;
const COLS = 55;
const INITIAL_START_ROW = 10;
const INITIAL_START_COL = 15;
const INITIAL_FINISH_ROW = 10;
const INITIAL_FINISH_COL = 35;

let grid = [];
let mouseIsPressed = false;
let isRunning = false;
let mode = 'wall';
let speed = 'normal';
let startNodeRow = INITIAL_START_ROW;
let startNodeCol = INITIAL_START_COL;
let finishNodeRow = INITIAL_FINISH_ROW;
let finishNodeCol = INITIAL_FINISH_COL;

// ── Build grid ──────────────────────────────────────────────────────────────

function createNode(col, row) {
  return {
    col, row,
    isStart: row === INITIAL_START_ROW && col === INITIAL_START_COL,
    isFinish: row === INITIAL_FINISH_ROW && col === INITIAL_FINISH_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}

function getInitialGrid() {
  const g = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    g.push(currentRow);
  }
  return g;
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  grid.forEach((row, rowIdx) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'grid-row';
    row.forEach((node, colIdx) => {
      const nodeEl = document.createElement('div');
      nodeEl.id = `node-${rowIdx}-${colIdx}`;
      nodeEl.className = `node${node.isStart ? ' node-start' : node.isFinish ? ' node-finish' : node.isWall ? ' node-wall' : ''}`;
      nodeEl.addEventListener('mousedown', () => handleMouseDown(rowIdx, colIdx));
      nodeEl.addEventListener('mouseenter', () => handleMouseEnter(rowIdx, colIdx));
      nodeEl.addEventListener('mouseup', handleMouseUp);
      rowEl.appendChild(nodeEl);
    });
    gridEl.appendChild(rowEl);
  });
}

// ── Mouse handlers ───────────────────────────────────────────────────────────

function handleMouseDown(row, col) {
  if (isRunning) return;
  mouseIsPressed = true;

  if (mode === 'start') {
    moveStartNode(row, col);
  } else if (mode === 'finish') {
    moveFinishNode(row, col);
  } else {
    toggleWall(row, col);
  }
}

function handleMouseEnter(row, col) {
  if (!mouseIsPressed || isRunning) return;
  if (mode === 'wall') toggleWall(row, col);
}

function handleMouseUp() {
  mouseIsPressed = false;
}

document.addEventListener('mouseup', handleMouseUp);

function toggleWall(row, col) {
  const node = grid[row][col];
  if (node.isStart || node.isFinish) return;
  node.isWall = !node.isWall;
  const el = document.getElementById(`node-${row}-${col}`);
  el.className = `node${node.isWall ? ' node-wall' : ''}`;
}

function moveStartNode(row, col) {
  if (row === finishNodeRow && col === finishNodeCol) return;
  // clear old
  const oldEl = document.getElementById(`node-${startNodeRow}-${startNodeCol}`);
  grid[startNodeRow][startNodeCol].isStart = false;
  oldEl.className = 'node';
  // set new
  grid[row][col].isStart = true;
  grid[row][col].isWall = false;
  document.getElementById(`node-${row}-${col}`).className = 'node node-start';
  startNodeRow = row;
  startNodeCol = col;
}

function moveFinishNode(row, col) {
  if (row === startNodeRow && col === startNodeCol) return;
  const oldEl = document.getElementById(`node-${finishNodeRow}-${finishNodeCol}`);
  grid[finishNodeRow][finishNodeCol].isFinish = false;
  oldEl.className = 'node';
  grid[row][col].isFinish = true;
  grid[row][col].isWall = false;
  document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
  finishNodeRow = row;
  finishNodeCol = col;
}

// ── Mode / Speed controls ────────────────────────────────────────────────────

function setMode(newMode, btn) {
  if (isRunning) return;
  mode = newMode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const modeText = {
    wall: 'Adding Walls (Click and drag to create walls)',
    start: 'Setting Start Node (Click anywhere to place the green start node)',
    finish: 'Setting Finish Node (Click anywhere to place the red finish node)',
  };
  document.getElementById('modeIndicatorText').textContent = modeText[newMode];
}

function setSpeed(newSpeed, btn) {
  if (isRunning) return;
  speed = newSpeed;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── Animation ────────────────────────────────────────────────────────────────

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  const visitDelay = speed === 'slow' ? 50 : speed === 'normal' ? 20 : 5;
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => animateShortestPath(nodesInShortestPathOrder), visitDelay * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      const el = document.getElementById(`node-${node.row}-${node.col}`);
      if (el) el.className = 'node node-visited';
    }, visitDelay * i);
  }
}

function animateShortestPath(nodesInShortestPathOrder) {
  const pathDelay = speed === 'slow' ? 100 : speed === 'normal' ? 50 : 20;
  nodesInShortestPathOrder.forEach((node, i) => {
    setTimeout(() => {
      const el = document.getElementById(`node-${node.row}-${node.col}`);
      if (el) el.className = 'node node-shortest-path';
      if (i === nodesInShortestPathOrder.length - 1) {
        isRunning = false;
        setControlsDisabled(false);
      }
    }, pathDelay * i);
  });
}

// ── Visualize ────────────────────────────────────────────────────────────────

function visualizeDijkstra() {
  if (isRunning) return;
  if (startNodeRow === null || finishNodeRow === null) {
    alert('Please set both start and finish nodes!');
    return;
  }

  isRunning = true;
  setControlsDisabled(true);
  document.getElementById('visualizeBtn').textContent = 'Running...';

  // clear visual state only
  document.querySelectorAll('.node').forEach(el => {
    el.classList.remove('node-visited', 'node-shortest-path');
  });

  // reset algorithm data (keep walls/start/finish)
  const freshGrid = grid.map(row =>
    row.map(node => ({ ...node, distance: Infinity, isVisited: false, previousNode: null }))
  );
  grid = freshGrid;

  setTimeout(() => {
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }, 100);
}

function clearGrid() {
  if (isRunning) return;

  startNodeRow = INITIAL_START_ROW;
  startNodeCol = INITIAL_START_COL;
  finishNodeRow = INITIAL_FINISH_ROW;
  finishNodeCol = INITIAL_FINISH_COL;

  grid = getInitialGrid();
  renderGrid();
}

function setControlsDisabled(disabled) {
  document.querySelectorAll('.mode-btn, .speed-btn, .action-btn').forEach(b => {
    b.disabled = disabled;
  });
  if (!disabled) {
    document.getElementById('visualizeBtn').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <polygon points="5,3 19,12 5,21" fill="currentColor"/>
      </svg>
      Visualize`;
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

grid = getInitialGrid();
renderGrid();
