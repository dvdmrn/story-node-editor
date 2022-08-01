var _a;
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
    const senderDropdown = dialogue.querySelector(".msg-sender");
    const textAreaRef = dialogue.querySelector(".msg-content");
    if (senderDropdown.value == "!DELAY")
        textAreaRef.disabled = true;
    senderDropdown.addEventListener("change", e => {
        const source = e.target;
        if (source.value == "!DELAY") {
            textAreaRef.disabled = true;
        }
        else {
            textAreaRef.disabled = false;
        }
    });
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
    if (jsonString === null)
        return;
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
const download = (filename, content) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
// connect to listeners -------------------------------
idField === null || idField === void 0 ? void 0 : idField.addEventListener('input', bubbleUpId);
const addStoryNodeButton = document.getElementById("new-story-node");
addStoryNodeButton.onclick = addSN;
const downloadJson = document.getElementById("download-json");
downloadJson.onclick = () => { download("dialogue.json", JSON.stringify(parseTree())); };
// const uploadButton =  document.getElementById("file-upload") as HTMLButtonElement;
(_a = document.getElementById("file-upload")) === null || _a === void 0 ? void 0 : _a.addEventListener('change', e => { readFile(e, (x) => renderStoryFile(x)); }, false);
const clearPageButton = document.getElementById("clear-page");
clearPageButton.onclick = () => {
    const choice = confirm("really clear the screen? All nodes will be lost!");
    choice && clearScreen();
};
// autosave
// goal: each event resets a timer. When timeout happens, we autosave to localStorage
const saveState = () => {
    console.log("state saved!");
    localStorage.setItem("save-state", JSON.stringify(parseTree()));
};
let saveTimeout = window.setTimeout(saveState, 1000);
const resetTimeout = () => {
    window.clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(saveState, 1000);
};
const getSender = (sender) => {
    console.log(sender.value);
    return sender.value;
    // TODO:
    // grey the textbox when sender == !DELAY
};
window.addEventListener("keydown", e => {
    resetTimeout();
});
window.onclick = resetTimeout;
window.onload = () => renderStoryFile(localStorage.getItem("save-state"));
