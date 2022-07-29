function readFile(ev : Event, callback : Function) : void{
    const fileList = ev.target as HTMLInputElement;

    if(fileList.files === null) return;

    const file = fileList.files[0];

    const reader = new FileReader();

    reader.onload = e => {
      let contents = e.target?.result;
      console.log(`got file name: ${file.name}`);
      callback(contents);
    }

    reader.readAsText(file);
  }

  export {readFile};