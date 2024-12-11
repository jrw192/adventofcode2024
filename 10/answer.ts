import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string): number[][] {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const map: number[][] = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split('').map((c) => Number(c)));
    }
    return map;
}

function findTrailScore(map: number[][], start: number[]): number {
    let output = JSON.parse(JSON.stringify(map));
    let score = 0;
    let visited = new Set<string>();
    let q: number[][] = [];
    q.push(start);
    visited.add(`${start[0]},${start[1]}`);

    while (q.length > 0) {
        // console.log(q);
        let newQ = [];
        for (let node of q) {
            let [row, col] = node;
            output[row][col] = 'X';
            if (map[row][col] == 9) {
                score += 1;
            }

            let nextLocations = [[row + 1, col], [row - 1, col], [row, col - 1], [row, col + 1]];
            for (let location of nextLocations) {
                // check if in bounds
                if (location[0] >= 0 && location[1] >= 0 && location[0] < map.length && location[1] < map[0].length) {
                    let token = `${location[0]},${location[1]}`;
                    if (!visited.has(token)) {
                        if (map[location[0]][location[1]] == map[row][col] + 1) {
                            newQ.push(location);
                            visited.add(token);
                        }
                    }
                }
            }
        }
        q = newQ;
    }

    return score;
}

function getAllTrailheads(map: number[][]): number[][] {
    let trailheads: number[][] = [];
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] == 0) {
                trailheads.push([r, c]);
            }
        }
    }
    return trailheads;
}

function answer1() {
    let map = init1('./test.txt');
    let trailheads = getAllTrailheads(map);
    let score = 0;
    for (let head of trailheads) {
        let currentScore = findTrailScore(map, head);
        score += currentScore;
    }
    console.log('ANSWER 1:', score);
}

answer1();

/* -------------------------------------PART 2------------------------------------- */
function init2(filename: string): any[][] {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const map: any[][] = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split('').map((c) => {
            if (!isNaN(Number(c))) {
                return Number(c);
            }
            return '.';
        }));
    }
    return map;
}
function findTrailScore2(map: any[][], location: number[], visited: Set<string>): number {
    let score = 0;
    let [row, col] = location;
    if (map[row][col] == 9) {
        score += 1;
    }
    let newVisited = new Set<string>();
    for (let e of visited.values()) {
        newVisited.add(e);
    }

    newVisited.add(`${row},${col}`);
    let nextLocations = [[row + 1, col], [row - 1, col], [row, col - 1], [row, col + 1]];
    for (let next of nextLocations) {
        let nextToken = `${next[0]},${next[1]}`;
        if (isInBounds(map, next) && !newVisited.has(nextToken)) {
            if (map[next[0]][next[1]] == map[row][col]+1) {
                score += findTrailScore2(map, next,newVisited);
            }
        }
    }

    return score;
}

function isInBounds(map: number[][], location: number[]): boolean {
    return (location[0] >= 0 && location[1] >= 0 && location[0] < map.length && location[1] < map[0].length);
}

function answer2() {
    let map = init2('./input.txt');
    let trailheads = getAllTrailheads(map);
    let score = 0;
    for (let head of trailheads) {
        let currentScore = findTrailScore2(map, head, new Set<string>());
        score += currentScore;
    }
    console.log('ANSWER 2:', score);
}

answer2();