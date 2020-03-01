'use strict';

class Utils {
  static compose(...fncs) {
    return x => fncs.reverse().reduce((v, f) => f(v), x);
  }

  static pipe(...fncs) {
    return x => fncs.reduce((v, f) => f(v), x);
  }

  static partial(fn, ...args) {
    return (...rest) => fn(...args, ...rest);
  }

  static extendEx(obj, name, mixin) {
    obj[name] = mixin;
    const keys = Object.keys(mixin);
    console.dir({ keys });
    for (const key of keys) {
      obj[name][key] = mixin[key];
    }
  }

  static extend(obj, mixin) {
    Object.assign(obj, mixin);
  }
};

module.exports = Utils;
