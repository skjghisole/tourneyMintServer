const Service = require('./Service');

module.exports = function () {
	return function setup() {
		const app = this;
		const path = "api/ipfs";
		app.use(path, new Service());

		const beforeHooks = {
			all: [],
			get: [],
		}

		const afterHooks = {
			all: [],
			get: [],
		}

		app.service(path).hooks({
			before: beforeHooks,
			after: afterHooks
		});
	}
}