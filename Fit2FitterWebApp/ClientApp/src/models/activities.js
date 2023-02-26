"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxHrColour = exports.getIndicatorColour = exports.getSleepColour = exports.getStepIndicatorColour = exports.getActivityLevel = void 0;
function getActivityLevel(activityLevel) {
    if (activityLevel === 'Sedentary') {
        return 1.2;
    }
    if (activityLevel === 'Lightly Active') {
        return 1.375;
    }
    if (activityLevel === 'Moderately Active') {
        return 1.55;
    }
    if (activityLevel === 'Very Active') {
        return 1.725;
    }
    if (activityLevel === 'Extra Active') {
        return 1.9;
    }
    return 0;
}
exports.getActivityLevel = getActivityLevel;
function getStepIndicatorColour(percent) {
    if (percent <= 0.5) {
        return 'red';
    }
    if (percent > 0.99) {
        return 'green';
    }
    return 'yellow';
}
exports.getStepIndicatorColour = getStepIndicatorColour;
function getSleepColour(hour) {
    if (hour < 6.0) {
        return 'red';
    }
    return 'green';
}
exports.getSleepColour = getSleepColour;
function getIndicatorColour(percent) {
    if (percent >= 1.0) {
        return 'green';
    }
    return 'red';
}
exports.getIndicatorColour = getIndicatorColour;
function getMaxHrColour(maxHr, age) {
    var calcMaxHr = 220 - age;
    var minMaxHr = 0.65 * calcMaxHr;
    var maxMaxHr = 0.85 * calcMaxHr;
    if (maxHr >= minMaxHr && maxHr <= maxMaxHr) {
        return 'green';
    }
    else if (maxHr > maxMaxHr && maxHr <= calcMaxHr) {
        return 'orange';
    }
    return 'red';
}
exports.getMaxHrColour = getMaxHrColour;
//# sourceMappingURL=activities.js.map