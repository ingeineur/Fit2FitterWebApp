"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVersionUpdate = void 0;
var version_1 = require("../models/version");
function requireVersionUpdate(server) {
    if (server.major === version_1.CurrentVersion.major &&
        server.minor === version_1.CurrentVersion.minor &&
        server.build === version_1.CurrentVersion.build) {
        return false;
    }
    return true;
}
exports.requireVersionUpdate = requireVersionUpdate;
//# sourceMappingURL=utilities.js.map