'use strict';

const fs = require('fs');
const path = require('path');

const Core = require('./core');

const MODS = [];
const ROOT = path.join(process.cwd(), 'app/modules')

const STATES = {
  "undefined": 0,
  "founded": 1,
  "loaded": 2,
  "installed": 3
};

//
class Module {
  constructor(name, state, config = null, mod = null){
    this.name = name;
    this._state = STATES[state];
    this._config = config;
    this.mod = mod;
  }
  config(conf){
    if(conf){
      this._config = conf;
    } else {
      return this._config;
    }
  }
  state(st){
    if(st){
      this._state = STATES[st];
    } else {
      return this._state;
    }
  }
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

      if(!config){
        Core.log.warn(new Error('0x0001'));
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
      const reqMod = require(mainFilePath);
      reqMod.init(mod.config());
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
