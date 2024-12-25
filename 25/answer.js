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
function init1(filename) {
    const input = fs.readFileSync(filename, 'utf8');
    const lines = input.split('\n');
    let isKey = false;
    const keys = [];
    const locks = [];
    let current = [0, 0, 0, 0, 0];
    for (let line of lines) {
        line = line.trim();
        if (line == '') {
            // first shave off extra height
            current = current.map((c) => c - 1);
            // start new
            if (isKey) {
                keys.push(current);
            }
            else {
                locks.push(current);
            }
            current = [0, 0, 0, 0, 0];
        }
        else {
            if (line == '#####') {
                // starting a lock
                isKey = false;
            }
            else if (line == '.....') {
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
    current = current.map((c) => c - 1);
    if (isKey) {
        keys.push(current);
    }
    else {
        locks.push(current);
    }
    return { keys, locks };
}
function isValidLockKeyPair(lock, key, maxHeight) {
    for (let i = 0; i < lock.length; i++) {
        if (lock[i] + key[i] > maxHeight) {
            return false;
        }
    }
    return true;
}
function getValidPairs(locks, keys) {
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
    let { keys, locks } = init1('./input.txt');
    console.log(keys);
    console.log(locks);
    let pairs = getValidPairs(locks, keys);
    console.log(pairs);
}
answer1();
