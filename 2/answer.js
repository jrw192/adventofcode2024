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
function init1() {
    const input = fs.readFileSync('./input.txt', 'utf8');
    const lines = input.split('\n');
    const reports = [];
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
function isReportSafe1(report) {
    if (isIncreasing(report)) {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i + 1] - report[i] > 0 && report[i + 1] - report[i] <= 3)) {
                return false;
            }
        }
    }
    else {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i] - report[i + 1] > 0 && report[i] - report[i + 1] <= 3)) {
                return false;
            }
        }
    }
    return true;
}
function isIncreasing(report) {
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
function isReportSafe2(report, dampened) {
    if (isIncreasing2(report)) {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i + 1] - report[i] > 0 && report[i + 1] - report[i] <= 3)) {
                if (dampened) {
                    return false;
                }
                return isReportSafe2(report.toSpliced(i, 1), true) || isReportSafe2(report.toSpliced(i + 1, 1), true);
            }
        }
    }
    else {
        for (let i = 0; i < report.length - 1; i++) {
            if (!(report[i] - report[i + 1] > 0 && report[i] - report[i + 1] <= 3)) {
                if (dampened) {
                    return false;
                }
                return isReportSafe2(report.toSpliced(i, 1), true) || isReportSafe2(report.toSpliced(i + 1, 1), true);
            }
        }
    }
    return true;
}
function isIncreasing2(report) {
    let numIncreases = 0;
    let numDecreases = 0;
    for (let i = 0; i < report.length - 1; i++) {
        if (report[i] - report[i + 1] < 0) {
            numIncreases += 1;
        }
        else {
            numDecreases += 1;
        }
    }
    if (numIncreases > numDecreases) {
        return true;
    }
    return false;
}
answer2();
