"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xsdloader_1 = require("./xsdloader");
const xmlsimpleparser_1 = require("./xmlsimpleparser");
class XsdCachedLoader {
    static async loadSchemaContentsFromUri(schemaLocationUri, formatXsd = true) {
        if (!XsdCachedLoader.cachedSchemas.has(schemaLocationUri)) {
            let content = await xsdloader_1.default.loadSchemaContentsFromUri(schemaLocationUri);
            if (formatXsd) {
                content = await xmlsimpleparser_1.default.formatXml(content, "\t", "\n", "multiLineAttributes");
            }
            XsdCachedLoader.cachedSchemas.set(schemaLocationUri, content);
        }
        let result = XsdCachedLoader.cachedSchemas.get(schemaLocationUri);
        if (result !== undefined) {
            return result;
        }
        throw `Cannot get schema contents from '${schemaLocationUri}'`;
    }
}
exports.default = XsdCachedLoader;
XsdCachedLoader.cachedSchemas = new Map();
//# sourceMappingURL=xsdcachedloader.js.map