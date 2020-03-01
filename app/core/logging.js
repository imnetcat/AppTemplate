'use strict';

const fs = require('fs');
const color = require('ansi-256-colors');

class Logging {
  constructor(root){
    this.ROOT = root;
    if (!fs.existsSync(root)) fs.mkdirSync('./' + root);
  }

  error(err) {
    //const text = `(${err.code}) ${err.msg} ${err.dest ? err.dest : ''}\n ${err.stack}`;
    this.Log('error', err, [2, 0, 0]);
  }

  info(text) {
    this.Log('info', text, [0, 3, 0]);
  }

  warn(err) {
    //const text = `(${err.code}) ${err.msg} ${err.dest}\n ${err.stack}`;
    this.Log('warn', err, [5, 3, 0]);
  }

  Log(label, text, colr) {
    colr = colr || [5, 5, 5];

    const date = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    const path = this.ROOT + '/' + date.split(' ')[0] + '.txt';
    const time = date.split(' ')[1];

      let log = `[${time}][${label}]  ${text}\n`;

    if (!fs.existsSync(path)) {
      fs.closeSync(fs.openSync(path, 'w')); // Create an empty file
    }

    fs.appendFileSync(path, log);

    log = `${color.fg.getRgb(0,0,5)}[${time}]${color.fg.getRgb(1,0,5)}[${label}]  ${color.fg.getRgb(colr[0],colr[1],colr[2])}${text}${color.reset}`;

    console.log(log);
  }
};

module.exports = Logging;
