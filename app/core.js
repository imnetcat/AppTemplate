'use strict';

const Db = require('./core/db');
const Error = require('./core/error');
const Logging = require('./core/logging');
const Utils = require('./core/utils');
const Config = require('./core/config');

const config = Config.create('./config.json');

class Core {

};

Core.config = {
  reCreate(){
    config = Config.create('./config.json');
  },
  modules(){
    return config.modules;
  },
  interfaces(){
    return config.interfaces;
  }
}

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
