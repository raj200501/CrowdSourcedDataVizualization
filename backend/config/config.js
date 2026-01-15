const path = require('path');
const { loadEnv } = require('../utils/env');

const repoRoot = path.join(__dirname, '..', '..');

loadEnv(path.join(repoRoot, '.env'));
loadEnv(path.join(__dirname, '..', '.env'));

const parseNumber = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseNumber(process.env.PORT, 5000),
    dataDir: process.env.DATA_DIR || path.join(repoRoot, 'data'),
    logLevel: process.env.LOG_LEVEL || 'info',
    tokenSecret: process.env.TOKEN_SECRET || 'dev-secret-change-me',
    repoRoot,
    requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '2mb',
};

module.exports = config;
