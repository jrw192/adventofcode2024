import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function formatInput(): { formatted: string[], openSpaces: number[] } {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const data = input.split('');
    let formatted: string[] = [];
    let openSpaces: number[] = [];
    let id = 0;
    for (let i = 0; i < data.length; i++) {
        let num = Number(data[i]);
        if (i % 2 == 1) {
            // free space indicator
            for (let n = 0; n < num; n++) {
                formatted.push('.');
                openSpaces.push(formatted.length - 1);
            }
        } else {
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

function squish(data: string[], openSpaces: number[]): string[] {
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

function getCheckSum(data: string[]): number {
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
function formatInput2(): string[] {
    const input = fs.readFileSync('./test.txt', 'utf8');
    const data = input.split('');
    let formatted: string[] = [];
    let id = 0;
    for (let i = 0; i < data.length; i++) {
        let num = Number(data[i]);
        if (i % 2 == 1) {
            let start = formatted.length;
            // free space indicator
            for (let n = 0; n < num; n++) {
                formatted.push('.');
            }
        } else {
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

function getFreeSpaces(data: string[]): Map<number, number> {
    // key: start index, value: num spaces
    let spaces = new Map<number, number>();
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

function squish2(data: string[],): string[] {
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
            if(index < 0) {
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
            let diff = openSpace-i+1;
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

function getNextBlock(data: string[]): string[] {
    let block: string[] = [];
    let i = data.length - 1;
    block.push(data[i]);
    i -= 1;
    while (i >= 0 && data[i] == block[0]) {
        block.push(data[i]);
        i -= 1;
    }
    return block;
}

function buildBlockOfMaxSize(data: string[], maxSize: number): { block: string[], indexes: number[] } {
    let block: string[] = [];
    let indexes: number[] = [];
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