
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