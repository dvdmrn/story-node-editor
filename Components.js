const TextBox = (sender, dialogue, delay) => `<div class="textbox">
                    Sender:
                        <select>
                            <option value="Self" ${sender == "Self" ? "selected" : ""}>Self</option>
                            <option value="Ina" ${sender == "Ina" ? "selected" : ""}>Ina</option>
                        </select>
                    delay: <input class="num-input" type="number" min="0" max="99" value=${delay}></input> seconds <br>
                    dialogue: <input type="text" class="dia" value="${dialogue}"></input>
                </div>`;
const OptionBox = (option, goto) => `<div class="option">
                                                            option text:<input type="text" class="dia" value="${option}"></input><br>
                                                            go to: <input type="text" class="dia" value="${goto}"></input> 
                                                        </div>`;
const SN = (id, messages, options) => `
                Story Node<br>

                id: <input type="text" id="sn-id" value="${id}"></input><br>
                <p>
                    Dialogue
                    <div class='dialogue'>
                        ${messages}
                    </div>
                </p>
                <p>
                    Options
                    <div class='options'>
                        ${options}
                    </div>
                </p>
            `;
export { TextBox, OptionBox, SN };
