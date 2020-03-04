'use strict';

const Db = require('./core/db');
const CustomError = require('./core/error');
const Logging = require('./core/logging');
const Utils = require('./core/utils');
const Config = require('./core/config');

let config = {};

class Core {

};

Core.utils = {
  partial: (fn, ...args) => {
    if(args){
      return Utils.partialEx(fn, ...args);
    } else {
      return Utils.partial(fn);
    }
  },
  curry: (fn, ...args) => {
    if(args){
      return Utils.curryEx(fn, ...args);
    } else {
      return Utils.curry(fn);
    }
  },
  curryEx: (fn, ...args) => Utils.curryExEx(fn, ...args)
}

Core.config = {
  reCreate: () => {
    config = Config.create('/config.json');
  },
  modules: () => {
    return config.modules;
  },
  interfaces: () => {
    return config.interfaces;
  }
}

Core.db = {
  open: (config) => {
    return Db(config);
  }
};

Core.log = {
  info: (text) => {
    Logging.info(text);
  },

  warning: (error) => {
    if( !(error instanceof Error) ){
      error = new CustomError(error);
    }
    Logging.warn(CustomError.toString(error));
  },

  error: (error) => {
    if( !(error instanceof Error) ){
      error = new CustomError(error);
    }
    Logging.error(CustomError.toString(error));
    process.exit(1);
  }
};

module.exports = Core;
