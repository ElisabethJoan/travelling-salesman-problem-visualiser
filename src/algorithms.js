function nearestNeighbour(cities) {
  let route = [];
  route.push({ visited: [], active: [], seeking: [], unvisited: [] });
  let dist = Infinity;
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  let bestIdx = 0;
  let counter = 0;
  while (cities.length > 1) {
    if (counter > 0) {
      route[counter]["visited"] = route[counter]["visited"].concat(route[counter - 1]["visited"])
    } else {
      route[counter]["visited"] = []
    }

    let minDist = Infinity;
    let active = cities[bestIdx];
    //console.log(active)
    route[counter]["active"].push(cities[bestIdx]);
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
    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;
    route[counter]["visited"].push(active)
  }
  route[counter]["visited"] = route[counter - 1]["visited"].concat(route[counter - 1]["active"].concat(route[counter - 1]["unvisited"]))
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
  route[0]["active"].push(cities[closestCityIdx]);
  cities.splice(closestCityIdx, 1);
  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let minDist = Infinity;
    let dist = Infinity;
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    // Find the closest unvisited city to any city in the tour (minimise d(uc, ct))
    for (let j = 0; j <= route[counter]["active"].length - 1; j++) {
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist = distance(route[counter]["active"][j], cities[i]);
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
      route[counter]["active"],
      toAdd
    );
    route[counter]["insertionSteps"] = insertionSteps;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    // Insert the closest city to the tour to the lowest cost edge
    let temp = [...route[counter - 1]["active"]];
    temp.splice(bestInsertion, 0, toAdd);
    route[counter]["active"] = temp;
  }
  let temp = [...route[counter]["active"]];
  route[counter]["visited"] = temp;
  route[counter]["active"] = [];
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
  route[0]["active"].push(cities[farthestCityIdx]);
  cities.splice(farthestCityIdx, 1);

  let counter = 0;
  let seekCounter = 0;
  while (cities.length > 0) {
    let maxDist = 0;
    let dist = 0;
    route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities);

    // Find the farthest unvisited city to any city in the tour (minimise d(uc, ct))
    for (let j = 0; j <= route[counter]["active"].length - 1; j++) {
      route[counter]["seeking"].push([]);
      for (let i = 0; i <= cities.length - 1; i++) {
        route[counter]["seeking"][seekCounter].push([cities[i]]);
        dist = distance(route[counter]["active"][j], cities[i]);
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
      route[counter]["active"],
      toAdd
    );
    route[counter]["insertionSteps"] = insertionSteps;

    route.push({ visited: [], active: [], seeking: [], unvisited: [] });
    counter++;

    // Insert the farthest city to the tour to the lowest cost edge
    let temp = [...route[counter - 1]["active"]];
    temp.splice(bestInsertion, 0, toAdd);
    route[counter]["active"] = temp;
  }
  let temp = [...route[counter]["active"]];
  route[counter]["visited"] = temp;
  route[counter]["active"] = [];
  return route;
}

function cheapestInsertion(cities) {
  let route = [];
  let counter = 0;
  route.push({ visited: [], active: [], chosen: undefined, insertionSteps: [], unvisited: [] });
  // let bestIdx = Math.floor(Math.random() * (cities.length - 1));
  // Start with sub-graph of two nodes only
  let cheapestCityIdx = 0;
  route[counter]["visited"].push(cities[cheapestCityIdx]);
  cities.splice(cheapestCityIdx, 1);
  route[counter]["visited"].push(cities[cheapestCityIdx]);
  cities.splice(cheapestCityIdx, 1);
  route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities)
  while (cities.length > 0) {
    let minCost = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < cities.length; i++) {
      let [insertionIdx, insertionSteps, cost] = minimiseInsertionCost(
        route[counter]["visited"],
        cities[i]
      )
      route[counter]["chosen"] = cities[i]
      route[counter]["unvisited"].splice(i, 1)
      route[counter]["insertionSteps"] = insertionSteps;
      if (cost < minCost) {
        minCost = cost;
        cheapestCityIdx = i;
        bestIdx = insertionIdx;
      }
      counter++;
      route.push({ visited: [], active: [], chosen: undefined, insertionSteps: [], unvisited: [] });
      route[counter]["unvisited"] = [].concat(cities);
      route[counter]["visited"] = route[counter]["visited"].concat(route[counter - 1]["visited"])
    }
    route[counter]["visited"].splice(bestIdx, 0, cities[cheapestCityIdx])
    route[counter]["unvisited"].splice(cheapestCityIdx, 1);
    cities.splice(cheapestCityIdx, 1);
  }
  return route;
}

function lineDist(city1, city2, city) {
  return Math.abs((city.y - city1.y) * (city2.x - city1.x) - (city2.y - city1.y) * (city.x - city1.x))
}

function findSide(city1, city2, city) {
  let val = (city.y - city1.y) * (city2.x - city1.x) - (city2.y - city1.y) * (city.x - city1.x)

  if (val > 0) {
    return 1
  }
  if (val < 0) {
    return -1
  }
  return 0
}


