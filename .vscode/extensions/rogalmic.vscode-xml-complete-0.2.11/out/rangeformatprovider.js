"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class XmlRangeFormatProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
    }
    async provideDocumentRangeFormattingEdits(textDocument, range, options, _token) {
        const indentationString = options.insertSpaces ? Array(options.tabSize).fill(' ').join("") : "\t";
        const before = textDocument.getText(new vscode.Range(textDocument.positionAt(0), range.start)).trim();
        const selection = textDocument.getText(new vscode.Range(range.start, range.end)).trim();
        const after = textDocument.getText(new vscode.Range(range.end, textDocument.lineAt(textDocument.lineCount - 1).range.end)).trim();
        const selectionSeparator = "<!--352cf605-57c7-48a8-a5eb-2da215536443-->";
        const text = [before, selection, after].join(selectionSeparator);
        if (!await xmlsimpleparser_1.default.checkXml(text)) {
            return [];
        }
        const emptyLines = /^\s*[\r?\n]|\s*[\r?\n]$/g;
        let formattedText = (await xmlsimpleparser_1.default.formatXml(text, indentationString, textDocument.eol === vscode.EndOfLine.CRLF ? `\r\n` : `\n`, extension_1.globalSettings.formattingStyle))
            .split(selectionSeparator)[1]
            .replace(emptyLines, "");
        if (!formattedText) {
            return [];
        }
        return [vscode.TextEdit.replace(range, formattedText)];
    }
}
exports.default = XmlRangeFormatProvider;
//# sourceMappingURL=rangeformatprovider.js.map