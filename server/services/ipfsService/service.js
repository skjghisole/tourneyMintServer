const ipfs = require('./ipfs');

class Service {
  async find(params) {
    return [];
  }

  async create(data) {
    let hash;
    return new Promise((resolve, reject) => {
      ipfs.files.add(Buffer.from(data.toString()), async (error, result) => {
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
