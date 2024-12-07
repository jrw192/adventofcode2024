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
function init() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    // const equations = new Map<number, number[]>();
    const equations = [];
    for (let line of lines) {
        let split = line.split(':');
        let target = Number(split[0]);
        let values = split[1].split(' ').filter(v => v !== '').map(v => Number(v));
        // equations.set(Number(target), values.map(v => Number(v)));
        equations.push([target, ...values]);
    }
    return equations;
}
/* -------------------------------------PART 1------------------------------------- */
function getValidTargets1() {
    let equations = init();
    let valid = [];
    for (let equation of equations) {
        let target = equation[0];
        let inputs = equation.slice(1);
        if (hasValidAnswer1(target, inputs)) {
            valid.push(target);
        }
    }
    return valid;
}
function hasValidAnswer1(target, inputs) {
    if (inputs.length == 1) {
        return target == inputs[0];
    }
    else {
        let add = inputs[0] + inputs[1];
        let multiply = inputs[0] * inputs[1];
        let addRemainder = [add, ...inputs.slice(2)];
        let multiplyRemainder = [multiply, ...inputs.slice(2)];
        return hasValidAnswer1(target, addRemainder) || hasValidAnswer1(target, multiplyRemainder);
    }
}
let valid1 = getValidTargets1();
console.log('valid', valid1);
let ANSWER1 = valid1.reduce((n, sum) => n + sum);
console.log('ANSWER1', ANSWER1);
/* -------------------------------------PART 2------------------------------------- */
function getValidTargets2() {
    let equations = init();
    let valid = [];
    for (let equation of equations) {
        let target = equation[0];
        let inputs = equation.slice(1);
        if (hasValidAnswer2(target, inputs)) {
            valid.push(target);
        }
    }
    return valid;
}
function hasValidAnswer2(target, inputs) {
    if (inputs.length == 1) {
        return target == inputs[0];
    }
    else {
        let add = inputs[0] + inputs[1];
        let multiply = inputs[0] * inputs[1];
        let concat = Number(`${inputs[0]}${inputs[1]}`);
        let addRemainder = [add, ...inputs.slice(2)];
        let multiplyRemainder = [multiply, ...inputs.slice(2)];
        let concatRemainder = [concat, ...inputs.slice(2)];
        return hasValidAnswer2(target, addRemainder)
            || hasValidAnswer2(target, multiplyRemainder)
            || hasValidAnswer2(target, concatRemainder);
    }
}
let valid2 = getValidTargets2();
console.log('valid', valid2);
let ANSWER2 = valid2.reduce((n, sum) => n + sum);
console.log('ANSWER2', ANSWER2);
