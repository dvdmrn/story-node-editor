class Message {
    Content: string;
    Delay: number;
    Sender: string;

    constructor(content : string, delay : number, sender : string) {
        this.Content = content;
        this.Delay = delay;
        this.Sender = sender;
    }
}

class Option {
    OptionText : string;
    GoTo : string;

    constructor(optionText : string, goTo: string){
        this.OptionText = optionText;
        this.GoTo = goTo;
    }
}

class StoryNode {
    Id: string;
    Messages: Message[];
    Options: Option[];

    constructor(){
        this.Id = "ass";
        this.Messages = [];
        this.Options = [];
    }
}


export { StoryNode, Message, Option };