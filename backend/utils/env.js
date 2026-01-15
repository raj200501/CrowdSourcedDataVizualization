const fs = require('fs');

const parseLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
        return null;
    }
    const [key, ...rest] = trimmed.split('=');
    if (!key) {
        return null;
    }
    return { key: key.trim(), value: rest.join('=').trim() };
};

const loadEnv = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
        const parsed = parseLine(line);
        if (!parsed) {
            return;
        }
        if (process.env[parsed.key] === undefined) {
            process.env[parsed.key] = parsed.value;
        }
    });
};

module.exports = {
    loadEnv,
};
