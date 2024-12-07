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
function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const lists = [[], []];
    for (let line of lines) {
        let [a, b] = line.split('   ');
        lists[0].push(Number(a));
        lists[1].push(Number(b));
    }
    lists[0].sort();
    lists[1].sort();
    return lists;
}
function getTotalDistance(list1, list2) {
    let total = 0;
    list1.map((n, i) => {
        total += Math.abs(n - list2[i]);
    });
    return total;
}
let lists1 = init1();
let ans1 = getTotalDistance(lists1[0], lists1[1]);
console.log('ANSWER1:', ans1);
/* -------------------------------------PART 2------------------------------------- */
function init2() {
    var _a;
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const list = [];
    // number : frequency
    const map = new Map();
    for (let line of lines) {
        let [a, b] = line.split('   ').map((n) => Number(n));
        list.push(a);
        let old = (_a = map.get(b)) !== null && _a !== void 0 ? _a : 0;
        map.set(b, old + 1);
    }
    return { list, map };
}
function getSimilarityScore(list, map) {
    var _a;
    let score = 0;
    for (let num of list) {
        score += (num * ((_a = map.get(num)) !== null && _a !== void 0 ? _a : 0));
    }
    return score;
}
let { list, map } = init2();
let ans2 = getSimilarityScore(list, map);
console.log('ANSWER2:', ans2);
