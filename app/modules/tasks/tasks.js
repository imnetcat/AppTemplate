'use strict';

const fs = require('fs');
const path = require('path');

let config = {};

const tasks = [];

class Task {
  constructor(task){
    this.task = task;
  }
}
class Tasks {
  static init(conf){
    config = conf;
  }
  static list(){
    return tasks;
  }

  static add(task){
    tasks.push(new Task(task));
  }
};

module.exports = Tasks;
