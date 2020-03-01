const fs = require('fs');

let config = {};

class Config {
  load(){
    const file = fs.readFileSync('./config.json');
    config = JSON.parse(file);
    this.core = config.core;
    this.interfaces = config.interfaces;
    this.modules = config.modules;
    return this;
  }
}

module.exports = Config;
