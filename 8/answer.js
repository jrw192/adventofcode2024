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
function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const map = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split(''));
    }
    return [map, lines.length, lines[0].length];
}
function buildCoordsFromMap(antennaMap) {
    let coordMap = new Map();
    let tokenMap = new Map();
    for (let r = 0; r < antennaMap.length; r++) {
        for (let c = 0; c < antennaMap[0].length; c++) {
            let char = antennaMap[r][c];
            if (char !== '.') {
                let coordList = coordMap.get(char) ?? [];
                coordList.push({ r, c });
                coordMap.set(char, coordList);
            }
        }
    }
    return coordMap;
}
function getAntinodes(map, coordMap, rows, cols) {
    let antinodeCoords = new Set();
    for (let [antenna, coords] of coordMap) {
        for (let i = 0; i < coords.length - 1; i++) {
            for (let j = i + 1; j < coords.length; j++) {
                let antenna1 = coords[i];
                let antenna2 = coords[j];
                let rDist = antenna1.r - antenna2.r;
                let cDist = antenna1.c - antenna2.c;
                let antiNode1 = { r: antenna1.r - rDist * 2, c: antenna1.c - cDist * 2 };
                let antiNode2 = { r: antenna1.r + rDist, c: antenna1.c + cDist };
                for (let node of [antiNode1, antiNode2]) {
                    let string = `${node.r},${node.c}`;
                    if (inBounds(node, rows, cols)) {
                        antinodeCoords.add(string);
                        map[node.r][node.c] = '#';
                    }
                }
            }
        }
    }
    // for(let row of map) {
    //     console.log(row.join(''));
    // }
    return antinodeCoords.size;
}
function inBounds(coords, rows, cols) {
    return (coords.r >= 0 && coords.c >= 0 && coords.r < rows && coords.c < cols);
}
function answer1() {
    let [map, rows, cols] = init1();
    // console.log(map);
    let coordMap = buildCoordsFromMap(map);
    // console.log(coordMap);
    let ans1 = getAntinodes(map, coordMap, rows, cols);
    console.log('ans1', ans1);
}
answer1();
/* -------------------------------------PART 2------------------------------------- */
function getAntinodes2(map, coordMap, rows, cols) {
    let antinodeCoords = new Set();
    for (let [antenna, coords] of coordMap) {
        for (let i = 0; i < coords.length - 1; i++) {
            for (let j = i + 1; j < coords.length; j++) {
                let antenna1 = coords[i];
                let antenna2 = coords[j];
                antinodeCoords.add(`${antenna1.r},${antenna1.c}`);
                antinodeCoords.add(`${antenna2.r},${antenna2.c}`);
                let rDist = antenna1.r - antenna2.r;
                let cDist = antenna1.c - antenna2.c;
                let antiNode1 = { r: antenna1.r - rDist * 2, c: antenna1.c - cDist * 2 };
                let antiNode2 = { r: antenna1.r + rDist, c: antenna1.c + cDist };
                while (inBounds(antiNode1, rows, cols)) {
                    let string = `${antiNode1.r},${antiNode1.c}`;
                    antinodeCoords.add(string);
                    map[antiNode1.r][antiNode1.c] = '#';
                    antiNode1 = { r: antiNode1.r - rDist, c: antiNode1.c - cDist };
                }
                while (inBounds(antiNode2, rows, cols)) {
                    let string = `${antiNode2.r},${antiNode2.c}`;
                    antinodeCoords.add(string);
                    map[antiNode2.r][antiNode2.c] = '#';
                    antiNode2 = { r: antiNode2.r + rDist, c: antiNode2.c + cDist };
                }
            }
        }
    }
    return antinodeCoords.size;
}
function answer2() {
    let [map, rows, cols] = init1();
    let coordMap = buildCoordsFromMap(map);
    let ans2 = getAntinodes2(map, coordMap, rows, cols);
    console.log('ans2', ans2);
}
answer2();
