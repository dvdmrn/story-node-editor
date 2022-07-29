const TextBox = (sender, dialogue, delay) => {
    const textBoxDiv = document.createElement("div");
    textBoxDiv.classList.add("textbox");
    textBoxDiv.innerHTML = `Sender:
                           <div class="remove-property remove-message">+</div>
                           <select class="msg-sender">
                               <option value="Self" ${sender == "Self" ? "selected" : ""}>Self</option>
                               <option value="Ina" ${sender == "Ina" ? "selected" : ""}>Ina</option>
                           </select>
                           delay: <input class="num-input msg-delay" type="number" min="0" max="99" style="width:3em" step="0.5" value=${delay}></input>s <br>
                           dialogue: <br><textarea class="msg-content" rows=2 cols=37>${dialogue}</textarea>
                           <span style="text-align:right">
                           <br>
                           </span>
                           `;
    return textBoxDiv;
};
const OptionBox = (option, goto) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.innerHTML = `<div class="remove-property">+</div>option text:<input type="text" class="option-text" value="${option}"></input><br>
                           go to: <input type="text" class="goto-val" value="${goto}"></input>`;
    return optionDiv;
};
const SN = () => {
    const sn = document.createElement("div");
    sn.classList.add("story-node");
    sn.innerHTML = `<div class="remove-node">+</div>
                    Story Node<br>
                    id: <input type="text" id="sn-id"></input><br>
                    <p>
                        Dialogue <button id="sn-add-dialogue">+</button>
                        <div id='sn-messages' class='dialogue'>
                        </div>
                    </p>
                    <p>
                        Options <button id="sn-add-option">+</button>
                        <div id='sn-options' class='options'>
                        </div>
                    </p>`;
    return sn;
};
export { TextBox, OptionBox, SN };
