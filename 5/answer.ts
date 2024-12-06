import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
// the number, and all the other numbers that have to come before it
let rules = new Map<number, Set<number>>();

// list of updates, where update is an array of the numbers
let updates: number[][] = [];


const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');

// calculate UPDATES and RULES
for (let line of lines) {
    if (line.includes('|')) {
        let nums = line.split('|').map((n) => Number(n));
        if (rules.get(nums[1])) {
            rules.get(nums[1])!.add(nums[0]);

        } else {
            let newSet = new Set<number>();
            rules.set(nums[1], newSet.add(nums[0]));
        }
    } else {
        let nums = line.split(',').map((n) => Number(n));
        updates.push(nums)
    }
}

// make RULES more robust
// for (let [num,befores] of rules) {
//     let mergedBefores = new Set<number>();
//     for (let b of befores.values()) {
//         mergedBefores.add(b);
//         let evenMoreBefores = rules.get(b);
//         if (evenMoreBefores) {
//             evenMoreBefores.forEach((b1) => mergedBefores.add(b1));
//         }
//     }
//     rules.set(num, mergedBefores);
// }


let middles = [];
let invalidUpdates = [];

for (let update of updates) {
    let invalid = false;
    // for each number, check that the rest of the numbers after it don't contain any befores.
    for (let i = 0; i < update.length; i++) {
        let num = update[i];
        let befores = rules.get(num) ?? new Set<number>();
        let rest = update.slice(i+1);
        for (let before of befores.values()) {
            if (rest.indexOf(before) > -1) {
                // this update is invalid, skip it
                invalid = true;
            }
        }
    }
    if (invalid) {
        // FOR PART 2
        invalidUpdates.push(update);
    } else {
        let index = Math.floor(update.length / 2);
        middles.push(update[index]);
    }
}
let answer1 = middles.reduce((n,sum) => sum+n);

console.log('PART 1:',answer1);



/* -------------------------------------PART 2------------------------------------- */
function sortFn(n1:number,n2:number): number {
    let n1befores = rules.get(n1) ?? new Set<number>();
    if (n1befores.has(n2)) {
        return 1; 
    }
    let n2befores = rules.get(n2) ?? new Set<number>();
    if (n2befores.has(n1)) {
        return -1; 
    }
    return 0;
}

let middles2 = [];
for (let update of invalidUpdates) {
    update.sort((n1,n2)=>sortFn(n1,n2));
    let index = Math.floor(update.length / 2);
    middles2.push(update[index]);
}

let answer2 = middles2.reduce((n,sum) => sum+n);

console.log('PART 2:',answer2);


