export interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

export interface IMealDto {
    id: number;
    mealType: string;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    updated: string;
    created: string;
    clientId: number;
}

export interface IMeals {
    0: IMealDetails[];
    1: IMealDetails[];
    2: IMealDetails[];
    3: IMealDetails[];
}

export interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    check: boolean;
    remove: boolean;
}

export interface IMacrosPlanDto {
    id: number,
    height: number,
    weight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    updated: string;
    created: string;
    clientId: number;
}

export interface IFoodLegacyDto {
    fdcId: string,
    description: string
}

export interface IMealDesc {
    id: string,
    description: string
}

export interface IFoodPortionDto {
    fdcId: string,
    modifier: string,
    amount: number,
    gramWeight: number,
    proteinValue: number,
    fatValue: number,
    carbValue: number,
}

export interface IRecipeDto {
    id: number,
    name: string,
    carbs: number,
    protein: number,
    fat: number,
    serving: number,
    photo: string,
    updated: string,
    created: string,
    clientId: number,
}

export interface IRecipeItemDto {
    id: number,
    name: string,
    dataSource: string,
    externalId: string,
    weight: number,
    carbs: number,
    protein: number,
    fat: number,
    updated: string,
    created: string,
    recipeId: number,
}