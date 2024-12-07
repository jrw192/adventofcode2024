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
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');
let FLOOR_MAP = [];
let COORDS = {
    r: 0,
    c: 0,
};
let VISITED = 0;
function initConstants() {
    let floorMap = [];
    let coords = { r: -1, c: -1 };
    for (let line of lines) {
        if (line.includes('^')) {
            coords = {
                r: lines.indexOf(line),
                c: line.indexOf('^'),
            };
        }
        floorMap.push(line.replace(/\r/g, '').split(''));
    }
    return { coords, floorMap };
}
/* -------------------------------------PART 1------------------------------------- */
function isOutOfBounds(floorMap, coords) {
    return (coords.r < 0 || coords.r > floorMap.length - 1 || coords.c < 0 || coords.c > floorMap[0].length - 1);
}
/*
 * moves until leaving the map
*/
function moveToObstacle(floorMap, coords, direction) {
    let visited = 0;
    let visitedCoords = [];
    let coordsCopy = {
        r: coords.r,
        c: coords.c,
    };
    if (doesMapContainLoop(floorMap, coordsCopy, direction)) {
        console.log('map contains loop');
        return { visited, visitedCoords, floorMap };
    }
    while (!isOutOfBounds(floorMap, coords)) {
        switch (direction) {
            case 'up':
                while (floorMap[coords.r][coords.c] !== '#') {
                    if (floorMap[coords.r][coords.c] !== 'X') {
                        // mark as visited
                        floorMap[coords.r][coords.c] = 'X';
                        visited += 1;
                        visitedCoords.push({ r: coords.r, c: coords.c });
                    }
                    coords.r -= 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return { visited, visitedCoords, floorMap };
                    }
                }
                coords.r += 1;
                direction = 'right';
                break;
            case 'down':
                while (floorMap[coords.r][coords.c] !== '#') {
                    if (floorMap[coords.r][coords.c] !== 'X') {
                        // mark as visited
                        floorMap[coords.r][coords.c] = 'X';
                        visited += 1;
                        visitedCoords.push({ r: coords.r, c: coords.c });
                    }
                    coords.r += 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return { visited, visitedCoords, floorMap };
                    }
                }
                coords.r -= 1;
                direction = 'left';
                break;
            case 'right':
                while (floorMap[coords.r][coords.c] !== '#') {
                    if (floorMap[coords.r][coords.c] !== 'X') {
                        // mark as visited
                        floorMap[coords.r][coords.c] = 'X';
                        visited += 1;
                        visitedCoords.push({ r: coords.r, c: coords.c });
                    }
                    coords.c += 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return { visited, visitedCoords, floorMap };
                    }
                }
                coords.c -= 1;
                direction = 'down';
                break;
            case 'left':
                while (floorMap[coords.r][coords.c] !== '#') {
                    if (floorMap[coords.r][coords.c] !== 'X') {
                        // mark as visited
                        floorMap[coords.r][coords.c] = 'X';
                        visited += 1;
                        visitedCoords.push({ r: coords.r, c: coords.c });
                    }
                    coords.c -= 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return { visited, visitedCoords, floorMap };
                    }
                }
                coords.c += 1;
                direction = 'up';
                break;
        }
    }
    return { visited, visitedCoords, floorMap };
}
let init = initConstants();
FLOOR_MAP = init.floorMap;
COORDS = init.coords;
let result1 = moveToObstacle(FLOOR_MAP, COORDS, 'up');
let answer1 = result1.visited;
let floorMap1 = result1.floorMap;
let visitedCoords1 = result1.visitedCoords;
console.log('ANSWER1:', answer1);
/* -------------------------------------PART 2------------------------------------- */
function doesMapContainLoop(floorMap, coordsOG, direction) {
    let visitedSet = new Set();
    let coords = JSON.parse(JSON.stringify(coordsOG));
    while (!isOutOfBounds(floorMap, coords)) {
        // console.log(visitedSet);
        switch (direction) {
            case 'up':
                while (floorMap[coords.r][coords.c] !== '#') {
                    let visitedStr = `${coords.r},${coords.c}up`;
                    if (visitedSet.has(visitedStr)) {
                        return true;
                    }
                    visitedSet.add(visitedStr);
                    coords.r -= 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return false;
                    }
                }
                coords.r += 1;
                direction = 'right';
                break;
            case 'down':
                while (floorMap[coords.r][coords.c] !== '#') {
                    let visitedStr = `${coords.r},${coords.c}down`;
                    if (visitedSet.has(visitedStr)) {
                        return true;
                    }
                    visitedSet.add(visitedStr);
                    coords.r += 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return false;
                    }
                }
                coords.r -= 1;
                direction = 'left';
                break;
            case 'right':
                while (floorMap[coords.r][coords.c] !== '#') {
                    let visitedStr = `${coords.r},${coords.c}right`;
                    if (visitedSet.has(visitedStr)) {
                        return true;
                    }
                    visitedSet.add(visitedStr);
                    coords.c += 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return false;
                    }
                }
                coords.c -= 1;
                direction = 'down';
                break;
            case 'left':
                while (floorMap[coords.r][coords.c] !== '#') {
                    let visitedStr = `${coords.r},${coords.c}left`;
                    if (visitedSet.has(visitedStr)) {
                        return true;
                    }
                    visitedSet.add(visitedStr);
                    coords.c -= 1;
                    if (isOutOfBounds(floorMap, coords)) {
                        return false;
                    }
                }
                coords.c += 1;
                direction = 'up';
                break;
        }
    }
    return false;
}
function findNumOptions(floorMap, coords, visited) {
    let answer = 0;
    for (let testCoord of visited) {
        let coordsCopy = JSON.parse(JSON.stringify(coords));
        let floorMapCopy = JSON.parse(JSON.stringify(floorMap));
        if (testCoord.r !== coords.r || testCoord.c !== coords.c) {
            floorMapCopy[testCoord.r][testCoord.c] = '#';
            if (doesMapContainLoop(floorMapCopy, coordsCopy, 'up')) {
                answer += 1;
            }
        }
    }
    return answer;
}
let FLOOR_MAP2 = [];
let init2 = initConstants();
let COORDS2 = {
    r: 0,
    c: 0,
};
FLOOR_MAP2 = init2.floorMap;
COORDS2 = init2.coords;
let answer2 = findNumOptions(FLOOR_MAP2, COORDS2, visitedCoords1);
console.log('ANSWER2:', answer2);
