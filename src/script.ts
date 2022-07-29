import { StoryNode, Message, Option } from "./StoryNode.js";
import * as Component from "./Components.js";
import { parseTree } from "./ParseStoryNodes.js";
import { readFile } from "./Upload.js";

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


const drawLine = (startElement : HTMLDivElement, endElement : HTMLDivElement) : void => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add("svg-line");
    svg.id = "connecting-line";

    svg.style.height = document.getElementById("Container")!.clientHeight.toString()+"px";
    svg.style.width = document.getElementById("Container")!.clientWidth.toString()+"px";
   
    // 
    const newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id','line2');
    newLine.setAttribute('x1',(startElement.getBoundingClientRect().x + startElement.offsetWidth + window.scrollX).toString());
    newLine.setAttribute('y1',(startElement.getBoundingClientRect().y + startElement.offsetHeight / 2 + window.scrollY).toString());
    newLine.setAttribute('x2',(endElement.getBoundingClientRect().left + window.scrollX + endElement.offsetWidth / 2).toString());
    newLine.setAttribute('y2',(endElement.getBoundingClientRect().top + window.scrollY).toString());
    newLine.setAttribute("stroke", "#ffbbff");
    newLine.setAttribute("opacity", "0.9");
    newLine.setAttribute("stroke-width", "2px");
    svg.append(newLine);
    document.getElementById("Container")?.appendChild(svg);
}

function setStoryNodeHash(id: string) : void{
    const textField : HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    textField.value = "@"+storynodeIdHash();

}

const connectRemoveButton = (parent : HTMLDivElement) : void => {
    let removeMsgBtn = parent.querySelector(".remove-property") as HTMLButtonElement;
    removeMsgBtn.onclick = e => removeField(e);
}

const addDialogue = (root : HTMLDivElement, sender : string, text : string, delay : number) : void => {
    const dialogue = Component.TextBox(sender, text, delay) as HTMLDivElement;
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

const gotoLink = (e : Event) : void => {
    const source : HTMLDivElement = e.target as HTMLDivElement;
    const targetIdInput : HTMLInputElement = source.querySelector(".goto-val") as HTMLInputElement;
    const targetId : string = targetIdInput?.value;
    const target : HTMLDivElement = document.getElementById(targetId) as HTMLDivElement;
    if(target===null) return;
    console.log(`found target: ${target}`);
    drawLine(source, target);
}

const addOption = (root : HTMLDivElement, optionText : string, goto : string) : void => {
    const option =  Component.OptionBox(optionText, goto) as HTMLDivElement;
    connectRemoveButton(option);
    root.appendChild(option);
    option.onmouseenter = e => {
        const line = document.getElementById("connecting-line");
        if(line != undefined){
            line.outerHTML = "";
        }
        gotoLink(e)
    };

    const gotoText = option.querySelector(".goto-val") as HTMLInputElement;
    gotoText.addEventListener("input", () => aestheticValidation(gotoText, gotoText.value));
    // option.onmouseleave = () => {
    //     const line = document.getElementById("connecting-line");
    //     if(line != undefined){
    //         line.outerHTML = "";
    //     }};
}

const aestheticValidation = (source : HTMLInputElement, target : string) => {
    const targetElement = document.getElementById(target);
    if(targetElement === null){
        source.classList.add("invalid-field")
    }
    else{
        source.classList.remove("invalid-field");
    }
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
        addDialogue(messages, msg.Sender, msg.Content, msg.Delay)
    });

    const options = storyNode.querySelector("#sn-options") as HTMLDivElement;
    node.Options.forEach(option => {
        addOption(options, option.OptionText, option.GoTo);        
    })
    

    const addDiaBtn = storyNode.querySelector("#sn-add-dialogue") as HTMLButtonElement;
    addDiaBtn.onclick = () => addDialogue(messages, "Self", "", 0);

    const addOptionBtn = storyNode.querySelector("#sn-add-option") as HTMLButtonElement;
    addOptionBtn.onclick = () => addOption(options, "!DEFAULT", "node_id");

    const removeSNbtn = storyNode.querySelector(".remove-node") as HTMLButtonElement;
    removeSNbtn.onclick = () => removeSN(storyNode);
    return storyNode;
}


const renderStoryFile = (jsonString : string | null) => {
    clearScreen();
    if(jsonString === null) return;
    
    try {
        const nodes : StoryNode[] = JSON.parse(jsonString).Nodes as StoryNode[];
        const container = document.getElementById("Container") as HTMLDivElement;
        nodes.forEach(sn => {
            container.appendChild(ConstructStoryNode(sn))
        });;
        
    } catch (error) {   
        alert(`Invalid story node structure!\nError: ${error}`);
    }
}


const download = (filename : string, content : string) =>{
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
// connect to listeners -------------------------------
idField?.addEventListener('input', bubbleUpId);

const addStoryNodeButton = document.getElementById("new-story-node") as HTMLButtonElement;
addStoryNodeButton.onclick = addSN;

const downloadJson = document.getElementById("download-json") as HTMLButtonElement;
downloadJson.onclick =  ()=>{download("dialogue.json",JSON.stringify(parseTree()))};

// const uploadButton =  document.getElementById("file-upload") as HTMLButtonElement;
document.getElementById("file-upload")?.addEventListener('change', 
                                                         e=>{readFile(e,(x : string)=>renderStoryFile(x))}, 
                                                         false)

const clearPageButton = document.getElementById("clear-page") as HTMLButtonElement;
clearPageButton.onclick = ()=>{
    const choice = confirm("really clear the screen? All nodes will be lost!")
    choice && clearScreen();
};

// autosave
// goal: each event resets a timer. When timeout happens, we autosave to localStorage
const saveState = () : void => {
    console.log("state saved!");
    localStorage.setItem("save-state", JSON.stringify(parseTree()));
}

let saveTimeout = window.setTimeout(saveState, 1000);

const resetTimeout = () => {
    window.clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(saveState, 1000);
}


window.addEventListener("keydown", e=>{
    resetTimeout();
})

window.onclick = resetTimeout;

window.onload = () => renderStoryFile(localStorage.getItem("save-state"));