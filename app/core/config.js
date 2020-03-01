const fs = require('fs');

class Config {
  create(confFile){
    const file = fs.readFileSync(confFile);
    config = JSON.parse(file);
    return this;
  }
}

module.exports = Config;
