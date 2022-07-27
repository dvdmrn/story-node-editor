const worl = 'hi';
const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function hello(who) {
    console.log("hiiiii :)");
    return `$hello {who}!`;
}
function storynodeIdHash() {
    const hashLength = 5;
    const ancLen = alphanumericChars.length;
    let hash = "";
    for (let i = 0; i < hashLength; i++) {
        hash += alphanumericChars[Math.floor(Math.random() * ancLen)];
    }
    return hash;
}
function setStoryNodeHash(id) {
    const textField = document.getElementById(id);
    console.log(`found textField? ${textField}`);
    console.log(`found textField? ${textField}`);
    textField.value = "@" + storynodeIdHash();
}
storynodeIdHash();
setStoryNodeHash("sn-id");
hello(worl);
