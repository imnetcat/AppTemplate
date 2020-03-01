const fs = require('fs');
const path = require('path');

const MODS = [];
const ROOT = path.join(process.cwd(), 'modules');

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
  search(modules){
    core.log.info('Начат поиск модулей');
    fs.readdirSync(ROOT).forEach(descriptor => {
      const mod = descriptor;
      const dir = path.join(ROOT, descriptor);
      if(fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()){
        if(modules) {
          for(const mod of modules) {
            if(mod.toLowerCase() === mod.toLowerCase()){
              MODS.push(new Module(mod, 1));
              core.log.info(`Обнаружен модуль [${mod.toLowerCase()}]`);
            }
          }
        } else {
          MODS.push(new Module(mod, 1));
          core.log.info(`Обнаружен модуль [${mod.toLowerCase()}]`);
        }
      }
    });
    core.log.info('Поиск модулей завершен');
    return this;
  }

  //
  load(modules){
    core.log.info('Загрузка конфигов модулей');
    for(const mod of MODS) {
      if(modules){
        if(mod !== modules) continue;
      }
      core.log.info(`Конфигурация [${mod.name.toLowerCase()}]`);
      const dir = path.join(ROOT, mod.name);
      const mainFilePath = path.join(dir, `${mod.name}.js`);
      const configPath = path.join(dir, 'config.json');

      if(!fs.existsSync(mainFilePath)){
        core.log.warn(new Error('0x0001'));
        continue;
      }
      if(!fs.existsSync(configPath)){
        // error
      }
      const config = JSON.parse(fs.readFileSync(configPath));
      let db = {};

      if(config){
        if(!config.core.db){
          core.log.warn(new Error('0x0001'));
        }
      } else {
        // WARNING
      }
      mod.config(config);
      mod.state(2);
    }
    core.log.info('Модули сконфигурированы');
    return this;
  }

  //
  install(modules){
    core.log.info('Установка модулей начата');
    for(const mod of MODS) {
      if(modules){
        if(mod !== modules) continue;
      }
      core.log.info(`Установка [${mod.name.toLowerCase()}]`);
      const dir = path.join(ROOT, mod.name);
      const mainFilePath = path.join(dir, `${mod.name}.js`);
      db = core.db.open(mod.config().core.db);
      mod.mod( (require(mainFilePath))(db, core) );
      mod.state(3);
      core.log.info('Модуль установлен');
    }
    core.log.info('Установка модулей завершена');
    return this;
  }

  //
  uninstall(){

  }

  //
  delete(){

  }

  //
  list(state){
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
