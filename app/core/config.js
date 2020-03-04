const fs = require('fs');

class Config {
  static create(confFile){
    if (!fs.existsSync(confFile)) {
      return null;
    }
    const file = fs.readFileSync(confFile);
    config = JSON.parse(file);
    return this;
  }
}

module.exports = Config;
