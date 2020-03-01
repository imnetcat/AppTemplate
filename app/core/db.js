'use strict';

const { Pool } = require('pg');
const Sql = require('./sql');

const Error = require('./error');
const Logging = require('./logging');

class DB {
  constructor(config){
    if (!config) return Error.warning(new Error('0x0001'));

    this.pool = new Pool(config);
  }

  sql() {
    return Sql(this.pool);
  }

  close() {
    if (!pool) return Error.warning(new Error('0x0001'));
    yhis.pool.end();
  }
};

module.exports = DB;
