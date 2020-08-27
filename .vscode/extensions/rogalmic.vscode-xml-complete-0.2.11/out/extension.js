"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.schemaId = exports.languageId = void 0;
const vscode = require("vscode");
const types_1 = require("./types");
const linterprovider_1 = require("./linterprovider");
const completionitemprovider_1 = require("./completionitemprovider");
const formatprovider_1 = require("./formatprovider");
const rangeformatprovider_1 = require("./rangeformatprovider");
const autocompletionprovider_1 = require("./autocompletionprovider");
const hoverprovider_1 = require("./hoverprovider");
const definitionprovider_1 = require("./definitionprovider");
const definitioncontentprovider_1 = require("./definitioncontentprovider");
exports.languageId = 'xml';
exports.schemaId = 'xml2xsd-definition-provider';
function activate(context) {
    vscode.workspace.onDidChangeConfiguration(loadConfiguration, undefined, context.subscriptions);
    loadConfiguration();
    const schemaPropertiesArray = new types_1.XmlSchemaPropertiesArray();
    let completionitemprovider = vscode.languages.registerCompletionItemProvider({ language: exports.languageId, scheme: 'file' }, new completionitemprovider_1.default(context, schemaPropertiesArray));
    let formatprovider = vscode.languages.registerDocumentFormattingEditProvider({ language: exports.languageId, scheme: 'file' }, new formatprovider_1.default(context, schemaPropertiesArray));
    let rangeformatprovider = vscode.languages.registerDocumentRangeFormattingEditProvider({ language: exports.languageId, scheme: 'file' }, new rangeformatprovider_1.default(context, schemaPropertiesArray));
    let hoverprovider = vscode.languages.registerHoverProvider({ language: exports.languageId, scheme: 'file' }, new hoverprovider_1.default(context, schemaPropertiesArray));
    let definitionprovider = vscode.languages.registerDefinitionProvider({ language: exports.languageId, scheme: 'file' }, new definitionprovider_1.default(context, schemaPropertiesArray));
    let linterprovider = new linterprovider_1.default(context, schemaPropertiesArray);
    let autocompletionprovider = new autocompletionprovider_1.default(context, schemaPropertiesArray);
    let definitioncontentprovider = vscode.workspace.registerTextDocumentContentProvider(exports.schemaId, new definitioncontentprovider_1.default(context, schemaPropertiesArray));
    context.subscriptions.push(completionitemprovider, formatprovider, rangeformatprovider, hoverprovider, definitionprovider, linterprovider, autocompletionprovider, definitioncontentprovider);
}
exports.activate = activate;
function loadConfiguration() {
    const section = vscode.workspace.getConfiguration('xmlComplete', null);
    exports.globalSettings = new types_1.XmlCompleteSettings();
    exports.globalSettings.schemaMapping = section.get('schemaMapping', []);
    exports.globalSettings.formattingStyle = section.get('formattingStyle', "singleLineAttributes");
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map