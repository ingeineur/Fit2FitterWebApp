
export interface IActivityGuides {
    calories: number;
    steps: number;
}

export interface ITotalDailyActivity {
    calories: number;
    steps: number;
}

export interface IActivity {
    id: number,
    calories: number;
    steps: number;
    maxHr: number;
    activityDesc: string;
    duration: number;
    check: boolean;
}

export interface IActivityDto {
    id: number,
    calories: number;
    steps: number;
    maxHr: number;
    duration: number;
    description: string;
    check: boolean;
    updated: string;
    created: string;
    clientId: number;
}

export function getActivityLevel(activityLevel: string) {
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

export function getStepIndicatorColour (percent: number) {
    if (percent <= 0.5) {
        return 'red';
    }

    if (percent > 0.99) {
        return 'green';
    }

    return 'yellow';
}

export function getSleepColour (hour: number) {
    if (hour < 6.0) {
        return 'red';
    }

    return 'green';
}

export function getIndicatorColour (percent: number) {
    if (percent >= 1.0) {
        return 'green';
    }

    return 'red';
}

export function getMaxHrColour(maxHr: number, age: number) {
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