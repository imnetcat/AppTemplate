'use strict';

const AdminPanel = require('./admin_panel');
const Core = require('./core');

process.title = 'Armitage';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err);
  })
  .on('exit', () => {
    Core.log.info('Завершение работы\n\n\n');
  });

Core.log.info('Запуск web-интерфейса');

const adminPanel = new AdminPanel();
