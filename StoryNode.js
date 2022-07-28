class Message {
    constructor(content, delay, sender) {
        this.Content = content;
        this.Delay = delay;
        this.Sender = sender;
    }
}
class Option {
    constructor(optionText, goTo) {
        this.OptionText = optionText;
        this.GoTo = goTo;
    }
}
class StoryNode {
    constructor() {
        this.Id = "ass";
        this.Messages = [];
        this.Options = [];
    }
}
export { StoryNode, Message, Option };
