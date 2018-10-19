const ipfs = require('./ipfs');

class Service {
  async find(params) {
    return [];
  }

  async create(data) {
    ipfs.files.add(data, async (error, result) => {
         if(error) {
             console.error(error)
             return
         }
         return result[0].hash;
     });
  }

}

module.exports = Service;
