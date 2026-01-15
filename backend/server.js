const http = require('http');
const { createApp } = require('./app');
const config = require('./config/config');
const { createLogger } = require('./utils/logger');

const logger = createLogger(config.logLevel);

const startServer = async () => {
    const { handler } = await createApp();
    const server = http.createServer(handler);

    server.listen(config.port, () => {
        logger.info(`Server running on port ${config.port}`);
    });

    return server;
};

startServer().catch((error) => {
    logger.error('Failed to start server', { message: error.message, stack: error.stack });
    process.exit(1);
});
