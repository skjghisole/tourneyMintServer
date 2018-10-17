/* eslint-disable no-console */
const logger = require('./logger');
const server = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

function startServer = () => {
	const app = await server();
	try {
    app.listen(process.env.PORT || app.get('port'), () => {
      console.log(`App Live! http://localhost:${process.env.PORT || app.get('port')}/`);
    });
  } catch (e) {
    console.error(e);
  }
}

startServer();