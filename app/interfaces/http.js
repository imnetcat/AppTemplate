'use strict';

const path = require('path');
const http = require('http');

const Core = require('../core');

const Config = require('../core/config');

const config = Config.get.core().http;

const ROOT = config.root;
const HTTP_PORT = config.port;

let server = {};

const serveFile = (name) => {
  const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml'
  };
  if (name === '/') {
    name = '/index.html';
  }
  const fileExt = path.extname(name).substring(1);
  const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
  const filePath = path.join(ROOT, name);
  const stream = fs.createReadStream(filePath);
  return { stream, mimeType };
}

const getTime() => {
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

const ROUTING = {
  '/api/gettime': getTime,
  '/api/get-installed-modules': listInstalledModules
}

const serveApi = (url, data) => {
  const fn = ROUTING[url];
  if(!fn){
    return null;
  }
  console.dir({ url, version, fn, data });
  return fn(data);
}

class HTTP {
  start(){
    Core.log.info('HTTP-server startup');
    server = http.createServer((req, res) => {
      const { url, method } = req;
      if(method === 'post'){
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const data = Buffer.concat(chunks).toString();
          const result = serveApi(url, data);
          res.end(JSON.stringify(result));
        });
      } else if(method === 'get') {
        const { stream, mimeType } = serveFile(fileName);
        if (stream) {
          res.writeHead(200, { 'Content-Type': mimeType });
          stream.pipe(res);
        } else {
          res.end(404);
        }
      } else {
        res.end(500);
      }
    });
    server.listen(HTTP_PORT);
    Core.log.info('HTTP-server started on localhost:' + HTTP_PORT);
    return this;
  }

  use(mod){
    this.modules[mod.name] = mod;
    return this;
  }
};

module.exports = Web;
