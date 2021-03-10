import React from "react";

const ANIMATION_SPEED = 100;
const NUM_POINTS = 20;

const POINT_COLOUR = "turquoise";
// const PATH_COLOUR = "light blue";
const ACTIVE_POINT_COLOUR = "fuchsia";
const SEEKING_PATH_COLOUR = "lightgrey";
const VISITED_POINT_COLOUR = "grey"

const timer = ms => new Promise(res => setTimeout(res, ms));


export default class TSPVisualiser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      route: [],
      lines: []
    };
  }

  componentDidMount() {
    this.resetArray(0);
  }

  resetArray(x) {
    const cities = [];
    // lines = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      cities.push(randomCoords(0, 500));
    }
    const arrayPoints = document.getElementsByClassName("city");
    if (x === 1) {
      for (let i = 0; i < NUM_POINTS; i++) {
        arrayPoints[i].style.backgroundColor = POINT_COLOUR;;
      }
    }
    this.setState({ cities: cities, route:[], lines: []});
  }

  refresh () {
    console.log(this.state)
    this.forceUpdate()
  }

  dots() {
    const arrayPoints = document.getElementsByClassName("city");
    // const arrayLines = document.getElementsByClassName("line");
    // console.log(arrayPoints[0])
    for (let i = 1; i <= NUM_POINTS; i++) {
      setTimeout(() => {
        let prevPoint = arrayPoints[i - 1].style;
        let currentPoint;
        if (i === NUM_POINTS) {
          currentPoint = arrayPoints[0].style;
        } else {
          currentPoint = arrayPoints[i].style;
        }
          prevPoint.backgroundColor = VISITED_POINT_COLOUR;
          currentPoint.backgroundColor = ACTIVE_POINT_COLOUR;
      }, i * ANIMATION_SPEED);
    }
  }

  async test () {
    let arrayPoints = [];
    this.state.cities.map((value, idx) => {
      arrayPoints.push(value);
    });
    let newArray = [];
    newArray.push(arrayPoints.shift());
    newArray.push(arrayPoints.shift());
    
    while (arrayPoints.length > 0) {
      let toAdd = arrayPoints.shift();;
      let bestPos = 1;
      let minDist = Number.MAX_SAFE_INTEGER;
      let storage;
      let wowlines = this.state.lines;
      for (let i = 1; i <= newArray.length - 1; i++) {
          this.setState({ lines: [] })
          let next = i;
          let prev = i - 1;
          
          if (i === newArray.length) {
            next = 0;
          }

          storage = distance(newArray[prev], toAdd) + distance(toAdd, newArray[next]) - distance(newArray[prev], newArray[next]);

          if (storage < minDist) {
            minDist = storage;
            bestPos = i;
          }
          this.setState({ lines: [...wowlines, toAdd, newArray[next]] })
          await timer(10);
      }
      newArray.splice(bestPos, 0, toAdd);
      this.setState({ lines: newArray })

    }
    this.setState({cities: newArray, lines: newArray });
    this.dots();

  }
  //THE ALGOS


  christofidesAlg() {}

  render() {
    const { cities, route, lines } = this.state;

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
              top: value[0] - 5,
              left: value[1] - 5,
              height: `10px`,
              width: `10px`
            }}
          ></div>
        ))}
        {route.map((value, idx) => (
          <div
            className="route"
            key={idx}
            style={{
              // backgroundColor: this.state.backgroundColor,
              backgroundColor: ACTIVE_POINT_COLOUR,
              position: "absolute",
              top: value[0] - 5,
              left: value[1] - 5,
              height: `10px`,
              width: `10px`
            }}
          ></div>
        ))}
          <svg width="500" height="500">
          {lines.map((value, idx, arr) => {
            let prev;
            if (idx === 0) {
              if (arr.length !== cities.length) {
                prev = value;
              } else {
                prev = arr[arr.length - 1];
              }
            }
            else {
              prev = arr[idx - 1];
            }
            return (
            <line
              className = "line"
              key = {idx}
              x1 = {value[1]}
              y1 = {value[0]}
              x2 = {prev[1]}
              y2 = {prev[0]}
              stroke = {SEEKING_PATH_COLOUR}
            />
            )})}
            </svg>


        <button onClick={() => this.resetArray(1)}>Generate New Array</button>
        <button onClick={() => this.refresh()}>Refresh</button>
        {/* <button onClick={() => this.testAlg()}>Dot Colour</button> */}
        <button onClick={() => this.test()}>Test Algorithm</button>
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
  const deltaX = a[0] - b[0];
  const deltaY = a[1] - b[1];
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}
