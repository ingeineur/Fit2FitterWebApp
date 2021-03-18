export interface IPersonal {
    avatar: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    targetWeight: number,
    activityLevel: number;
    macroType: number;
    carbPercent: number;
    proteinPercent: number;
    fatPercent: number;
}

export interface IClient {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
    avatar: string;
}

export interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
    avatar: string;
}