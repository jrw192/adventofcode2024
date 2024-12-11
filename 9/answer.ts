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
function formatInput2(): { formatted: string[], openSpaces: Map<number, number> } {
    const input = fs.readFileSync('./test.txt', 'utf8');
    const data = input.split('');
    let formatted: string[] = [];
    let openSpaces = new Map<number, number>();
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

function squish2(data: string[], openSpaces: Map<number, number>): string[] {
    console.log('before:', data.join(''));
    let output = JSON.parse(JSON.stringify(data));
    let index = data.length - 1;

    for (let [space, size] of openSpaces) {
        console.log('space:', space, 'size:', size);

        let {block, indexes} = buildBlockOfMaxSize(output.slice(0, index+1), size);
        console.log('block',block);

        index -= 1;

    }
    console.log(output.join(''));
    return output;
}

function buildBlockOfMaxSize(data: string[], maxSize: number): { block: string[], indexes: number[] } {
    let block: string[] = [];
    let indexes: number[] = [];
    let index = data.length - 1;
    let upperLimit = data.length-1;
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