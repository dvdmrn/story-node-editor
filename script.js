var _a;
import { StoryNode } from "./StoryNode.js";
import * as Component from "./Components.js";
const worl = 'hi';
const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function storynodeIdHash() {
    const hashLength = 5;
    const ancLen = alphanumericChars.length;
    let hash = "";
    for (let i = 0; i < hashLength; i++) {
        hash += alphanumericChars[Math.floor(Math.random() * ancLen)];
    }
    return hash;
}
function setStoryNodeHash(id) {
    const textField = document.getElementById(id);
    textField.value = "@" + storynodeIdHash();
}
function ConstructStoryNode(node) {
    let el = document.createElement('div');
    el.className = "story-node";
    let messagesHtmlString = "";
    node.Messages.forEach(msg => {
        messagesHtmlString += Component.TextBox(msg.Sender, msg.Content, msg.Delay);
    });
    let optionsHtmlString = "";
    node.Options.forEach(option => {
        optionsHtmlString += Component.OptionBox(option.OptionText, option.GoTo);
    });
    el.innerHTML = Component.SN(storynodeIdHash(), messagesHtmlString, optionsHtmlString);
    return el;
}
const test = JSON.parse(`{
    "Id": "SN1",
    "Messages": [{
        "Content": "mvp",
        "Delay": 0,
        "Sender": "Self"
    }],
    "Options": [{
        "OptionText": "!DEFAULT",
        "GoTo": "XYZ"
    }]
}`);
console.log(test.Id);
(_a = document.getElementById("Container")) === null || _a === void 0 ? void 0 : _a.appendChild(ConstructStoryNode(test));
// json obj
const nodes = [new StoryNode(), new StoryNode()];
console.log(JSON.stringify(nodes));
