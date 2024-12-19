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
function init1(file) {
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
function getNextDirections(nodes, current, visited) {
    let dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let nextNodesAndDir = new Map();
    for (let d of dirs) {
        let newD = { r: current.r + d[0], c: current.c + d[1] };
        let token = `${newD.r},${newD.c}`;
        let newNode = nodes.get(token);
        // console.log('nextDir:',token,'value:',maze[newD.r][newD.c]);
        if (nodes.has(token)) {
            nextNodesAndDir.set(token, d);
        }
    }
    // console.log('validDirs:',validDirs);
    return nextNodesAndDir;
}
function getAllNodes(maze) {
    let nodes = new Map();
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        for (let j = 0; j < row.length; j++) {
            let sq = row[j];
            if (sq == '.' || sq == 'E' || sq == 'S') {
                let nodeToken = `${i},${j}`;
                nodes.set(nodeToken, { r: i, c: j, v: sq });
            }
        }
    }
    return nodes;
}
function answer1() {
    let { maze, start, end } = init1('./input.txt');
    let nodes = getAllNodes(maze);
    // console.log('-------------');
    // for (let [t,n] of nodes) {
    //   console.log(`${t}, node: ${JSON.stringify(n)}`);
    // }
    // console.log('-------------');
    let visited = new Set();
    visited.add(`${start.r},${start.c}`);
    dijkstra(nodes, start, end);
    // console.log('ANS1:',minScore);
}
function dijkstra(graph, start, end) {
    let q = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    // store the shortest distance from start to each node
    // map of r,c token to DirectedNode
    let directedDistances = new Map();
    for (let [t, n] of graph) {
        [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach((dir) => {
            let token = `${n.r},${n.c},${dir}`;
            directedDistances.set(token, {
                n: n,
                dir: dir,
                dist: Number.MAX_VALUE,
            });
        });
    }
    let startNode = { r: start.r, c: start.c, v: 'S' };
    let directedStart = { n: startNode, dir: [0, 1], dist: 0 };
    let token = `${start.r},${start.c},${directedStart.dir}`;
    directedDistances.set(token, directedStart);
    let visited = new Set();
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
        if (closestNode === null || closestDir === null)
            break;
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
                let token = `${neighbor.r},${neighbor.c},${neighborDir}`;
                let directedNeighbor = directedDistances.get(token);
                directedNeighbor.dist = Math.min(directedNeighbor?.dist, distance);
                directedDistances.set(token, directedNeighbor);
            }
            else {
                // going straight
                let distance = shortestDistance + 1;
                // console.log('going straight! dist:', distance);
                // Update if we found a shorter path
                let token = `${neighbor.r},${neighbor.c},${neighborDir}`;
                let directedNeighbor = directedDistances.get(token);
                directedNeighbor.dist = Math.min(directedNeighbor?.dist, distance);
                directedDistances.set(token, directedNeighbor);
            }
        }
    }
    let endNode = { r: end.r, c: end.c, v: 'E' };
    for (let [k, dn] of directedDistances) {
        if (dn.n.v === 'E') {
            console.log('ans:', dn.dist);
        }
    }
}
function printMaze(maze) {
    for (let r of maze) {
        console.log(r.join(''));
    }
    console.log('---------------------------------------');
}
answer1();
