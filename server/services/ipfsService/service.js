const ipfs = require('./ipfs');

class Service {
  async find(params) {
    return [];
  }

  async create(data) {
    let hash;
    let stringifiedData = data instanceof Object ? JSON.stringify(data) : data.toString();
    return new Promise((resolve, reject) => {
      ipfs.files.add(Buffer.from(stringifiedData), async (error, result) => {
         if(error) {
             console.error(error)
             reject(error);
         }
         resolve(result[0].hash);
     });
    })
  }
}

module.exports = Service;
