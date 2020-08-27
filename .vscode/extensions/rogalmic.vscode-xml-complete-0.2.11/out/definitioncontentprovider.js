"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xsdcachedloader_1 = require("./helpers/xsdcachedloader");
const extension_1 = require("./extension");
class XmlDefinitionContentProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideTextDocumentContent(uri) {
        let trueUri = Buffer.from(uri.toString(true).replace(`${extension_1.schemaId}://`, ''), 'hex').toString();
        return await xsdcachedloader_1.default.loadSchemaContentsFromUri(trueUri);
    }
}
exports.default = XmlDefinitionContentProvider;
//# sourceMappingURL=definitioncontentprovider.js.map