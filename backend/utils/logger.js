const levels = ['debug', 'info', 'warn', 'error'];

const shouldLog = (currentLevel, messageLevel) => {
    const currentIndex = levels.indexOf(currentLevel);
    const messageIndex = levels.indexOf(messageLevel);
    if (currentIndex === -1 || messageIndex === -1) {
        return true;
    }
    return messageIndex >= currentIndex;
};

const createLogger = (level = 'info') => {
    const log = (messageLevel, message, meta) => {
        if (!shouldLog(level, messageLevel)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const payload = meta ? ` ${JSON.stringify(meta)}` : '';
        process.stdout.write(`[${timestamp}] ${messageLevel.toUpperCase()} ${message}${payload}\n`);
    };

    return {
        debug: (message, meta) => log('debug', message, meta),
        info: (message, meta) => log('info', message, meta),
        warn: (message, meta) => log('warn', message, meta),
        error: (message, meta) => log('error', message, meta),
    };
};

module.exports = { createLogger };
