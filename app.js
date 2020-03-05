'use strict';

const Core = require('./app/core');
const Interfaces = require('./app/interfaces');
const Modules = require('./app/modules');

let config = {};

class App {
  static configure(){
    config = Core.config.create('./app/config.json');
    return this;
  }
  static updateMods(){
    Modules.search()
           .load()
           .install();
    return this;
  }
  static interfacesUp(){
    Interfaces.start(config.interfaces);
    return this;
  }
  static start(){
    App.configure()
       .updateMods()
       .interfacesUp();
    return this;
  }
}

module.exports = App;
