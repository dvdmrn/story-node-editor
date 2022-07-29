function readFile(ev, callback) {
    const fileList = ev.target;
    if (fileList.files === null)
        return;
    const file = fileList.files[0];
    const reader = new FileReader();
    reader.onload = e => {
        var _a;
        let contents = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        console.log(`got file name: ${file.name}`);
        callback(contents);
    };
    reader.readAsText(file);
}
export { readFile };
