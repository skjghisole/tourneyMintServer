const contractService = require('./contractService');
const ipfsService = require('./ipfsService');

module.exports = () => {
  return function service() {
    const app = this;
    app.configure(contractService())
    	.configure(ipfsService());
  };
};

