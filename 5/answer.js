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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
/* -------------------------------------PART 1------------------------------------- */
// the number, and all the other numbers that have to come before it
let rules = new Map();
// list of updates, where update is an array of the numbers
let updates = [];
const input = fs.readFileSync('./input.txt', 'utf8');
const lines = input.split('\n');
// calculate UPDATES and RULES
for (let line of lines) {
    if (line.includes('|')) {
        let nums = line.split('|').map((n) => Number(n));
        if (rules.get(nums[1])) {
            rules.get(nums[1]).add(nums[0]);
        }
        else {
            let newSet = new Set();
            rules.set(nums[1], newSet.add(nums[0]));
        }
    }
    else {
        let nums = line.split(',').map((n) => Number(n));
        updates.push(nums);
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
        let befores = (_a = rules.get(num)) !== null && _a !== void 0 ? _a : new Set();
        let rest = update.slice(i + 1);
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
    }
    else {
        let index = Math.floor(update.length / 2);
        middles.push(update[index]);
    }
}
let answer1 = middles.reduce((n, sum) => sum + n);
console.log('PART 1:', answer1);
/* -------------------------------------PART 2------------------------------------- */
function sortFn(n1, n2) {
    var _a, _b;
    let n1befores = (_a = rules.get(n1)) !== null && _a !== void 0 ? _a : new Set();
    if (n1befores.has(n2)) {
        return 1;
    }
    let n2befores = (_b = rules.get(n2)) !== null && _b !== void 0 ? _b : new Set();
    if (n2befores.has(n1)) {
        return -1;
    }
    return 0;
}
let middles2 = [];
for (let update of invalidUpdates) {
    update.sort((n1, n2) => sortFn(n1, n2));
    let index = Math.floor(update.length / 2);
    middles2.push(update[index]);
}
let answer2 = middles2.reduce((n, sum) => sum + n);
console.log('PART 2:', answer2);
