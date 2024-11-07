import React, { Component } from "react";
import LineTo from "react-lineto";
import { Button, Slider } from "@mui/material";

import {
  nearestNeighbour,
  nearestInsertion,
  farthestInsertion,
  cheapestInsertion,
  convexHull,
  nodeInsertion,
  edgeInsertion,
  twoOpt,
} from "./algorithms";
import City, { createCities } from "./city";
import HomeButton from "./homebutton";

import "./css/app.css";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      lines: [],
      seeking: [[{ className: "none" }], [{ className: "none" }]],
      ANIMATION_DELAY: 300,
      NUM_POINTS: 6,
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
    const referrer = document.referrer;
    if (referrer) {
      localStorage.setItem("referrer", referrer);
    }
    this.begin();
  }

  reset(cities) {
    cities.map((city) => {
      city.isRoute = false;
      city.isActive = false;
    });

    this.setState({ cities: cities, lines: [] });
  }

  async displayPath(route) {
    console.log(route);
    for (const step of route) {
      let visited = step["visited"];
      let unvisited = step["unvisited"];
      let active = step["active"];

      visited.forEach((e) => {
        e.isRoute = true;
      });

      if (active.length > 0) {
        this.setState({ cities: active.concat(visited.concat(unvisited)), lines: active.concat(visited) });
        for (let i = 0; i < active.length; i++) {
          active[i].isActive = true;
          active[i].isRoute = false;
          for (let j = 0; j < step["seeking"][i].length; j++) {
              this.setState({
                seeking: [[active[i]], step["seeking"][i][j]],
              });
              await timer(this.state.ANIMATION_DELAY);
          }
          active[i].isActive = false;
          active[i].isRoute = true;
        }
      }

      if (step["chosen"]) {
        if (active.length === 0) {
          this.setState({ cities: visited.concat(unvisited.concat([step["chosen"]])), lines: visited.concat(visited[0]), seeking: this.state.seeking })
        } 
        let chosenCity = step["chosen"];
        chosenCity.isActive = true;
        this.forceUpdate();
        let insertionSteps = step["insertionSteps"];

        for (let i = 0; i < insertionSteps.length; i++) {
          this.setState({
            seeking: [[chosenCity], insertionSteps[i]],
          });
          await timer(this.state.ANIMATION_DELAY);
        }
        chosenCity.isActive = false;
        if (active.length > 0) {
          chosenCity.isRoute = true;
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

  async displayOptimisation(route) {
    for (const step of route) {
      this.setState({ lines: step[1].concat([step[1][0]]) });
      await timer(this.state.ANIMATION_DELAY);
    }
  }

  async testPath(route) {
    console.log(route)
    this.setState({ lines: route.concat(route[0]) })
  }

  render() {
    const { cities, seeking, lines, ANIMATION_DELAY, NUM_POINTS } = this.state;

    return (
      <div className="App">
        <div className="interface">
          <HomeButton />
          <div className="algoButtons">
            <h5>Constructed Heuristics</h5>
            <ul>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.displayPath(nearestNeighbour(cities));
                  }}
                >
                  Nearest Neighbour
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.displayPath(cheapestInsertion(cities));
                  }}
                >
                  Cheapest Insertion
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.displayPath(nearestInsertion(cities));
                  }}
                >
                  Nearest Insertion
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.displayPath(farthestInsertion(cities));
                  }}
                >
                  Farthest Insertion
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.displayPath(convexHull(cities));
                  }}
                >
                  Convex Hull
                </Button>
              </li>
            </ul>
          </div>
          <div className="algoButtons">
            <h5>Optimisation Heuristics</h5>
            <ul>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.setState({ lines: [] });
                    this.displayOptimisation(twoOpt(cities));
                  }}
                >
                  2-Opt
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.setState({ lines: [] });
                    this.displayOptimisation(nodeInsertion(cities));
                  }}
                >
                  Node Insertion
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.reset(cities);
                    this.setState({ lines: [] });
                    this.displayOptimisation(edgeInsertion(cities));
                  }}
                >
                  Edge Insertion
                </Button>
              </li>
            </ul>
          </div>
          <div className="algoButtons">
          <ul>
            <li>
              <h5>Settings</h5>
            </li>
            <li>
              <Button
                variant="outlined"
                onClick={() => this.begin()}
              >
                Generate New Array     
              </Button>
            </li>
            <li>
              <span>Animation Delay</span>
              <Slider
                min={5}
                step={5}
                max={100}
                value={ANIMATION_DELAY}
                onChange={(_, value) => {
                  this.setState({ ANIMATION_DELAY: value });
                }}
              />
            </li>
            <li>
              <span>City Count</span>
              <Slider
                min={6}
                step={1}
                max={50}
                value={NUM_POINTS}
                onChange={(_, value) => {
                  this.setState({ NUM_POINTS: value });
                  this.begin();
                }}
              />
            </li>
          </ul>
          </div>
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
          {seeking[1].map((seekCity, outerIdx) => {
            return seeking[0].map((activeCity, innerIdx) => {
              return (
                <LineTo
                  key={`${outerIdx}${innerIdx}`}
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
