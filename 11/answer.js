"use strict";
function init1() {
    const input = '6 11 33023 4134 564 0 8922422 688775';
    const stones = input.split(' ').map((n) => Number(n));
    return stones;
}
/* -------------------------------------PART 1------------------------------------- */
/*
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
*/
function performOneBlink(stones) {
    let newStones = [];
    for (let stone of stones) {
        if (stone == 0) {
            newStones.push(1);
        }
        else if (stone.toString().length % 2 == 0) {
            let stoneStr = stone.toString();
            let left = stoneStr.slice(0, stoneStr.length / 2);
            let right = stoneStr.slice(stoneStr.length / 2);
            // console.log(`left:${left},right:${right}`);
            newStones.push(Number(left), Number(right));
        }
        else {
            newStones.push(stone * 2024);
        }
    }
    return newStones;
}
function answer1() {
    let stones = init1();
    let NUM_BLINKS = 25;
    for (let b = 0; b < NUM_BLINKS; b++) {
        stones = performOneBlink(stones);
    }
    let ans = stones.length;
    console.log('ANS1', ans);
}
answer1();
/* -------------------------------------PART 2------------------------------------- */
function init2(input) {
    const stones = input.split(' ').map((n) => Number(n));
    return stones;
}
/*
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
*/
function processAllStones(stones, blinks) {
    // key: ${stone},${blink#} , value: num stones
    let memo = new Map();
    let count = 0;
    for (let stone of stones) {
        let result = processOneStone(stone, blinks, memo);
        count += result;
    }
    return count;
}
function processOneStone(stone, blinks, memo) {
    let token = `${stone},${blinks}`;
    if (memo.has(token)) {
        return memo.get(token);
    }
    if (blinks == 1) {
        return performOneBlink2(stone).length;
    }
    let first = performOneBlink2(stone);
    let total = 0;
    for (let newStone of first) {
        let remainder = processOneStone(newStone, blinks - 1, memo);
        total += remainder;
        token = `${newStone},${blinks - 1}`;
        memo.set(token, remainder);
    }
    return total;
}
function performOneBlink2(stone) {
    let newStones = [];
    if (stone == 0) {
        newStones.push(1);
    }
    else if (stone.toString().length % 2 == 0) {
        let stoneStr = stone.toString();
        let left = stoneStr.slice(0, stoneStr.length / 2);
        let right = stoneStr.slice(stoneStr.length / 2);
        // console.log(`left:${left},right:${right}`);
        newStones.push(Number(left), Number(right));
    }
    else {
        newStones.push(stone * 2024);
    }
    return newStones;
}
function answer2() {
    let stones = init2('6 11 33023 4134 564 0 8922422 688775');
    // let stones = init2('125 17');
    let NUM_BLINKS = 75;
    let ans = processAllStones(stones, NUM_BLINKS);
    console.log('ANS2', ans);
}
answer2();
