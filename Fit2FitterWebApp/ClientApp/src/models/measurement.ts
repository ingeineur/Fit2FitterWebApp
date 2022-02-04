export interface IMeasurements {
    neck: number;
    upperArm: number
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number
}

export interface IMeasurementDto {
    id: number;
    neck: number;
    upperArm: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
    bodyFat: number;
    updated: string;
    created: string;
    clientId: number;
}

export interface IGraphMeasurements {
    neck: number[];
    upperArm: number[];
    waist: number[];
    hips: number[];
    thigh: number[];
    chest: number[];
    weight: number[];
    bodyFat: number[];
}

export function calcBodyFatPercent(height: number, neck: number, waist: number, hip: number) {
    var neckcm = 2.54 * neck;
    var waistcm = 2.54 * waist;
    var hipcm = 2.54 * hip;
    //return 19.2 - (0.239 * height) + (0.8 * (waist + hip)) - (0.5 * neck);
    return ((waist + hip) -  neck) * 0.5;
}

export function getBodyFatIndicator (age: number, bodyFat: number) {
    if (age <= 20) {
        if (11.3 <= bodyFat && bodyFat <= 15.7) {
            return 'LEAN';
        }
        if (15.7 < bodyFat && bodyFat <= 21.5) {
            return 'IDEAL';
        }
        if (21.5 < bodyFat && bodyFat <= 29.0) {
            return 'AVERAGE';
        }
        if (29.0 < bodyFat && bodyFat <= 34.6) {
            return 'ABOVE AVERAGE';
        }
    }
    if (21 <= age && age <= 25) {
        if (11.9 <= bodyFat && bodyFat <= 18.4) {
            return 'LEAN';
        }
        if (18.4 < bodyFat && bodyFat <= 23.8) {
            return 'IDEAL';
        }
        if (23.8 < bodyFat && bodyFat <= 29.6) {
            return 'AVERAGE';
        }
        if (29.6 < bodyFat && bodyFat <= 35.2) {
            return 'ABOVE AVERAGE';
        }
    }
    if (26 <= age && age <= 30) {
        if (12.5 <= bodyFat && bodyFat <= 19.0) {
            return 'LEAN';
        }
        if (19.0 < bodyFat && bodyFat <= 24.5) {
            return 'IDEAL';
        }
        if (24.5 < bodyFat && bodyFat <= 31.5) {
            return 'AVERAGE';
        }
        if (31.5 < bodyFat && bodyFat <= 35.8) {
            return 'ABOVE AVERAGE';
        }
    }
    if (31 <= age && age <= 35) {
        if (13.2 <= bodyFat && bodyFat <= 19.6) {
            return 'LEAN';
        }
        if (19.6 < bodyFat && bodyFat <= 25.1) {
            return 'IDEAL';
        }
        if (25.1 < bodyFat && bodyFat <= 32.1) {
            return 'AVERAGE';
        }
        if (32.1 < bodyFat && bodyFat <= 36.4) {
            return 'ABOVE AVERAGE';
        }
    }
    if (36 <= age && age <= 40) {
        if (13.8 <= bodyFat && bodyFat <= 22.2) {
            return 'LEAN';
        }
        if (22.2 < bodyFat && bodyFat <= 27.3) {
            return 'IDEAL';
        }
        if (27.3 < bodyFat && bodyFat <= 32.7) {
            return 'AVERAGE';
        }
        if (32.7 < bodyFat && bodyFat <= 37.0) {
            return 'ABOVE AVERAGE';
        }
    }
    if (41 <= age && age <= 45) {
        if (14.4 <= bodyFat && bodyFat <= 22.8) {
            return 'LEAN';
        }
        if (22.8 < bodyFat && bodyFat <= 27.9) {
            return 'IDEAL';
        }
        if (27.9 < bodyFat && bodyFat <= 34.4) {
            return 'AVERAGE';
        }
        if (34.4 < bodyFat && bodyFat <= 37.7) {
            return 'ABOVE AVERAGE';
        }
    }
    if (46 <= age && age <= 50) {
        if (15.0 <= bodyFat && bodyFat <= 23.4) {
            return 'LEAN';
        }
        if (23.4 < bodyFat && bodyFat <= 28.6) {
            return 'IDEAL';
        }
        if (28.6 < bodyFat && bodyFat <= 35.0) {
            return 'AVERAGE';
        }
        if (35.0 < bodyFat && bodyFat <= 38.3) {
            return 'ABOVE AVERAGE';
        }
    }
    if (51 <= age && age <= 55) {
        if (15.6 <= bodyFat && bodyFat <= 24.0) {
            return 'LEAN';
        }
        if (24.0 < bodyFat && bodyFat <= 29.2) {
            return 'IDEAL';
        }
        if (29.2 < bodyFat && bodyFat <= 35.6) {
            return 'AVERAGE';
        }
        if (35.6 < bodyFat && bodyFat <= 38.9) {
            return 'ABOVE AVERAGE';
        }
    }
    if (56 <= age) {
        if (16.3 <= bodyFat && bodyFat <= 24.6) {
            return 'LEAN';
        }
        if (24.6 < bodyFat && bodyFat <= 29.8) {
            return 'IDEAL';
        }
        if (29.8 < bodyFat && bodyFat <= 37.2) {
            return 'AVERAGE';
        }
        if (37.2 < bodyFat && bodyFat <= 39.5) {
            return 'ABOVE AVERAGE';
        }
    }

    return 'AVERAGE';
}

export function getColour (level: string) {
    if (level === 'LEAN') {
        return 'blue';
    }

    if (level === 'IDEAL') {
        return 'green';
    }

    if (level === 'AVERAGE') {
        return 'yellow';
    }

    return 'red';
}

export function getBodyfatForeColour (level: string) {
    if (level === 'AVERAGE') {
        return 'black';
    }

    return 'white';
}