"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
/* -------------------------------------PART 1------------------------------------- */
function init1(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const map = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split('').map((c) => Number(c)));
    }
    return map;
}
function findTrailScore(map, start) {
    let output = JSON.parse(JSON.stringify(map));
    let score = 0;
    let visited = new Set();
    let q = [];
    q.push(start);
    visited.add(`${start[0]},${start[1]}`);
    while (q.length > 0) {
        // console.log(q);
        let newQ = [];
        for (let node of q) {
            let [row, col] = node;
            output[row][col] = 'X';
            // console.log('---------------');
            // for (let l of output) {
            //     console.log(l.join(''));
            // }
            // console.log('---------------');
            if (map[row][col] == 9) {
                score += 1;
            }
            let nextLocations = [[row + 1, col], [row - 1, col], [row, col - 1], [row, col + 1]];
            for (let location of nextLocations) {
                // console.log('loc:', location, 'rows:', map.length, 'rows[0]', map[0].length);
                // check if in bounds
                if (location[0] >= 0 && location[1] >= 0 && location[0] < map.length && location[1] < map[0].length) {
                    // console.log('visitng:', location);
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
function getAllTrailheads(map) {
    let trailheads = [];
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
    // console.log('map');
    // console.log(map);
    let trailheads = getAllTrailheads(map);
    console.log('trailheads', trailheads);
    let score = 0;
    for (let head of trailheads) {
        let currentScore = findTrailScore(map, head);
        score += currentScore;
    }
    console.log('ANSWER 1:', score);
}
answer1();
/* -------------------------------------PART 2------------------------------------- */
function init2(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const map = [];
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
function findTrailScore2(map, location, visited) {
    let score = 0;
    let [row, col] = location;
    if (map[row][col] == 9) {
        // console.log('9 found');
        // return 1;
        score += 1;
    }
    let newVisited = new Set();
    for (let e of visited.values()) {
        newVisited.add(e);
    }
    newVisited.add(`${row},${col}`);
    let nextLocations = [[row + 1, col], [row - 1, col], [row, col - 1], [row, col + 1]];
    for (let next of nextLocations) {
        let nextToken = `${next[0]},${next[1]}`;
        if (isInBounds(map, next) && !newVisited.has(nextToken)) {
            if (map[next[0]][next[1]] == map[row][col] + 1) {
                score += findTrailScore2(map, next, newVisited);
            }
        }
    }
    return score;
}
function isInBounds(map, location) {
    return (location[0] >= 0 && location[1] >= 0 && location[0] < map.length && location[1] < map[0].length);
}
// q: [0] newQ: [1,1] => +1 trail, trail count 2
// q: [1,1] newQ: [2,2] => +0 trail, trail count 2
// q: [2,2] newQ: [3,3]
function answer2() {
    let map = init2('./input.txt');
    console.log('--------------');
    for (let l of map) {
        console.log(l.join(''));
    }
    console.log('--------------');
    // console.log('map');
    // console.log(map);
    let trailheads = getAllTrailheads(map);
    console.log('trailheads', trailheads);
    let score = [];
    for (let head of trailheads) {
        let currentScore = findTrailScore2(map, head, new Set());
        score.push(currentScore);
    }
    console.log('score', score);
    console.log('ANSWER 2:', score.reduce((n, sum) => n + sum));
}
answer2();
