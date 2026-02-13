import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Returns the winner and the winning line indices, if any.
 * @param {Array<null | "X" | "O">} squares
 * @returns {{ winner: null | "X" | "O", line: number[] | null }}
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {Array<null | "X" | "O">} squares
 * @returns {boolean}
 */
function isBoardFull(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Array<null | "X" | "O">, Function]} */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isDraw = useMemo(() => !winner && isBoardFull(squares), [winner, squares]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It’s a draw!";
    return `Turn: ${xIsNext ? PLAYER_X : PLAYER_O}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Ignore clicks if the game is over or the square is occupied. */
    if (winner || squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? PLAYER_X : PLAYER_O;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe Game">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p
              className={`ttt-status ${winner ? "is-winner" : ""} ${isDraw ? "is-draw" : ""}`}
              aria-live="polite"
            >
              {statusText}
            </p>
          </header>

          <div className="ttt-board" role="grid" aria-label="3 by 3 Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningCell = Boolean(line && line.includes(idx));
              const isDisabled = Boolean(winner || value);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-cell",
                    value ? "is-filled" : "",
                    value === PLAYER_X ? "is-x" : "",
                    value === PLAYER_O ? "is-o" : "",
                    isWinningCell ? "is-winning" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={Boolean(winner) || Boolean(value)}
                  aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ""}${isDisabled ? "" : ", empty"}`}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="ttt-footer">
            <button type="button" className="ttt-reset" onClick={handleReset}>
              Reset
            </button>

            <p className="ttt-hint">
              Two players, one device. First to get 3 in a row wins.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
