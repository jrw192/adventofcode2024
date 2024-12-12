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
    let id = 0;
    for (let i = 0; i < data.length; i++) {
        let num = Number(data[i]);
        if (i % 2 == 1) {
            let start = formatted.length;
            // free space indicator
            for (let n = 0; n < num; n++) {
                formatted.push('.');
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
    return formatted;
}
function getFreeSpaces(data) {
    // key: start index, value: num spaces
    let spaces = new Map();
    let startIndex = 0;
    let numSpaces = 0;
    for (let i = 0; i < data.length; i++) {
        let c = data[i];
        if (c !== '.') {
            if (numSpaces > 0) {
                startIndex = i - numSpaces;
                spaces.set(startIndex, numSpaces);
            }
            numSpaces = 0;
        }
        else if (c == '.') {
            numSpaces += 1;
        }
    }
    return spaces;
}
function squish2(data) {
    console.log('before:', data.join(''));
    let output = JSON.parse(JSON.stringify(data));
    let index = data.length - 1;
    let openSpaces = getFreeSpaces(output);
    while (index >= 0) {
        // console.log('space:', space, 'size:', size);
        let openSpace = Math.min(...Array.from(openSpaces.keys()));
        let openSize = openSpaces.get(openSpace) ?? 0;
        console.log('starting index:', index);
        let block = getNextBlock(output.slice(0, index + 1));
        let filteredBlock = block.filter((c) => c !== '.');
        while ((filteredBlock.length == 0 || filteredBlock.length > openSize)) {
            if (index < 0) {
                return output;
            }
            index -= (block.length);
            block = getNextBlock(output.slice(0, index + 1));
            filteredBlock = block.filter((c) => c !== '.');
        }
        console.log('block', block);
        console.log('filteredBlock', filteredBlock);
        // clear the block space
        for (let i = openSpace; i < openSpace + openSize; i++) {
            let diff = openSpace - i + 1;
            output[index - diff] = 'X';
        }
        // move the block
        for (let i = openSpace; i < openSpace + openSize; i++) {
            output[i] = block[0];
        }
        index -= (block.length);
        openSpaces = getFreeSpaces(output);
    }
    return output;
}
// for (let [space, size] of openSpaces) {
//     console.log('space:', space, 'size:', size);
//     let {block, indexes} = buildBlockOfMaxSize(output.slice(0, index+1), size);
//     console.log('block',block);
//     openSpaces = getFreeSpaces(output);
//     index -= 1;
// }
function getNextBlock(data) {
    let block = [];
    let i = data.length - 1;
    block.push(data[i]);
    i -= 1;
    while (i >= 0 && data[i] == block[0]) {
        block.push(data[i]);
        i -= 1;
    }
    return block;
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
function answer2() {
    let formatted = formatInput2();
    let output = squish2(formatted);
    console.log(output.join(''));
    let checkSum = getCheckSum(output);
    console.log('ANSWER2', checkSum);
}
answer2();
