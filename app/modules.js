const fs = require('fs');
const path = require('path');

const Core = require('./core');

const MODS = [];
const ROOT = './modules';

const STATES = {
  0: "undefined",
  1: "founded",
  2: "loaded",
  3: "installed"
};

//
class Module {
  constructor(name, state = 0, config = null, mod = null){
    this.name = name;
    this.state = STATES[state];
    this.config = config;
    this.mod = mod;
  }

  get name(){ return this.name }
  set name(value){ this.name = value }

  get state(){ return this.state }
  set state(value){
    if(value < STATES.length || value === Math.abs(value)) {
      this.state = value ;
    }
  }

  get config(){ return this.config }
  set config(value){ this.config = value }

  get mod(){ return this.mod }
  set mod(value){ this.mod = value }
};

//
class Modules {
  //
  static search(modules){
    Core.log.info('Начат поиск модулей');
    fs.readdirSync(ROOT).forEach(descriptor => {
      const mod = descriptor;
      const dir = path.join(ROOT, descriptor);
      if(fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()){
        if(modules) {
          for(const mod of modules) {
            if(mod.toLowerCase() === mod.toLowerCase()){
              MODS.push(new Module(mod, 1));
              Core.log.info(`Обнаружен модуль [${mod.toLowerCase()}]`);
            }
          }
        } else {
          MODS.push(new Module(mod, 1));
          Core.log.info(`Обнаружен модуль [${mod.toLowerCase()}]`);
        }
      }
    });
    Core.log.info('Поиск модулей завершен');
    return this;
  }

  //
  static load(modules){
    Core.log.info('Загрузка конфигов модулей');
    for(const mod of MODS) {
      if(modules){
        if(mod !== modules) continue;
      }
      Core.log.info(`Конфигурация [${mod.name.toLowerCase()}]`);
      const dir = path.join(ROOT, mod.name);
      const mainFilePath = path.join(dir, `${mod.name}.js`);
      const configPath = path.join(dir, 'config.json');

      if(!fs.existsSync(mainFilePath)){
        Core.log.warn(new Error('0x0001'));
        continue;
      }
      if(!fs.existsSync(configPath)){
        // error
      }
      const config = JSON.parse(fs.readFileSync(configPath));
      let db = {};

      if(config){
        if(!config.Core.db){
          Core.log.warn(new Error('0x0001'));
        }
      } else {
        // WARNING
      }
      mod.config(config);
      mod.state(2);
    }
    Core.log.info('Модули сконфигурированы');
    return this;
  }

  //
  static install(modules){
    Core.log.info('Установка модулей начата');
    for(const mod of MODS) {
      if(modules){
        if(mod !== modules) continue;
      }
      Core.log.info(`Установка [${mod.name.toLowerCase()}]`);
      const dir = path.join(ROOT, mod.name);
      const mainFilePath = path.join(dir, `${mod.name}.js`);
      db = Core.db.open(mod.config().Core.db);
      mod.mod( (require(mainFilePath))(db, Core) );
      mod.state(3);
      Core.log.info('Модуль установлен');
    }
    Core.log.info('Установка модулей завершена');
    return this;
  }

  //
  static uninstall(){

  }

  //
  static delete(){

  }

  //
  static list(state){
    const list = [];
    for(const mod of MODS){
      if(state){
        if(mod.state() !== state) continue;
      }
      list.push(mod);
    }
    return list;
  }
};

module.exports = Modules;
