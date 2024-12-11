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
function formatInput() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const data = input.split('');
    let formatted = [];
    let openSpaces = [];
    let id = 0;
    for (let i = 0; i < data.length; i++) {
        let num = Number(data[i]);
        if (i % 2 == 1) {
            // free space indicator
            for (let n = 0; n < num; n++) {
                formatted.push('.');
                openSpaces.push(formatted.length - 1);
            }
        }
        else {
            // data block indicator
            for (let n = 0; n < num; n++) {
                formatted.push(id.toString());
            }
            id += 1;
        }
    }
    // console.log(formatted.join(''));
    // console.log(openSpaces);
    return { formatted, openSpaces };
}
// 12345 --> 0..111....22222
function squish(data, openSpaces) {
    let output = JSON.parse(JSON.stringify(data));
    let index = data.length - 1;
    for (let space of openSpaces) {
        if (space >= index) {
            break;
        }
        while (data[index] == '.') {
            index -= 1;
        }
        output[space] = data[index];
        output[index] = '.';
        index--;
    }
    // console.log('output');
    // console.log(output);
    return output;
}
function getCheckSum(data) {
    let total = 0;
    data.map((id, i) => {
        if (id !== '.') {
            total += Number(id) * i;
        }
    });
    return total;
}
function answer1() {
    let { formatted, openSpaces } = formatInput();
    let output = squish(formatted, openSpaces);
    let checkSum = getCheckSum(output);
    console.log('ANSWER1', checkSum);
}
answer1();
/* -------------------------------------PART 2------------------------------------- */
function formatInput2() {
    const input = fs.readFileSync('./test.txt', 'utf8');
    const data = input.split('');
    let formatted = [];
    let openSpaces = new Map();
    let id = 0;
    for (let i = 0; i < data.length; i++) {
        let num = Number(data[i]);
        if (i % 2 == 1) {
            let start = formatted.length;
            // free space indicator
            for (let n = 0; n < num; n++) {
                formatted.push('.');
            }
            openSpaces.set(start, num);
        }
        else {
            // data block indicator
            for (let n = 0; n < num; n++) {
                formatted.push(id.toString());
            }
            id += 1;
        }
    }
    // console.log(formatted.join(''));
    // console.log(openSpaces);
    return { formatted, openSpaces };
}
function squish2(data, openSpaces) {
    console.log('before:', data.join(''));
    let output = JSON.parse(JSON.stringify(data));
    let index = data.length - 1;
    for (let [space, size] of openSpaces) {
        console.log('space:', space, 'size:', size);
        let { block, indexes } = buildBlockOfMaxSize(output.slice(0, index + 1), size);
        console.log('block', block);
        index -= 1;
    }
    console.log(output.join(''));
    return output;
}
function buildBlockOfMaxSize(data, maxSize) {
    let block = [];
    let indexes = [];
    let index = data.length - 1;
    let upperLimit = data.length - 1;
    while (index >= 0) {
        while (data[index] == '.') {
            index -= 1;
        }
        const currentIndexList = data.map((n, i) => {
            if (n === data[index] && i < upperLimit) {
                return i;
            }
        }).filter((i) => i !== undefined);
        // if adding this block doesn't make the size too big, then add it
        if (currentIndexList.length + indexes.length <= maxSize) {
            indexes.push(...currentIndexList);
            for (let i = 0; i < currentIndexList.length; i++) {
                block.push(data[index]);
            }
        }
        upperLimit = index;
        index -= 1;
    }
    return { block, indexes };
}
// function getBlockAndStartIndex(data: string[]): { block: string[], startIndex: number } {
//     let i = data.length - 1;
//     while (data[i] == '.') {
//         i -= 1;
//     }
//     let block = [data[i]];
//     // console.log('data[i]',data[i],'block[0]',block[0]);
//     i -= 1;
//     while (data[i] == block[0]) {
//         // console.log('data[i]',data[i],'block[0]',block[0]);
//         block.push(data[i]);
//         i -= 1;
//     }
//     return { block, startIndex: i + 1 };
// }
function answer2() {
    let { formatted, openSpaces } = formatInput2();
    let output = squish2(formatted, openSpaces);
    let checkSum = getCheckSum(output);
    console.log('ANSWER2', checkSum);
}
answer2();
