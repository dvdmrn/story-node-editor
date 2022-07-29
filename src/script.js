var _a, _b;
import { StoryNode } from "./StoryNode.js";
import * as Component from "./Components.js";
import { parseTree } from "./ParseStoryNodes.js";
import { readFile } from "./Upload.js";
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
const drawLine = (startElement, endElement) => {
    var _a;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add("svg-line");
    svg.id = "connecting-line";
    svg.style.height = document.getElementById("Container").clientHeight.toString() + "px";
    svg.style.width = document.getElementById("Container").clientWidth.toString() + "px";
    // 
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('id', 'line2');
    newLine.setAttribute('x1', (startElement.getBoundingClientRect().x + startElement.offsetWidth + window.scrollX).toString());
    newLine.setAttribute('y1', (startElement.getBoundingClientRect().y + startElement.offsetHeight / 2 + window.scrollY).toString());
    newLine.setAttribute('x2', (endElement.getBoundingClientRect().left + window.scrollX + endElement.offsetWidth / 2).toString());
    newLine.setAttribute('y2', (endElement.getBoundingClientRect().top + window.scrollY).toString());
    newLine.setAttribute("stroke", "#ffbbff");
    newLine.setAttribute("opacity", "0.9");
    newLine.setAttribute("stroke-width", "2px");
    svg.append(newLine);
    (_a = document.getElementById("Container")) === null || _a === void 0 ? void 0 : _a.appendChild(svg);
};
function setStoryNodeHash(id) {
    const textField = document.getElementById(id);
    textField.value = "@" + storynodeIdHash();
}
const connectRemoveButton = (parent) => {
    let removeMsgBtn = parent.querySelector(".remove-property");
    removeMsgBtn.onclick = e => removeField(e);
};
const addDialogue = (root, sender, text, delay) => {
    const dialogue = Component.TextBox(sender, text, delay);
    connectRemoveButton(dialogue);
    root.appendChild(dialogue);
};
const removeField = (e) => {
    var _a;
    const button = e.target;
    const field = button.parentNode;
    (_a = field.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(field);
};
const addSN = () => {
    var _a;
    (_a = document.getElementById("Container")) === null || _a === void 0 ? void 0 : _a.appendChild(ConstructStoryNode(new StoryNode("")));
};
const gotoLink = (e) => {
    const source = e.target;
    const targetIdInput = source.querySelector(".goto-val");
    const targetId = targetIdInput === null || targetIdInput === void 0 ? void 0 : targetIdInput.value;
    const target = document.getElementById(targetId);
    if (target === null)
        return;
    console.log(`found target: ${target}`);
    drawLine(source, target);
};
const addOption = (root, optionText, goto) => {
    const option = Component.OptionBox(optionText, goto);
    connectRemoveButton(option);
    root.appendChild(option);
    option.onmouseenter = e => {
        const line = document.getElementById("connecting-line");
        if (line != undefined) {
            line.outerHTML = "";
        }
        gotoLink(e);
    };
    const gotoText = option.querySelector(".goto-val");
    gotoText.addEventListener("input", () => aestheticValidation(gotoText, gotoText.value));
    // option.onmouseleave = () => {
    //     const line = document.getElementById("connecting-line");
    //     if(line != undefined){
    //         line.outerHTML = "";
    //     }};
};
const aestheticValidation = (source, target) => {
    const targetElement = document.getElementById(target);
    if (targetElement === null) {
        source.classList.add("invalid-field");
    }
    else {
        source.classList.remove("invalid-field");
    }
};
const removeSN = (sn) => {
    var _a;
    if (confirm("really remove story node?")) {
        (_a = document.getElementById("Container")) === null || _a === void 0 ? void 0 : _a.removeChild(sn);
    }
    else {
        alert("ok not removed :)");
    }
};
const idField = document.getElementById("sn-id");
const bubbleUpId = (e) => {
    const target = e.target;
    const storyNode = target.parentElement;
    storyNode.id = target.value;
    return (target.value);
};
const clearScreen = () => {
    document.getElementById("Container").innerHTML = "";
};
const ConstructStoryNode = (node) => {
    const storyNode = Component.SN();
    const randomId = storynodeIdHash();
    storyNode.id = node.Id.length > 0 ? node.Id : randomId;
    const idField = storyNode.querySelector("#sn-id");
    idField.value = storyNode.id;
    idField.addEventListener('input', bubbleUpId);
    const messages = storyNode.querySelector("#sn-messages");
    node.Messages.forEach(msg => {
        addDialogue(messages, msg.Sender, msg.Content, msg.Delay);
    });
    const options = storyNode.querySelector("#sn-options");
    node.Options.forEach(option => {
        addOption(options, option.OptionText, option.GoTo);
    });
    const addDiaBtn = storyNode.querySelector("#sn-add-dialogue");
    addDiaBtn.onclick = () => addDialogue(messages, "Self", "", 0);
    const addOptionBtn = storyNode.querySelector("#sn-add-option");
    addOptionBtn.onclick = () => addOption(options, "!DEFAULT", "node_id");
    const removeSNbtn = storyNode.querySelector(".remove-node");
    removeSNbtn.onclick = () => removeSN(storyNode);
    return storyNode;
};
const renderStoryFile = (jsonString) => {
    clearScreen();
    try {
        const nodes = JSON.parse(jsonString).Nodes;
        const container = document.getElementById("Container");
        nodes.forEach(sn => {
            container.appendChild(ConstructStoryNode(sn));
        });
        ;
    }
    catch (error) {
        alert(`Invalid story node structure!\nError: ${error}`);
    }
};
// connect to listeners -------------------------------
idField === null || idField === void 0 ? void 0 : idField.addEventListener('input', bubbleUpId);
// const addDiaButton = document.getElementById("add-dialogue") as HTMLButtonElement;
// addDiaButton.onclick = () => addDialogue(document.getElementById("sn-dialogue") as HTMLDivElement);
// const removeButton =  document.getElementById("sn-remove-button") as HTMLButtonElement;
// removeButton.onclick = e => removeField(e);
const addStoryNodeButton = document.getElementById("new-story-node");
addStoryNodeButton.onclick = addSN;
const downloadJson = document.getElementById("download-json");
downloadJson.onclick = parseTree;
const uploadButton = document.getElementById("file-upload");
(_a = document.getElementById("file-upload")) === null || _a === void 0 ? void 0 : _a.addEventListener('change', e => { readFile(e, (x) => renderStoryFile(x)); }, false);
// testing story node construction from json -------------
const test = JSON.parse(`{
    "Id": "test-target",
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
(_b = document.getElementById("Container")) === null || _b === void 0 ? void 0 : _b.appendChild(ConstructStoryNode(test));
// json obj
const nodes = [new StoryNode(""), new StoryNode("")];
console.log(JSON.stringify(nodes));
/* -------- testing line drawing -------------- */
const tgt = document.getElementById("test-target");
console.log(tgt === null || tgt === void 0 ? void 0 : tgt.getBoundingClientRect());
const source = document.getElementById("sn-option-1");
// the problem: SVG size is too smol?