function quickHull(cities) {
  let hull = new Set()
  function quickHull(cities, city1, city2, side) {
    let ind = -1
    let maxDist = 0

    for (let i = 0; i < cities.length; i++) {
      let temp = lineDist(city1, city2, cities[i])
      if ((findSide(city1, city2, cities[i]) == side) && (temp > maxDist)) {
        ind = i
        maxDist = temp
      }
    }

    if (ind == -1) {
      hull.add(city1)
      hull.add(city2)
      return
    }
    quickHull(cities, cities[ind], city1, -findSide(cities[ind], city1, city2))
    quickHull(cities, cities[ind], city2, -findSide(cities[ind], city2, city1))
  }
  
  let minX = 0;
  let maxX = 0;
  for (let i = 1; i < cities.length; i++) {
    if (cities[i].x < cities[minX].x) {
      minX = i
    }
    if (cities[i].x > cities[maxX].x) {
      maxX = i
    }
  }
  
  quickHull(cities, cities[minX], cities[maxX], 1)

  quickHull(cities, cities[minX], cities[maxX], -1)

  return hull
}

function orderHull(hull) {
	// calculate centroid
  let cX = 0;
  let cY = 0;

  for (let i = 0; i < hull.length; i++) {
    cX += hull[i].x
    cY += hull[i].y
  }
  cX = cX / hull.length;
  cY = cY / hull.length;
  
  // for each point in the hull calculate the angle from the centroid
  let sortedHull = []	
  hull.forEach((city) => {
    let angle = Math.atan2(city.y - cY, city.x - cX) + 2 * Math.PI
    sortedHull.push({ 'city': city, 'angle': angle })
  });
	
  // sort the array of points based on the angles
  sortedHull.sort(function(a, b) {
    return (a.angle < b.angle)
  })
  //console.log(sortedHull)
  
  hull = []
  sortedHull.forEach((city) => {
    hull.push(city.city)
  });

  return hull
}

function convexHull(cities) {
  // form the convex hull as initial sub-tour
  let hullSet = quickHull(cities)
  let hull = orderHull(Array.from(hullSet))
  let tempCities = [...cities]
  let deleteCount = 0;
  for (let i = 0; i < cities.length; i++) {
    for (let j = 0; j < hull.length; j++) {
      if (hull[j].className == cities[i].className) {
        tempCities.splice(i - deleteCount, 1);
        deleteCount++;
      }
    }
  }
  cities = [...tempCities]
  let route = []
  let counter = 0;
  route.push({ visited: [], active: [], chosen: undefined, insertionSteps: [], unvisited: [] });
  while (cities.length > 0) {
    let x = [];
    let y = [];
    let z = [];
    for (let i = 0; i < cities.length; i++) {
      route[counter]["visited"] = route[counter]["visited"].concat(hull);
      route[counter]["chosen"] = cities[i];
      const newCities = cities.filter(function (city) {
        return city !== cities[i];
      });
      route[counter]["unvisited"] = route[counter]["unvisited"].concat(newCities);
      let cost_idx = [];
      for (let j = 0; j < hull.length; j++) {
        let prev = j;
        let next = j + 1;
        if (j === hull.length - 1) {
          next = 0;
        }
        cost_idx.push([hull[prev], cities[i], hull[next]]);
      }
      let cost_vec_1 = [];
      let insertionSteps = [];
      for (let j = 0; j < hull.length; j++) {
        let prev = j;
        let next = j + 1;
        if (j === hull.length - 1) {
          next = 0;
        }
        let cost =
          distance(hull[prev], cities[i]) +
          distance(cities[i], hull[next]) -
          distance(hull[prev], hull[next]);
        cost_vec_1.push(cost);
        insertionSteps.push([hull[prev], hull[next]]);
      }
      let cost_vec_2 = [];
      for (let j = 0; j < hull.length; j++) {
        let prev = j;
        let next = j + 1;
        if (j === hull.length - 1) {
          next = 0;
        }
        let cost =
          distance(hull[prev], cities[i]) +
          distance(cities[i], hull[next]) /
          distance(hull[prev], hull[next]);
        cost_vec_2.push(cost);
        insertionSteps.push([hull[prev], hull[next]]);
      }
      x.push(cost_vec_1.indexOf(Math.min(...cost_vec_1)));
      y.push(cost_vec_2[x.slice(-1)]);
      z.push(cost_idx[x.slice(-1)]);
      route[counter]["insertionSteps"] = route[counter]["insertionSteps"].concat(insertionSteps);
      counter++;
      route.push({ visited: [], active: [], chosen: undefined, insertionSteps: [], unvisited: [] });
    }
    let [asd, bsd, _] = z[y.indexOf(Math.min(...y))];
    let bestIdx = cities.indexOf(bsd);
    cities.splice(bestIdx, 1);
    let insertIdx = hull.indexOf(asd);
    hull.splice(insertIdx + 1, 0, bsd)
  }
  route[counter]["visited"] = route[counter]["visited"].concat(hull);
  return route
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
  convexHull,
  nodeInsertion,
  edgeInsertion,
  twoOpt,
};
