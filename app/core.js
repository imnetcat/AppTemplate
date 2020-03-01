'use strict';

const Db = require('./core/db');
const Error = require('./core/error');
const Logging = require('./core/logging');
const Utils = require('./core/utils');

class Core {

};

Core.db = {
  open(config){
    return Db(config);
  }
};

Core.log = {
  info(text){
    Logger.info(text);
  },

  warning(code) {
    const warn = new Error(code);
    Logger.warn(warn);
  },

  error(code) {
    const err = new Error(code);
    Logger.error(err);
    process.exit(1);
  }
};

module.exports = Core;
