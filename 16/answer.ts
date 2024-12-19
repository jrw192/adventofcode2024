import * as fs from 'fs';

function init1(file: string) {
    let maze = [];
    let start = { r: 0, c: 0, d: `0,1` };
    let end = { r: 0, c: 0, d: `` };
    const input = fs.readFileSync(file, 'utf8');
    let lines = input.split('\n');
    for (let line of lines) {
        // console.log('line',line);
        maze.push(line.split(''));
        if (line.includes('S')) {
            start = { r: lines.indexOf(line), c: line.indexOf('S'), d: `0,1` };
        }
        if (line.includes('E')) {
            end = { r: lines.indexOf(line), c: line.indexOf('E'), d: `0,1` };
        }
    }

    return { maze, start, end };
}




/* -------------------------------------PART 1------------------------------------- */

interface Node {
    r: number;
    c: number;
    v: string;
}

interface DirectedNode {
    n: Node;
    dir: number[]; // direction of approach
    dist: number;
}

function getNextDirections(nodes: Map<string, Node>, current: Node, visited: Set<string>) {
    let dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let nextNodesAndDir = new Map<string, number[]>();
    for (let d of dirs) {
        let newD = { r: current.r + d[0], c: current.c + d[1] };
        let token = `${newD.r},${newD.c}`;
        let newNode = nodes.get(token)!;

        // console.log('nextDir:',token,'value:',maze[newD.r][newD.c]);
        if (nodes.has(token)) {
            nextNodesAndDir.set(token, d);
        }
    }
    // console.log('validDirs:',validDirs);
    return nextNodesAndDir;
}

function getAllNodes(maze: string[][]) {
    let nodes = new Map<string, Node>();
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            let sq = row[j];
            if (sq == '.' || sq == 'E' || sq == 'S') {
                let nodeToken = `${i},${j}`;
                nodes.set(nodeToken, { r: i, c: j, v: sq } as Node);
            }
        }
    }

    return nodes;
}

function answer1() {
    let { maze, start, end } = init1('./test.txt');
    let nodes = getAllNodes(maze);

    // console.log('-------------');
    // for (let [t,n] of nodes) {
    //   console.log(`${t}, node: ${JSON.stringify(n)}`);
    // }
    // console.log('-------------');

    let visited = new Set<string>();
    visited.add(`${start.r},${start.c}`);
    dijkstra(nodes, start, end);
    // console.log('ANS1:',minScore);
}

function sortDistances(dists: Map<string, DirectedNode>) {
    
}

function dijkstra(graph: Map<string, Node>, start: { r: number, c: number }, end: { r: number, c: number }) {
    let q: DirectedNode[] = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    // store the shortest distance from start to each node
    // map of r,c token to DirectedNode
    let directedDistances = new Map<string, DirectedNode>();
    for (let [t, n] of graph) {
        [[0,1], [0,-1], [1,0], [-1,0]].forEach((dir) => {
            let token = `${n.r},${n.c},${dir}`;
            directedDistances.set(token, {
              n: n,
              dir: dir,
              dist: Number.MAX_VALUE,
            });
          });
    }

    let startNode = { r: start.r, c: start.c, v: 'S' } as Node;
    let directedStart = { n: startNode, dir: [0, 1], dist: 0 } as DirectedNode;
    let token = `${start.r},${start.c},${directedStart.dir}`;
    directedDistances.set(token, directedStart);

    let visited = new Set<string>();

    while (true) {
        // Find the unvisited node with the smallest distance
        let closestNode = null;
        let closestDir = null;
        let shortestDistance = Number.MAX_VALUE;

        for (let [token, dirNode] of directedDistances) {
            let { n, dir, dist } = dirNode;
            let nodeToken = `${n.r},${n.c},${dir}`;
            if (!visited.has(nodeToken) && dist < shortestDistance) {
                closestDir = dirNode.dir;
                closestNode = n;
                shortestDistance = dist;
            }
        }

        // If no unvisited nodes left, we're done
        if (closestNode === null || closestDir === null) break;

        // // Mark the closest node as visited
        let closestNodeToken = `${closestNode.r},${closestNode.c},${closestDir}`;
        visited.add(closestNodeToken);

        // Check all neighbors of the current node
        let neighbors = getNextDirections(graph, closestNode, visited);
        // console.log('neighbors');
        // for (let [t, d] of neighbors) {
        //   console.log(t);
        // }
        for (let [neighborToken, neighborDir] of neighbors) {
            // Calculate distance to neighbor through current node
            // console.log('neighborToken', neighborToken)
            let neighbor = graph.get(neighborToken);
            // console.log('neighbor', neighbor, 'dir:', neighborDir);

            if (neighborDir[0] !== closestDir[0] || neighborDir[1] !== closestDir[1]) {
                // turning
                let distance = shortestDistance + 1001;
                // console.log('turning! dist:', distance);

                // Update if we found a shorter path
                let token = `${neighbor!.r},${neighbor!.c},${neighborDir}`;
                let directedNeighbor = directedDistances.get(token)!;
                directedNeighbor.dist = Math.min(directedNeighbor?.dist, distance)
                directedDistances.set(token, directedNeighbor);

            } else {
                // going straight
                let distance = shortestDistance + 1;
                // console.log('going straight! dist:', distance);

                // Update if we found a shorter path
                let token = `${neighbor!.r},${neighbor!.c},${neighborDir}`;
                let directedNeighbor = directedDistances.get(token)!;
                directedNeighbor.dist = Math.min(directedNeighbor?.dist, distance)
                directedDistances.set(token, directedNeighbor);

            }
        }
    }
    let endNode = { r: end.r, c: end.c, v: 'E' } as Node;
    for (let [k, dn] of directedDistances) {
        if (dn.n.v === 'E') {
            console.log('ans:', dn.dist);
        }
    }
}

function printMaze(maze: string[][]) {
    for (let r of maze) {
        console.log(r.join(''));
    }
    console.log('---------------------------------------');
}

answer1();