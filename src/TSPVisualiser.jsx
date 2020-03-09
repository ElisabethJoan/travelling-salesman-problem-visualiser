import React from "react";

const ANIMATION_SPEED = 100;
const NUM_POINTS = 20;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

const POINT_COLOUR = "turquoise";
const PATH_COLOUR = "light blue";
const ACTIVE_POINT_COLOUR = "fuchsia";
const ACTIVE_PATH_COLOUR = "grey";

export default class TSPVisualiser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: []
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const cities = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      cities.push(randomCoords(0, 500));
    }
    this.setState({ cities });
  }

  //THE ALGOS
  testAlg() {
    for (let i = 1; i < NUM_POINTS; i++) {
      const arrayPoints = document.getElementsByClassName("city");
      setTimeout(() => {
        const prevPoint = arrayPoints[i - 1].style;
        const currentPoint = arrayPoints[i].style;
        prevPoint.backgroundColor = POINT_COLOUR;
        currentPoint.backgroundColor = ACTIVE_POINT_COLOUR;
      }, i * ANIMATION_SPEED);
    }
  }

  christofidesAlg() {}

  render() {
    const { cities } = this.state;

    return (
      <div className="pointContainer">
        {cities.map((value, idx) => (
          <div
            className="city"
            key={idx}
            style={{
              // backgroundColor: this.state.backgroundColor,
              backgroundColor: POINT_COLOUR,
              position: "absolute",
              top: value[0],
              left: value[1],
              height: `10px`,
              width: `10px`
            }}
          ></div>
        ))}
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
