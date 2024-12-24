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
    let connections = [];
    for (let line of lines) {
        connections.push(line.trim().split('-'));
    }
    return connections;
}
function buildConnectionMap(connections) {
    let cMap = new Map;
    for (let connection of connections) {
        let [c1, c2] = connection;
        let c1Set = cMap.get(c1) ?? new Set();
        cMap.set(c1, c1Set.add(c2));
        let c2Set = cMap.get(c2) ?? new Set();
        cMap.set(c2, c2Set.add(c1));
    }
    return cMap;
}
function findAllSets(cMap) {
    // let sets: string[][] = [];
    let tokens = new Set();
    for (let [c1, c1Connections] of cMap) {
        if (c1Connections.size >= 2) {
            for (let c2 of c1Connections) {
                if (c2 !== c1) {
                    let c2Connections = cMap.get(c2);
                    for (let c3 of c2Connections) {
                        if (c3 !== c2 && c3 !== c1) {
                            let c3Connections = cMap.get(c3);
                            if (c1Connections.has(c3)) {
                                let cArr = [c1, c2, c3].sort();
                                let token = `${cArr}`;
                                if (!tokens.has(token)) {
                                    // sets.push([c1,c2,c3]);
                                    tokens.add(token);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return tokens;
}
function answer1() {
    let connections = init1('./input.txt');
    let cMap = buildConnectionMap(connections);
    console.log(cMap);
    let sets = findAllSets(cMap);
    let count = 0;
    for (let set of sets) {
        if (set.startsWith('t') || set.includes(',t')) {
            count += 1;
        }
    }
    console.log('ANS1', count);
}
// answer1();
/* -------------------------------------PART 2------------------------------------- */
// R: set of computers/nodes in the current clique
// P: set of computers/nodes that can be added to R (by default, all computers)
// X: set of computers/nodes that has been processed
// cliques: stores the maximal clique
function bronKerbosch(cMap, R, P, cliques) {
    // console.log('--------------------------bronKerbosch--------------------------');
    // console.log('R:', R);
    // console.log('P:', P);
    // console.log('X:',X);
    // if P and X are both empty then report R as a maximal clique
    // no more computers to process
    if (P.size == 0) {
        cliques.add(Array.from(R));
        return cliques;
    }
    // for each vertex v in P do
    for (let v of P) {
        // console.log('v:',v);
        // BronKerbosch2(R ⋃ {v}, P ⋂ N(v), X ⋂ N(v))
        // newR = R ⋃ {v}
        let newR = R.union(new Set([v]));
        let newNeighbors = cMap.get(v) ?? new Set();
        // console.log('newNeighbors',newNeighbors);
        // newP = P ⋂ N(v)
        let newP = P.intersection(newNeighbors);
        bronKerbosch(cMap, newR, newP, cliques);
        // P := P \ {v}
        // X := X ⋃ {v}
        P.delete(v);
    }
    return cliques;
}
function buildConnectionMapInSet(connections, set) {
    let cMap = new Map;
    for (let connection of connections) {
        let [c1, c2] = connection;
        if (set.has(c1) && set.has(c2)) {
            let c1Set = cMap.get(c1) ?? new Set();
            cMap.set(c1, c1Set.add(c2));
            let c2Set = cMap.get(c2) ?? new Set();
            cMap.set(c2, c2Set.add(c1));
        }
    }
    return cMap;
}
function answer2() {
    let connections = init1('./input.txt');
    let cMap = buildConnectionMap(connections);
    // console.log(cMap);
    // console.log('-------------');
    let P = new Set();
    for (let c of cMap.keys()) {
        P.add(c);
    }
    // console.log(P);
    // connections, R, P, X, cliques
    let cliques = bronKerbosch(cMap, new Set(), P, new Set());
    let maximalClique = null;
    let maxSize = -1;
    Array.from(cliques).map(c => {
        if (c.length > maxSize) {
            maximalClique = c;
            maxSize = c.length;
        }
    });
    let ans = maximalClique.sort().join(',');
    console.log('ANS:', ans);
}
answer2();
