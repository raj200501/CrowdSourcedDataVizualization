const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { createApp } = require('../app');

const createTempDir = async () => {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'csviz-'));
    return dir;
};

const startTestServer = async ({ dataDir }) => {
    const { handler } = await createApp({ dataDir });
    const server = http.createServer(handler);
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();

    return {
        server,
        baseUrl: `http://127.0.0.1:${port}`,
    };
};

const cleanupDir = async (dirPath) => {
    if (!dirPath) {
        return;
    }
    await fs.promises.rm(dirPath, { recursive: true, force: true });
};

module.exports = {
    createTempDir,
    startTestServer,
    cleanupDir,
};
