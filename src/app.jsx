import React from "react";
import LineTo from "react-lineto";
import { Slider } from "rsuite";

import {
  nearestNeighbour,
  nearestInsertion,
  farthestInsertion,
  cheapestInsertion,
} from "./algorithms";
import City, { createCities } from "./city";

import "rsuite/dist/rsuite.min.css";
import "./css/app.css";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const flipActive = (city) => {
  city.isActive = !city.isActive;
  city.isRoute = !city.isRoute;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      lines: [],
      seeking: [[{ className: "none" }], [{ className: "none" }]],
      ANIMATION_DELAY: 300,
      NUM_POINTS: 5,
    };
  }

  begin() {
    const coords = [];

    for (let i = 0; i < this.state.NUM_POINTS; i++) {
      coords.push(randomCoords(140, 700));
    }

    const cities = createCities(coords);
    this.setState({ cities: cities, lines: [] });
  }

  componentDidMount() {
    this.begin();
  }

  reset(cities) {
    cities.map((city) => {
      city.isRoute = false;
    });

    this.setState({ cities: cities, lines: [] });
  }

  async displayPath(route) {
    // console.log(route);
    for (const step of route.slice(0, -1)) {
      let visited = step["visited"];
      let unvisited = step["unvisited"];

      visited.forEach((e) => {
        e.isRoute = true;
      });

      this.setState({ cities: visited.concat(unvisited), lines: visited });

      for (let i = 0; i < step["active"].length; i++) {
        step["visited"][i].isActive = true;
        step["visited"][i].isRoute = false;
        for (let j = 0; j < step["seeking"][i].length; j++) {
          this.setState({
            seeking: [step["active"][i], step["seeking"][i][j]],
          });
          await timer(this.state.ANIMATION_DELAY);
        }
        step["visited"][i].isActive = false;
        step["visited"][i].isRoute = true;
      }

      if (step["chosen"]) {
        let chosenCity = step["chosen"];
        chosenCity.isActive = true;
        this.forceUpdate();
        let insertionSteps = step["insertionSteps"];

        for (let i = 0; i < insertionSteps.length; i++) {
          // console.log(insertionSteps[i]);
          this.setState({
            seeking: [[chosenCity], insertionSteps[i]],
          });
          await timer(this.state.ANIMATION_DELAY);
        }
      }
    }

    this.setState({
      cities: route[route.length - 1]["visited"],
      seeking: [[{ className: "none" }], [{ className: "none" }]],
      lines: route[route.length - 1]["visited"].concat(
        route[route.length - 1]["visited"][0]
      ),
    });
    this.forceUpdate();
  }

  render() {
    const { cities, seeking, lines, ANIMATION_DELAY, NUM_POINTS } = this.state;

    // console.log(seeking);
    return (
      <div className="App">
        <div className="interface">
          <div className="algoButtons">
            <h5>Algorithms</h5>
            <ul>
              <li>
                <button
                  onClick={() => this.displayPath(nearestNeighbour(cities))}
                >
                  Nearest Neighbour
                </button>
              </li>
              <li>
                <button
                  onClick={() => this.displayPath(cheapestInsertion(cities))}
                >
                  Cheapest Insertion
                </button>
              </li>
              <li>
                <button
                  onClick={() => this.displayPath(nearestInsertion(cities))}
                >
                  Nearest Insertion
                </button>
              </li>
              <li>
                <button
                  onClick={() => this.displayPath(farthestInsertion(cities))}
                >
                  Farthest Insertion
                </button>
              </li>
              <li>
                <button>Temp</button>
              </li>
              <li>
                <button>Temp</button>
              </li>
              <li>
                <button>Temp</button>
              </li>
              <li>
                <button>Temp</button>
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <h5>Settings</h5>
            </li>
            <li>
              <button onClick={() => this.begin()}>Generate New Array</button>
            </li>
            <li>
              <span>Animation Delay</span>
              <Slider
                defaultValue={ANIMATION_DELAY}
                min={5}
                step={5}
                max={100}
                graduated
                progress
                value={ANIMATION_DELAY}
                onChange={(value) => {
                  this.setState({ ANIMATION_DELAY: value });
                }}
              />
            </li>
            <li>
              <span>City Count</span>
              <Slider
                defaultValue={NUM_POINTS}
                min={3}
                step={1}
                max={50}
                graduated
                progress
                value={NUM_POINTS}
                onChange={(value) => {
                  this.setState({ NUM_POINTS: value });
                  this.begin();
                }}
              />
            </li>
          </ul>
        </div>
        <div>
          {cities.map((city) => {
            return (
              <City
                key={city.className}
                isRoute={city.isRoute}
                isActive={city.isActive}
                className={city.className}
                x={city.x}
                y={city.y}
              />
            );
          })}
          {seeking[1].map((seekCity, idx) => {
            return seeking[0].map((activeCity, idx) => {
              return (
                <LineTo
                  key={idx}
                  from={`${activeCity.className}`}
                  to={`${seekCity.className}`}
                  borderColor="lightgrey"
                />
              );
            });
          })}
          {lines.map((line, idx, lines) => {
            let end;
            if (idx === lines.length - 1) {
              end = line;
            } else {
              end = lines[idx + 1];
            }
            return (
              <LineTo
                key={idx}
                from={`${line.className}`}
                to={`${end.className}`}
                borderColor="turquoise"
              />
            );
          })}
        </div>
      </div>
    );
  }
}

function randomCoords(min, max) {
  let x = Math.floor(Math.random() * (max - min + 1) + min);
  let y = Math.floor(Math.random() * (max - min + 1) + min);
  return [x, y];
}
