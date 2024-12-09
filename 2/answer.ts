import * as fs from 'fs';

/* -------------------------------------PART 1------------------------------------- */
function init1(): number[][] {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const reports: number[][] = [];
    for (let line of lines) {
        reports.push(line.replace('\r', '').split(' ').map((n) => Number(n)));
    }
    return reports;
}


function answer1() {
    let reports = init1();
    let valid = 0;
    for (let report of reports) {
        if (isReportSafe1(report)) {
            valid += 1;
        }
    }
    console.log('answer1:', valid);
    return valid;
}

function isReportSafe1(report: number[]): boolean {
    if (isIncreasing(report)) {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i + 1] - report[i] > 0 && report[i + 1] - report[i] <= 3)) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i] - report[i + 1] > 0 && report[i] - report[i + 1] <= 3)) {
                return false;
            }
        }
    }
    return true;
}

function isIncreasing(report: number[]): boolean {
    return report[0] < report[1];
}

answer1();

/* -------------------------------------PART 2------------------------------------- */

function answer2() {
    let reports = init1();
    let safeReports = [];
    for (let report of reports) {
        if (isReportSafe2(report, false)) {
            safeReports.push(report);
        }
    }
    let valid = safeReports.length;
    console.log('answer2:', valid);
    return valid;
}

function isReportSafe2(report: number[], dampened: boolean): boolean {
    if (isIncreasing2(report)) {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i + 1] - report[i] > 0 && report[i + 1] - report[i] <= 3)) {
                if (dampened) {
                    return false;
                }
                return isReportSafe2(report.toSpliced(i, 1), true) || isReportSafe2(report.toSpliced(i+1, 1), true);
            }
        }
    } else {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i] - report[i + 1] > 0 && report[i] - report[i + 1] <= 3)) {
                if (dampened) {
                    return false;
                }
                return isReportSafe2(report.toSpliced(i, 1), true) || isReportSafe2(report.toSpliced(i+1, 1), true);
            }
        }
    }
    return true;
}

function isIncreasing2(report: number[]): boolean {
    let numIncreases = 0;
    let numDecreases = 0;
    for (let i = 0; i < report.length-1; i++) {
        if (report[i]-report[i+1] < 0) {
            numIncreases += 1;
        } else {
            numDecreases += 1;
        }
    }
    if( numIncreases > numDecreases) {
        return true;
    }
    return false;
}
answer2();