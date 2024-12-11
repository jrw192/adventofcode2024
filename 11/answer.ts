function init1(): number[] {
    // const input = fs.readFileSync(filename, 'utf8');
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
function performOneBlink(stones: number[]) {
    let newStones = [];
    for (let stone of stones) {
        if (stone == 0) {
            newStones.push(1);
        } else if (stone.toString().length % 2 == 0) {
            let stoneStr = stone.toString();
            let left = stoneStr.slice(0, stoneStr.length/2);
            let right = stoneStr.slice(stoneStr.length/2);
            // console.log(`left:${left},right:${right}`);
            newStones.push(Number(left), Number(right));
        } else {
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
        // console.log(stones);
    }
    let ans = stones.length;
    console.log('ANS1',ans);

}

answer1();
