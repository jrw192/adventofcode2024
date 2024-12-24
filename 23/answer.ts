import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    let connections: string[][] = [];
    for (let line of lines) {
        connections.push(line.trim().split('-'));
    }
    return connections;
}

function buildConnectionMap(connections: string[][]) {
    let cMap = new Map<string, Set<string>>;
    for (let connection of connections) {
        let [c1, c2] = connection;

        let c1Set = cMap.get(c1) ?? new Set<string>();
        cMap.set(c1, c1Set.add(c2));
        let c2Set = cMap.get(c2) ?? new Set<string>();
        cMap.set(c2, c2Set.add(c1));
    }

    return cMap;
}

function findAllSets(cMap: Map<string, Set<string>>) {
    // let sets: string[][] = [];
    let tokens = new Set<string>();

    for (let [c1, c1Connections] of cMap) {
        if (c1Connections.size >= 2) {
            for (let c2 of c1Connections) {

                if (c2 !== c1) {
                    let c2Connections = cMap.get(c2)!;
                    for (let c3 of c2Connections) {

                        if (c3 !== c2 && c3 !== c1) {
                            let c3Connections = cMap.get(c3)!;
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
// cliques: stores the maximal clique
function bronKerbosch(cMap: Map<string, Set<string>>, R: Set<string>, P: Set<string>, cliques: Set<string[]>) {
    // if P empty then report R as a maximal clique
    // no more computers to process
    if (P.size == 0) {
        cliques.add(Array.from(R));
        return cliques;
    }

    // for each vertex v in P do
    for (let v of P) {
        // BronKerbosch2(R ⋃ {v}, P ⋂ N(v), X ⋂ N(v))

        // newR = R ⋃ {v}
        let newR = R.union(new Set([v]));
        
        let newNeighbors = cMap.get(v) ?? new Set<string>();

        // newP = P ⋂ N(v)
        let newP = P.intersection(newNeighbors);


        bronKerbosch(cMap, newR, newP, cliques);

        // P := P \ {v}
        P.delete(v);
    }

    return cliques;

}

function buildConnectionMapInSet(connections: string[][], set: Set<string>) {
    let cMap = new Map<string, Set<string>>;
    for (let connection of connections) {
        let [c1, c2] = connection;
        if (set.has(c1) && set.has(c2)) {
            let c1Set = cMap.get(c1) ?? new Set<string>();
            cMap.set(c1, c1Set.add(c2));
            let c2Set = cMap.get(c2) ?? new Set<string>();
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
    let P = new Set<string>();
    for (let c of cMap.keys()) {
        P.add(c);
    }
    // console.log(P);
    // connections, R, P, X, cliques
    let cliques = bronKerbosch(cMap, new Set<string>(), P, new Set<string[]>());
    let maximalClique = null;
    let maxSize = -1;
    Array.from(cliques).map(c => {
        if (c.length > maxSize) {
            maximalClique = c;
            maxSize = c.length;
        }
    })
    let ans = maximalClique!.sort().join(',');
    console.log('ANS:',ans);
}

answer2();