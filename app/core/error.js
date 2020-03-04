'use strict';

const CODES = {
  0x000001: {
    msg: "unknown error: all fuck up"
  }
}

class CustomError {
  constructor(code){
    const err = {};
    Error.captureStackTrace(this, err);
    err.code = code;
    err.msg = CODES[code].msg;
    return err;
  }
  static toString(err){
    let text = '';
    if(err.code){
      text += `(${err.code}) `;
    }
    if(err.msg){
      text += `${err.msg} `;
    }
    if(err.message && !err.stack){
      text += `${err.message} `;
    }
    if(err.dest){
      text += `${err.dest} `;
    }
    if(err.stack){
      text += `${err.stack} `;
    }
    return text;
  }
};

module.exports = CustomError;
