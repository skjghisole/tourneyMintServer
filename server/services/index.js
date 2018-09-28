const contractService = require('./contractService');

module.exports = () => {
  return function service() {
    const app = this;
    app.configure(contractService());
  };
};

