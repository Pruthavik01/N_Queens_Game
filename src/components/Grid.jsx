import React, { useState, useEffect } from "react";
import "./Grid.css";
import generatePuzzle from "./utils/generatePuzzle.js";

const init2D = (n, val) => Array.from({ length: n }, () => Array(n).fill(val));

export default function Grid({ n }) {
  const [queenBoard, setQueenBoard] = useState(() => init2D(n, false));
  const [text, setText] = useState(() => init2D(n, ""));
  const [puzzleColors] = useState(() => generatePuzzle(n));

  const recomputeText = (qBoard) => {
    const newText = init2D(n, "");

    const markAttacks = (row, col) => {
      // mark row
      for (let j = 0; j < n; j++) newText[row][j] = "x";
      // mark col
      for (let i = 0; i < n; i++) newText[i][col] = "x";

      // mark immediate diagonals (matching your original logic)
      if (row + 1 < n && col + 1 < n) newText[row + 1][col + 1] = "x";
      if (row + 1 < n && col - 1 >= 0) newText[row + 1][col - 1] = "x";
      if (row - 1 >= 0 && col + 1 < n) newText[row - 1][col + 1] = "x";
      if (row - 1 >= 0 && col - 1 >= 0) newText[row - 1][col - 1] = "x";
    };

    // Mark attacks for every queen on the board
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qBoard[r][c]) {
          markAttacks(r, c);
        }
      }
    }

    // Place Q symbols
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qBoard[r][c]) newText[r][c] = "Q";
      }
    }

    setText(newText);
  };

  useEffect(() => {
    recomputeText(queenBoard);
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
    if (text[row][col] == "x") return;

    setQueenBoard((prev) => {
      const newBoard = prev.map((r) => [...r]);
      // If board has Q, remove it; otherwise place it
      newBoard[row][col] = !newBoard[row][col];
      // Recompute everything based on new queenBoard
      recomputeText(newBoard);
      return newBoard;
    });
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

    if (startTime !== null) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime]);


  const getCellStyle = (row, col) => {
    let backgroundColor = puzzleColors[row][col];
    return { backgroundColor };
  };

  const getCellClass = (row, col) => {
    const classes = ["grid-item"];

    // Override with state-based classes
    if (text[row][col] === "Q") {
      classes.push("queen-cell");
    } else if (text[row][col] === "x") {
      classes.push("attacked-cell");
    }
    
    return classes.join(" ");
  };


  return (
    <div className="grid-wrapper">
      <div className="timer">
        Time: {formatTime(elapsedTime)}
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
              {text[row][col] === "x" && (
                <span className="attack-mark">×</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

