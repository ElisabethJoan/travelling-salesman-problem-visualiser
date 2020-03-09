import React from "react";

const ANIMATION_SPEED = 1;
const NUM_POINTS = 20;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

const POINT_COLOUR = "blue";
const PATH_COLOUR = "light blue";
const ACTIVE_POINT_COLOUR = "green";
const ACTIVE_PATH_COLOUR = "grey";

export default class TSPVisualiser extends React.Component {
  constructor(props) {
    super(props);

    this.myCanvas = React.createRef();
    this.state = {
      cities: []
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const cities = [];
    this.ctx.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);
    for (let i = 0; i < NUM_POINTS; i++) {
      cities.push(randomCoords(0, 500));
    }
    console.log(cities);
    this.setState({ cities });
  }

  //THE ALGOS
  testAlg() {}

  christofidesAlg() {}

  componentDidMount() {
    const canvas = this.refs.myCanvas;
    this.ctx = canvas.getContext("2d");
  }
  render() {
    const { cities } = this.state;
    cities.map(value => drawCoordinates(this.ctx, value));

    return (
      <div className="pointContainer">
        <canvas
          ref="myCanvas"
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
        ></canvas>
        <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.testAlg()}>Test Algorithm</button>
      </div>
    );
  }
}

function randomCoords(min, max) {
  let x = Math.floor(Math.random() * (max - min + 1) + min);
  let y = Math.floor(Math.random() * (max - min + 1) + min);
  return [x, y];
}

function distance(a, b) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.hypot(deltaX, deltaY);
}

function drawCoordinates(canvas, coords) {
  canvas.fillStyle = POINT_COLOUR;
  canvas.beginPath();
  canvas.arc(coords[0], coords[1], 5, 0, 2 * Math.PI, true);
  canvas.fill();
}
