"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XsdLoader {
    static loadSchemaContentsFromUri(schemaLocationUri) {
        return new Promise((resolve, reject) => {
            let resultContent = ``;
            const getUri = require('get-uri');
            getUri(schemaLocationUri, function (err, rs) {
                if (err) {
                    reject(`Error getting XSD:\n${err.toString()}`);
                    return;
                }
                rs.on('data', (buf) => {
                    resultContent += buf.toString();
                });
                rs.on('end', () => {
                    resolve(resultContent);
                });
            });
        });
    }
}
exports.default = XsdLoader;
//# sourceMappingURL=xsdloader.js.map