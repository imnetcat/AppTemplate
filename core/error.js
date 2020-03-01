'use strict';

class error extends Error {
  constructor(code, ...params) {
    super(...params);
    const errors = {
      0x000000: {},
      0x000001: {
        msg: 'неизвестная ошибка, всё пошло по *****'
      }
    };
    
    if(code !== 0x000000){
      this.code = code;
      this.name = this.errors[code].name;
      this.message = this.errors[code].message + '\n' + this.message ;
    }
  }
};

module.exports = error;
