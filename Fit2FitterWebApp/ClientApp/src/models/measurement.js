"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBodyfatForeColour = exports.getColour = exports.getBodyFatIndicator = exports.getBmiColour = exports.getBmiClassification = exports.calcBmi = exports.calcBodyFatPercent = void 0;
function calcBodyFatPercent(height, neck, waist, hip) {
    var neckcm = 2.54 * neck;
    var waistcm = 2.54 * waist;
    var hipcm = 2.54 * hip;
    //return 19.2 - (0.239 * height) + (0.8 * (waist + hip)) - (0.5 * neck);
    return ((waist + hip) - neck) * 0.5;
}
exports.calcBodyFatPercent = calcBodyFatPercent;
function calcBmi(height, weight) {
    var heightMeter = height / 100.0;
    return weight / (heightMeter * heightMeter);
}
exports.calcBmi = calcBmi;
function getBmiClassification(bmi) {
    if (bmi < 18.5) {
        return 'UNDER WEIGHT';
    }
    if (bmi <= 24.9) {
        return 'NORMAL';
    }
    if (bmi <= 29.9) {
        return 'OVERWEIGHT';
    }
    if (bmi <= 34.9) {
        return 'OBESE CLASS I';
    }
    if (bmi <= 39.9) {
        return 'OBESE CLASS II';
    }
    return 'OBESE CLASS III';
}
exports.getBmiClassification = getBmiClassification;
function getBmiColour(level) {
    if (level === 'UNDER WEIGHT') {
        return 'blue';
    }
    if (level === 'NORMAL') {
        return 'green';
    }
    if (level === 'OVERWEIGHT') {
        return 'yellow';
    }
    return 'red';
}
exports.getBmiColour = getBmiColour;
function getBodyFatIndicator(age, bodyFat) {
    if (age <= 39) {
        if (bodyFat <= 21) {
            return 'LOW';
        }
        else if (bodyFat <= 33) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 39) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
    else if (age <= 59) {
        if (bodyFat <= 23) {
            return 'LOW';
        }
        else if (bodyFat <= 35) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 40) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
    else {
        if (bodyFat <= 24) {
            return 'LOW';
        }
        else if (bodyFat <= 36) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 42) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
}
exports.getBodyFatIndicator = getBodyFatIndicator;
function getColour(level) {
    if (level === 'LOW') {
        return 'blue';
    }
    if (level === 'HEALTHY') {
        return 'green';
    }
    if (level === 'OVERWEIGHT') {
        return 'yellow';
    }
    return 'red';
}
exports.getColour = getColour;
function getBodyfatForeColour(level) {
    if (level === 'OVERWEIGHT') {
        return 'black';
    }
    return 'white';
}
exports.getBodyfatForeColour = getBodyfatForeColour;
//# sourceMappingURL=measurement.js.map