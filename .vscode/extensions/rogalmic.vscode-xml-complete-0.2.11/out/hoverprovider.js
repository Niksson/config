"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class XmlHoverProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideHover(textDocument, position, token) {
        let documentContent = textDocument.getText();
        let offset = textDocument.offsetAt(position);
        let xsdFileUris = (await xmlsimpleparser_1.default.getSchemaXsdUris(documentContent, textDocument.uri.toString(true), extension_1.globalSettings.schemaMapping))
            .map(u => vscode.Uri.parse(u));
        let nsMap = await xmlsimpleparser_1.default.getNamespaceMapping(documentContent);
        let scope = await xmlsimpleparser_1.default.getScopeForPosition(documentContent, offset);
        let wordRange = textDocument.getWordRangeAtPosition(position, /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g);
        let word = textDocument.getText(wordRange);
        let resultTexts;
        if (token.isCancellationRequested) {
            resultTexts = [];
        }
        else if (scope.context === "text") {
            resultTexts = [];
        }
        else if (scope.tagName === undefined) {
            resultTexts = [];
        }
        else if (scope.context === "element") {
            resultTexts = this.schemaPropertiesArray
                .filterUris(xsdFileUris)
                .map(sp => sp.tagCollection.filter(e => e.visible).map(e => sp.tagCollection.fixNs(e.tag, nsMap)))
                .reduce((prev, next) => prev.concat(next), [])
                .sort()
                .filter(e => e.name === word)
                .filter((v, i, a) => a.findIndex(e => e.name === v.name && e.comment === v.comment) === i);
        }
        else if (scope.context !== undefined) {
            resultTexts = this.schemaPropertiesArray
                .filterUris(xsdFileUris)
                .map(sp => sp.tagCollection.loadAttributesEx(scope.tagName, nsMap).map(s => sp.tagCollection.fixNs(s, nsMap)))
                .reduce((prev, next) => prev.concat(next), [])
                .sort()
                .filter(e => e.name === word)
                .filter((v, i, a) => a.findIndex(e => e.name === v.name && e.comment === v.comment) === i);
        }
        else {
            resultTexts = [];
        }
        return {
            contents: resultTexts.map(t => new vscode.MarkdownString(t.comment)),
            range: wordRange
        };
    }
}
exports.default = XmlHoverProvider;
//# sourceMappingURL=hoverprovider.js.map