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
        map.push(line.replace('\r', '').split(''));
    }
    return map;
}
function findRegion(map, startCoords, visited) {
    let target = map[startCoords[0]][startCoords[1]];
    console.log('target:', target);
    let edges = 0;
    let area = 0;
    let q = [];
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
function isInBounds(coords, map) {
    return coords[0] >= 0 && coords[1] >= 0
        && coords[0] < map.length && coords[1] < map[0].length;
}
function traverse(map) {
    let visited = new Set();
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
            }
            else {
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
answer1();
