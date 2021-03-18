"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLevel = void 0;
function getActivityLevel(activityLevel) {
    if (activityLevel == 'Sedentary') {
        return 1.2;
    }
    if (activityLevel == 'Lightly Active') {
        return 1.375;
    }
    if (activityLevel == 'Moderately Active') {
        return 1.55;
    }
    if (activityLevel == 'Very Active') {
        return 1.725;
    }
    if (activityLevel == 'Extra Active') {
        return 1.9;
    }
    return 0;
}
exports.getActivityLevel = getActivityLevel;
//# sourceMappingURL=activities.js.map