import React, { Component } from "react";
import "./css/city.css";

class CityNode {
  constructor(value, coords) {
    (this.isRoute = false),
      (this.isActive = false),
      (this.className = value),
      (this.x = coords[0]),
      (this.y = coords[1]);
  }
}

function createCities(coords) {
  let cities = [];

  coords.forEach((coords, idx) => {
    let city = new CityNode(idx, coords);
    cities.push(city);
  });

  return cities;
}

export default class City extends Component {
  render() {
    const { isRoute, isActive, className, x, y } = this.props;

    const type = isRoute ? "route" : isActive ? "active" : "";

    return (
      <div
        className={`city ${className} ${type}`}
        style={{
          top: y,
          left: x,
        }}
      ></div>
    );
  }
}

export { createCities };
