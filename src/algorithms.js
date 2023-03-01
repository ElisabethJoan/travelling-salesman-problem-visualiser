function nearestNeighbour(cities) {
  let route = [];
  let dist = Infinity;
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let bestIdx = 0;

  let counter = 0;
  while (cities.length > 0) {
    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    if (counter > 0) {
      route[counter]["visited"] = route[counter - 1]["visited"].concat([
        cities[bestIdx],
      ]);
    } else {
      route[counter]["visited"].push(cities[bestIdx]);
    }

    let minDist = Infinity;
    let active = cities[bestIdx];
    route[counter]["active"].push([cities[bestIdx]]);
    cities.splice(bestIdx, 1);
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);
    route[counter]["seeking"].push([]);

    for (let i = 0; i < cities.length; i++) {
      route[counter]["seeking"][0].push([cities[i]]);
      dist = distance(active, cities[i]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = i;
      }
    }

    counter++;
  }
  route.push({ visited: [], active: [], seeking: [], unvisited: [] });
  route[counter]["visited"] = route[counter - 1]["visited"].concat([]);
  console.log(calculateTour(route[counter]["visited"]));
  return route;
}

function nearestInsertion(cities) {
  let route = [];
  route.push({ visited: [], active: [], seeking: [], unvisited: [] });
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let bestIdx = 0;
  route[0]["visited"].push(cities[bestIdx]);
  cities.splice(bestIdx, 1);

  // bestIdx = Math.floor(Math.random() * (cities.length - 1));
  bestIdx = 1;
  route[0]["visited"].push(cities[bestIdx]);
  cities.splice(bestIdx, 1);

  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let minDist = Infinity;
    let dist = Infinity;
    let bestInsertion = 0;
    for (let j = 0; j <= route[counter]["visited"].length - 1; j++) {
      route[counter]["active"].push([route[counter]["visited"][j]]);
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist = distance(route[counter]["visited"][j], cities[i]);
        if (dist < minDist) {
          minDist = dist;
          bestIdx = i;
          bestInsertion = j;
        }
      }
      seekCounter++;
    }

    let toAdd = cities[bestIdx];
    let prev, next;
    if (bestInsertion === 0) {
      prev = route[counter]["visited"].length - 1;
    } else {
      prev = bestInsertion - 1;
    }
    if (bestInsertion === route[counter]["visited"].length - 1) {
      next = 0;
    } else {
      next = bestInsertion + 1;
    }
    let beforeDist =
      distance(route[counter]["visited"][bestInsertion], toAdd) +
      distance(toAdd, route[counter]["visited"][next]) -
      distance(
        route[counter]["visited"][bestInsertion],
        route[counter]["visited"][next]
      );

    let afterDist =
      distance(route[counter]["visited"][prev], toAdd) +
      distance(toAdd, route[counter]["visited"][bestInsertion]) -
      distance(
        route[counter]["visited"][prev],
        route[counter]["visited"][bestInsertion]
      );

    if (beforeDist < afterDist) {
      bestInsertion = next;
    }

    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);
    cities.splice(bestIdx, 1);

    seekCounter = 0;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    let temp = [...route[counter - 1]["visited"]];
    temp.splice(bestInsertion, 0, toAdd);
    route[counter]["visited"] = route[counter]["visited"].concat(temp);
  }
  console.log(calculateTour(route[counter]["visited"]));
  return route;
}

function cheapestInsertion(cities) {
  let route = [];
  route.push({ visited: [], active: [], seeking: [], unvisited: [] });
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let bestIdx = 0;
  route[0]["visited"].push(cities[bestIdx]);
  cities.splice(bestIdx, 1);

  // bestIdx = Math.floor(Math.random() * (cities.length - 1));
  bestIdx = 1;
  route[0]["visited"].push(cities[bestIdx]);
  cities.splice(bestIdx, 1);

  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let minDist = Infinity;
    let dist = Infinity;
    let bestInsertion = 0;
    // Find every adjacent city and set them as active pairs
    for (let j = 0; j <= route[counter]["visited"].length - 1; j++) {
      if (j === route[counter]["visited"].length - 1) {
        route[counter]["active"].push([
          route[counter]["visited"][j],
          route[counter]["visited"][0],
        ]);
      } else {
        route[counter]["active"].push([
          route[counter]["visited"][j],
          route[counter]["visited"][j + 1],
        ]);
      }
    }

    // console.log(route[counter]);
    // For each unvisited city calculate tour distance against all active pairs
    for (let j = 0; j <= route[counter]["active"].length - 1; j++) {
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist =
          distance(route[counter]["active"][j][0], cities[i]) +
          distance(cities[i], route[counter]["active"][j][1]) -
          distance(
            route[counter]["active"][j][0],
            route[counter]["active"][j][1]
          );
        // console.log(route[counter]["active"][j][0]);
        // console.log(route[counter]["active"][j][1]);
        // console.log(cities[i]);
        // console.log(dist);
        if (dist < minDist) {
          minDist = dist;
          bestIdx = i;
          bestInsertion = j + 1;
        }
      }
      seekCounter++;
    }
    // break;
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    seekCounter = 0;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    let temp = [...route[counter - 1]["visited"]];
    temp.splice(bestInsertion, 0, cities[bestIdx]);
    cities.splice(bestIdx, 1);
    route[counter]["visited"] = route[counter]["visited"].concat(temp);
  }
  // console.log(route);
  console.log(calculateTour(route[counter]["visited"]));
  return route;
}

function calculateTour(cities) {
  let totalDistance = 0;
  for (let i = 0; i < cities.length; i++) {
    if (i === cities.length - 1) {
      totalDistance += distance(cities[0], cities[i]);
    } else {
      totalDistance += distance(cities[i], cities[i + 1]);
    }
  }
  return totalDistance;
}

function distance(a, b) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}

export { nearestNeighbour, nearestInsertion, cheapestInsertion };
