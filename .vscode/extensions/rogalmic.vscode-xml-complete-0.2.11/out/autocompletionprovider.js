"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class AutoCompletionProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
        this.delayCount = 0;
        this.documentListener = vscode.workspace.onDidChangeTextDocument(async (evnt) => this.triggerDelayedAutoCompletion(evnt), this, this.extensionContext.subscriptions);
    }
    dispose() {
        this.documentListener.dispose();
    }
    async triggerDelayedAutoCompletion(documentEvent, timeout = 250) {
        if (this.delayCount > 0) {
            this.delayCount = timeout;
            this.documentEvent = documentEvent;
            return;
        }
        this.delayCount = timeout;
        this.documentEvent = documentEvent;
        const tick = 100;
        while (this.delayCount > 0) {
            await new Promise(resolve => setTimeout(resolve, tick));
            this.delayCount -= tick;
        }
        this.triggerAutoCompletion(this.documentEvent);
    }
    async triggerAutoCompletion(documentEvent) {
        const activeTextEditor = vscode.window.activeTextEditor;
        const document = documentEvent.document;
        const inputChange = documentEvent.contentChanges[0];
        if (document.languageId !== extension_1.languageId
            || documentEvent.contentChanges.length !== 1
            || !inputChange.range.isSingleLine
            || (inputChange.text && inputChange.text.indexOf("\n") >= 0)
            || activeTextEditor === undefined
            || document.lineCount > AutoCompletionProvider.maxLines
            || activeTextEditor.document.uri.toString() !== document.uri.toString()) {
            return;
        }
        const changeLine = inputChange.range.end.line;
        const wholeLineRange = document.lineAt(changeLine).range;
        const wholeLineText = document.getText(document.lineAt(inputChange.range.end.line).range);
        let linePosition = inputChange.range.start.character + inputChange.text.length;
        if (wholeLineText.length >= AutoCompletionProvider.maxLineChars) {
            return;
        }
        const scope = await xmlsimpleparser_1.default.getScopeForPosition(`${wholeLineText}\n`, linePosition);
        if (--linePosition < 0) {
            return;
        }
        const before = wholeLineText.substring(0, linePosition);
        const after = wholeLineText.substring(linePosition);
        if (!(scope.context && scope.context !== "text" && scope.tagName)) {
            return;
        }
        if (before.substr(before.lastIndexOf("<"), 2) === "</") {
            return;
        }
        const closeCurrentTagIndex = after.indexOf(">");
        const nextTagStartPostion = after.indexOf("<");
        const nextTagEndingPostion = nextTagStartPostion >= 0 ? after.indexOf(">", nextTagStartPostion) : -1;
        const invalidTagStartPostion = nextTagEndingPostion >= 0 ? after.indexOf("<", nextTagEndingPostion) : -1;
        let resultText = "";
        if (after.substr(closeCurrentTagIndex - 1).startsWith(`/></${scope.tagName}>`) && closeCurrentTagIndex === 1) {
            resultText = wholeLineText.substring(0, linePosition + nextTagStartPostion) + `` + wholeLineText.substring(linePosition + nextTagEndingPostion + 1);
        }
        else if (after.substr(closeCurrentTagIndex - 1, 2) !== "/>" && invalidTagStartPostion < 0) {
            if (nextTagStartPostion >= 0 && after[nextTagStartPostion + 1] === "/") {
                resultText = wholeLineText.substring(0, linePosition + nextTagStartPostion) + `</${scope.tagName}>` + wholeLineText.substring(linePosition + nextTagEndingPostion + 1);
            }
            else if (nextTagStartPostion < 0) {
                resultText = wholeLineText.substring(0, linePosition + closeCurrentTagIndex + 1) + `</${scope.tagName}>` + wholeLineText.substring(linePosition + closeCurrentTagIndex + 1);
            }
        }
        if (!resultText || resultText.trim() === wholeLineText.trim()) {
            return;
        }
        resultText = resultText.trimRight();
        if (!await xmlsimpleparser_1.default.checkXml(`${resultText}`)) {
            return;
        }
        let documentContent = document.getText();
        documentContent = documentContent.split("\n")
            .map((l, i) => (i === changeLine) ? resultText : l)
            .join("\n");
        if (!await xmlsimpleparser_1.default.checkXml(documentContent)) {
            return;
        }
        await activeTextEditor.edit((builder) => {
            builder.replace(new vscode.Range(wholeLineRange.start, wholeLineRange.end), resultText);
        }, { undoStopAfter: false, undoStopBefore: false });
    }
}
exports.default = AutoCompletionProvider;
AutoCompletionProvider.maxLineChars = 1024;
AutoCompletionProvider.maxLines = 8096;
//# sourceMappingURL=autocompletionprovider.js.map