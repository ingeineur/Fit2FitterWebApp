export interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    bodyFat: number;
}

export interface IMacrosPlan {
    id: number,
    height: number,
    weight: number,
    targetWeight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    carbWeight: number,
    proteinWeight: number,
    fatWeight: number,
    manual: boolean,
    updated: string;
    created: string;
    clientId: number;
}