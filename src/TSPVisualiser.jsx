import React from "react";

const ANIMATION_SPEED = 100;
const NUM_POINTS = 20;

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
    this.resetArray(0);
  }

  resetArray(x) {
    const cities = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      cities.push(randomCoords(0, 500));
    }
    const arrayPoints = document.getElementsByClassName("city");
    if (x === 1) {
      for (let i = 0; i < NUM_POINTS; i++) {
        let x = arrayPoints[i].style;
        x.backgroundColor = POINT_COLOUR;
      }
    }
    this.setState({ cities });
  }

  //THE ALGOS
  testAlg() {
    const arrayPoints = document.getElementsByClassName("city");
    const arrayLines = document.getElementsByClassName("lines");
    for (let i = 1; i <= NUM_POINTS; i++) {
      setTimeout(() => {
        if (i === NUM_POINTS) {
          let prevPoint = arrayPoints[i - 1].style;
          let currentPoint = arrayPoints[0].style;
          prevPoint.backgroundColor = POINT_COLOUR;
          currentPoint.backgroundColor = ACTIVE_POINT_COLOUR;
          arrayLines[0].stroke = "black";
        } else {
          let prevPoint = arrayPoints[i - 1].style;
          let currentPoint = arrayPoints[i].style;
          prevPoint.backgroundColor = POINT_COLOUR;
          currentPoint.backgroundColor = ACTIVE_POINT_COLOUR;
          arrayLines[i].stroke = "green";
        }
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
        <svg width="500" height="500">
          {cities.map((value, idx, element) => (
            <line
              className="lines"
              key={idx}
              x1={value[1]}
              y1={value[0]}
              x2="500"
              y2="500"
              stroke="black"
            />
          ))}
        </svg>
        <button onClick={() => this.resetArray(1)}>Generate New Array</button>
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
