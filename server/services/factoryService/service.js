const fs = require('fs');
const factoryAddress = fs.readFileSync('server/services/contractService/factoryAddress.txt', 'utf8');

class Service {
  async find() {
    return factoryAddress;
  }

  async get() {
    return factoryAddress;
  }
}

module.exports = Service;
