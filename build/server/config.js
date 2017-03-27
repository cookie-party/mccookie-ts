"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLocation() {
    const protocol = process.env.protocol || 'http';
    const host = process.env.host || '127.0.0.1';
    const port = process.env.port || 7777;
    // console.log(protocol + '://' + host + ':' + port);
    return protocol + '://' + host + ':' + port;
}
exports.getLocation = getLocation;
exports.Constant = {
    HASHTAG: '#くーこれ'
};
//# sourceMappingURL=config.js.map