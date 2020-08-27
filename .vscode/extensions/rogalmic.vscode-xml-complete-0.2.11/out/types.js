"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlScope = exports.XmlDiagnosticData = exports.XmlSchemaPropertiesArray = exports.XmlSchemaProperties = exports.XmlTagCollection = exports.XmlTag = exports.CompletionString = exports.XmlCompleteSettings = void 0;
class XmlCompleteSettings {
}
exports.XmlCompleteSettings = XmlCompleteSettings;
class CompletionString {
    constructor(name, comment, definitionUri, definitionLine, definitionColumn) {
        this.name = name;
        this.comment = comment;
        this.definitionUri = definitionUri;
        this.definitionLine = definitionLine;
        this.definitionColumn = definitionColumn;
    }
}
exports.CompletionString = CompletionString;
class XmlTag {
}
exports.XmlTag = XmlTag;
class XmlTagCollection extends Array {
    constructor() {
        super(...arguments);
        this.nsMap = new Map();
    }
    setNsMap(xsdNsTag, xsdNsStr) {
        this.nsMap.set(xsdNsTag, xsdNsStr);
    }
    loadAttributesEx(tagName, localXmlMapping) {
        let result = [];
        if (tagName !== undefined) {
            let fixedNames = this.fixNsReverse(tagName, localXmlMapping);
            fixedNames.forEach(fixn => {
                result.push(...this.loadAttributes(fixn));
            });
        }
        return result;
    }
    loadTagEx(tagName, localXmlMapping) {
        let result = undefined;
        if (tagName !== undefined) {
            let fixedNames = this.fixNsReverse(tagName, localXmlMapping);
            let element = this.find(e => fixedNames.includes(e.tag.name));
            if (element !== undefined) {
                return element.tag;
            }
        }
        return result;
    }
    loadAttributes(tagName, handledNames = []) {
        let tagNameCompare = (a, b) => a === b || a === b.substring(b.indexOf(":") + 1);
        let result = [];
        if (tagName !== undefined) {
            handledNames.push(tagName);
            let currentTags = this.filter(e => tagNameCompare(e.tag.name, tagName));
            if (currentTags.length > 0) {
                result.push(...currentTags.map(e => e.attributes).reduce((prev, next) => prev.concat(next), []));
                currentTags.forEach(e => {
                    e.base.filter(b => !handledNames.includes(b))
                        .forEach(b => result.push(...this.loadAttributes(b)));
                });
            }
        }
        return result;
    }
    fixNs(xsdString, localXmlMapping) {
        let arr = xsdString.name.split(":");
        if (arr.length === 2 && this.nsMap.has(arr[0]) && localXmlMapping.has(this.nsMap[arr[0]])) {
            return new CompletionString(localXmlMapping[this.nsMap[arr[0]]] + ":" + arr[1], xsdString.comment, xsdString.definitionUri, xsdString.definitionLine, xsdString.definitionColumn);
        }
        return xsdString;
    }
    fixNsReverse(xmlString, localXmlMapping) {
        let arr = xmlString.split(":");
        let xmlStrings = new Array();
        localXmlMapping.forEach((v, k) => {
            if (v === arr[0]) {
                this.nsMap.forEach((v2, k2) => {
                    if (v2 == k) {
                        xmlStrings.push(k2 + ":" + arr[1]);
                    }
                });
            }
        });
        xmlStrings.push(arr[arr.length - 1]);
        return xmlStrings;
    }
}
exports.XmlTagCollection = XmlTagCollection;
class XmlSchemaProperties {
}
exports.XmlSchemaProperties = XmlSchemaProperties;
class XmlSchemaPropertiesArray extends Array {
    filterUris(uris) {
        return this.filter(e => uris
            .find(u => u.toString() === e.schemaUri.toString()) !== undefined);
    }
}
exports.XmlSchemaPropertiesArray = XmlSchemaPropertiesArray;
class XmlDiagnosticData {
}
exports.XmlDiagnosticData = XmlDiagnosticData;
class XmlScope {
}
exports.XmlScope = XmlScope;
//# sourceMappingURL=types.js.map