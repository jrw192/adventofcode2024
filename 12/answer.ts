import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string): string[][] {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const map: string[][] = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split(''));
    }
    return map;
}

function findRegion(map: string[][], startCoords: number[], visited: Set<string>) {
    let target = map[startCoords[0]][startCoords[1]];
    // console.log('target:', target);
    let edges = 0;
    let area = 0;
    let q: number[][] = [];
    q.push(startCoords);
    visited.add(`${startCoords[0]},${startCoords[1]}`);

    while (q.length > 0) {
        let newQ = [];
        for (let coord of q) {

            // add plot to area
            area += 1;

            let [r, c] = coord;

            let NEIGHBORS = [[r, c + 1], [r + 1, c], [r, c - 1], [r - 1, c]];
            for (let neighbor of NEIGHBORS) {
                let neighborToken = `${neighbor[0]},${neighbor[1]}`;
                if (!isInBounds(neighbor, map) || map[neighbor[0]][neighbor[1]] !== target) {
                    // if neighbor is not the same type, or it'there is no neighbor
                    // then there is an edge
                    edges += 1;
                }
                else if (!visited.has(neighborToken)) {
                    newQ.push(neighbor);
                    visited.add(neighborToken);
                }
            }
        }
        q = newQ;
    }
    return { edges, area, visited };
}

function isInBounds(coords: number[], map: string[][]): boolean {
    return coords[0] >= 0 && coords[1] >= 0
        && coords[0] < map.length && coords[1] < map[0].length;
}

function traverse(map: string[][]) {
    let visited = new Set<string>();
    let total = 0;
    let currentType = 'NONE';
    let skipped = false;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            let token = `${r},${c}`;
            if (!visited.has(token)) {
                if (map[r][c] !== currentType || skipped) {
                    let result = findRegion(map, [r, c], visited);
                    let price = result.area * result.edges;
                    total += price;
                    visited = result.visited;
                    currentType = map[r][c];
                    skipped = false;
                }
            } else {
                skipped = true;
            }
        }
    }

    return total;
}

function answer1() {
    let fieldMap = init1('./input.txt');
    // let { edges, area, visited } = findRegion(fieldMap, [1, 2], new Set<string>());
    // console.log('edges:', edges);
    // console.log('area', area);
    let answer = traverse(fieldMap);
    console.log('ANSWER1', answer);

}
// answer1();

/* -------------------------------------PART 2------------------------------------- */

function isInPlot(coords: number[], map: string[][], target: string): boolean {
    return isInBounds(coords, map) && map[coords[0]][coords[1]] === target
}

function findCornersForPlot(map: string[][], coords: number[]) {
    let target = map[coords[0]][coords[1]];
    // console.log('target:',target);
    let convexCorners = 0;
    let concaveCorners = 0;

    let directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    for (let i = 0; i < directions.length; i++) {
        let modifier = directions[i];
        let neighbor = [coords[0]+modifier[0], coords[1]+modifier[1]];
        let prevModifier = (i-1 == -1) ? directions[directions.length-1] : directions[i-1]
        let prevNeighbor = [coords[0]+prevModifier[0], coords[1]+prevModifier[1]];
        // let neighborVal = map[neighbor[0]][neighbor[1]];
        // let prevNeighborVal = map[prevNeighbor[0]][prevNeighbor[1]];
        // console.log(`neighbor:${neighbor},neighborVal:${neighborVal}`);
        // console.log(`prevNeighbor:${prevNeighbor},prevNeighborVal:${prevNeighborVal}`);
        // convex corners = two neighbors are not matching target
        if (!isInPlot(neighbor, map, target) && !isInPlot(prevNeighbor, map, target)) {
            convexCorners += 1;
        }
        // concave corners = two neighbors are matching target, diagonal not matching
        else if (isInPlot(neighbor, map, target)) {
            if (isInPlot(prevNeighbor, map, target)) {
                // check diagonal not matching
                let diagonalModifier = [modifier[0] + prevModifier[0], modifier[1] + prevModifier[1]];
                let diagonal = [coords[0]+diagonalModifier[0], coords[1]+diagonalModifier[1]];
                if (!isInPlot(diagonal, map, target)) {
                    concaveCorners += 1;
                }
            }
        }

    }
    // console.log('concaveCorners', concaveCorners);
    // console.log('convexCorners', convexCorners);
    return concaveCorners + convexCorners;
}

function findRegion2(map: string[][], startCoords: number[], visited: Set<string>) {
    let target = map[startCoords[0]][startCoords[1]];
    // console.log('target:', target);
    let corners = 0;
    let area = 0;
    let q: number[][] = [];
    q.push(startCoords);
    visited.add(`${startCoords[0]},${startCoords[1]}`);

    while (q.length > 0) {
        let newQ = [];
        for (let coord of q) {
            // add plot to area
            area += 1;
            // get corners = faces
            corners += findCornersForPlot(map, coord);

            let [r, c] = coord;
            let NEIGHBORS = [[r, c + 1], [r + 1, c], [r, c - 1], [r - 1, c]];
            for (let neighbor of NEIGHBORS) {
                let neighborToken = `${neighbor[0]},${neighbor[1]}`;
                if (!isInBounds(neighbor, map) || map[neighbor[0]][neighbor[1]] !== target) {
                }
                else if (!visited.has(neighborToken)) {
                    newQ.push(neighbor);
                    visited.add(neighborToken);
                }
            }
        }
        q = newQ;
    }
    return { corners, area, visited };
}

function traverse2(map: string[][]) {
    let visited = new Set<string>();
    let total = 0;
    let currentType = 'NONE';
    let skipped = false;

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            let token = `${r},${c}`;
            if (!visited.has(token)) {
                if (map[r][c] !== currentType || skipped) {
                    let result = findRegion2(map, [r, c], visited);
                    let price = result.area * result.corners;
                    total += price;
                    visited = result.visited;
                    currentType = map[r][c];
                    skipped = false;
                }
            } else {
                skipped = true;
            }
        }
    }

    return total;
}

function answer2() {
    let fieldMap = init1('./input.txt');
    // findCornersForPlot(fieldMap, [1,1]);
    let ans = traverse2(fieldMap);
    console.log('ANSWER2',ans);

}

answer2();