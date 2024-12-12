import * as fs from 'fs';

function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('mul');

    return lines;
}

/* -------------------------------------PART 1------------------------------------- */
function getValidInstOrNull(testStr: string): number | null {
    const TEST_REGEX = /^[(]\d*[,]\d*[)]/;
    let match = testStr.match(TEST_REGEX);
    if (match) {
        let numMatches = match[0].matchAll(/\d+/g);
        let product = 1;
        for (let m of numMatches) {
            product *= Number(m[0]);
        }
        console.log('product', product);
        return product;
    }
    return null;
}

function totalProduct1() {
    let lines = init1();
    let sum = 0;
    for (let line of lines) {
        sum += getValidInstOrNull(line) ?? 0;
    }
    console.log('ANSWER1:', sum);

}

// totalProduct1();


/* -------------------------------------PART 2------------------------------------- */
function init2() {
    const REGEX = /((do\(\))|(don't\(\))|^).*?(?=(do\(\))|(don't\(\))|$)/g;
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    let joined = '';
    for (let line of lines) {
        joined += line.trim();
    }
    const matches = joined.matchAll(REGEX);
    let filteredLines: string[] = [];
    for (let m of matches) {
        console.log(m[0]);
        if (!m[0].startsWith(`don't`)) {
            filteredLines.push(m[0]);
        }
    }


    return filteredLines;
}

function getProduct(lines: string[]) {
    const MUL_REGEX = /mul\(\d*,\d*\)/g;
    let total = 0;
    for (let line of lines) {
        let mulMatches = line.matchAll(MUL_REGEX);
        for (let mulMatch of mulMatches) {
            // console.log('mulMatch:',mulMatch[0]);
            let product = 1;
            let numMatches = mulMatch[0].matchAll(/\d+/g);
            for (let m of numMatches) {
                // console.log('numMatch:', m[0]);
                product *= Number(m[0]);
            }
            // console.log('product:',product);
            total += product;
        }
    }
    return total;
}


function answer2() {
    let lines = init2();
    let ans = getProduct(lines);
    console.log('ANS2:', ans);
}

answer2();