import EventEmitter from 'events';
import { readFile } from 'fs';

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
