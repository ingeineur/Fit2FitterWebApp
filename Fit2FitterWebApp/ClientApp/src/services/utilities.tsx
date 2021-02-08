import { IVersion, CurrentVersion } from '../models/version';

export function requireVersionUpdate (server: IVersion) {
    if (server.major === CurrentVersion.major &&
        server.minor === CurrentVersion.minor &&
        server.build === CurrentVersion.build) {
        return false;
    }

    return true;
}