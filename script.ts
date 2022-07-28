import { StoryNode, Message, Option } from "./StoryNode.js";
import * as Component from "./Components.js";

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

function ConstructStoryNode(node : StoryNode) : Node {
    let el = document.createElement('div');
    el.className = "story-node";
    
    let messagesHtmlString : string = "";
    node.Messages.forEach(msg => {
        messagesHtmlString += Component.TextBox(msg.Sender, msg.Content, msg.Delay);
    });

    let optionsHtmlString : string = "";
    node.Options.forEach(option => {
        optionsHtmlString += Component.OptionBox(option.OptionText, option.GoTo);
    })
    el.innerHTML = Component.SN(storynodeIdHash(), messagesHtmlString, optionsHtmlString);
    
    return el;
}


const test : StoryNode = JSON.parse(`{
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


document.getElementById("Container")?.appendChild(ConstructStoryNode(test));
// json obj

const nodes : StoryNode[] = [new StoryNode(), new StoryNode()];
console.log(JSON.stringify(nodes));