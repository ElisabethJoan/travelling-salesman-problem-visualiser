import * as React from "react";
import LineTo from "react-lineto";

import { HomeRow, SketchWrapper } from "@elisabethjoan/portfolio-scaffold";

import { Interface } from "./interface";
import City, { createCities } from "./city";

import "./css/app.css";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const App = () => {
  const [cities, setCities] = React.useState([]);
  const [lines, setLines] = React.useState([]);
  const [seeking, setSeeking] = React.useState([[{ className: "none" }], [{ className: "none" }]]);
  const [animationDelay, setAnimationDelay] = React.useState(50);
  const [numPoints, setNumPoints] = React.useState(12);
  const [wrapperDimensions, setWrapperDimensions] = React.useState({width: 0, height: 0, top: 0, left: 0});
  const [initialized, setInitialized] = React.useState(false);
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const updateDimensions = () => {
        if (wrapperRef.current) {
            setWrapperDimensions({
                width: wrapperRef.current.offsetWidth,
                height: wrapperRef.current.offsetHeight,
                top: wrapperRef.current.offsetTop,
                left: wrapperRef.current.offsetLeft,
            });
        }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
        window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  React.useEffect(() => {
    if (!initialized && wrapperDimensions.left > 0 && wrapperDimensions.top > 0) {
        setInitialized(true);
    }
    begin();
  }, [wrapperDimensions, initialized])

  function randomCoords() {
    const { width, height, top, left } = wrapperDimensions; 
    let x = Math.floor(Math.random() * ((left + width) - left + 1) + left);
    let y = Math.floor(Math.random() * ((top + height) - top + 1) + top);
    return [x, y];
  }

  function begin() {
    const coords = [];

    for (let i = 0; i < numPoints; i++) {
      coords.push(randomCoords());
    }

    const cities = createCities(coords);
    setCities(cities);
    setLines([]);
  }

  function reset(cities) {
    cities.map((city) => {
      city.isRoute = false;
      city.isActive = false;
    });

    setCities(cities);
    setLines([]);
  }

  async function displayPath(route) {
    console.log(route);
    for (const step of route) {
      let visited = step["visited"];
      let unvisited = step["unvisited"];
      let active = step["active"];

      visited.forEach((e) => {
        e.isRoute = true;
      });

      if (active.length > 0) {
        setCities(active.concat(visited.concat(unvisited)));
        setLines(active.concat(visited));
        for (let i = 0; i < active.length; i++) {
          active[i].isActive = true;
          active[i].isRoute = false;
          for (let j = 0; j < step["seeking"][i].length; j++) {
              setSeeking([[active[i]], step["seeking"][i][j]]);
              await timer(animationDelay);
          }
          active[i].isActive = false;
          active[i].isRoute = true;
        }
      }

      if (step["chosen"]) {
        if (active.length === 0) {
          setCities(visited.concat(unvisited.concat([step["chosen"]])));
          setLines(visited.concat(visited[0]));
          setSeeking(seeking);

        } 
        let chosenCity = step["chosen"];
        chosenCity.isActive = true;
        let insertionSteps = step["insertionSteps"];

        for (let i = 0; i < insertionSteps.length; i++) {
          setSeeking([[chosenCity], insertionSteps[i]])
          await timer(animationDelay);
        }
        chosenCity.isActive = false;
        if (active.length > 0) {
          chosenCity.isRoute = true;
        }
      }
    }

    setCities(route[route.length - 1]["visited"]);
    setSeeking([[{ className: "none"}], [{ className: "none"}]]);
    setLines(route[route.length - 1]["visited"].concat(route[route.length - 1]["visited"][0]))
  }

  async function displayOptimisation(route) {
    for (const step of route) {
      setLines(step[1].concat([step[1][0]]))
      await timer(animationDelay);
    }
  }

  return (
    <div className="App">
      <HomeRow extension={".jsx"} />
      <SketchWrapper ref={wrapperRef} >
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
                borderColor="#0288d1"
              />
            );
          })}
        </div>
      </SketchWrapper>
      <Interface 
        begin={begin}
        reset={reset}
        displayPath={displayPath}
        displayOptimisation={displayOptimisation} 
        cities={cities}
        animationDelay={animationDelay}
        numPoints={numPoints}
        setCities={setCities}
        setLines={setLines}
        setAnimationDelay={setAnimationDelay}
        setNumPoints={setNumPoints}
      />
    </div>
  );
}

