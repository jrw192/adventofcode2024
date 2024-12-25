import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(filename: string) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    let isKey = false;
    const keys: number[][] = [];
    const locks: number[][] = [];
    let current: number[] = [0,0,0,0,0];
    for (let line of lines) {
        line = line.trim();
        if (line == '') {
            // first shave off extra height
            current = current.map((c) => c-1);
            // start new
            if (isKey) {
                keys.push(current);
            } else {
                locks.push(current);
            }
            current = [0,0,0,0,0];
        } else {
            if (line == '#####') {
                // starting a lock
                isKey = false;
            } else if (line == '.....') {
                // starting a key
                isKey = true;
            }
            for (let i = 0; i < 5; i++) {
                let c = line.charAt(i);
                if (c == '#') {
                    current[i] += 1;
                }
            }
        }
    }
    current = current.map((c) => c-1);
    if (isKey) {
        keys.push(current);
    } else {
        locks.push(current);
    }

    return {keys, locks};
}

function isValidLockKeyPair(lock: number[], key: number[], maxHeight: number) {
    for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] > maxHeight) {
            return false;
        }
    }
    return true;
}

function getValidPairs(locks: number[][], keys: number[][]) {
    let pairs = 0;
    for (let lock of locks) {
        for (let key of keys) {
            if (isValidLockKeyPair(lock, key, 5)) {
                pairs += 1;
            }
        }
    }
    return pairs;
}

function answer1() {
    let {keys, locks } = init1('./input.txt');
    console.log(keys);
    console.log(locks);
    let pairs = getValidPairs(locks,keys);
    console.log(pairs);
}
answer1();