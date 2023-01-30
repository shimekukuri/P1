import { EventEmitter } from 'events';
import { readFile } from 'fs';

const findRegex = (files: any, regex: RegExp) => {
  const emitter = new EventEmitter();

  for (const file of files) {
    readFile(file, 'utf-8', (err, contents) => {
      if (err) {
        return emitter.emit('error', err);
      }
      emitter.emit('fileRead', file);
      const match = contents.match(new RegExp(regex));
      if (match) {
        match.forEach((elem) => {
          emitter.emit('found', file, elem);
        });
      }
    });
  }
  return emitter;
};

findRegex(['fileA.txt', 'fileB.json'], /hello \w+/g)
  .on('fileRead', (file) => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`Matched ${match} in ${file}`))
  .on('error', (error) => console.error(`Emmited error ${error.message}`));
