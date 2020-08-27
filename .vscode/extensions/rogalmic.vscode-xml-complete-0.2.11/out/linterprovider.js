"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const types_1 = require("./types");
const xsdparser_1 = require("./helpers/xsdparser");
const xsdcachedloader_1 = require("./helpers/xsdcachedloader");
const xmlsimpleparser_1 = require("./helpers/xmlsimpleparser");
class XmlLinterProvider {
    constructor(extensionContext, schemaPropertiesArray) {
        this.extensionContext = extensionContext;
        this.schemaPropertiesArray = schemaPropertiesArray;
        this.delayCount = Number.MIN_SAFE_INTEGER;
        this.linterActive = false;
        this.schemaPropertiesArray = schemaPropertiesArray;
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();
        this.documentListener = vscode.workspace.onDidChangeTextDocument(evnt => this.triggerDelayedLint(evnt.document), this, this.extensionContext.subscriptions);
        vscode.workspace.onDidOpenTextDocument(doc => this.triggerDelayedLint(doc, 100), this, extensionContext.subscriptions);
        vscode.workspace.onDidCloseTextDocument(doc => this.cleanupDocument(doc), null, extensionContext.subscriptions);
        vscode.workspace.textDocuments.forEach(doc => this.triggerDelayedLint(doc, 100), this);
    }
    dispose() {
        this.documentListener.dispose();
        this.diagnosticCollection.clear();
    }
    cleanupDocument(textDocument) {
        this.diagnosticCollection.delete(textDocument.uri);
    }
    async triggerDelayedLint(textDocument, timeout = 2000) {
        if (this.delayCount > Number.MIN_SAFE_INTEGER) {
            this.delayCount = timeout;
            this.textDocument = textDocument;
            return;
        }
        this.delayCount = timeout;
        this.textDocument = textDocument;
        const tick = 100;
        while (this.delayCount > 0 || this.linterActive) {
            await new Promise(resolve => setTimeout(resolve, tick));
            this.delayCount -= tick;
        }
        try {
            this.linterActive = true;
            await this.triggerLint(this.textDocument);
        }
        finally {
            this.delayCount = Number.MIN_SAFE_INTEGER;
            this.linterActive = false;
        }
    }
    async triggerLint(textDocument) {
        if (textDocument.languageId !== extension_1.languageId) {
            return;
        }
        let diagnostics = new Array();
        try {
            let documentContent = textDocument.getText();
            let xsdFileUris = (await xmlsimpleparser_1.default.getSchemaXsdUris(documentContent, textDocument.uri.toString(true), extension_1.globalSettings.schemaMapping))
                .map(u => vscode.Uri.parse(u))
                .filter((v, i, a) => a.findIndex(u => u.toString() === v.toString()) === i);
            let nsMap = await xmlsimpleparser_1.default.getNamespaceMapping(documentContent);
            const text = textDocument.getText();
            for (let xsdUri of xsdFileUris) {
                let schemaProperties = this.schemaPropertiesArray
                    .filterUris([xsdUri])[0];
                if (schemaProperties === undefined) {
                    schemaProperties = { schemaUri: xsdUri, xsdContent: ``, tagCollection: new types_1.XmlTagCollection() };
                    try {
                        let xsdUriString = xsdUri.toString(true);
                        schemaProperties.xsdContent = await xsdcachedloader_1.default.loadSchemaContentsFromUri(xsdUriString);
                        schemaProperties.tagCollection = await xsdparser_1.default.getSchemaTagsAndAttributes(schemaProperties.xsdContent, xsdUriString);
                        vscode.window.showInformationMessage(`Loaded ...${xsdUri.toString().substr(xsdUri.path.length - 16)}`);
                    }
                    catch (err) {
                        vscode.window.showErrorMessage(err.toString());
                    }
                    finally {
                        this.schemaPropertiesArray.push(schemaProperties);
                    }
                }
                const strict = !extension_1.globalSettings.schemaMapping.find(m => m.xsdUri === xsdUri.toString() && m.strict === false);
                let diagnosticResults = await xmlsimpleparser_1.default.getXmlDiagnosticData(text, schemaProperties.tagCollection, nsMap, strict);
                diagnostics.push(this.getDiagnosticArray(diagnosticResults));
            }
            if (xsdFileUris.length === 0) {
                const planXmlCheckResults = await xmlsimpleparser_1.default.getXmlDiagnosticData(text, new types_1.XmlTagCollection(), nsMap, false);
                diagnostics.push(this.getDiagnosticArray(planXmlCheckResults));
            }
            this.diagnosticCollection.set(textDocument.uri, diagnostics
                .reduce((prev, next) => prev.filter(dp => next.find(dn => dn.range.start.compareTo(dp.range.start) === 0))));
        }
        catch (err) {
            vscode.window.showErrorMessage(err.toString());
        }
    }
    getDiagnosticArray(data) {
        return data.map(r => {
            let position = new vscode.Position(r.line, r.column);
            let severity = (r.severity === "error") ? vscode.DiagnosticSeverity.Error :
                (r.severity === "warning") ? vscode.DiagnosticSeverity.Warning :
                    (r.severity === "info") ? vscode.DiagnosticSeverity.Information :
                        vscode.DiagnosticSeverity.Hint;
            return new vscode.Diagnostic(new vscode.Range(position, position), r.message, severity);
        });
    }
}
exports.default = XmlLinterProvider;
//# sourceMappingURL=linterprovider.js.map