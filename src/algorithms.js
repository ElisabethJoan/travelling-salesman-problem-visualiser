function nearestNeighbour(cities) {
    let route = []
    let dist = Infinity;
    let bestIdx = Math.floor(Math.random() * (cities.length - 1));

    let counter = 0;
    while (cities.length > 0) {
        route.push({ visited: [], active: [], seeking: [], unvisited: [] })
        if (counter > 0) {
            route[counter]["visited"] = route[counter - 1]["visited"].concat([cities[bestIdx]]);
        } else {
            route[counter]["visited"].push(cities[bestIdx]);
        }

        let minDist = Infinity
        let active = cities[bestIdx];
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

        counter++;
    }
    route.push({ visited: [], active: [], seeking: [], unvisited: [] })
    route[counter]["visited"] = route[counter - 1]["visited"].concat([])
    return route;
}


function nearestInsertion(cities) {
    let route = [];
    route.push({ visited: [], active: [], seeking: [], unvisited: [] })
    let bestIdx = Math.floor(Math.random() * (cities.length - 1));
    route[0]["visited"].push(cities[bestIdx])
    cities.splice(bestIdx, 1);

    bestIdx = Math.floor(Math.random() * (cities.length - 1));

    route[0]["visited"].push(cities[bestIdx])
    cities.splice(bestIdx, 1);

    let counter = 0
    let seekCounter = 0
    while (cities.length > 0) {
        let minDist = Infinity;
        let dist = Infinity;
        for (const city of route[counter]["visited"]) {
            route[counter]["active"].push(city);
            route[counter]["seeking"].push([]);
            for (let i = 0; i <= cities.length - 1; i++) {
                route[counter]["seeking"][seekCounter].push([cities[i]]);
                dist = distance(city, cities[i])
                if (dist < minDist) {
                    minDist = dist;
                    bestIdx = i;
                }
            }
            seekCounter++;
        }

        let toAdd = cities[bestIdx]
        route[counter]["active"].push(cities[bestIdx]);
        route[counter]["unvisited"] = route[counter]["unvisited"].concat(cities)
        cities.splice(bestIdx, 1);
        route[counter]["seeking"].push([]);

        minDist = Infinity;
        dist = Infinity;
        for (let i = 1; i <= route[counter]["visited"].length; i++) {
            let next = i;
            let prev = i - 1;

            if (i === route[counter]["visited"].length) {
                next = 0;
            }

            route[counter]["seeking"][seekCounter].push([route[counter]["visited"][prev], route[counter]["visited"][next]]);

            dist = distance(route[counter]["visited"][prev], toAdd) +
                distance(toAdd, route[counter]["visited"][next]) -
                distance(route[counter]["visited"][prev], route[counter]["visited"][next]);

            if (dist < minDist) {
                minDist = dist;
                bestIdx = next;
            }
        }
        seekCounter = 0;

        route.push({ visited: [], active: [], seeking: [], unvisited: [] });
        counter++;

        let temp = [...route[counter - 1]["visited"]];
        temp.splice(bestIdx, 0, toAdd);
        route[counter]["visited"] = route[counter]["visited"].concat(temp)
    }
    return route;
}


function distance(a, b) {
    const deltaX = a.x - b.x;
    const deltaY = a.y - b.y;
    return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}

export {
    nearestNeighbour, nearestInsertion
};