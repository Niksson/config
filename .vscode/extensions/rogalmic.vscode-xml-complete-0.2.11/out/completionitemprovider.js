"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class XmlCompletionItemProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideCompletionItems(textDocument, position, token, _context) {
        let documentContent = textDocument.getText();
        let offset = textDocument.offsetAt(position);
        let xsdFileUris = (await xmlsimpleparser_1.default.getSchemaXsdUris(documentContent, textDocument.uri.toString(true), extension_1.globalSettings.schemaMapping))
            .map(u => vscode.Uri.parse(u));
        let nsMap = await xmlsimpleparser_1.default.getNamespaceMapping(documentContent);
        let scope = await xmlsimpleparser_1.default.getScopeForPosition(documentContent, offset);
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
        else if (scope.context === "element" && scope.tagName.indexOf(".") < 0) {
            resultTexts = this.schemaPropertiesArray
                .filterUris(xsdFileUris)
                .map(sp => sp.tagCollection.filter(e => e.visible).map(e => sp.tagCollection.fixNs(e.tag, nsMap)))
                .reduce((prev, next) => prev.concat(next), [])
                .sort()
                .filter((v, i, a) => a.findIndex(e => e.name === v.name && e.comment === v.comment) === i);
        }
        else if (scope.context !== undefined) {
            resultTexts = this.schemaPropertiesArray
                .filterUris(xsdFileUris)
                .map(sp => sp.tagCollection.loadAttributesEx(scope.tagName ? scope.tagName.replace(".", "") : undefined, nsMap).map(s => sp.tagCollection.fixNs(s, nsMap)))
                .reduce((prev, next) => prev.concat(next), [])
                .sort()
                .filter((v, i, a) => a.findIndex(e => e.name === v.name && e.comment === v.comment) === i);
        }
        else {
            resultTexts = [];
        }
        return resultTexts
            .map(t => {
            let ci = new vscode.CompletionItem(t.name, vscode.CompletionItemKind.Snippet);
            ci.detail = scope.context;
            ci.documentation = t.comment;
            return ci;
        });
    }
}
exports.default = XmlCompletionItemProvider;
//# sourceMappingURL=completionitemprovider.js.map