const Service = require('./service');

module.exports = function service() {
  return function setup() {
    const app = this;
    const path = '/api/factory/address';
    app.use(path, new Service());

    const beforeHooks = {
      all: [],
    };

    const afterHooks = {
      all: [],
    };

    app.service(path).hooks({
      before: beforeHooks,
      after: afterHooks
    });
  };
};
