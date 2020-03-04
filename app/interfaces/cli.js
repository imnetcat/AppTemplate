'use strict';

const readline = require('readline');

const Shell = require('./commands');
const Core = require('../core');

// input line look like:
// modules install -l 123 -m qwertyu --night "qwerty and 12345"
// modules install qwertyu
const parse = line => {
  const splited = line.split(' ');
  const commands = [];
  const options = [];
  // flag witch indicate that splited item may be command
  const isCommands = true;
  for(let i = 0; i < splited.length; i++){
    const item = splited[i];
    // is this is param
    if(item.startsWith('-')){
      // остальные елементы уже не могут быть частью комманды
      isCommands = false;
      const param = item;
      const value = splited[i+1];

      options.push({
        param,
        value
      });
    } else { // else this is value of param, command, or part of command
      if(isCommands){ // element of array is part of command
        commands.push(item);
      } else {  // else element of array is part is param than we
        options.push({
          param: "",
          value: item
        });
      }
    }
  }
  return { commands, options };
}

const processInput = line => {
  const { commands, options } = parse(line);
  Shell.exec(commands, options);
}

let rl = {};
class CLI {
  static start(){
    Core.log.info('CLI startup');
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.on('line', (input) => {
      processInput(input);
    });
    Core.log.info('Command line interface stated');
  }
  static close(){
    rl.close();
  }
  static pause(){
    rl.pause();
  }
  static resume(){
    rl.resume();
  }
}

module.exports = CLI;
