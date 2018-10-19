const contractService = require('./contractService');
const ipfsService = require('./ipfsService');
const factoryService = require('./factoryService');

module.exports = () => {
  return function service() {
    const app = this;
    app.configure(contractService())
    	.configure(ipfsService())
    	.configure(factoryService());
  };
};

