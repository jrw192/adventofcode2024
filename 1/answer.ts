import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(): number[][] {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n')
    const lists: number[][] = [[], []];
    for (let line of lines) {
        let [a, b] = line.split('   ');
        lists[0].push(Number(a));
        lists[1].push(Number(b));
    }
    lists[0].sort();
    lists[1].sort();
    return lists;
}

function getTotalDistance(list1: number[], list2: number[]): number {
    let total = 0;
    list1.map((n, i) => {
        total += Math.abs(n - list2[i]);
    })
    return total;
}

let lists1 = init1();
let ans1 = getTotalDistance(lists1[0], lists1[1]);
console.log('ANSWER1:', ans1);

/* -------------------------------------PART 2------------------------------------- */
function init2(): {
    list: number[];
    map: Map<number, number>;
} {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n')
    const list: number[] = [];
    // number : frequency
    const map = new Map<number, number>();
    for (let line of lines) {
        let [a, b] = line.split('   ').map((n) => Number(n));
        list.push(a);

        let old = map.get(b) ?? 0;
        map.set(b, old + 1);
    }

    return { list, map };
}

function getSimilarityScore(list: number[], map: Map<number,number>): number {
    let score = 0;
    for (let num of list) {
        score += (num * (map.get(num) ?? 0));
    }
    return score;
}

let {list, map} = init2();
let ans2 = getSimilarityScore(list, map);
console.log('ANSWER2:',ans2);

