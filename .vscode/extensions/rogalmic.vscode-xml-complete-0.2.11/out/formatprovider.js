"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class XmlFormatProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideDocumentFormattingEdits(textDocument, options, _token) {
        const indentationString = options.insertSpaces ? Array(options.tabSize).fill(' ').join("") : "\t";
        const documentRange = new vscode.Range(textDocument.positionAt(0), textDocument.lineAt(textDocument.lineCount - 1).range.end);
        const text = textDocument.getText();
        let formattedText = (await xmlsimpleparser_1.default.formatXml(text, indentationString, textDocument.eol === vscode.EndOfLine.CRLF ? `\r\n` : `\n`, extension_1.globalSettings.formattingStyle))
            .trim();
        if (!formattedText) {
            return [];
        }
        return [vscode.TextEdit.replace(documentRange, formattedText)];
    }
}
exports.default = XmlFormatProvider;
//# sourceMappingURL=formatprovider.js.map