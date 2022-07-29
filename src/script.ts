import { StoryNode, Message, Option } from "./StoryNode.js";
import * as Component from "./Components.js";
import { parseTree } from "./ParseStoryNodes.js";
import { readFile } from "./Upload.js";

const worl = 'hi';
const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function storynodeIdHash() : string {
    const hashLength = 5;
    const ancLen = alphanumericChars.length;

    let hash = "";
    for (let i = 0; i < hashLength; i++) {
        hash += alphanumericChars[Math.floor(Math.random() * ancLen)]
    }
    return hash;
}

function setStoryNodeHash(id: string) : void{
    const textField : HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    textField.value = "@"+storynodeIdHash();

}

const connectRemoveButton = (parent : HTMLDivElement) : void => {
    let removeMsgBtn = parent.querySelector(".remove-property") as HTMLButtonElement;
    removeMsgBtn.onclick = e => removeField(e);
}

const addDialogue = (root : HTMLDivElement) : void => {
    const dialogue = Component.TextBox("Ina", "", 0) as HTMLDivElement;
    connectRemoveButton(dialogue);    
    root.appendChild(dialogue);
}

const removeField = (e: Event) : void => {
    const button = e.target as HTMLButtonElement;
    const field = button.parentNode as HTMLDivElement;
    field.parentNode?.removeChild(field);
}

const addSN = () : void => {
    document.getElementById("Container")?.appendChild(ConstructStoryNode(new StoryNode("")));
}

const addOption = (root : HTMLDivElement) : void => {
    const option =  Component.OptionBox("!DEFAULT", "Node_ID") as HTMLDivElement;
    connectRemoveButton(option);
    root.appendChild(option);

}


const removeSN = (sn : HTMLDivElement) : void => {
    if(confirm("really remove story node?")){
        document.getElementById("Container")?.removeChild(sn);
    }else{
        alert("ok not removed :)")
    }
}
const idField = document.getElementById("sn-id");

const bubbleUpId = (e : Event) : string =>{
    const target : HTMLInputElement = e.target as HTMLInputElement;
    const storyNode : HTMLDivElement = target.parentElement as HTMLDivElement;
    storyNode.id = target.value;
    return(target.value);
}

const clearScreen = () : void =>{
    document.getElementById("Container")!.innerHTML = "";
}

const ConstructStoryNode = (node : StoryNode) : Node => {

    const storyNode = Component.SN() as HTMLDivElement;
    const randomId : string = storynodeIdHash();

    storyNode.id = node.Id.length > 0? node.Id : randomId;
    const idField = storyNode.querySelector("#sn-id") as HTMLInputElement;
    idField.value = storyNode.id;
    idField.addEventListener('input', bubbleUpId);
    
    const messages = storyNode.querySelector("#sn-messages") as HTMLDivElement;
    node.Messages.forEach(msg => {
        let message = Component.TextBox(msg.Sender, msg.Content, msg.Delay) as HTMLDivElement;
        connectRemoveButton(message);

        messages.appendChild(message);
    });

    const options = storyNode.querySelector("#sn-options") as HTMLDivElement;
    node.Options.forEach(option => {
        let opt = Component.OptionBox(option.OptionText, option.GoTo) as HTMLDivElement;
        connectRemoveButton(opt);
        options.appendChild(opt);
    })
    

    const addDiaBtn = storyNode.querySelector("#sn-add-dialogue") as HTMLButtonElement;
    addDiaBtn.onclick = () => addDialogue(messages);

    const addOptionBtn = storyNode.querySelector("#sn-add-option") as HTMLButtonElement;
    addOptionBtn.onclick = () => addOption(options);

    const removeSNbtn = storyNode.querySelector(".remove-node") as HTMLButtonElement;
    removeSNbtn.onclick = () => removeSN(storyNode);
    return storyNode;
}


const renderStoryFile = (jsonString : string) => {
    clearScreen();
    const story : StoryNode[] = JSON.parse(jsonString).Nodes as StoryNode[];
    const container = document.getElementById("Container") as HTMLDivElement;
    story.forEach(sn => {
        container.appendChild(ConstructStoryNode(sn))
    });;
}

// connect to listeners -------------------------------
idField?.addEventListener('input', bubbleUpId);

// const addDiaButton = document.getElementById("add-dialogue") as HTMLButtonElement;
// addDiaButton.onclick = () => addDialogue(document.getElementById("sn-dialogue") as HTMLDivElement);

// const removeButton =  document.getElementById("sn-remove-button") as HTMLButtonElement;
// removeButton.onclick = e => removeField(e);

const addStoryNodeButton = document.getElementById("new-story-node") as HTMLButtonElement;
addStoryNodeButton.onclick = addSN;

const downloadJson = document.getElementById("download-json") as HTMLButtonElement;
downloadJson.onclick =  parseTree;

const uploadButton =  document.getElementById("file-upload") as HTMLButtonElement;
document.getElementById("file-upload")?.addEventListener('change', 
                                                         e=>{readFile(e,(x : string)=>renderStoryFile(x))}, 
                                                         false)
// testing story node construction from json -------------

const test : StoryNode = JSON.parse(`{
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
}`) as StoryNode;

document.getElementById("Container")?.appendChild(ConstructStoryNode(test));
// json obj

const nodes : StoryNode[] = [new StoryNode(""), new StoryNode("")];
console.log(JSON.stringify(nodes));












/* -------- testing line drawing -------------- */
const tgt = document.getElementById("test-target") as HTMLDivElement;

console.log(tgt?.getBoundingClientRect())
const source = document.getElementById("sn-option-1") as HTMLDivElement;

// the problem: SVG size is too smol?

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.classList.add("svg-line")

const newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
newLine.setAttribute('id','line2');
newLine.setAttribute('x1',(source.getBoundingClientRect().x + source.offsetWidth).toString());
newLine.setAttribute('y1',(source.getBoundingClientRect().y + source.offsetHeight / 2).toString());
newLine.setAttribute('x2',(tgt.getBoundingClientRect().left + window.scrollX + tgt.offsetWidth / 2).toString());
newLine.setAttribute('y2',(tgt.getBoundingClientRect().top + window.scrollY).toString());
newLine.setAttribute("stroke", "#ff0000")
newLine.setAttribute("opacity", "0.5")
svg.append(newLine);
document.getElementById("Container")?.appendChild(svg);