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

export function calcBmi(height: number, weight: number) {
    var heightMeter = height / 100.0;
    return weight / (heightMeter * heightMeter);
}

export function getBmiClassification(bmi: number) {
    if (bmi < 18.5) {
        return 'UNDER WEIGHT';
    }
    if (bmi <= 24.9) {
        return 'NORMAL';
    }
    if (bmi <= 29.9) {
        return 'OVERWEIGHT';
    }
    if (bmi <= 34.9) {
        return 'OBESE CLASS I';
    }
    if (bmi <= 39.9) {
        return 'OBESE CLASS II';
    }

    return 'OBESE CLASS III';
}

export function getBmiColour(level: string) {
    if (level === 'UNDER WEIGHT') {
        return 'blue';
    }

    if (level === 'NORMAL') {
        return 'green';
    }

    if (level === 'OVERWEIGHT') {
        return 'yellow';
    }

    return 'red';
}

export function getBodyFatIndicator (age: number, bodyFat: number) {
    if (age <= 39) {
        if (bodyFat <= 21) {
            return 'LOW';
        }
        else if (bodyFat <= 33) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 39) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
    else if (age <= 59) {
        if (bodyFat <= 23) {
            return 'LOW';
        }
        else if (bodyFat <= 35) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 40) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
    else {
        if (bodyFat <= 24) {
            return 'LOW';
        }
        else if (bodyFat <= 36) {
            return 'HEALTHY';
        }
        else if (bodyFat <= 42) {
            return 'OVERWEIGHT';
        }
        else {
            return 'OBESE';
        }
    }
}

export function getColour (level: string) {
    if (level === 'LOW') {
        return 'blue';
    }

    if (level === 'HEALTHY') {
        return 'green';
    }

    if (level === 'OVERWEIGHT') {
        return 'yellow';
    }

    return 'red';
}

export function getBodyfatForeColour (level: string) {
    if (level === 'OVERWEIGHT') {
        return 'black';
    }

    return 'white';
}