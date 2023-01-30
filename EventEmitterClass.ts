import EventEmitter from 'events';
import { readFile } from 'fs';

//this version utilizes asyncrhonous which means that the listeners can be registered after the the find function is called. Because the async
//file read does not happen until the callstack is clear and the event cycle is run again we can add listeners after its invocation.
//for the case of a syncronous version of this class we would have to actually add the listeners before the the invocation of the find() method

class findRegex extends EventEmitter {
  regex: RegExp;
  files: string[];

  constructor(regexToAdd: RegExp) {
    super();
    this.regex = new RegExp(regexToAdd);
    this.files = [];
  }

  addFile = (file: string) => {
    this.files.push(file);
    return this;
  };

  find = () => {
    for (const file of this.files) {
      readFile(file, 'utf-8', (err, content) => {
        if (err) {
          return this.emit('error', err);
        }
        this.emit('fileRead', file);
        const match = content.match(this.regex);
        if (match) {
          match.forEach((element) => this.emit('found', file, element));
        }
      });
    }
    return this;
  };
}

const findRegexInstance = new findRegex(/hello \w+/g);

findRegexInstance
  .addFile('fileA.txt')
  .addFile('fileB.json')
  .find()
  .on('found', (file, match) => console.log(`Matched ${match} in ${file}`))
  .on('fileRead', (file) => console.log(`${file} read`))
  .on('error', (error) => console.error(error.message));
