import { Message, StoryNode, Option } from "./StoryNode.js";




const parseTree = () :  Object => {
    const root = document.getElementById("Container") as HTMLDivElement;
    const storyNodes : NodeListOf<HTMLDivElement> = root.querySelectorAll(".story-node");
    let story : StoryNode[] = [];

    storyNodes.forEach(el => {
        const sn = new StoryNode(el.id);

        const messages : NodeListOf<HTMLDivElement> = el.querySelectorAll(".textbox");
        let msgArr : Message[] = [];
        messages.forEach(msg => {
            const content = msg.querySelector(".msg-content") as HTMLTextAreaElement;
            const delay = msg.querySelector(".msg-delay") as HTMLInputElement;
            const sender = msg.querySelector(".msg-sender") as HTMLSelectElement;
            const m = new Message(content.value, parseFloat(delay.value), sender.value);
            msgArr.push(m);            
        });

        const options : NodeListOf<HTMLDivElement> = el.querySelectorAll(".option");
        let optArr : Option[] = [];        
        options.forEach(opt => {
            const optionText = opt.querySelector(".option-text") as HTMLTextAreaElement;
            const goTo = opt.querySelector(".goto-val") as HTMLTextAreaElement;
            const o = new Option(optionText.value, goTo.value);
            optArr.push(o);
        });

        sn.Messages = msgArr;
        sn.Options = optArr;
        story.push(sn);
    })

    const finalOutput = {"Nodes": story};
    
    return finalOutput;
}


export {parseTree};