import React from "react";
import { random } from "lodash";

const ANIMATION_SPEED = 1;
const NUM_POINTS = 20;

const POINT_COLOUR = "blue";
const PATH_COLOUR = "light blue";
const ACTIVE_POINT_COLOUR = "green";
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
  testAlg() {}

  christofidesAlg() {}

  render() {
    const { cities } = this.state;
    console.log(cities);
    return (
      <div className="pointContainer">
        <button onClick={() => this.resetArray()}>Generate New Array</button>
        <button onClick={() => this.testAlg()}>Test Algorithm</button>
      </div>
    );
  }
}

function randomCoords(min, max) {
  let x = Math.floor(Math.random() * (max - min + 1) + min);
  let y = Math.floor(Math.random() * (max - min + 1) + min);
  return { x, y };
}

function distance(a, b) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.hypot(deltaX, deltaY);
}
