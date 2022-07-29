import { Message, StoryNode, Option } from "./StoryNode.js";
const parseTree = () => {
    const root = document.getElementById("Container");
    const storyNodes = root.querySelectorAll(".story-node");
    let story = [];
    storyNodes.forEach(el => {
        const sn = new StoryNode(el.id);
        const messages = el.querySelectorAll(".textbox");
        let msgArr = [];
        messages.forEach(msg => {
            const content = msg.querySelector(".msg-content");
            const delay = msg.querySelector(".msg-delay");
            const sender = msg.querySelector(".msg-sender");
            const m = new Message(content.value, parseFloat(delay.value), sender.value);
            msgArr.push(m);
        });
        const options = el.querySelectorAll(".option");
        let optArr = [];
        options.forEach(opt => {
            const optionText = opt.querySelector(".option-text");
            const goTo = opt.querySelector(".goto-val");
            const o = new Option(optionText.value, goTo.value);
            optArr.push(o);
        });
        sn.Messages = msgArr;
        sn.Options = optArr;
        story.push(sn);
    });
    const finalOutput = { "Nodes": story };
    return finalOutput;
};
export { parseTree };
