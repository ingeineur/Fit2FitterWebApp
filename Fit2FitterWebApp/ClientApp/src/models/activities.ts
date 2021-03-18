
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