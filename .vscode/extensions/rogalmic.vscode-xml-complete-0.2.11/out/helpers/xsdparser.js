"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
class XsdParser {
    static getSchemaTagsAndAttributes(xsdContent, xsdUri) {
        const sax = require("sax");
        const parser = sax.parser(true);
        let getCompletionString = (name, comment) => new types_1.CompletionString(name, comment, xsdUri, parser.line, parser.column);
        return new Promise((resolve) => {
            let result = new types_1.XmlTagCollection();
            let xmlDepthPath = [];
            parser.onopentag = (tagData) => {
                xmlDepthPath.push({
                    tag: tagData.name,
                    resultTagName: tagData.attributes["name"]
                });
                if (tagData.name.endsWith(":schema")) {
                    Object.keys(tagData.attributes).forEach((k) => {
                        if (k.startsWith("xmlns:")) {
                            result.setNsMap(k.substring("xmlns:".length), tagData.attributes[k]);
                        }
                    });
                }
                if (tagData.name.endsWith(":element") && tagData.attributes["name"] !== undefined) {
                    result.push({
                        tag: getCompletionString(tagData.attributes["name"]),
                        base: [tagData.attributes["type"]],
                        attributes: [],
                        visible: true
                    });
                }
                if (tagData.name.endsWith(":complexType") && tagData.attributes["name"] !== undefined) {
                    result.push({
                        tag: getCompletionString(tagData.attributes["name"]),
                        base: [],
                        attributes: [],
                        visible: false
                    });
                }
                if (tagData.name.endsWith(":attributeGroup") && tagData.attributes["name"] !== undefined) {
                    result.push({
                        tag: getCompletionString(tagData.attributes["name"]),
                        base: [],
                        attributes: [],
                        visible: false
                    });
                }
                if (tagData.name.endsWith(":attribute") && tagData.attributes["name"] !== undefined) {
                    let currentResultTag = xmlDepthPath
                        .slice()
                        .reverse()
                        .filter(e => e.resultTagName !== undefined)[1];
                    result
                        .filter(e => currentResultTag && e.tag.name === currentResultTag.resultTagName)
                        .forEach(e => e.attributes.push(getCompletionString(tagData.attributes["name"])));
                }
                if (tagData.name.endsWith(":extension") && tagData.attributes["base"] !== undefined) {
                    let currentResultTag = xmlDepthPath
                        .slice()
                        .reverse()
                        .filter(e => e.resultTagName !== undefined)[0];
                    result
                        .filter(e => currentResultTag && e.tag.name === currentResultTag.resultTagName)
                        .forEach(e => e.base.push(tagData.attributes["base"]));
                }
                if (tagData.name.endsWith(":attributeGroup") && tagData.attributes["ref"] !== undefined) {
                    let currentResultTag = xmlDepthPath
                        .slice()
                        .reverse()
                        .filter(e => e.resultTagName !== undefined)[0];
                    result
                        .filter(e => currentResultTag && e.tag.name === currentResultTag.resultTagName)
                        .forEach(e => e.base.push(tagData.attributes["ref"]));
                }
                if (tagData.name.endsWith(":import") && tagData.attributes["schemaLocation"] !== undefined) {
                }
            };
            parser.onclosetag = (name) => {
                let popped = xmlDepthPath.pop();
                if (popped !== undefined && popped.tag !== name) {
                    console.warn("XSD open/close tag consistency error.");
                }
            };
            parser.ontext = (t) => {
                if (/\S/.test(t)) {
                    let stack = xmlDepthPath
                        .slice()
                        .reverse();
                    if (!stack.find(e => e.tag.endsWith(":documentation"))) {
                        return;
                    }
                    let currentCommentTargets = stack.filter(e => e && e.resultTagName !== undefined);
                    let currentCommentTarget = currentCommentTargets[0];
                    if (!currentCommentTarget) {
                        return;
                    }
                    if (currentCommentTarget.tag.endsWith(":element")) {
                        result
                            .filter(e => currentCommentTarget && e.tag.name === currentCommentTarget.resultTagName)
                            .forEach(e => e.tag.comment = t.trim());
                    }
                    else if (currentCommentTarget.tag.endsWith(":attribute")) {
                        let currentCommentTargetTag = currentCommentTargets[1];
                        result
                            .filter(e => currentCommentTargetTag && e.tag.name === currentCommentTargetTag.resultTagName)
                            .map(e => e.attributes)
                            .reduce((prev, next) => prev.concat(next), [])
                            .filter(e => currentCommentTarget && e.name === currentCommentTarget.resultTagName)
                            .forEach(e => e.comment = t.trim());
                    }
                }
            };
            parser.onend = () => {
                if (xmlDepthPath.length !== 0) {
                    console.warn("XSD open/close tag consistency error (end).");
                }
                resolve(result);
            };
            parser.write(xsdContent).close();
        });
    }
}
exports.default = XsdParser;
//# sourceMappingURL=xsdparser.js.map