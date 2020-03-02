'use strict';

class Utils {
  static compose(...fncs) {
    return x => fncs.reverse().reduce((v, f) => f(v), x);
  }

  static pipe(...fncs) {
    return x => fncs.reduce((v, f) => f(v), x);
  }

  static partial(fn) {
    return (...rest) => fn(...rest);
  }
  static partialEx(fn, ...args) {
    return (...rest) => fn(...args, ...rest);
  }

  static extend(obj, mixin) {
    Object.assign(obj, mixin);
  }
  
  static extendEx(obj, name, mixin) {
    obj[name] = mixin;
    const keys = Object.keys(mixin);
    console.dir({ keys });
    for (const key of keys) {
      obj[name][key] = mixin[key];
    }
  }

  static curry(fn){
    return (...args) => {
      if (fn.length > args.length) {
        const f = fn.bind(null, ...args);
        return curry(f);
      } else {
        return fn(...args);
      }
    }
  }

  static curryEx(fn, ...par) {
    const curried = (...args) => (
      fn.length > args.length ?
        curry(fn.bind(null, ...args)) :
        fn(...args)
    );
    return par.length ? curried(...par) : curried;
  }
};

module.exports = Utils;
