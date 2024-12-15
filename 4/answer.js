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
    let grid = [];
    for (let line of lines) {
        grid.push(line.split(''));
    }
    return grid;
}
const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];
function findWords(grid, starts) {
}
function canBeWord(grid, start, currentStr) {
    switch (currentStr) {
        case 'X':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0] + dir[0], start[1] + dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'M') {
                    if (canBeWord(grid, newStart, 'XM')) {
                        return true;
                    }
                    ;
                }
            }
        case 'XM':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0] + dir[0], start[1] + dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'A') {
                    if (canBeWord(grid, newStart, 'XMA')) {
                        return true;
                    }
                    ;
                }
            }
        case 'XMA':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0] + dir[0], start[1] + dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'S') {
                    if (canBeWord(grid, newStart, 'XMAS')) {
                        return true;
                    }
                    ;
                }
            }
        case 'XMAS':
            return true;
        default:
            return false;
    }
}
function findAllStarts(grid) {
    // returns the coordinates of all X's
    let coords = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == 'X') {
                coords.push([r, c]);
            }
        }
    }
    return coords;
}
function answer1() {
    let grid = init1('./test.txt');
    let starts = findAllStarts(grid);
}
answer1();
