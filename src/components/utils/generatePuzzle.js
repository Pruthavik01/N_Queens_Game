export default function generatePuzzle(N) {
  const board = Array(N).fill().map(() => Array(N).fill(0));
  const queens = [];

  // ----------------------------------------------------------
  // 1. N-Queens WITH "no-touch" constraint
  // ----------------------------------------------------------
  function isSafe(r, c) {
    for (const [qr, qc] of queens) {
      if (qr === r || qc === c) return false;
      if (Math.abs(qr - r) === Math.abs(qc - c)) return false;
      if (Math.abs(qr - r) <= 1 && Math.abs(qc - c) <= 1) return false;
    }
    return true;
  }

  function backtrack(row = 0) {
    if (row === N) return true;
    const cols = [...Array(N).keys()];
    // shuffle to produce more variation in solutions
    for (let i = cols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cols[i], cols[j]] = [cols[j], cols[i]];
    }

    for (const col of cols) {
      if (isSafe(row, col)) {
        queens.push([row, col]);
        if (backtrack(row + 1)) return true;
        queens.pop();
      }
    }
    return false;
  }

  if (!backtrack()) {
    console.error("Could not solve N-Queens for N =", N);
    return Array(N).fill().map(() => Array(N).fill("lightblue"));
  }

  // Assign IDs
  queens.forEach((q, i) => {
    const [r, c] = q;
    board[r][c] = i + 1;
  });

  // ----------------------------------------------------------
  // 2. COMPLEX REGION GROWTH (randomized multi-pass BFS)
  // ----------------------------------------------------------
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  function growRegions() {
    const queue = [];
    queens.forEach(([r, c], id) => {
      queue.push({ r, c, id: id + 1 });
    });

    // MULTI-PASS growth to create jagged, organic shapes
    let passes = Math.floor(N * 1.8 + Math.random() * N);

    while (passes-- > 0 && queue.length > 0) {
      const idx = Math.floor(Math.random() * queue.length);
      const { r, c, id } = queue.splice(idx, 1)[0];

      // Randomized order of directions
      const dirs = [...directions].sort(() => Math.random() - 0.5);

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= N || nc >= N) continue;
        if (board[nr][nc] !== 0) continue;

        // Random "adhesion" probability to avoid smooth blobs
        if (Math.random() < 0.65) {
          board[nr][nc] = id;
          queue.push({ r: nr, c: nc, id });
        }
      }
    }

    // Fill in leftover cells by nearest region
    const emptyCells = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] === 0) emptyCells.push([r, c]);
      }
    }

    // Secondary BFS waves to ensure full coverage
    while (emptyCells.length) {
      const [er, ec] = emptyCells.pop();
      const neighbors = [];

      for (const [dr, dc] of directions) {
        const nr = er + dr, nc = ec + dc;
        if (nr < 0 || nc < 0 || nr >= N || nc >= N) continue;
        if (board[nr][nc] !== 0) neighbors.push(board[nr][nc]);
      }
      if (neighbors.length > 0) {
        board[er][ec] = neighbors[Math.floor(Math.random() * neighbors.length)];
      } else {
        // fallback — rare case
        const id = Math.floor(Math.random() * queens.length) + 1;
        board[er][ec] = id;
      }
    }
  }

  growRegions();

  // ----------------------------------------------------------
  // 3. Check region complexity; if too "simple", regenerate
  // ----------------------------------------------------------
  function computeIrregularity() {
    const stats = Array(queens.length + 1).fill(0).map(() => ({
      area: 0,
      perimeter: 0
    }));

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const id = board[r][c];
        stats[id].area++;

        // Perimeter contribution
        for (const [dr, dc] of directions) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= N || nc >= N || board[nr][nc] !== id) {
            stats[id].perimeter++;
          }
        }
      }
    }

    // Higher "shape score" = more jagged
    let totalScore = 0;
    for (let id = 1; id < stats.length; id++) {
      const { area, perimeter } = stats[id];
      totalScore += perimeter / Math.sqrt(area);
    }
    return totalScore;
  }

  let score = computeIrregularity();
  if (score < N * 2.2) {
    // rerun region generation for more complexity
    for (let r = 0; r < N; r++) board[r].fill(0);
    queens.forEach((q, i) => {
      const [r, c] = q;
      board[r][c] = i + 1;
    });
    growRegions();
  }

  // ----------------------------------------------------------
  // 4. Modern Colors
  // ----------------------------------------------------------
  const cssColors = [
    "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#d06969ff",
    "#3b82f6", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
    "#84cc16", "#22d3ee", "#a855f7", "#fb7185", "#34d399",
    "#60a5fa", "#fbbf24", "#818cf8", "#2dd4bf", "#f472b6"
  ];

  const colorGrid = board.map(row =>
    row.map(id => cssColors[(id - 1) % cssColors.length])
  );

  return colorGrid;
}
