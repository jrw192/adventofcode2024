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
function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('mul');
    return lines;
}
/* -------------------------------------PART 1------------------------------------- */
function getValidInstOrNull(testStr) {
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
    let filteredLines = [];
    for (let m of matches) {
        console.log(m[0]);
        if (!m[0].startsWith(`don't`)) {
            filteredLines.push(m[0]);
        }
    }
    return filteredLines;
}
function getProduct(lines) {
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
