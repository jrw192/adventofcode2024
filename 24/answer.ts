import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    const inits: string[][] = [];
    const ops: string[][] = [];
    for (let line of lines) {
        line = line.replace(':', '').replace(' ->', '').replace('\r', '');
        let split = line.split(' ');
        if (split.length == 2) {
            inits.push(split);
        }
        else if (split.length == 4) {
            ops.push(split);
        }
    }

    return { inits, ops };
}

function processData(inits: string[][], ops: string[][]) {
    let wireValues = new Map<string, number>();
    for (let [w, v] of inits) {
        wireValues.set(w, Number(v));
    }
    let processed = new Set<string>();

    while (processed.size < ops.length) {
        for (let func of ops) {
            let token = `${func}`;
            if (!processed.has(token)) {
                // console.log('func:',func);
                let w1 = func[0];
                let op = func[1];
                let w2 = func[2];
                let targ = func[3];

                if (wireValues.has(w1) && wireValues.has(w2)) {
                    let value = -1;
                    switch (op) {
                        case 'AND':
                            value = wireValues.get(w1)! && wireValues.get(w2)!;
                            break;
                        case 'OR':
                            value = wireValues.get(w1)! || wireValues.get(w2)!;
                            break;
                        case 'XOR':
                            value = wireValues.get(w1)! !== wireValues.get(w2)! ? 1 : 0;
                            break;
                        default:
                            break;
                    }
                    wireValues.set(targ, value);
                    processed.add(token);
                }
            }
        }
    }
    return wireValues;
}

function getZValue(inits: string[][], ops: string[][]) {
    let wires = processData(inits, ops);

    let sortedWires = new Map([...wires.entries()].sort());
    console.log(sortedWires);
    let output = '';
    for (let [k, v] of sortedWires) {
        if (k.startsWith('z')) {
            output = String(v) + output;
        }
    }
    return output;

}
function answer1() {
    let { inits, ops } = init1('./input.txt');
    console.log('inits', inits);
    console.log('ops', ops);
    let wires = processData(inits, ops);

    let sortedWires = new Map([...wires.entries()].sort());
    console.log(sortedWires);
    let output = getZValue(inits, ops);
    console.log(output);
    console.log(parseInt(output, 2));
}
// answer1();

/* -------------------------------------PART 2------------------------------------- */

function getSusGates(ops: string[][]) {
    let sus = new Set<string[]>();
    /* If the output of a gate is z, then the operation has to be XOR
        unless it is the last bit.
       If the output of a gate is not z and the inputs are not x, y
       then it has to be AND / OR, but not XOR.
    */
    let highestZ = 'z01';
    for (let op of ops) {
        let output = op[3];
        if (output.startsWith('z')) {
            if (Number(output.slice(1)) > Number(highestZ.slice(1))) {
                highestZ = output;
            }
        }
    }
    console.log('highestZ', highestZ);
    for (let op of ops) {
        let input1 = op[0];
        let operand = op[1];
        let input2 = op[2];
        let output = op[3];
        /* If the output of a gate is z, then the operation has to be XOR
            unless it is the last bit.*/
        if (output.startsWith('z')) {
            if (operand !== 'XOR' && highestZ !== output) {
                sus.add(op);
            }
        }
        /* If the output of a gate is not z and the inputs are not x, y
            then it has to be AND / OR, but not XOR.*/
        else if (!input1.startsWith('x') && !input1.startsWith('y')
            && !input2.startsWith('x') && !input2.startsWith('y')) {
            if (operand == 'XOR') {
                sus.add(op);
            }
        }
        else if (!(['x00', 'y00'].includes(input1) || ['x00', 'y00'].includes(input2))) {
            /* If you have a XOR gate with inputs x, y, there must be another XOR gate
                with this gate as an input. Search through all gates for an XOR-gate with
                this gate as an input; if it does not exist, your (original) XOR gate is faulty.*/
            if (operand == 'XOR' && (['x', 'y'].includes(input1.charAt(0)) || ['x', 'y'].includes(input2.charAt(0)))) {
                let found = false;
                for (let opa of ops) {
                    let input1a = opa[0];
                    let operanda = opa[1];
                    let input2a = opa[2];

                    if (operanda == 'XOR' && (input1a == output || input2a == output)) {
                        found = true;
                        continue;
                    }
                }
                if (!found) {
                    sus.add(op);
                }
            }
            /* Similarly, if you have an AND-gate, there must be an OR-gate with this gate as an input.
                If that gate doesn't exist, the original AND gate is faulty.*/
            else if (operand == 'AND') {
                let found = false;
                for (let opa of ops) {
                    let input1a = opa[0];
                    let operanda = opa[1];
                    let input2a = opa[2];

                    if (operanda == 'OR' && (input1a == output || input2a == output)) {
                        found = true;
                        continue;
                    }
                }
                if (!found) {
                    sus.add(op);
                }
            }
        }
    }
    console.log(sus);
    return sus;
}

function expectedZValues(ops: string[][], inits: string[][]) {
    // get X
    let X = '';
    for (let [k, v] of inits) {
        if (k.startsWith('x')) {
            X = String(v) + X;
        }
    }
    let xParsed = parseInt(X, 2);

    // get Y
    let Y = '';
    for (let [k, v] of inits) {
        if (k.startsWith('y')) {
            Y = String(v) + Y;
        }
    }
    let yParsed = parseInt(Y, 2);

    // calculate expected Z
    let zParsed = xParsed + yParsed;
    let Z = zParsed.toString(2);

    return Z;
}


function answer2() {
    let { inits, ops } = init1('./input.txt');
    // console.log('inits', inits);
    // console.log('ops', ops);
    let susGates = getSusGates(ops);
    let outputs = Array.from(susGates).map((s) => s[3]);
    console.log(outputs.sort().join(','));
}
answer2();