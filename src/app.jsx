import React from "react";
import LineTo from "react-lineto";
import { Slider } from 'rsuite';

import City, { createCities } from "./city"

import "rsuite/dist/rsuite.min.css";
import "./css/app.css"

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            lines: [],
            seeking: [{className: "none"}, {className: "none"}],
            ANIMATION_DELAY: 50,
            NUM_POINTS: 20
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
        })

        this.setState({ cities: cities })
    }

    async nearestNeighbour(cities) {
        this.reset(cities);
        let route = [];
        let dist = Infinity;
        let bestIdx = Math.floor(Math.random() * (cities.length - 1));
        let temp = bestIdx

        while (cities.length > 0) {
            let minDist = Infinity
            let active = cities[bestIdx];
            active.isActive = true;
            // this.forceUpdate()
            cities.splice(bestIdx, 1);
            this.setState({ cities: cities.concat([active]).concat(route) })

            for (let i = 0; i < cities.length - 1; i++) {
                dist = distance(active, cities[i]);
                if (dist < minDist) {
                    minDist = dist;
                    bestIdx = i;
                }
                this.setState({ seeking: [active, cities[i]] })
                await timer(this.state.ANIMATION_DELAY);
            }
            active.isActive = false;
            active.isRoute = true;
            route.push(active);
            this.setState({ cities: route.concat(cities), lines: route.concat(cities[bestIdx]) })
        }

        this.setState({ cities: route, seeking: [{className: "none"}, {className: "none"}], lines: route.concat({ className: `${temp}` }) })
    }


    async nearestInsertion(cities) {
        this.reset(cities);
        let route = [];
        cities[0].isRoute = true;
        route.push(cities.shift())
        cities[0].isRoute = true;
        route.push(cities.shift())

        while (cities.length > 0) {
            let toAdd = cities.shift();
            toAdd.isActive = true;
            this.forceUpdate();

            let bestPos = 1;
            let minDist = Infinity;
            let dist;
            for (let i = 1; i <= route.length - 1; i++) {
                let next = i;
                let prev = i - 1;

                if (i === route.length) {
                    next = 0;
                }

                dist = distance(route[prev], toAdd) + distance(toAdd, route[next]) - distance(route[prev], route[next]);

                if (dist < minDist) {
                    minDist = dist;
                    bestPos = i;
                }
                this.setState({ seeking: [toAdd, route[next]] })
                await timer(this.state.ANIMATION_DELAY);
            }
            toAdd.isActive = false;
            toAdd.isRoute = true;
            route.splice(bestPos, 0, toAdd);

            this.setState({ cities: route.concat(cities), lines: route })
        }
        this.setState({cities: route, seeking: [{className: "none"}, {className: "none"}], lines: route.concat([{ className: "0"}]) });
    }


    render() {
        const { cities, seeking, lines, ANIMATION_DELAY, NUM_POINTS } = this.state;

        return (
            <div className="App">
                <div className="interface">
                    <div className="algoButtons">
                        <h5>Algorithms</h5>
                        <ul>
                            <li><button onClick={() => this.nearestNeighbour(cities)}>Nearest Neighbour</button></li>
                            <li><button onClick={() => this.nearestInsertion(cities)}>Nearest Insertion</button></li>
                            <li><button>Temp</button></li>
                            <li><button>Temp</button></li>
                            <li><button>Temp</button></li>
                            <li><button>Temp</button></li>
                            <li><button>Temp</button></li>
                            <li><button>Temp</button></li>
                        </ul>
                    </div>
                    <ul>
                        <li><h5>Settings</h5></li>
                        <li><button onClick={() => this.begin()}>Generate New Array</button></li>
                        <li><span>Animation Delay</span><Slider defaultValue={ANIMATION_DELAY} min={10} step={10}
                            max={100} graduated progress value={ANIMATION_DELAY}
                            onChange={value => {
                                this.setState({ ANIMATION_DELAY: value });
                            }} />
                        </li>
                        <li><span>City Count</span><Slider defaultValue={NUM_POINTS} min={3} step={1}
                            max={50} graduated progress value={NUM_POINTS} 
                            onChange={value => {
                                this.setState({ NUM_POINTS: value });
                                this.begin();
                            }} />
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
                    <LineTo 
                        from={`${seeking[0].className}`}
                        to={`${seeking[1].className}`}
                        borderColor="lightgrey"
                    />
                    {lines.map((line, idx, lines) => {
                        let end;
                        if (idx === lines.length - 1) {
                            end = line;
                        } else {
                            end = lines[idx + 1]
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
  
  function distance(a, b) {
    const deltaX = a.x - b.x;
    const deltaY = a.y - b.y;
    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
  }
  