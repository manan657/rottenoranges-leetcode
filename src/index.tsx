import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';

interface AppProps {}
interface AppState {
  name: string;
  grid: any;
  visited;
  currentLevel: any;
  queue: any;
  activeTime: any;
}

class Point {
  x;
  y;
  timeToReach;
  constructor(x, y, timeToReach) {
    this.x = x;
    this.y = y;
    this.timeToReach = timeToReach;
  }
}

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const DEFAULT = {
  name: 'React',
  currentLevel: 0,
  grid: [
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 2, 1, 0, 1, 0, 1, 2, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 2, 1, 0, 1, 0, 1],
    [1, 2, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  visited: null,
  queue: [],
  activeTime: 0,
};
class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT,
    };

    this.markAllUnVisited = this.markAllUnVisited.bind(this);
    this.reset = this.reset.bind(this);
    this.bfs = this.bfs.bind(this);
  }

  reset() {
    this.setState({ ...this.state, ...DEFAULT });
    console.log(DEFAULT);
  }

  markAllUnVisited() {
    let visited = [];
    let queue = [];
    for (let i = 0; i < this.state.grid.length; i++) {
      visited[i] = [];
      for (let j = 0; j < this.state.grid[0].length; j++) {
        visited[i][j] = false;
        if (this.state.grid[i][j] == '2') {
          visited[i][j] = true;
          queue.push(new Point(i, j, 0));
        }
      }
    }
    this.setState({ ...this.state, visited: visited, queue });
  }

  componentDidMount() {
    this.markAllUnVisited();
  }

  async delay() {
    return new Promise((res) => setTimeout(res, 400));
  }

  isValid(x, y) {
    if (
      x < 0 ||
      y < 0 ||
      x > this.state.grid.length - 1 ||
      y > this.state.grid[0].length - 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  bfs() {
    let visited = this.state.visited;
    let queue = this.state.queue;
    let grid = this.state.grid;
    if (queue.length != 0) {
      let queue = this.state.queue;
      let size = queue.length;
      let activeTime = this.state.activeTime;
      while (size != 0) {
        let current = queue.shift();
        for (let i = 0; i < DIRECTIONS.length; i++) {
          let newPointX = current.x + DIRECTIONS[i][0];
          let newPointY = current.y + DIRECTIONS[i][1];
          if (
            this.isValid(newPointX, newPointY) &&
            !visited[newPointX][newPointY] &&
            grid[newPointX][newPointY] == 1
          ) {
            visited[newPointX][newPointY] = true;
            grid[newPointX][newPointY] = 2;
            queue.push(
              new Point(newPointX, newPointY, current.timeToReach + 1)
            );
          }
        }
        size = size - 1;
      }
      this.setState({
        visited: visited,
        queue: queue,
        grid,
        activeTime: activeTime + 1,
      });
      setTimeout(() => {
        this.bfs();
      }, 1000);
    }
  }

  render() {
    return (
      <div>
        {this.state.activeTime}
        <div style={{ display: 'flex', margin: '20px' }}>
          <button className="btn" onClick={this.bfs}>
            Start
          </button>
          <button
            className="btn"
            disabled={this.state.queue.length != 0}
            onClick={this.reset}
          >
            Reset
          </button>
        </div>
        <div className="align-middle">
          {this.state.grid.map((row, index) => {
            return <Row row={row} key={'row-' + index} />;
          })}
        </div>
      </div>
    );
  }
}

const Row = (props) => {
  return (
    <div className="row">
      {props.row.map((cell, j_index) => {
        return (
          <div className="col" key={'col-' + j_index}>
            <Cell cell={cell} />
          </div>
        );
      })}
    </div>
  );
};

const Cell = (props) => {
  return (
    <div className="cell align-middle">
      {props.cell == 0 ? (
        ''
      ) : props.cell == 1 ? (
        <img src="https://5.imimg.com/data5/VN/YP/MY-33296037/orange-600x600-500x500.jpg" />
      ) : (
        <img
          src="https://thumbs.dreamstime.com/z/rotten-moldy-orange-rotten-moldy-orange-white-background-isolated-126629774.jpg"
          alt=""
        />
      )}
    </div>
  );
};

render(<App />, document.getElementById('root'));
