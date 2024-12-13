import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string): string[][] {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    let grid: string[][] = [];
    for (let line of lines) {
        grid.push(line.split(''));
    }
    return grid;
}
const DIRECTIONS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

function findWords(grid: string[][], starts: number[][]) {

}

function canBeWord(grid: string[][], start: number[], currentStr: string): boolean {
    switch (currentStr) {
        case 'X':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0]+dir[0], start[1]+dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'M') {
                    if (canBeWord(grid, newStart, 'XM')) {
                        return true;
                    };
                }
            }
        case 'XM':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0]+dir[0], start[1]+dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'A') {
                    if (canBeWord(grid, newStart, 'XMA')) {
                        return true;
                    };
                }
            }
        case 'XMA':
            for (let dir of DIRECTIONS) {
                let newStart = [start[0]+dir[0], start[1]+dir[1]];
                if (grid[newStart[0]][newStart[1]] == 'S') {
                    if (canBeWord(grid, newStart, 'XMAS')) {
                        return true;
                    };
                }
            }
        case 'XMAS':
            return true;
        default:
            return false;
    }
}

function findAllStarts(grid: string[][]): number[][] {
    // returns the coordinates of all X's
    let coords: number[][] = [];
    for (let r=0; r < grid.length; r++) {
        for (let c=0; c<grid[0].length; c++) {
            if (grid[r][c] == 'X') {
                coords.push([r,c]);
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