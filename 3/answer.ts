import * as fs from 'fs';

function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('mul');
    
    return lines;
}

/* -------------------------------------PART 1------------------------------------- */
function getValidInstOrNull(testStr: string): number|null {
    const TEST_REGEX = /^[(]\d*[,]\d*[)]/;
    let match = testStr.match(TEST_REGEX);
    if (match) {
        let numMatches = match[0].matchAll(/\d+/g);
        let product = 1;
        for (let m of numMatches) {
            product *= Number(m[0]);
        }
        console.log('product',product);
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
    console.log('ANSWER1:',sum);
    
}

totalProduct1();


/* -------------------------------------PART 2------------------------------------- */
function init2() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split(`don't()`);
    
    
    return lines;
}

