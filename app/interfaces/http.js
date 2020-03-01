'use strict';

const path = require('path');
const http = require('http');

const Core = require('../core');

const DEF_ROOT = path.join(process.cwd(), 'html');
const MOD_ROOT = path.join(process.cwd(), 'modules');
const HTTP_PORT = 8080;
const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml'
};

class HTTP {
  start(){
    this.core.log.info('Админ панель запускаеться');
    http.createServer((req, res) => {
      const { url } = req;
      if (url.startsWith('/api/')) {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const data = Buffer.concat(chunks).toString();
          res.end(JSON.stringify(this.routing(url)));
        });
      } else if (url.startsWith('/modules/')) {
          let fileName = url;
          const fileExt = path.extname(fileName).substring(1);
          const mimeType = this.MIME_TYPES[fileExt] || this.MIME_TYPES.html;
          res.writeHead(200, { 'Content-Type': mimeType });
          const stream = serveFile(fileName);
          if (stream) stream.pipe(res);
      } else {
        let fileName = url;
        if (url === '/') {
          fileName = '/index.html';
        }
        const fileExt = path.extname(fileName).substring(1);
        const mimeType = this.MIME_TYPES[fileExt] || this.MIME_TYPES.html;
        const stream = serveFile(fileName);
        if (stream) {
          res.writeHead(200, { 'Content-Type': mimeType });
          stream.pipe(res);
        } else {
          res.end(404);
        }
      }
    }).listen(this.HTTP_PORT);
    this.core.log.info('Админ панель развёрнута на localhost:' + this.HTTP_PORT);
  }

  use(mod){
    this.modules[mod.name] = mod;
  }

  listInstalledModules(){
    const result = {
      res: []
    };
    for(const mod in this.modules){
      if(this.modules[mod].state === 'installed'){
        result.res.push(this.modules[mod].name);
      }
    }
    return result;
  }

  serveFile(name) {
    let root = this.DEF_ROOT;
    if(name.startsWith('/modules/')){
      root = this.MOD_ROOT;
      name = name.replace('/modules/', '');
      const moduleName = name.substr(0, name.indexOf('/'));
      if(!this.modules[moduleName]){
        // warn
        return null;
      }
      if(this.modules[moduleName].state !== 'installed'){
        // TODO: warning
        return null;
      }
      name = name.split('/');
      name.splice(1, 0, 'html');
      name = name.join('/');
    }
    const filePath = path.join(root, name);
    if (!filePath.startsWith(root)) {
      console.log(`Can not be served: ${name}`);
      // TODO: error.nonfatal
      return null;
    }
    const stream = fs.createReadStream(filePath);
    console.log(`Served: ${name}`);
    return stream;
  }

  serveApi(url){
    url = url.replace('/api/', '');
    const [ version, dir, moduleName, options ] = url.split('/');
    if(this.modules[moduleName] === undefined){
      // TODO: error.nonfatal
    }
    if(options === undefined){
      // TODO: error.nonfatal
    }
    console.dir({version, dir, moduleName, options});
    return {
      moduleName,
      evnt:this.api[version][dir][moduleName].api[options]
    }
  }

  routing(url) {
    switch (url) {
      case '/api/gettime':
        return this.getTime();
      break;
      case '/api/get-installed-modules':
        return this.listInstalledModules();
        break;
    }
  }

  getTime(){
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const day = d.getDate();

    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    return {
      year,
      month,
      day,
      hours,
      minutes,
      seconds
    }
  }
};

module.exports = Web;
