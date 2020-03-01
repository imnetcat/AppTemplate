'use strict';

const where = conditions => {
  const clause = [];
  const args = [];
  let i = 1;
  for (const key in conditions) {
    let value = conditions[key];
    let condition;
    if (typeof value === 'number') {
      condition = `${key} = $${i}`;
    } else if (typeof value === 'string') {
      if (value.startsWith('>=')) {
        condition = `${key} >= $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('<=')) {
        condition = `${key} <= $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('<>')) {
        condition = `${key} <> $${i}`;
        value = value.substring(2);
      } else if (value.startsWith('>')) {
        condition = `${key} > $${i}`;
        value = value.substring(1);
      } else if (value.startsWith('<')) {
        condition = `${key} < $${i}`;
        value = value.substring(1);
      } else if (value.includes('*') || value.includes('?')) {
        value = value.replace(/\*/g, '%').replace(/\?/g, '_');
        condition = `${key} LIKE $${i}`;
      } else {
        condition = `${key} = $${i}`;
      }
    }
    i++;
    args.push(value);
    clause.push(condition);
  }
  const sclause = clause.join(' AND ');
  return { sclause,
    args };
};

const MODE_ROWS = 0;
const MODE_VALUE = 1;
const MODE_ROW = 2;
const MODE_COL = 3;
const MODE_COUNT = 4;

const sql = (pool) => {
  const sql = '';
  const op = null;
  const table = null;
  const cols = null;
  const rows = null;
  const rowCount = 0;
  const ready = false;
  const mode = MODE_ROWS;
  const whereClause = undefined;
  const fields = ['*'];
  const args = [];
  const orderBy = undefined;

  return {
    pool,

    sql,
    op,
    table,
    cols,
    rows,
    rowCount,
    ready,
    mode,
    whereClause,
    fields,
    args,
    orderBy,

    select(fields) {
      this.fields = fields;
      this.op = 'select';
      return this;
    },

    insert(table) {
      this.table = table;
      this.op = 'insert';
      return this;
    },

    values(values) {
      for (const key in values) {
        this.fields.push(key);
        this.args.push(values[key]);
      }
      return this;
    },

    where(conditions) {
      const { sclause, args } = where(conditions);
      this.whereClause = sclause;
      this.args = args;
      return this;
    },

    from(table) {
      this.table = table;
      return this;
    },

    value() {
      this.mode = MODE_VALUE;
      return this;
    },

    row() {
      this.mode = MODE_ROW;
      return this;
    },

    col(name) {
      this.mode = MODE_COL;
      this.columnName = name;
      return this;
    },

    count() {
      this.mode = MODE_COUNT;
      return this;
    },

    order(name) {
      this.orderBy = name;
      return this;
    },

    build() {
      const operations = {
        'select': 'buildSelect',
        'insert': 'buildInsert'
      };
      this[operations[this.op]]();
      return this;
    },

    buildSelect() {
      const { table, fields, args } = this;
      const { whereClause, orderBy, columnName } = this;
      const flds = fields.join(', ');
      let sql = `SELECT ${flds} FROM ${table}`;
      if (whereClause) sql += ` WHERE ${whereClause}`;
      if (orderBy) sql += ` ORDER BY ${orderBy}`;
      this.sql = { sql,
        values: args };
    },

    buildInsert() {
      const { table, fields, args } = this;
      const flds = fields.join(', ');
      const sql = `INSERT ${table} (${flds})`;
      this.sql = { sql,
        values: args };
    },

    exec(callback) {
      // TODO: store callback to pool

      const { sql, values } = this.sql;

      const startTime = new Date().getTime();
      this.pool.query(sql, values, (err, res) => {
        if (err) return this.error.nonfatal(new Error('0x0001'));
        const endTime = new Date().getTime();
        const executionTime = endTime - startTime;
        //this.log.info(`Database execution time: ${executionTime}`);
        if (callback) {
          const mode = this.mode;
          this.rows = res.rows;
          this.cols = res.fields;
          this.rowCount = res.rowCount;
          const { rows, cols } = this;
          if (mode === MODE_VALUE) {
            const col = cols[0];
            const row = rows[0];
            callback(row[col.name]);
          } else if (mode === MODE_ROW) {
            callback(rows[0]);
          } else if (mode === MODE_COL) {
            const col = [];
            for (const row of rows) {
              col.push(row[columnName]);
            }
            callback(col);
          } else if (mode === MODE_COUNT) {
            callback(this.rowCount);
          } else if (mode === MODE_ROWS) {
            callback(rows);
          }
        }
      });
      return this;
    }
  };
};

module.exports = sql;
