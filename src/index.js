import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      isNext: true,
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(
        <div className="board-row">
          {[...Array(3)].map((x, j) => this.renderSquare(i * 3 + j))}
        </div>
      );
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      isNext: true,
      stepNumber: 0,
      ascending: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    let items = document.querySelectorAll(".font-bold");
    for (let i = 0; i < items.length; i++) {
      items[i].style.fontWeight = "normal";
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      isNext: !this.state.isNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move, col) => {
      var previous = [],
        pos = null;

      if (move !== 0) {
        previous = col[move - 1].squares;

        for (let i = 0; i < previous.length; i++) {
          if (previous[i] !== step.squares[i]) {
            pos = i;

            break;
          }
        }
      }

      let currentPos = {
        x: Math.floor(pos / 3) + 1,
        y: (pos % 3) + 1,
      };

      const desc = move
        ? "Go to move #" +
          move +
          " clicked On :(" +
          currentPos.x +
          "," +
          currentPos.y +
          ")"
        : "Go to game start";

      return (
        <li key={move}>
          <button
            className="font-bold"
            onClick={(self) => {
              self.target.style.fontWeight = "bold";

              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    const toggleMoves = this.state.ascending ? moves : moves.reverse();

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.isNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{toggleMoves}</ol>
          <button
            onClick={() => this.setState({ ascending: !this.state.ascending })}
          >
            Change list order
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
