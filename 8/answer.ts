import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(): any[] {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const map: string[][] = [];
    for (let line of lines) {
        map.push(line.replace('\r', '').split(''));
    }
    return [map, lines.length, lines[0].length];
}

function buildCoordsFromMap(antennaMap: string[][]): Map<string, { r: number, c: number }[]> {
    let coordMap = new Map<string, { r: number, c: number }[]>();
    let tokenMap = new Map<string, string[]>();
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

function getAntinodes(map: string[][], coordMap: Map<string, { r: number, c: number }[]>, rows: number, cols: number) {
    let antinodeCoords = new Set<string>();
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

function inBounds(coords: { r: number, c: number }, rows: number, cols: number): boolean {
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

function getAntinodes2(map: string[][], coordMap: Map<string, { r: number, c: number }[]>, rows: number, cols: number): number {
    let antinodeCoords = new Set<string>();
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
    console.log('ans2',ans2);
}

answer2();