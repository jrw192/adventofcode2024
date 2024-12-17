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
const WIDTH = 101;
const MAXCOL = WIDTH - 1;
const HEIGHT = 103;
const MAXROW = HEIGHT - 1;
class Robot {
    position;
    velocity;
    constructor(pos, vel) {
        this.position = pos ?? { col: 0, row: 0 };
        this.velocity = vel ?? { col: 0, row: 0 };
    }
    move(seconds) {
        // let newCol = Math.abs((this.position.col + (this.velocity.col * seconds)) % MAXCOL);
        // let newRow = Math.abs((this.position.row + (this.velocity.row * seconds)) % MAXROW);
        let newCol = this.position.col;
        let newRow = this.position.row;
        for (let i = 0; i < seconds; i++) {
            newCol += this.velocity.col;
            if (newCol < 0) {
                newCol = WIDTH + newCol;
            }
            else if (newCol > MAXCOL) {
                newCol = newCol - WIDTH;
            }
            newRow += this.velocity.row;
            if (newRow < 0) {
                newRow = HEIGHT + newRow;
            }
            else if (newRow > MAXROW) {
                newRow = newRow - HEIGHT;
            }
        }
        this.position = { col: newCol, row: newRow };
        return this.position;
    }
}
/* -------------------------------------PART 1------------------------------------- */
function init1(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    let robots = [];
    /* p=x,y where x represents the number of tiles the
    robot is from the left wall and y represents the number
    of tiles from the top wall */
    // x = col, y = row
    for (let line of lines) {
        let coords = Array.from(line.matchAll(/((-)?\d+,(-)?\d+)/g));
        let p = coords[0][0];
        let v = coords[1][1];
        // console.log('p',p,'v',v);
        let position = { col: Number(p.slice(0, p.indexOf(','))), row: Number(p.slice(p.indexOf(',') + 1)) };
        let velocity = { col: Number(v.slice(0, v.indexOf(','))), row: Number(v.slice(v.indexOf(',') + 1)) };
        let robot = new Robot(position, velocity);
        robots.push(robot);
    }
    return robots;
}
// const WIDTH = 11;
// const MAXCOL = WIDTH-1; 10
// const HEIGHT = 7;
// const MAXROW = HEIGHT-1; 6
function inQuadrant1(robot) {
    return robot.position.col < MAXCOL / 2 && robot.position.row < MAXROW / 2;
}
function inQuadrant2(robot) {
    return robot.position.col > MAXCOL / 2 && robot.position.row < MAXROW / 2;
}
function inQuadrant3(robot) {
    return robot.position.col > MAXCOL / 2 && robot.position.row > MAXROW / 2;
}
function inQuadrant4(robot) {
    return robot.position.col < MAXCOL / 2 && robot.position.row > MAXROW / 2;
}
function answer1() {
    let robots = init1('./input.txt');
    for (let robot of robots) {
        // console.log('before',robot.position);
        robot.move(100);
        // console.log('after',robot.position);
        // if (inQuadrant1(robot)) {
        //     console.log('inQuadrant1');
        // }
        // if (inQuadrant2(robot)) {
        //     console.log('inQuadrant2');
        // }
        // if (inQuadrant3(robot)) {
        //     console.log('inQuadrant3');
        // }
        // if (inQuadrant4(robot)) {
        //     console.log('inQuadrant4');
        // }
    }
    // do quadrant stuff
    let quadrants = [0, 0, 0, 0];
    for (let robot of robots) {
        if (inQuadrant1(robot)) {
            // console.log('inQuadrant1');
            quadrants[0] += 1;
        }
        if (inQuadrant2(robot)) {
            // console.log('inQuadrant2');
            quadrants[1] += 1;
        }
        if (inQuadrant3(robot)) {
            // console.log('inQuadrant3');
            quadrants[2] += 1;
        }
        if (inQuadrant4(robot)) {
            // console.log('inQuadrant4');
            quadrants[3] += 1;
        }
    }
    console.log('quadrants', quadrants);
    let safetyFactor = quadrants.reduce((i, t) => i * t);
    console.log('ANS 1:', safetyFactor);
}
answer1();
/* -------------------------------------PART 2------------------------------------- */
function hasOverlaps(robots) {
    let positions = new Set();
    for (let robot of robots) {
        let token = `${robot.position.col},${robot.position.row}`;
        if (positions.has(token)) {
            return true;
        }
        else {
            positions.add(token);
        }
    }
    return false;
}
function getSafetyFactor(robots) {
    let quadrants = [0, 0, 0, 0];
    for (let robot of robots) {
        if (inQuadrant1(robot)) {
            // console.log('inQuadrant1');
            quadrants[0] += 1;
        }
        if (inQuadrant2(robot)) {
            // console.log('inQuadrant2');
            quadrants[1] += 1;
        }
        if (inQuadrant3(robot)) {
            // console.log('inQuadrant3');
            quadrants[2] += 1;
        }
        if (inQuadrant4(robot)) {
            // console.log('inQuadrant4');
            quadrants[3] += 1;
        }
    }
    let safetyFactor = quadrants.reduce((i, t) => i * t);
    return safetyFactor;
}
function answer2() {
    let robots = init1('./input.txt');
    let seconds = 0;
    let safetyFactor = Number.MAX_VALUE;
    while (true) {
        for (let robot of robots) {
            robot.move(1);
        }
        seconds += 1;
        let newSafetyFactor = getSafetyFactor(robots);
        if (newSafetyFactor < safetyFactor) {
            safetyFactor = newSafetyFactor;
            console.log('tiny safety factor', safetyFactor);
            console.log('seconds', seconds);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            drawTree(robots);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
    }
    console.log('ANS 2:', seconds);
}
function drawTree(robots) {
    let grid = [];
    for (let r = 0; r < MAXROW; r++) {
        let row = [];
        for (let c = 0; c < MAXCOL; c++) {
            row.push('.');
        }
        grid.push(row);
    }
    for (let robot of robots) {
        let { row, col } = robot.position;
        grid[col][row] = 'X';
    }
    for (let line of grid) {
        console.log(line.join(''));
    }
}
answer2();
