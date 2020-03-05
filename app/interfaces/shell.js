'use strict';

const Core = require('../core');
const Modules = require('../modules');

const COMMANDS = {
  "modules": {
    "list": Modules.list,
    "load": Modules.load,
    "install": Modules.install,
    "uninstall": Modules.uninstall,
    "search": Modules.search,
    "delete": Modules.delete,
  },
  "interface": {
  },
};

const getFunc = commands => {
  let fn = COMMANDS;
  for(const command of commands){
    fn = fn[command];
    if(!fn){
      return null;
    }
  }

  if(typeof fn !== "function"){
    return null;
  }

  return Core.utils.curryEx(fn);
}

const serving = (fn) => {
  console.log(fn());
}

class Shell {
  static exec(commands, options){
    const fn = getFunc(commands);
    for(const option of options){
      fn = fn(option.value);
    }
    if(!fn){
      Core.log.info('Wrong command');
    } else {
      serving(fn);
    }
  }
}

module.exports = Shell;
