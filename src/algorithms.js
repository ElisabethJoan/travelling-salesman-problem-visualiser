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
  route.push({
    visited: [],
    active: [],
    seeking: [],
    chosen: undefined,
    insertionSteps: [],
    unvisited: [],
  });
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let closestCityIdx = 0;
  route[0]["visited"].push(cities[closestCityIdx]);
  cities.splice(closestCityIdx, 1);

  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let minDist = Infinity;
    let dist = Infinity;
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    // Find the closest unvisited city to any city in the tour (minimise d(uc, ct))
    for (let j = 0; j <= route[counter]["visited"].length - 1; j++) {
      route[counter]["active"].push([route[counter]["visited"][j]]);
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist = distance(route[counter]["visited"][j], cities[i]);
        if (dist < minDist) {
          minDist = dist;
          closestCityIdx = i;
        }
      }
      seekCounter++;
    }
    seekCounter = 0;

    // Remove the chosen city from the list of unvisited cities
    let toAdd = cities[closestCityIdx];
    route[counter]["chosen"] = toAdd;
    cities.splice(closestCityIdx, 1);

    // Find the edge in the tour where the cost to insert city is the lowest
    let [bestInsertion, insertionSteps] = minimiseInsertionCost(
      route[counter]["visited"],
      toAdd
    );
    route[counter]["insertionSteps"] = insertionSteps;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    // Insert the closest city to the tour to the lowest cost edge
    let temp = [...route[counter - 1]["visited"]];
    temp.splice(bestInsertion, 0, toAdd);
    route[counter]["visited"] = temp;
  }
  return route;
}

function farthestInsertion(cities) {
  let route = [];
  route.push({
    visited: [],
    active: [],
    seeking: [],
    chosen: undefined,
    insertionSteps: [],
    unvisited: [],
  });
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let farthestCityIdx = 0;
  route[0]["visited"].push(cities[farthestCityIdx]);
  cities.splice(farthestCityIdx, 1);

  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let maxDist = 0;
    let dist = 0;
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    // Find the closest unvisited city to any city in the tour (minimise d(uc, ct))
    for (let j = 0; j <= route[counter]["visited"].length - 1; j++) {
      route[counter]["active"].push([route[counter]["visited"][j]]);
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist = distance(route[counter]["visited"][j], cities[i]);
        if (dist > maxDist) {
          maxDist = dist;
          farthestCityIdx = i;
        }
      }
      seekCounter++;
    }
    seekCounter = 0;

    // Remove the chosen city from the list of unvisited cities
    let toAdd = cities[farthestCityIdx];
    route[counter]["chosen"] = toAdd;
    cities.splice(farthestCityIdx, 1);

    // Find the edge in the tour where the cost to insert city is the lowest
    let [bestInsertion, insertionSteps] = minimiseInsertionCost(
      route[counter]["visited"],
      toAdd
    );
    route[counter]["insertionSteps"] = insertionSteps;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    // Insert the closest city to the tour to the lowest cost edge
    let temp = [...route[counter - 1]["visited"]];
    temp.splice(bestInsertion, 0, toAdd);
    route[counter]["visited"] = temp;
  }
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
    // TODO convert this to check the total distance of the tour against each city
    // TODO for the entire tour find the place the current city increases the cost the least
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

function minimiseInsertionCost(tour, toAdd) {
  let minCost = Infinity;
  let insertionSteps = [];
  let bestInsertion = 0;
  for (let i = 0; i < tour.length; i++) {
    let prev = i;
    let next = i + 1;
    if (i === tour.length - 1) {
      next = 0;
    }
    insertionSteps.push([tour[prev], tour[next]]);
    let cost =
      distance(tour[prev], toAdd) +
      distance(toAdd, tour[next]) -
      distance(tour[prev], tour[next]);
    // console.log(cost);
    // console.log(minCost);
    if (cost < minCost) {
      minCost = cost;
      bestInsertion = i + 1;
    }
  }

  return [bestInsertion, insertionSteps];
}

function calculateTour(tour) {
  let currentDistance = 0;
  for (let i = 0; i < tour.length; i++) {
    if (i === tour.length - 1) {
      currentDistance += distance(tour[0], tour[i]);
    } else {
      currentDistance += distance(tour[i], tour[i + 1]);
    }
  }
  return currentDistance;
}

function distance(a, b) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}

export {
  nearestNeighbour,
  nearestInsertion,
  farthestInsertion,
  cheapestInsertion,
};
