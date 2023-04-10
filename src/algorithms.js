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

    // Find the farthest unvisited city to any city in the tour (minimise d(uc, ct))
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

    // Insert the farthest city to the tour to the lowest cost edge
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
  // Start with sub-graph of one node only
  let cheapestCityIdx = 0;
  route[0]["visited"].push(cities[cheapestCityIdx]);
  cities.splice(cheapestCityIdx, 1);

  // Find node closest to the node in our existing tour and add it
  let minDist = Infinity;
  let dist = Infinity;
  let counter = 0;
  let seekCounter = 0;
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
        cheapestCityIdx = i;
      }
    }
    seekCounter++;
  }
  seekCounter = 0;

  route.push({ visited: [], active: [], seeking: [], unvisited: [] });
  counter++;

  route[counter]["visited"] = route[counter - 1]["visited"].concat([
    cities[cheapestCityIdx],
  ]);
  cities.splice(cheapestCityIdx, 1);
  // route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

  while (cities.length > 0) {
    // Find edge in tour and node not in tour such that distance equation is minimal
    let minimal = Infinity;
    let bestInsertion = 0;
    for (let i = 0; i < cities.length; i++) {
      let [insertionIdx, steps, cost] = minimiseInsertionCost(
        route[counter]["visited"],
        cities[i]
      );
      if (cost < minimal) {
        minimal = cost;
        cheapestCityIdx = i;
        bestInsertion = insertionIdx;
      }
      route[counter]["active"].push([cities[i]]);
      route[counter]["seeking"].push(steps);
    }

    // Insert found node in found edge
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    let temp = [...route[counter - 1]["visited"]];
    temp.splice(bestInsertion, 0, cities[cheapestCityIdx]);
    cities.splice(cheapestCityIdx, 1);
    route[counter]["visited"] = route[counter]["visited"].concat(temp);
  }

  return route;
}

// function clarkWrightSavings(cities) {
//   let route = [];

//   return route;
// }

function optimiseInsertion(cities, nodes) {
  let tours = [];
  let stable = false;
  let bestTour = [...cities];
  let bestTourLength = calculateTour(cities);
  tours.push([bestTourLength, bestTour]);
  while (!stable) {
    stable = true;
    for (let i = 0; i < cities.length - nodes; i++) {
      for (let j = 0; j < cities.length; j++) {
        let newTour = [...bestTour];
        let toAdd = newTour.slice(i, nodes + i);
        newTour.splice(i, nodes);
        newTour.splice(j, 0, ...toAdd);
        let tourLength = calculateTour(newTour);
        if (bestTourLength > tourLength) {
          stable = false;
          bestTour = [...newTour];
          bestTourLength = tourLength;
          tours.push([tourLength, newTour]);
        }
      }
    }
  }
  tours.sort(function (a, b) {
    return b[0] - a[0];
  });
  return tours;
}

function nodeInsertion(cities) {
  return optimiseInsertion(cities, 1);
}

function edgeInsertion(cities) {
  return optimiseInsertion(cities, 2);
}

function twoOpt(cities) {
  let tours = [];
  let stable = false;
  let bestTour = [...cities];
  let bestTourLength = calculateTour(cities);
  tours.push([bestTourLength, bestTour])
  while (!stable) {
    stable = true;
    for (let i = 1; i < cities.length - 2; i++) {
      for (let j = i + 1; j < cities.length - 1; j++) {
        // pairwise exchange
        let temp1 = bestTour.slice(0, i);
        let temp2 = bestTour.slice(i, j + 1);
        temp2.reverse();
        let temp3 = bestTour.slice(j + 1);
        let newTour = [...temp1, ...temp2, ...temp3];
        let newTourLength = calculateTour(newTour);
        if (bestTourLength > newTourLength) {
          stable = false;
          bestTour = [...newTour];
          bestTourLength = newTourLength;
          tours.push([newTourLength, newTour]);
        }
      }
    }
  }
  return tours;
}

function gain(i, j, k, meow) {

}

function threeOpt(cities) {
  let tours = [];
  let stable = false;
  let bestTour = [...cities];
  let bestTourLength = calculateTour(cities);
  tours.push([bestTourLength, bestTour]);
  while (!stable) {
    stable = true;
    for (let i = 1; i < cities.length - 1; i++) {
      let A = bestTour[i - 1]
      let B = bestTour[i];
      if (!stable) {
        break;
      }
      for (let j = i + 2; j < cities.length; j++) {
        let C = bestTour[j - 1];
        let D = bestTour[j];
        if (!stable) {
          break;
        }
        for (let k = j + 2; k < cities.length + 1; k++) {
          let E = bestTour[k - 1];
          let F = bestTour[k % cities.length];
          let d0 = distance(A, B) + distance(C, D) + distance(E, F);
          let d1 = distance(A, C) + distance(B, D) + distance(E, F);
          let d2 = distance(A, B) + distance(C, E) + distance(D, F);
          let d3 = distance(A, D) + distance(E, B) + distance(C, F);
          let d4 = distance(F, B) + distance(C, D) + distance(E, A);
          let delta = 0;
          let newTour = [...bestTour];
          if (d0 > d1) {
            let temp = bestTour.slice(i, j + 1);
            temp.reverse();
            newTour.splice(i, temp.length, ...temp);
            delta = -d0 + d1
          } else if (d0 > d2) {
            let temp = bestTour.slice(j, k + 1);
            temp.reverse();
            newTour.splice(j, temp.length, ...temp);
            delta = -d0 + d2
          } else if (d0 > d4) {
            let temp = bestTour.slice(i, k + 1);
            temp.reverse();
            newTour.splice(i, temp.length, ...temp);
            delta = -d0 + d4
          } else if (d0 > d3) {
            let temp1 = bestTour.slice(j, k + 1);
            let temp2 = bestTour.slice(i, j + 1);
            newTour.splice(i, temp1.length + temp2.length, ...temp1.concat(temp2));
            delta = -d0 + d3
          }
          console.log(delta);
          if (delta < 0) {
            stable = false;
            let newTourLength = calculateTour(newTour);
            bestTour = [...newTour];
            tours.push([newTourLength, newTour]);  
          } 
        }
      }
    }
  }
  console.log(tours)
  return tours;
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
    if (cost < minCost) {
      minCost = cost;
      bestInsertion = i + 1;
    }
  }

  return [bestInsertion, insertionSteps, minCost];
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
  nodeInsertion,
  edgeInsertion,
  twoOpt,
  threeOpt,
};
