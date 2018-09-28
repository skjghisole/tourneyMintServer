const Service = require('./service');

module.exports = function service() {
  return function setup() {
    const app = this;
    const path = '/api/contracts';
    app.use(path, new Service());

    const beforeHooks = {
      all: [],
      get: [],
    };

    const afterHooks = {
      all: [],
      get: [],
    };

    app.service(path).hooks({
      before: beforeHooks,
      after: afterHooks
    });


  };
};
