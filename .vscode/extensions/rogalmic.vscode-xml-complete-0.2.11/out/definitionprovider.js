"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
const extension_1 = require("./extension");
class XmlDefinitionProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideDefinition(textDocument, position, _token) {
        let documentContent = textDocument.getText();
        let offset = textDocument.offsetAt(position);
        let scope = await xmlsimpleparser_1.default.getScopeForPosition(documentContent, offset);
        let wordRange = textDocument.getWordRangeAtPosition(position, /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g);
        let word = textDocument.getText(wordRange);
        let noDefinitionUri = (e) => `data:text/plain;base64,${Buffer.from(`No definition found for '${e}'`).toString('base64')}`;
        let generateResult = (cs) => new vscode.Location(vscode.Uri.parse(`${extension_1.schemaId}://${Buffer.from(cs.definitionUri || noDefinitionUri(word)).toString('hex')}`), new vscode.Position(cs.definitionLine || 0, cs.definitionColumn || 0));
        switch (scope.context) {
            case "element":
                let tags = this.schemaPropertiesArray
                    .map(p => p.tagCollection.filter(t => t.tag.name === word))
                    .reduce((prev, next) => prev.concat(next), []);
                if (tags.length > 0) {
                    return generateResult(tags[0].tag);
                }
                break;
            case "attribute":
                let atts = this.schemaPropertiesArray
                    .map(p => p.tagCollection
                    .map(t => t.attributes.filter(a => a.name === word))
                    .reduce((prev, next) => prev.concat(next), []))
                    .reduce((prev, next) => prev.concat(next), []);
                if (atts.length > 0) {
                    return generateResult(atts[0]);
                }
                break;
        }
        throw `Unable to get definition for phrase '${word}'.`;
    }
}
exports.default = XmlDefinitionProvider;
//# sourceMappingURL=definitionprovider.js.map