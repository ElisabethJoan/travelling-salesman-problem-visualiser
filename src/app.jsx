import React from "react";
import LineTo from "react-lineto";

import City, { createCities } from "./city"

const ANIMATION_DELAY = 50;
const NUM_POINTS = 20;

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            lines: [],
            seeking: [{className: "none"}, {className: "none"}],
        };
    }

    begin() {
        const coords = [];

        for (let i = 0; i < NUM_POINTS; i++) {
            coords.push(randomCoords(100, 600));
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
        let bestIdx = Math.floor(Math.random() * 19);
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
                await timer(ANIMATION_DELAY);
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
                await timer(ANIMATION_DELAY);
            }
            toAdd.isActive = false;
            toAdd.isRoute = true;
            route.splice(bestPos, 0, toAdd);

            this.setState({ cities: route.concat(cities), lines: route })
        }
        this.setState({cities: route, seeking: [{className: "none"}, {className: "none"}], lines: route.concat([{ className: "0"}]) });
    }


    render() {
        const { cities, seeking, lines } = this.state;

        return (
            <div className="App">
                <button onClick={() => this.begin()}>Generate New Array</button>
                <button onClick={() => this.nearestNeighbour(cities)}>Nearest Neighbour</button>
                <button onClick={() => this.nearestInsertion(cities)}>Nearest Insertion</button>
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
  