"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataURIToBlob = exports.requireVersionUpdate = void 0;
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
function DataURIToBlob(dataURI) {
    var splitDataURI = dataURI.split(',');
    var byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    var mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
}
exports.DataURIToBlob = DataURIToBlob;
//# sourceMappingURL=utilities.js.map