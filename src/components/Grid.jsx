import React, { useState, useEffect } from "react";
import "./Grid.css";
import generatePuzzle from "./utils/generatePuzzle.js";

const init2D = (n, val) => Array.from({ length: n }, () => Array(n).fill(val));

const generateNumber = () => {
  //number between 4 and 10
  return Math.floor(Math.random() * 7) + 4;
};

export default function Grid({ n: initialN }) {
  const [n, setN] = useState(initialN);
  const [queenBoard, setQueenBoard] = useState(() => init2D(n, false));
  const [text, setText] = useState(() => init2D(n, ""));
  const [puzzleColors, setPuzzleColors] = useState(() => generatePuzzle(n));
  const [isWin, setIsWin] = useState(false);
  const [violatingQueens, setViolatingQueens] = useState(() => init2D(n, false));
  const [autoCheck, setAutoCheck] = useState(false);

  const recomputeText = (qBoard, boardSize = n) => {
    const newText = init2D(boardSize, "");

    const markAttacks = (row, col) => {
      // mark row
      for (let j = 0; j < boardSize; j++) newText[row][j] = "x";
      // mark col
      for (let i = 0; i < boardSize; i++) newText[i][col] = "x";

      // mark immediate diagonals (matching your original logic)
      if (row + 1 < boardSize && col + 1 < boardSize) newText[row + 1][col + 1] = "x";
      if (row + 1 < boardSize && col - 1 >= 0) newText[row + 1][col - 1] = "x";
      if (row - 1 >= 0 && col + 1 < boardSize) newText[row - 1][col + 1] = "x";
      if (row - 1 >= 0 && col - 1 >= 0) newText[row - 1][col - 1] = "x";
    };

    // Mark attacks for every queen on the board
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (qBoard[r][c]) {
          markAttacks(r, c);
        }
      }
    }

    // Place Q symbols
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (qBoard[r][c]) newText[r][c] = "Q";
      }
    }

    setText(newText);
  };

  useEffect(() => {
    recomputeText(queenBoard, n);
  }, [n]);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Helper to format time as mm:ss
  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const toggle = (row, col) => {
    // if (text[row][col] == "x") return;

    setQueenBoard((prev) => {
      const newBoard = prev.map((r) => [...r]);
      // If board has Q, remove it; otherwise place it
      newBoard[row][col] = !newBoard[row][col];
      // Recompute everything based on new queenBoard
      recomputeText(newBoard, n);
      checkWin(newBoard, n);
      return newBoard;
    });
  };

  // Helper to find violating queens
  const computeViolations = (board, boardSize = n) => {
    const violations = init2D(boardSize, false);

    // Row violations
    for (let r = 0; r < boardSize; r++) {
      let queens = [];
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) queens.push([r, c]);
      }
      if (queens.length !== 1) {
        queens.forEach(([rr, cc]) => violations[rr][cc] = true);
      }
    }

    // Column violations
    for (let c = 0; c < boardSize; c++) {
      let queens = [];
      for (let r = 0; r < boardSize; r++) {
        if (board[r][c]) queens.push([r, c]);
      }
      if (queens.length !== 1) {
        queens.forEach(([rr, cc]) => violations[rr][cc] = true);
      }
    }

    // Color region violations
    const colorMap = new Map();
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          const color = puzzleColors[r][c];
          if (!colorMap.has(color)) colorMap.set(color, []);
          colorMap.get(color).push([r, c]);
        }
      }
    }
    for (let queens of colorMap.values()) {
      if (queens.length !== 1) {
        queens.forEach(([rr, cc]) => violations[rr][cc] = true);
      }
    }

    // Adjacency violations
    const drc = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          for (let [dr, dc] of drc) {
            const nr = r + dr, nc = c + dc;
            if (
              nr >= 0 && nr < boardSize &&
              nc >= 0 && nc < boardSize &&
              board[nr][nc]
            ) {
              violations[r][c] = true;
              // Also mark the neighbor queen as violating
              violations[nr][nc] = true;
            }
          }
        }
      }
    }

    return violations;
  };

  const checkWin = (board, boardSize = n) => {
    const violations = computeViolations(board, boardSize);
    setViolatingQueens(violations);

    // Win only if there are no violations and all rules are satisfied
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (violations[r][c]) return setIsWin(false);
      }
    }

    // 1. Check one queen per row
    for (let r = 0; r < boardSize; r++) {
      let rowCount = 0;
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) rowCount++;
      }
      if (rowCount !== 1) return setIsWin(false);
    }

    // 2. Check one queen per column
    for (let c = 0; c < boardSize; c++) {
      let colCount = 0;
      for (let r = 0; r < boardSize; r++) {
        if (board[r][c]) colCount++;
      }
      if (colCount !== 1) return setIsWin(false);
    }

    // 3. Check one queen per color region
    // We'll use a Map to count queens per color
    const colorMap = new Map();
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          const color = puzzleColors[r][c];
          colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }
      }
    }
    for (let count of colorMap.values()) {
      if (count !== 1) return setIsWin(false);
    }

    // 4. No two queens are adjacent (touching, including diagonals)
    const drc = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (board[r][c]) {
          for (let [dr, dc] of drc) {
            const nr = r + dr, nc = c + dc;
            if (
              nr >= 0 && nr < boardSize &&
              nc >= 0 && nc < boardSize &&
              board[nr][nc]
            ) {
              return setIsWin(false);
            }
          }
        }
      }
    }

    // If all checks pass, it's a win
    setIsWin(true);
  };

  const handleClick = (i) => {
    const row = Math.floor(i / n);
    const col = i % n;
    if (startTime === null) {
      setStartTime(Date.now());
    }

    toggle(row, col);
  };

  useEffect(() => {
    let interval;

    if (startTime !== null && !isWin) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, isWin]);

  const getCellStyle = (row, col) => {
    let backgroundColor = puzzleColors[row][col];
    return { backgroundColor };
  };

  const getCellClass = (row, col) => {
    const classes = ["grid-item"];
    if (text[row][col] === "Q") {
      classes.push("queen-cell");
      if (violatingQueens[row][col]) classes.push("violating");
    } else if (text[row][col] === "x") {
      classes.push("attacked-cell");
    }
    return classes.join(" ");
  };

  const restartGame = () => {
    const newN = generateNumber();
    const newBoard = init2D(newN, false);
    setN(newN);
    setQueenBoard(newBoard);
    setText(init2D(newN, ""));
    setIsWin(false);
    setStartTime(null);
    setElapsedTime(0);
    setPuzzleColors(generatePuzzle(newN));
    recomputeText(newBoard, newN);
  };

  const clearBoard = () => {
    setQueenBoard(init2D(n, false));
    setText(init2D(n, ""));
    setIsWin(false);
    recomputeText(init2D(n, false), n);
  };

  return (
    <div className="grid-wrapper">
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="timer">
            Time: {formatTime(elapsedTime)}
          </div>
        </div>
        <div className="top-bar-right">
          <div className="clear" onClick={clearBoard}>Clear</div>
          <div className="checkBoxDiv">
            <label htmlFor="auto-check" style={{ margin: 0, fontSize: "1rem" }}>
              Auto-check
            </label>

            <label className="switch">
              <input
                type="checkbox"
                id="auto-check"
                checked={autoCheck}
                onChange={e => setAutoCheck(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

        </div>
      </div>

      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gridTemplateRows: `repeat(${n}, 1fr)`,
        }}
      >
        {Array.from({ length: n * n }).map((_, i) => {
          const row = Math.floor(i / n);
          const col = i % n;

          return (
            <div
              key={i}
              className={getCellClass(row, col)}
              style={getCellStyle(row, col)}
              onClick={() => handleClick(i)}
            >
              {text[row][col] === "Q" && (
                <span className="queen-icon" role="img" aria-label="queen">
                  ♛
                </span>
              )}
              {text[row][col] === "x" && autoCheck && (
                <span className="attack-mark">×</span>
              )}
            </div>
          );
        })}
      </div>

      {isWin && (
        <div className="winner-popup">
          <h1>🎉 Winner! 🎉</h1>
          <p>Your time: {formatTime(elapsedTime)}</p>
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      )}

    </div>
  );
}

