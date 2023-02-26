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
    carbWeight: number,
    proteinWeight: number,
    fatWeight: number,
    manualMacro: boolean,
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
    grp: string;
}

export interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    grp: string;
    created: string;
    avatar: string;
}

export interface LoginDto {
    id: number,
    username: string;
    password: string;
    active: boolean;
    lastLogin: string;
    clientId: number;
}